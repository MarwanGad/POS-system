import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastInterface } from 'shared/models/toast.interface';
import { ToastService } from 'shared/services/toast-service';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast implements OnInit, OnDestroy {
  toasts: ToastInterface[] = [];
  subscription: Subscription | null = null;

  constructor(private toastService: ToastService){}

  ngOnInit(): void {
    this.toastService.toast$
      .subscribe( toast => {
        this.toasts.push(toast);
      })
  }

  ngOnDestroy(): void {
    if(this.subscription)
      this.subscription.unsubscribe();
  }
}
