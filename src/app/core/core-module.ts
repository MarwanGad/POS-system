import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { SharedModule } from 'shared/shared-module';



@NgModule({
  declarations: [
    Navbar,

  ],
  imports: [
    SharedModule
  ],
  exports: [
    Navbar
  ]
})
export class CoreModule { }
