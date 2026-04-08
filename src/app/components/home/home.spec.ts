import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';
import { ClipService } from '../../services/clipService';
import { ModalService } from '../../services/modal-service';
import { of, throwError } from 'rxjs';
import { LikeType } from '../../enum/likeType';
import { ClipResponse } from '../../response/clipResponse';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let mockClipService: jasmine.SpyObj<ClipService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let CLIPS: ClipResponse[];

  beforeEach(async () => {
    mockClipService = jasmine.createSpyObj(['getClips']);
    mockModalService = jasmine.createSpyObj(['register', 'unregister']);

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        {provide: ClipService, useValue: mockClipService},
        {provide: ModalService, useValue: mockModalService},
        provideRouter([])
      ],
    })
    .compileComponents();

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

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });


  it('should have no clips at start', () => {
    mockClipService.getClips.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.clips().length).toBe(0);
  });

  it('should register "auth" modal on init', () => {
    mockClipService.getClips.and.returnValue(of([]));

    fixture.detectChanges();

    expect(mockModalService.register).toHaveBeenCalledWith('auth');
  });

  it('should return the correct number of clips', () => {
    mockClipService.getClips.and.returnValue(of(CLIPS));

    fixture.detectChanges();

    expect(component.clips().length).toBe(2);
  });

  it('should log error when getClips() fails', () => {
    const error = new HttpErrorResponse({status: 500});
    const consoleSpy = spyOn(console, 'error');
    mockClipService.getClips.and.returnValue(throwError(() => error));

    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith(error);
    expect(component.clips().length).toBe(0);
  });

  it('should unregister "auth" modal on destroy', () => {
    mockClipService.getClips.and.returnValue(of([]));
    fixture.detectChanges();

    component.ngOnDestroy();

    expect(mockModalService.unregister).toHaveBeenCalledWith('auth');
  });


  describe('template', () => {
    it('should render one element per clip', () => {
      mockClipService.getClips.and.returnValue(of(CLIPS));

      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('a')).length).toBe(CLIPS.length);
    });

    it('should render the correct data', () => {
      mockClipService.getClips.and.returnValue(of(CLIPS));

      fixture.detectChanges();

      const items = fixture.debugElement.queryAll(By.css('a'));
      expect(items[0].nativeElement.querySelector('img').getAttribute('src')).toBe(CLIPS[0].thumbnailUrl);
      expect(items[0].nativeElement.querySelector('h2').textContent).toBe(CLIPS[0].title);
      expect(items[0].nativeElement.querySelector('p').textContent).toContain(CLIPS[0].user.firstName);
      expect(items[0].nativeElement.querySelector('p span').textContent).toContain(CLIPS[0].createdDate.getFullYear());
    });
  });

});
