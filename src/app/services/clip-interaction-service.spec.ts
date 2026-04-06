import { TestBed } from '@angular/core/testing';

import { ClipInteractionService } from './clip-interaction-service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment.development';
import { VideoLikeResponse } from '../response/videoLikeResponse';
import { LikeType } from '../enum/likeType';


describe('ClipInteractionService', () => {
  let service: ClipInteractionService;
  let httpTestingController: HttpTestingController;
  let videoLikeResponse: VideoLikeResponse;
  const clipId: number = 2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), 
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ClipInteractionService);
    httpTestingController = TestBed.inject(HttpTestingController);

    videoLikeResponse = {
      userLikeStatus: LikeType.LIKE,
      likesCount: 100,
      dislikesCount: 10,
    };
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('likeClip()', () => {
    it('should call the method with the correct URL', () => {
      service.likeClip(clipId).subscribe(res => expect(res).toEqual(videoLikeResponse));
  
      let req = httpTestingController.expectOne(`${environment.BASE_URL}/videos/${clipId}/like`);
      req.flush(videoLikeResponse);
      expect(req.request.method).toBe('POST');
    });
  
    it('should propagate errors', () => {
      service.likeClip(clipId).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toBe(500)
      });
  
      let req = httpTestingController.expectOne(`${environment.BASE_URL}/videos/${clipId}/like`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server error' });
    });
  });

  describe('dislikeClip()', () => {
    it('should call the method with the correct URL', () => {
      service.dislikeClip(clipId).subscribe(res => expect(res).toEqual(videoLikeResponse));
  
      let req = httpTestingController.expectOne(`${environment.BASE_URL}/videos/${clipId}/dislike`);
      req.flush(videoLikeResponse);
      expect(req.request.method).toBe('POST');
    });
  
    it('should propagate errors', () => {
      service.dislikeClip(clipId).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toBe(500)
      });
  
      let req = httpTestingController.expectOne(`${environment.BASE_URL}/videos/${clipId}/dislike`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('view()', () => {
    it('should call the method with the correct URL', () => {
      service.view(clipId).subscribe();
  
      let req = httpTestingController.expectOne(`${environment.BASE_URL}/videos/${clipId}/view`);
      req.flush(null);
      expect(req.request.method).toBe('POST');
    });
  
    it('should propagate errors', () => {
      service.view(clipId).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toBe(500)
      });
  
      let req = httpTestingController.expectOne(`${environment.BASE_URL}/videos/${clipId}/view`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getLikeStatus()', () => {
    it('should call the method with the correct URL', () => {
      service.getLikeStatus(clipId).subscribe(res => expect(res).toEqual(LikeType.LIKE));
  
      let req = httpTestingController.expectOne(`${environment.BASE_URL}/videos/${clipId}/like-status`);
      req.flush(LikeType.LIKE);
      expect(req.request.method).toBe('GET');
    });
  
    it('should propagate errors', () => {
      service.getLikeStatus(clipId).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toBe(500)
      });
  
      let req = httpTestingController.expectOne(`${environment.BASE_URL}/videos/${clipId}/like-status`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
