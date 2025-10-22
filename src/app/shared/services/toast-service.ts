import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastInterface } from 'shared/models/toast.interface';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastInterface>();
  toast$ = this.toastSubject.asObservable();

  show(toast: ToastInterface): void {
    this.toastSubject.next(toast);
  }
}
