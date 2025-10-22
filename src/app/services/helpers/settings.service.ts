import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from './database.service';
import { GlobalsService } from './globals.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private db: DatabaseService, private globals: GlobalsService) {}

  /** ✅ Get project settings from Firebase */
  getProjectSettings(): Observable<any> {
    const settings = `projects/${this.globals.ProjectId}/settings`;

    return new Observable((observer) => {
      this.db.getDatabase(settings).subscribe((settings) => {
        if (settings) {
          this.globals.currency = settings.currency;
          this.globals.appName = settings.general_settings.application_name
          this.globals.appIcon = settings.general_settings.icon
          this.globals.phoneNumber = settings.content_settings.contact_phone
          this.globals.instagramPage = settings.content_settings.contact_instagram
          this.globals.primaryColor = settings.application_settings.mobile_primary_color;
          this.globals.secondaryColor = settings.application_settings.mobile_text_color;
          this.updateCSSVariables(this.globals.primaryColor, this.globals.secondaryColor);
          observer.next(settings);
        } else {
          observer.next({});
        }
        observer.complete();
      });
    });
  }

  private updateCSSVariables(primary: string, secondary: string): void {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }
}
