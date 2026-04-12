import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Edit } from './edit';
import { ModalService } from '../../../services/modal-service';
import { ClipService } from '../../../services/clipService';
import { of, Subject, throwError } from 'rxjs';
import { LikeType } from '../../../enum/likeType';
import { ClipResponse } from '../../../response/clipResponse';
import { ClipRequest } from '../../../request/clipRequest';
import { HttpErrorResponse } from '@angular/common/http';


describe('Edit', () => {
  let component: Edit;
  let fixture: ComponentFixture<Edit>;

  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockClipService: jasmine.SpyObj<ClipService>;

  let clipResponse: ClipResponse;

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj(['register', 'unregister', 'isModalOpen']);
    mockClipService = jasmine.createSpyObj(['updateClip']);

    await TestBed.configureTestingModule({
      imports: [Edit],
      providers: [
        {provide: ModalService, useValue: mockModalService},
        {provide: ClipService, useValue: mockClipService},
      ]
    })
    .compileComponents();

    clipResponse = {
      id: 1,
      title: 'Clip 1',
      description: 'Clip 1 description',
      pathFile: '/clip1-fake-path',
      cloudinaryPublicId: 'clip-1-fake-cloud-id',
      thumbnailUrl: 'clip1-fake-thumbnail',
      createdDate: new Date(2025, 5, 25),
      user: {
        id: 1,
        firstName: 'Mario',
        lastName: 'Rossi',
        age: 30,
        email: 'mario.rossi@example.com',
        phoneNumber: '0123456789',
        profilePicture: 'mario-profile-img',
        authorities: [{ authority: 'USER' }],
      },
      videoLikeResponse: {
        userLikeStatus: LikeType.LIKE,
        likesCount: 100,
        dislikesCount: 10,
      },
      views: 1000,
    }

    fixture = TestBed.createComponent(Edit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for properties', () => {
    expect(component.alertColor).toBe('blue');
    expect(component.alertMsg).toBe('Please wait! Updating clip.');
    expect(component.inSubmission).toBeFalse();
  });

  describe('title validation', () => {
    const titleTests: {value: any, valid: boolean}[] = [
      { value: '', valid: false },
      { value: null, valid: false },
      { value: undefined, valid: false },

      { value: 'a', valid: false },
      { value: 'ab', valid: false },

      { value: 'abc', valid: true },
      { value: 'abcd', valid: true },
      { value: 'valid title', valid: true },

      { value: '   ', valid: false },
    ];

    titleTests.forEach((test) => {
      it(`should validate title: ${test.value}`, () => {
        const titleControl = component.editForm.get('title');
        titleControl?.patchValue(test.value);

        fixture.detectChanges();

        expect(titleControl?.valid).toBe(test.valid);
      });
    });
  });

  describe('description validation', () => {
    const descriptionTests: {value: any, valid: boolean}[] = [
      { value: '', valid: false },
      { value: null, valid: false },
      { value: undefined, valid: false },

      { value: 'a', valid: false },
      { value: 'ab', valid: false },

      { value: '   ', valid: false },
      { value: '  a', valid: true },
      { value: 'a  ', valid: true },

      { value: 'abc', valid: true },
      { value: 'abcd', valid: true },
      { value: 'valid description', valid: true },

      { value: '\t\n', valid: false },
    ];

    descriptionTests.forEach((test) => {
      it(`should validate description: ${test.value}`, () => {
        const descriptionControl = component.editForm.get('description');
        descriptionControl?.patchValue(test.value);

        fixture.detectChanges();

        expect(descriptionControl?.valid).toBe(test.valid);
      });
    });
  });

  describe('clipID validation', () => {
    it('should validate clipID', () => {
      const clipidControl = component.editForm.get('clipID');

      expect(clipidControl?.valid).toBeTrue();
      expect(clipidControl).not.toBeNull();
    });
  });

  it('should call modalService.register("editClip") on init', () => {
    expect(mockModalService.register).toHaveBeenCalledWith('editClip');
  });

  it('should call modalService.unregister("editClip") on destroy', () => {
    component.ngOnDestroy();
    expect(mockModalService.unregister).toHaveBeenCalledWith('editClip');
  });

  describe('submit()', () =>{
    beforeEach(() => {
      component.activeClip = {
        id: 1,
        title: 'Clip 1',
        description: 'Clip 1 description',
        pathFile: '/clip1-fake-path',
        cloudinaryPublicId: 'clip-1-fake-cloud-id',
        thumbnailUrl: 'clip1-fake-thumbnail',
        createdDate: new Date(2025, 5, 25),
        user: {
          id: 1,
          firstName: 'Mario',
          lastName: 'Rossi',
          age: 30,
          email: 'mario.rossi@example.com',
          phoneNumber: '0123456789',
          profilePicture: 'mario-profile-img',
          authorities: [{ authority: 'USER' }],
        },
        videoLikeResponse: {
          userLikeStatus: LikeType.LIKE,
          likesCount: 100,
          dislikesCount: 10,
        },
        views: 1000,
      };

      component.editForm.setValue({
        clipID: '',
        title: 'Clip 1',
        description: 'Clip description',
      });
    });

    it('should disable form during submission', () => {
      const subject = new Subject<ClipResponse>();
      mockClipService.updateClip.and.returnValue(subject.asObservable());

      component.submit(component.editForm);

      expect(component.editForm.disabled).toBeTrue();
    });

    it('should set showAlert to true, alertColor to "blue", and alertMsg to "Please wait! Updating clip."', () => {
      const subject = new Subject<ClipResponse>();
      mockClipService.updateClip.and.returnValue(subject.asObservable());

      component.submit(component.editForm);

      expect(component.showAlert).toBeTrue();
      expect(component.alertColor).toBe('blue');
      expect(component.alertMsg).toBe('Please wait! Updating clip.');
    });

    it('should call clipService.updateClip with the correct activeClip.id and request body', () => {
      const request: ClipRequest = {
        title: 'Clip 1',
        description: 'Clip description'
      };
      mockClipService.updateClip.and.returnValue(of(clipResponse));

      component.submit(component.editForm);

      expect(mockClipService.updateClip).toHaveBeenCalledWith(1, request);
    });

    it('should set alertColor to "green" and reset and re-enable form on success', () => {
      mockClipService.updateClip.and.returnValue(of(clipResponse));

      component.submit(component.editForm);

      expect(component.alertColor).toBe('green');
      expect(component.editForm.enabled).toBeTrue();
      expect(component.editForm.value).toEqual({clipID: '', title: null, description: null});
    });

    it('should emit an updated ClipResponse with new title/description', () => {
      mockClipService.updateClip.and.returnValue(of(clipResponse));
      spyOn(component.refresh, 'emit');

      component.submit(component.editForm);

      expect(component.refresh.emit).toHaveBeenCalledWith(jasmine.objectContaining({
        id: 1,
        title: 'Clip 1',
        description: 'Clip description'
      }));
    });

    it('should set showAlert to false after 2 seconds', fakeAsync(() => {
      mockClipService.updateClip.and.returnValue(of(clipResponse));

      component.submit(component.editForm);

      expect(component.showAlert).toBeTrue();

      tick(2000);
      expect(component.showAlert).toBeFalse();
    }));
  });

  describe('submit() - Error handling', () => {
    beforeEach(() => {
      component.editForm.setValue({
        clipID: '',
        title: 'Clip 1',
        description: 'Clip description',
      });

      const error = new HttpErrorResponse({ status: 500 });
      mockClipService.updateClip.and.returnValue(throwError(() => error));
    });

    it('should set alertColor to red and re-enable form on error', () => {
      component.submit(component.editForm);

      expect(component.alertColor).toBe('red');
      expect(component.alertMsg).toBe('Something went wrong. Try again later.');
      expect(component.editForm.enabled).toBeTrue();
    });

    it('should not emit refresh on error', () => {
      spyOn(component.refresh, 'emit');

      component.submit(component.editForm);

      expect(component.refresh.emit).not.toHaveBeenCalled();

    });
  });
});
