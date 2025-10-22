import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GlobalsService } from './../../services/helpers/globals.service';
import { CartService } from '../../services/cart.service';
import { TranslationService } from '../../services/helpers/translation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  screenWidth: number = 0;
  backButtonVisible: boolean = false;
  currentUrl: string = '';
  prevUrl: string = '';
  orderChecked: boolean = false;
  showLanguageIcon: boolean = false;
  isRtl!: boolean;
  constructor(
    public globals: GlobalsService,
    public router: Router,
    public translationService: TranslationService,
    private toastr: ToastrService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getScreenSize();
    this.router.events
      // Filter out only NavigationEnd events (when navigation is fully done)
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // If the current navigation lands on the "/cart" route
        if (event.urlAfterRedirects.startsWith('/cart')) {
          // Save the previous URL before updating currentUrl
          this.prevUrl = this.currentUrl;
        }
        // Update the current URL after navigation
        this.currentUrl = event.urlAfterRedirects;
        // ✅ Show back button only when NOT on home (even with params)
        const pathOnly = this.currentUrl.split('?')[0];
        this.backButtonVisible = pathOnly !== '/';

        // check if current URL is /order
        this.orderChecked = this.currentUrl.startsWith('/order');
      });
    // check directgions with language
    this.translationService.isRtl.subscribe((response) => {
      this.isRtl = response;
    });
  }

  // Navigate back to the previously stored URL
  navigateToPreviousUrl() {
    // ✅ Preserve query params when navigating back
    if (this.prevUrl && this.prevUrl !== this.currentUrl) {
      // ensure we pass an absolute path (no origin) to router
      try {
        const u = new URL(this.prevUrl, window.location.origin);
        const pathWithQuery = u.pathname + u.search + u.hash; // e.g. /categories/CAT-0002?table=1
        this.router.navigateByUrl(pathWithQuery);
      } catch (err) {
        // fallback: if prevUrl is already a path, just navigateByUrl
        this.router.navigateByUrl(this.prevUrl);
      }
    } else {
      this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
    }
  }

  goToCart(): void {
    // ✅ Preserve existing query params when going to cart
    this.router.navigate(['/cart'], { queryParamsHandling: 'preserve' });
  }

  changeLang(lang: string): void {
    this.translationService.setCurrentLanguage(lang);
  }

  openInstagram() {
    if (this.globals.instagramPage) {
      window.open(this.globals.instagramPage, '_blank');
    } else {
      console.warn('Instagram page URL is not set.');
    }
  }

  copyPhoneNumber() {
    if (this.globals.phoneNumber) {
      // Copy phone number to clipboard
      navigator.clipboard
        .writeText(this.globals.phoneNumber)
        .then(() => {
          // Show success toast
          this.toastr.success('Phone number copied!');
        })
        .catch((err) => {
          console.error('Failed to copy phone number: ', err);
        });
    } else {
      console.warn('Phone number is not set.');
    }
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenWidth = document.documentElement.clientWidth;

    this.showLanguageIcon = this.screenWidth < 784;
  }

  openLanguagesMenu(selectElement: HTMLSelectElement) {
    if (selectElement.showPicker) {
      selectElement.showPicker();
    } else {
      selectElement.focus();
      selectElement.click();
    }
  }
}
