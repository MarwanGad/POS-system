import { AuthService } from '@auth0/auth0-angular';
import { Account } from './account';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

describe('Account', () => {
  let component: Account;
  let fixture: ComponentFixture<Account>;
  let authMock: Partial<AuthService>;

  beforeEach(waitForAsync(() => {
    authMock = jasmine.createSpyObj('AuthService', ['getAccessTokenSilently'], {
      user$: of({ name: 'klaus', email: 'mysticFalls@gmail.com' }),
    });

    (authMock.getAccessTokenSilently as jasmine.Spy).and.returnValue(
      of('fake-token')
    );

    TestBed.configureTestingModule({
      declarations: [Account],
      providers: [{ provide: AuthService, useValue: authMock }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(Account);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('refreshes the token', () => {
      component.ngOnInit();

      expect(authMock.getAccessTokenSilently).toHaveBeenCalled();
    });

    it('gets user credentials', () => {
      const user = { name: 'klaus', email: 'mysticFalls@gmail.com' };

      component.ngOnInit();

      expect(component.loggedInUser).toEqual(user);
    });
  });
});
