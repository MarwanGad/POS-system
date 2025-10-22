import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalsService {
  ProjectId: string | null = null;
  currency: any;
  primaryColor: string = '#000000';
  secondaryColor: string = '#ffffff';
  tableNumber: string | null = null;
  appName: string | null = null;
  appIcon: string | null = null;
  phoneNumber: string | null = null;
  instagramPage: string | null = null;
  constructor() {}

  initializeProjectFromUrl() {
    const params = new URLSearchParams(window.location.search);
    this.ProjectId = params.get('projectId');
    this.tableNumber = params.get('table');
  }
}
