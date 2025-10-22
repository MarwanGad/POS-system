import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast-service';
import { ToastInterface } from 'shared/models/toast.interface';
import { firstValueFrom } from 'rxjs';

describe('ToastService', () => {
  let toastService: ToastService;
  let toast: ToastInterface;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    toastService = TestBed.inject(ToastService);
  });

  it('creates toast serivce', () => {
    expect(toastService).toBeTruthy();
  });

  describe('show', () => {
    it('emits the given toast into the observable', async () => {
      toast = { header: 'testing header', body: 'testing body' };

      const emittedPromise = firstValueFrom(toastService.toast$);

      toastService.show(toast);
      const emittedValue = await emittedPromise;

      expect(emittedValue).toEqual(toast);
    });
  });
});
