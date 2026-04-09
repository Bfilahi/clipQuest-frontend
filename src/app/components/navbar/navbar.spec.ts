import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navbar } from './navbar';
import { ModalService } from '../../services/modal-service';
import { Auth } from '../../services/auth';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

describe('Navbar', () => {
  let component: Navbar;
  let router: Router;
  let fixture: ComponentFixture<Navbar>;

  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockAuthService: jasmine.SpyObj<Auth>;

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj(['toggleModal']);
    mockAuthService = jasmine.createSpyObj(['logout', 'getReturnUrl'], {isLoggedIn: signal(false)});

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([]),
        {provide: ModalService, useValue: mockModalService},
        {provide: Auth, useValue: mockAuthService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the login/register button only', () => {    
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('ul li a')).length).toBe(1);
    expect(fixture.debugElement.query(By.css('ul a')).nativeElement.textContent).toContain('Login / Register');
  });

  it('should show authenticated links', () => {
    mockAuthService.isLoggedIn.set(true);

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('ul li a')).length).toBe(3);
  });

  it('should call toggleModal when login/register is clicked', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'preventDefault');

    component.openModal(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockModalService.toggleModal).toHaveBeenCalledWith('auth');
  });

  it('should navigate to home if logged out', () => {
    mockAuthService.getReturnUrl.and.returnValue('/manage/videos');

    spyOn(router, 'navigate');
    component.logout(new MouseEvent('click'));

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not navigate if logged out from an unguarded route', () => {
    mockAuthService.getReturnUrl.and.returnValue('/home');

    spyOn(router, 'navigate');
    component.logout(new MouseEvent('click'));

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
