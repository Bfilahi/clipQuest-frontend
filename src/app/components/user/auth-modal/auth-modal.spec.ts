import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthModal } from './auth-modal';
import { ModalService } from '../../../services/modal-service';
import { Auth } from '../../../services/auth';
import { By } from '@angular/platform-browser';
import { Modal } from '../../shared/modal/modal';



describe('AuthModal', () => {
  let component: AuthModal;
  let fixture: ComponentFixture<AuthModal>;

  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockAuthService: jasmine.SpyObj<Auth>;

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj(['register','unregister','isModalOpen']);
    mockAuthService = jasmine.createSpyObj(['toggleModal']);

    await TestBed.configureTestingModule({
      imports: [AuthModal, Modal],
      providers: [
        { provide: ModalService, useValue: mockModalService },
        { provide: Auth, useValue: mockAuthService}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register() with "auth" exactly once', () => {
    expect(mockModalService.register).toHaveBeenCalledOnceWith('auth');
  });

  it('should call register() with "auth" on init', () => {    
    expect(mockModalService.register).toHaveBeenCalledWith('auth');
  });

  it('should call unregister() with "auth" on destroy', () => {
    component.ngOnDestroy();

    expect(mockModalService.unregister).toHaveBeenCalledWith('auth');
  });

  it('should render modal with correct modalID', () => {
    const modalComponent = fixture.debugElement.query(By.directive(Modal));

    expect(modalComponent.attributes['modalID']).toBe('auth');
  });
});
