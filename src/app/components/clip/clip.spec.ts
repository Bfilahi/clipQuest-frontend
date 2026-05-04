import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clip } from './clip';
import { CommentService } from '../../services/comment-service';
import { ClipService } from '../../services/clipService';
import { ClipInteractionService } from '../../services/clip-interaction-service';
import { ModalService } from '../../services/modal-service';
import { Auth } from '../../services/auth';
import { ActivatedRoute, Params, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { CommentResponse } from '../../response/commentResponse';
import { of, Subject } from 'rxjs';
import { VideoLikeResponse } from '../../response/videoLikeResponse';
import { LikeType } from '../../enum/likeType';
import { NgForm } from '@angular/forms';
import { ClipResponse } from '../../response/clipResponse';

describe('Clip', () => {
  let component: Clip;
  let fixture: ComponentFixture<Clip>;

  let mockCommentService: jasmine.SpyObj<CommentService>;
  let mockClipService: jasmine.SpyObj<ClipService>;
  let mockClipInteractionService: jasmine.SpyObj<ClipInteractionService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockAuthService: jasmine.SpyObj<Auth>;

  let route: ActivatedRoute;

  let commentResponse: CommentResponse[];
  let clipResponse: ClipResponse;
  let form: NgForm;

  beforeEach(async () => {
    mockCommentService = jasmine.createSpyObj([
      'addComment',
      'deleteComment',
      'getVideoComments',
      'getUserComments',
    ]);
    mockClipService = jasmine.createSpyObj(['getClip']);
    mockClipInteractionService = jasmine.createSpyObj([
      'likeClip',
      'dislikeClip',
      'view',
      'getLikeStatus',
    ]);
    mockModalService = jasmine.createSpyObj([
      'toggleModal',
      'register',
      'unregister',
    ]);
    mockAuthService = jasmine.createSpyObj([''], { isLoggedIn: signal(false) });
    form = jasmine.createSpyObj('NgForm', ['reset'], {value: {comment: 'Test comment'}});

    mockModalService.register.and.returnValue(void 0);


    await TestBed.configureTestingModule({
      imports: [Clip],
      providers: [
        {provide: CommentService, useValue: mockCommentService},
        {provide: ClipService, useValue: mockClipService},
        {provide: ClipInteractionService, useValue: mockClipInteractionService},
        {provide: ModalService, useValue: mockModalService},
        {provide: Auth, useValue: mockAuthService},
        provideRouter([])
      ]
    })
    .compileComponents();

    commentResponse = [
      {
        id: 1,
        comment:
          'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
        createdDate: new Date(2025, 5, 23),
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
      },
      {
        id: 2,
        comment:
          'All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary',
        createdDate: new Date(2025, 5, 23),
        user: {
          id: 2,
          firstName: 'Adam',
          lastName: 'Neri',
          age: 30,
          email: 'adam.neri@example.com',
          phoneNumber: '0123456789',
          profilePicture: 'adam-profile-img',
          authorities: [{ authority: 'USER' }, { authority: 'ADMIN' }],
        },
      },
    ];

    clipResponse = {
      id: 1,
      title: 'Test Clip',
      description: 'A test description',
      pathFile: 'http://example.com/video.mp4',
      cloudinaryPublicId: 'cloudinary-example.com',
      thumbnailUrl: 'fake-thumbnail',
      createdDate: new Date(2025, 5, 23),
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
        likesCount: 42,
        dislikesCount: 7,
        userLikeStatus: LikeType.LIKE,
      },
      views: 100,
    };

    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(Clip);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('checkUserComment(id)', () => {
    it(`should return true when the comment id belongs to the current user's comments
      and false when it doesn't`, () => {
      component.userComments.set(commentResponse);

      let expectedValue = component.checkUserComment(commentResponse[0].id);

      expect(expectedValue).toBeTrue();

      expectedValue = component.checkUserComment(3);

      expect(expectedValue).toBeFalse();
    });
  });

  describe('like()', () => {
    let videoLikeResponse: VideoLikeResponse;

    beforeEach(() => {
      videoLikeResponse = {
        userLikeStatus: LikeType.LIKE,
        likesCount: 100,
        dislikesCount: 20
      }

      mockClipInteractionService.likeClip.and.returnValue(of(videoLikeResponse));
    });

    it('should open the auth modal when the user is not logged in', () => {
      mockAuthService.isLoggedIn.set(false);

      component.like();

      expect(mockModalService.toggleModal).toHaveBeenCalledWith('auth');
    });

    it('should call likeClip() when logged in', () => {
      mockAuthService.isLoggedIn.set(true);

      component.like();

      expect(mockClipInteractionService.likeClip).toHaveBeenCalled();
    });

    it('should update likesCount, dislikesCount, and likeStatus signals on success', () => {
      mockAuthService.isLoggedIn.set(true);

      component.like();

      expect(component.likesCount()).toBe(videoLikeResponse.likesCount);
      expect(component.dislikesCount()).toBe(videoLikeResponse.dislikesCount);
      expect(component.likeStatus()).toBe(videoLikeResponse.userLikeStatus);
    });
  });

  describe('dislike()', () => {
    let videoLikeResponse: VideoLikeResponse;

    beforeEach(() => {
      videoLikeResponse = {
        userLikeStatus: LikeType.LIKE,
        likesCount: 100,
        dislikesCount: 20
      }

      mockClipInteractionService.dislikeClip.and.returnValue(of(videoLikeResponse));
    });

    it('should open the auth modal when the user is not logged in', () => {
      mockAuthService.isLoggedIn.set(false);

      component.dislike();

      expect(mockModalService.toggleModal).toHaveBeenCalledWith('auth');
    });

    it('should call dislikeClip() when logged in', () => {
      mockAuthService.isLoggedIn.set(true);

      component.dislike();

      expect(mockClipInteractionService.dislikeClip).toHaveBeenCalled();
    });

    it('should update likesCount, dislikesCount, and likeStatus signals on success', () => {
      mockAuthService.isLoggedIn.set(true);

      component.dislike();

      expect(component.likesCount()).toBe(videoLikeResponse.likesCount);
      expect(component.dislikesCount()).toBe(videoLikeResponse.dislikesCount);
      expect(component.likeStatus()).toBe(videoLikeResponse.userLikeStatus);
    });
  });

  describe('addComment(form)', () => {
    it('should open the auth modal when not logged in', () => {
      mockAuthService.isLoggedIn.set(false);

      component.addComment(form);

      expect(mockModalService.toggleModal).toHaveBeenCalledWith('auth');
    });

    it('should call commentService.addComment() with the correct clip id and comment text', () => {
      mockAuthService.isLoggedIn.set(true);
      mockCommentService.addComment.and.returnValue(of(commentResponse[0]));
      component.id = 0;
   
      component.addComment(form);

      expect(mockCommentService.addComment).toHaveBeenCalledWith(0, 'Test comment');
    });

    it('should append the new comment to both comments and userComments signals on success', () => {
      mockAuthService.isLoggedIn.set(true);
      const existingComment = commentResponse[0];
      const newComment = commentResponse[1];
      component.comments.set([existingComment]);
      component.userComments.set([existingComment]);
      mockCommentService.addComment.and.returnValue(of(newComment));

      component.addComment(form);

      expect(component.comments()).toEqual([existingComment, newComment]);
      expect(component.userComments()).toEqual([existingComment, newComment]);
    });

    it('should reset the form after submission', () => {
      mockAuthService.isLoggedIn.set(true);
      mockCommentService.addComment.and.returnValue(of(commentResponse[0]));

      component.addComment(form);

      expect(form.reset).toHaveBeenCalled();
    });
  });

  describe('deleteComment()', () => {
    let event: jasmine.SpyObj<Event>;

    beforeEach(() => {
      event = jasmine.createSpyObj('Event', ['preventDefault']);
    });

    it('should call event.preventDefault', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteComment(event, 0);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not do anything when the user cancels the confirm dialog', () => {
      mockCommentService.deleteComment.and.returnValue(of(void 0));
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteComment(event, 0);

      expect(mockCommentService.deleteComment).not.toHaveBeenCalled();
    });

    it('should call commentService.deleteComment() with the correct id when confirmed', () => {
      mockCommentService.deleteComment.and.returnValue(of(void 0));
      mockCommentService.getVideoComments.and.returnValue(of(commentResponse));

      spyOn(window, 'confirm').and.returnValue(true);

      component.deleteComment(event, 0);

      expect(mockCommentService.deleteComment).toHaveBeenCalledWith(0);
    });

    it('should call getComments() on successful deletion', () => {
      mockCommentService.deleteComment.and.returnValue(of(void 0));
      const getCommentsSpy = spyOn<any>(component, 'getComments');
      spyOn(window, 'confirm').and.returnValue(true);

      component.deleteComment(event, 0);

      expect(mockCommentService.deleteComment).toHaveBeenCalledWith(0);
      expect(getCommentsSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    let paramsSubject: Subject<Params>;
    let registerViewSpy: jasmine.Spy<any>;

    beforeEach(() => {
      paramsSubject = new Subject<Params>();
      Object.defineProperty(route, 'params', {
        value: paramsSubject.asObservable(),
      });
      mockAuthService.isLoggedIn.set(false);
      registerViewSpy = spyOn<any>(component, 'registerView');
    });

    it('should subscribe to route params and set this.id', () => {
      component.ngOnInit();

      paramsSubject.next({ id: 1 });

      expect(component.id).toBe(1);
    });

    it('should call registerView() on param change', () => {
      component.ngOnInit();

      paramsSubject.next({ id: 1 });

      expect(registerViewSpy).toHaveBeenCalled();
    });

    it('should call getLikeInfo() only when the user is logged in', () => {
      mockAuthService.isLoggedIn.set(true);
      const getLikeInfoSpy = spyOn<any>(component, 'getLikeInfo');

      component.ngOnInit();
      paramsSubject.next({ id: 1 });

      expect(getLikeInfoSpy).toHaveBeenCalled();
    });

    it('should not call getLikeInfo() only when the user is logged out', () => {
      mockAuthService.isLoggedIn.set(false);
      const getLikeInfoSpy = spyOn<any>(component, 'getLikeInfo');

      component.ngOnInit();
      paramsSubject.next({ id: 1 });

      expect(getLikeInfoSpy).not.toHaveBeenCalled();
    });
  });

  describe('getClip()', () => {
    let paramsSubject: Subject<Params>;

    beforeEach(() => {
      paramsSubject = new Subject();
      Object.defineProperty(route, 'params', {value: paramsSubject.asObservable()});
      mockClipInteractionService.view.and.returnValue(of(void 0));
      mockClipService.getClip.and.returnValue(of(clipResponse));
      mockCommentService.getVideoComments.and.returnValue(of(commentResponse));
    });

    it('should set likesCount from videoLikeResponse', () => {
      component.ngOnInit();

      paramsSubject.next({ id: 1 });

      expect(component.likesCount()).toBe(42);
    });

    it('should set dislikesCount from videoLikeResponse', () => {
      component.ngOnInit();

      paramsSubject.next({ id: 1 });

      expect(component.dislikesCount()).toBe(7);
    });
  });

  describe('getComments()', () => {
    let paramsSubject: Subject<Params>;
    beforeEach(() => {
      paramsSubject = new Subject();
      Object.defineProperty(route, 'params', {value: paramsSubject.asObservable()});
      mockClipInteractionService.view.and.returnValue(of(void 0));
      mockClipInteractionService.getLikeStatus.and.returnValue(of(LikeType.LIKE));
      mockClipService.getClip.and.returnValue(of(clipResponse));
      mockCommentService.getVideoComments.and.returnValue(of(commentResponse));
      mockCommentService.getUserComments.and.returnValue(of(commentResponse));
    });

    it('should populate comments', () => {
      component.ngOnInit();

      paramsSubject.next({id: 1});

      expect(component.comments()).toEqual(commentResponse);
    });

    it('should call getUserComments() only when logged in and comments exist', () => {
      mockAuthService.isLoggedIn.set(true);
      component.ngOnInit();

      paramsSubject.next({id: 1});

      expect(mockCommentService.getUserComments).toHaveBeenCalled();
    });

    it('should not call getUserComments() when logged out', () => {
      mockAuthService.isLoggedIn.set(false);
      component.ngOnInit();

      paramsSubject.next({ id: 1 });

      expect(mockCommentService.getUserComments).not.toHaveBeenCalled();
    });
  });

});
