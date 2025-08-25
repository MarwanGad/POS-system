import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import 'moment-hijri';
import { cartItemInterface } from 'shared/models/cartItem.interface';

@Component({
  selector: 'receipt',
  standalone: false,
  templateUrl: './receipt.html',
  styleUrl: './receipt.css'
})
export class Receipt implements OnInit {
  currentDate:any;
  productTotalPrice: number = 0;
  recepitId: any;

  @Input('cart') cart: cartItemInterface[] = [];



  ngOnInit(): void {
    this.recepitId = 'REC-' + Date.now();
    const now = new Date();

    const dateParts = new Intl.DateTimeFormat(
      'ar-SA-u-ca-islamic',
      { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Cairo' }
    ).formatToParts(now);

    const timeParts = new Intl.DateTimeFormat(
      'ar-SA',
      { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Africa/Cairo' }
    ).formatToParts(now);

    const get = (parts: Intl.DateTimeFormatPart[], type: string) =>
      (parts.find(p => p.type === type)?.value) || '';

    const day     = get(dateParts, 'day');
    const month   = get(dateParts, 'month');       
    const year    = get(dateParts, 'year');        
    const hour    = get(timeParts, 'hour');        
    const minute  = get(timeParts, 'minute');      
    const period  = get(timeParts, 'dayPeriod');   

    this.currentDate = `${day} ${month} ${year} هـ في ${hour}:${minute} ${period}`;
  }

  totalPrice(){
    const cartTotalPrice = this.cart
      .reduce( (sum, item) => sum + item.regularPrice * item.quantity,0);
    return cartTotalPrice ? cartTotalPrice : null;
  }

  downloadReceipt(){
    const recepitId = `فاتورة رقم: ${this.recepitId}\n`;
    const date = `التاريخ : ${this.currentDate}\n`;
    const receiptContent = this.cart
    .map(item => `${item.productName} - ${item.quantity} - ر.س ${item.regularPrice} = ر.س ${item.regularPrice * item.quantity}`)
    .join('\n');

    const total = `\nالمجموع: ${this.cart.reduce((sum, item) => sum + item.quantity * item.regularPrice, 0)} ر.س`;

    const blob = new Blob([recepitId + date + `\nالمنتجات:\n${receiptContent}` + '\n' + total], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `REC-${Date.now()}.txt`;
    a.click();

    window.URL.revokeObjectURL(url);
  }

}
