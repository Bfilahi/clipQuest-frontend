import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modal } from './modal';
import { ModalService } from '../../../services/modal-service';
import { Auth } from '../../../services/auth';
import { By } from '@angular/platform-browser';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockAuthService: jasmine.SpyObj<Auth>;

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj(['toggleModal', 'isModalOpen']);
    mockAuthService = jasmine.createSpyObj(['']);

    await TestBed.configureTestingModule({
      imports: [Modal],
      providers: [
        {provide: ModalService, useValue: mockModalService},
        {provide: Auth, useValue: mockAuthService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should append element to the body on init', () => {
    const appendSpy = spyOn(document.body, 'appendChild');

    component.ngOnInit();

    expect(appendSpy).toHaveBeenCalledWith(component.el.nativeElement);
  });

  it('should call modalService.toggleModal with the correct modalID', () => {
    component.modalID = 'auth';

    component.closeModal();

    expect(mockModalService.toggleModal).toHaveBeenCalledWith('auth');
  });

  describe('template', () => {
    it('should have hidden class when modal is closed', () => {
      mockModalService.isModalOpen.and.returnValue(false);
  
      fixture.detectChanges();
  
      const modalEl = fixture.debugElement.query(By.css('#modal')).nativeElement;
      expect(modalEl.classList.contains('hidden')).toBeTrue();
    });
  
    it('should not have hidden class when modal is open', () => {
      mockModalService.isModalOpen.and.returnValue(true);
  
      fixture.detectChanges();
  
      const modalEl = fixture.debugElement.query(By.css('#modal')).nativeElement;
      expect(modalEl.classList.contains('hidden')).toBeFalse();
    });
  
    it('should close the modal when closeModal is clicked', () => {
      component.modalID = 'auth';
      fixture.detectChanges();
  
      const btn = fixture.debugElement.query(By.css('button span'));
      btn.triggerEventHandler('click', null);
  
      expect(mockModalService.toggleModal).toHaveBeenCalledWith('auth');
    });
  });
});
