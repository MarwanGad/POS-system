// clickup-reporter.cjs — Node 18+, zero deps, loads .env

console.log('[ClickUpReporter v2] file loaded')

const fs = require('node:fs')
const path = require('node:path')

// --- minimal .env loader so VS Code runs get the vars too ---
;(function loadDotEnv() {
  const p = path.resolve(process.cwd(), '.env')
  if (!fs.existsSync(p)) return
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!m) continue
    const key = m[1]
    let val = m[2].replace(/^['"]|['"]$/g, '') // strip quotes
    if (!process.env[key]) process.env[key] = val
  }
})()

// --- helpers ---
function hasHtmlReporter(config) {
  const r = config.reporter
  if (typeof r === 'string') return r === 'html'
  if (Array.isArray(r)) {
    return r.some((entry) => {
      if (typeof entry === 'string') return entry === 'html'
      if (Array.isArray(entry)) return entry[0] === 'html'
      return false
    })
  }
  return false
}

async function createClickUpTask(listId, apiKey, payload) {
  const res = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
    method: 'POST',
    headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(`ClickUp task creation failed: ${res.status} ${await res.text()}`)
  return res.json() // { id: string, ... }
}

async function attachFileToTask(taskId, apiKey, filePath) {
  if (!fs.existsSync(filePath)) return
  const filename = path.basename(filePath)
  const buf = await fs.promises.readFile(filePath)
  // Buffer -> ArrayBuffer (avoid SharedArrayBuffer typing issues)
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' })

  const form = new FormData()
  form.append('attachment', blob, filename)

  const res = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/attachment`, {
    method: 'POST',
    headers: { Authorization: apiKey },
    body: form
  })
  if (!res.ok) throw new Error(`ClickUp attachment upload failed: ${res.status} ${await res.text()}`)
}

function collectFailureAttachments(result) {
  const files = []
  for (const a of result.attachments || []) {
    if (a.path && fs.existsSync(a.path)) files.push(a.path)
  }
  return files
}

// --- reporter ---
class ClickUpReporter {
  onBegin(config) {
    this.listId = process.env.CLICKUP_LIST_ID
    this.apiKey = process.env.CLICKUP_API_TOKEN
    this.htmlReportDir = hasHtmlReporter(config) ? path.resolve(process.cwd(), 'playwright-report') : undefined

    console.log('[ClickUpReporter] Loaded. list=', !!this.listId, 'token=', !!this.apiKey)
    if (!this.listId || !this.apiKey) {
      console.warn('[ClickUpReporter] Missing CLICKUP_LIST_ID or CLICKUP_API_TOKEN; will not create tasks.')
    }
  }

  async onTestEnd(test, result) {
    if (!this.listId || !this.apiKey) return
    if (result.status !== 'failed') return

    // ===== Config =====
    const MAX_UPLOAD_MB = 50 // change if your ClickUp plan allows bigger uploads

    // ===== Utils =====
    // Robust ANSI stripper
    const stripAnsi = (s = '') =>
      s
        .replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '') // CSI
        .replace(/\x1B\][^\x07]*(?:\x07|\x1B\\)/g, '') // OSC
        .replace(/\x1B[@-Z\\-_]/g, '') // single ESC
        .replace(/\x1B[^m]*m/g, '') // fallback

    const truncate = (s = '', max = 120) => (s.length > max ? s.slice(0, max) + '…' : s)
    const bytesToMB = (b) => Math.round((b / (1024 * 1024)) * 10) / 10

    // ===== Parse error once =====
    const msg = stripAnsi(result.error?.message || 'Unknown error')
    const locator = (msg.match(/Locator:\s*(.+)/)?.[1] || '').trim()
    const location = `${test.location.file}:${test.location.line}`
    const projectName = test.parent?.project()?.name || 'unknown'

    // First line & Expected/Received as-is (keep normal spaces)
    const firstLine = (msg.split('\n').find(Boolean) || msg).trim()
    const exp = msg.match(/Expected (?:string|value):\s*"([^"]*)"/)
    const rec = msg.match(/Received (?:string|value):\s*"([^"]*)"/)

    const expectedRaw = exp ? exp[1] : ''
    const receivedRaw = rec ? rec[1] : ''

    // Title cause (preserve normal spaces, trim long)
    let shortCause = firstLine
    if (exp && rec) shortCause = `Expected "${expectedRaw}" but got "${receivedRaw}"`
    if (shortCause.length > 90) shortCause = shortCause.slice(0, 87) + '…'

    // Body values (also keep normal spaces)
    const expected = exp ? '`' + truncate(expectedRaw) + '`' : ''
    const received = rec ? '`' + truncate(receivedRaw) + '`' : ''

    const htmlHint = this.htmlReportDir ? `HTML report: \`${this.htmlReportDir}\`\nRun: \`npx playwright show-report\`` : ''

    // Collect artifacts and build a readable list
    const attachments = (result.attachments || [])
      .filter((a) => a.path && fs.existsSync(a.path))
      .map((a) => ({
        name: a.name || path.basename(a.path),
        path: a.path,
        sizeBytes: fs.statSync(a.path).size
      }))

    const artifactsLines = attachments.length ? ['**Artifacts**', ...attachments.map((a) => `- ${a.name} (${bytesToMB(a.sizeBytes)} MB): \`${a.path}\``), ''] : []

    const lines = [
      `**Test**: \`${test.title}\``,
      `**File**: \`${location}\``,
      `**Project**: \`${projectName}\``,
      locator ? `**Locator**: \`${locator}\`` : '',
      '',
      '**Failure**',
      `- ${firstLine}`,
      expected ? `- **Expected**: ${expected}` : '',
      received ? `- **Received**: ${received}` : '',
      '',
      ...artifactsLines,
      htmlHint
    ].filter(Boolean)

    // Final task payload — title includes mismatch with normal spaces
    const payload = {
      name: `❌ ${test.title} [${projectName}] – ${shortCause}`,
      description: lines.join('\n'),
      tags: ['playwright', 'auto-created', projectName]
    }

    try {
      const task = await createClickUpTask(this.listId, this.apiKey, payload)

      // Upload artifacts (skip too-large files)
      for (const a of attachments) {
        const sizeMB = bytesToMB(a.sizeBytes)
        if (sizeMB > MAX_UPLOAD_MB) {
          console.warn(`[ClickUpReporter] Skipping upload (>${MAX_UPLOAD_MB}MB): ${a.name} (${sizeMB}MB)`)
          continue
        }
        try {
          await attachFileToTask(task.id, this.apiKey, a.path)
        } catch (e) {
          console.warn('[ClickUpReporter] Attachment failed:', a.name, e.message)
        }
      }

      console.log('[ClickUpReporter] Created ClickUp task:', task.id)
    } catch (e) {
      console.error('[ClickUpReporter] Task creation error:', e.message)
    }
  }
}

module.exports = ClickUpReporter
