import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Manage } from './manage';
import { ModalService } from '../../../services/modal-service';
import { ClipService } from '../../../services/clipService';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { LikeType } from '../../../enum/likeType';
import { ClipResponse } from '../../../response/clipResponse';
import { HttpErrorResponse } from '@angular/common/http';


describe('Manage', () => {
  let component: Manage;
  let fixture: ComponentFixture<Manage>;

  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockClipService: jasmine.SpyObj<ClipService>;

  let CLIPS: ClipResponse[];

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj(['toggleModal', 'register', 'unregister', 'isModalOpen']);
    mockClipService = jasmine.createSpyObj(['deleteClip', 'getUserClips']);

    await TestBed.configureTestingModule({
      imports: [Manage, ReactiveFormsModule],
      providers: [
        {provide: ModalService, useValue: mockModalService},
        {provide: ClipService, useValue: mockClipService},
        provideRouter([])
      ],
    })
    .compileComponents();

    mockClipService.getUserClips.and.returnValue(of([]));

    CLIPS = [
      {
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
      },
      {
        id: 2,
        title: 'Clip 2',
        description: 'Clip 2 description',
        pathFile: '/clip2-fake-path',
        cloudinaryPublicId: 'clip-2-fake-cloud-id',
        thumbnailUrl: 'clip2-fake-thumbnail',
        createdDate: new Date(2025, 10, 25),
        user: {
          id: 1,
          firstName: 'Adam',
          lastName: 'Neri',
          age: 30,
          email: 'adam.neri@example.com',
          phoneNumber: '0123456789',
          profilePicture: 'adam-profile-img',
          authorities: [{ authority: 'USER' }, { authority: 'ADMIN' }],
        },
        videoLikeResponse: {
          userLikeStatus: LikeType.LIKE,
          likesCount: 200,
          dislikesCount: 5,
        },
        views: 3000,
      },
    ];

    fixture = TestBed.createComponent(Manage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('listUserClips()', () => {
    it('should populate clips signal and set isLoading to false on success', () => {
      expect(component.clips().length).toBe(0);
      mockClipService.getUserClips.and.returnValue(of(CLIPS));

      component.ngOnInit();

      expect(component.clips().length).toBe(CLIPS.length);
      expect(component.isLoading()).toBeFalse();
    });

    it('should keep clips empy and log error on error', () => {
      const error = new HttpErrorResponse({status: 500});
      mockClipService.getUserClips.and.returnValue(throwError(() => error));
      const consoleSpy = spyOn(console, 'error');

      component.ngOnInit();

      expect(component.clips().length).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteClip()', () => {
    let event: Event;

    beforeEach(() => {
      mockClipService.deleteClip.and.returnValue(of(void 0));
      event = new MouseEvent('click');
      spyOn(event, 'preventDefault');
      component.clips.set(CLIPS);
    });

    it('should not call deleteClip if user cancels confirm', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteClip(event, CLIPS[0]);

      expect(mockClipService.deleteClip).not.toHaveBeenCalled();
    });

    it('should remove the deleted clip from the clips signal, and alert state should update correctly', () => {
      spyOn(window, 'confirm').and.returnValue(true);

      component.deleteClip(event, CLIPS[0]);

      expect(component.clips()).not.toContain(CLIPS[0]);
      expect(component.showAlert).toBeFalse();
    });

    it('should set error message and alertColor to "red"', () => {
      const error = new HttpErrorResponse({status: 500});
      mockClipService.deleteClip.and.returnValue(throwError(() => error));
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(console, 'error');

      component.deleteClip(event, CLIPS[0]);

      expect(console.error).toHaveBeenCalled();
      expect(component.alertColor).toBe('red');
    });
  });

  describe('refresh()', () => {
    it('should update title and description in the signal when a clip with a matching id is emitted', () => {
      component.clips.set(CLIPS);
      const updated: ClipResponse = {
        id: 1,
        title: 'Updated Clip title',
        description: 'Updated Clip description',
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

      component.refresh(updated);

      expect(component.clips()[0].title).toBe('Updated Clip title');
      expect(component.clips()[0].description).toBe('Updated Clip description');
    });
  });

  describe('openModal()', () => {
    let event: Event;

    beforeEach(() => {
      component.clips.set(CLIPS);
      event = new MouseEvent('click');
    });

    it('should set activeClip to the passed clip', () => {
      component.openModal(event, CLIPS[0]);

      expect(component.activeClip).toEqual(CLIPS[0]);
    });

    it('should call modalService.toggleModal("editClip")', () => {
      component.openModal(event, CLIPS[0]);

      expect(mockModalService.toggleModal).toHaveBeenCalledWith('editClip');
    });

    it('should call preventDefault()', () => {
      spyOn(event, 'preventDefault');

      component.openModal(event, CLIPS[0]);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('copyLink()', () => {
    let event: Event;

    beforeEach(() => {
      event = new MouseEvent('click');
      spyOn(navigator.clipboard, 'writeText');
    });

    it('should call navigator.clipboard.writeText with the correct path', () => {
      component.copyLink(event, CLIPS[0].pathFile);

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    it('should call preventDefault()', () => {
      spyOn(event, 'preventDefault');

      component.copyLink(event, CLIPS[0].pathFile);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not do anything when pathFile is falsy', () => {
      component.copyLink(event, '');

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });
  });

});
