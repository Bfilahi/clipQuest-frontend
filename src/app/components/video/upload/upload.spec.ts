import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Upload } from './upload';
import { ClipService } from '../../../services/clipService';
import { provideRouter, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { ClipResponse } from '../../../response/clipResponse';
import { LikeType } from '../../../enum/likeType';
import { HttpErrorResponse } from '@angular/common/http';

describe('Upload', () => {
  let component: Upload;
  let fixture: ComponentFixture<Upload>;

  let mockClipService: jasmine.SpyObj<ClipService>;

  let clipResponse: ClipResponse;
  let router: Router;

  beforeEach(async () => {
    mockClipService = jasmine.createSpyObj(['uploadClip']);

    await TestBed.configureTestingModule({
      imports: [Upload],
      providers: [
        { provide: ClipService, useValue: mockClipService },
        provideRouter([]),
      ],
    }).compileComponents();

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
    };

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Upload);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('storeFile()', () => {
    it('should set isDragOver to false after called', () => {
      component.isDragOver = true;

      const mockInput = { files: null } as HTMLInputElement;
      const event = new Event('change');
      Object.defineProperty(event, 'target', { value: mockInput });

      component.storeFile(event);

      expect(component.isDragOver).toBeFalse();
    });

    it('should set nextStep to true when a valid MP4 file is provided', () => {
      const mockFile = new File([''], 'test.mp4', { type: 'video/mp4' });
      const mockInput = {
        files: { item: () => mockFile },
      } as unknown as HTMLInputElement;
      const event = new Event('change');
      Object.defineProperty(event, 'target', { value: mockInput });

      component.storeFile(event);

      expect(component.nextStep).toBeTrue();
    });

    it('should set alertColor = "red" and showAlert = true when non-MP4 files are rejected', () => {
      const mockFile = new File([''], 'test.mvk', { type: 'video/mvk' });
      const mockInput = {
        files: { item: () => mockFile },
      } as unknown as HTMLInputElement;
      const event = new Event('change');
      Object.defineProperty(event, 'target', { value: mockInput });

      component.storeFile(event);

      expect(component.alertColor).toBe('red');
      expect(component.showAlert).toBeTrue();
      expect(component.nextStep).toBeFalse();
    });

    it('should store file from dataTransfer when drag-and-drop event is used', () => {
      const mockFile = new File([''], 'test.mp4', { type: 'video/mp4' });
      const mockInput = { files: { item: () => mockFile } };
      const event = new DragEvent('drop');
      Object.defineProperty(event, 'dataTransfer', { value: mockInput });

      component.storeFile(event);

      expect(component.file).toBe(mockFile);
    });

    it('should pre-fill the title form control with the filename (minus extension)', () => {
      const mockFile = new File([''], 'test-file.mp4', { type: 'video/mp4' });
      const mockInput = { files: { item: () => mockFile } };
      const event = new Event('change');
      Object.defineProperty(event, 'target', { value: mockInput });

      component.storeFile(event);

      expect(component.uploadForm.get('title')?.value).toBe('test-file');
    });

    it('should handle a null file gracefully', () => {
      const mockInput = {
        files: { item: () => null },
      } as unknown as HTMLInputElement;
      const event = new Event('change');
      Object.defineProperty(event, 'target', { value: mockInput });

      component.storeFile(event);

      expect(component.file).toBeNull();
      expect(component.nextStep).toBeFalse();
      expect(component.showAlert).toBeTrue();
      expect(component.alertColor).toBe('red');
    });
  });

  describe('uploadFile()', () => {
    it('should disable the form while uploading', () => {
      const subject = new Subject<ClipResponse>();
      mockClipService.uploadClip.and.returnValue(subject.asObservable());

      component.uploadFile(component.uploadForm);

      expect(component.uploadForm.disabled).toBeTrue();
    });

    it('should show the blue loading alert while in progress', () => {
      const subject = new Subject<ClipResponse>();
      mockClipService.uploadClip.and.returnValue(subject.asObservable());

      component.uploadFile(component.uploadForm);

      expect(component.alertColor).toBe('blue');
      expect(component.showAlert).toBeTrue();
    });

    it('should set green alert, resets the form, re-enables it, and navigates away on success', fakeAsync(() => {
      mockClipService.uploadClip.and.returnValue(of(clipResponse));
      spyOn(component.uploadForm, 'reset');
      spyOn(router, 'navigate');

      component.uploadFile(component.uploadForm);
      tick(2000);

      expect(component.alertColor).toBe('green');
      expect(component.alertMsg).toBe('Success!.');
      expect(component.uploadForm.reset).toHaveBeenCalled();
      expect(component.uploadForm.enabled).toBeTrue();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('should set red alert and re-enables the form on error', () => {
      const error = new HttpErrorResponse({ status: 500 });
      mockClipService.uploadClip.and.returnValue(throwError(() => error));
      const consoleSpy = spyOn(console, 'error');

      component.uploadFile(component.uploadForm);

      expect(component.alertColor).toBe('red');
      expect(component.alertMsg).toBe('Something went wrong. Try again later.');
      expect(component.uploadForm.enabled).toBeTrue();
      expect(consoleSpy).toHaveBeenCalledWith(error);
    });

    it('should construct formData correctly', () => {
      const mockFile = new File([''], 'test.mp4', { type: 'video/mp4' });
      component.file = mockFile;
      component.uploadForm.setValue({
        title: 'Clip 1',
        description: 'Clip description',
      });
      const expectedFormData = new FormData();
      expectedFormData.append('title', 'Clip 1');
      expectedFormData.append('description', 'Clip description');
      expectedFormData.append('file', mockFile);

      const subject = new Subject<ClipResponse>();
      mockClipService.uploadClip.and.returnValue(subject.asObservable());

      component.uploadFile(component.uploadForm);

      expect(mockClipService.uploadClip).toHaveBeenCalledWith(expectedFormData);
    });
  });

  describe('title validation', () => {
    const titleTests: { value: any; valid: boolean }[] = [
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
        let titleControl = component.uploadForm.get('title');
        titleControl?.patchValue(test.value);

        fixture.detectChanges();

        expect(titleControl?.valid).toBe(test.valid);
      });
    });
  });

  describe('descriptioin validation', () => {
    const descriptionTests: { value: any; valid: boolean }[] = [
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
        const descriptionControl = component.uploadForm.get('description');
        descriptionControl?.patchValue(test.value);

        fixture.detectChanges();

        expect(descriptionControl?.valid).toBe(test.valid);
      });
    });
  });

  it('should validate uploadForm with acceptable values', () => {
    component.uploadForm.setValue({
      title: 'Clip 1',
      description: 'Clip description',
    });

    expect(component.uploadForm.valid).toBeTrue();
  });
});
