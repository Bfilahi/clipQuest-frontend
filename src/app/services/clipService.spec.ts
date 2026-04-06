import { TestBed } from '@angular/core/testing';

import { ClipService } from './clipService';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ClipResponse } from '../response/clipResponse';
import { LikeType } from '../enum/likeType';
import { environment } from '../../environments/environment.development';
import { ClipRequest } from '../request/clipRequest';

describe('ClipService', () => {
  let service: ClipService;
  let clipResponse: ClipResponse[];
  let httpTestingController: HttpTestingController;

  const url: string = `${environment.BASE_URL}/videos`;
  const clipId: number = 2;
  let formData: FormData;
  let clipRequest: ClipRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ClipService);
    httpTestingController = TestBed.inject(HttpTestingController);

    clipResponse = [
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

    formData = new FormData();
    formData.append('title', clipResponse[0].title);
    formData.append('description', clipResponse[0].description);
    formData.append('file', clipResponse[0].pathFile);

    clipRequest = {
      title: 'Clip 1',
      description: 'Clip 1 description'
    };
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getClips()', () => {
    it('should call the method with the correct URL', () => {
      service.getClips().subscribe(res => expect(res).toEqual(clipResponse));

      const req = httpTestingController.expectOne(url);
      req.flush(clipResponse);
      expect(req.request.method).toBe('GET');
    });

    it('should return an empty array when no clips exist', () => {
      service.getClips().subscribe(res => {
        expect(res).toEqual([]);
        expect(res.length).toBe(0);
      });

      const req = httpTestingController.expectOne(url);
      req.flush([]);
    });

    it('should propagate errors', () => {
      service.getClips().subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toBe(500)
      });

      const req = httpTestingController.expectOne(url);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getUserClips()', () => {
    it('should call the method with the correct URL', () => {
      service.getUserClips().subscribe(res => expect(res).toEqual(clipResponse));

      const req = httpTestingController.expectOne(`${url}/user`);
      req.flush(clipResponse);
      expect(req.request.method).toBe('GET');
    });

    it('should propagate errors', () => {
      service.getUserClips().subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toEqual(500)
      });

      const req = httpTestingController.expectOne(`${url}/user`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getClip()', () => {
    it('should call the method with the correct URL', () => {
      service.getClip(clipId).subscribe(res => expect(res).toEqual(clipResponse[0]));

      const req = httpTestingController.expectOne(`${url}/video/${clipId}`);
      req.flush(clipResponse[0]);
      expect(req.request.method).toBe('GET');
    });

    it('should propagate errors', () => {
      service.getClip(clipId).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toEqual(500)
      });

      const req = httpTestingController.expectOne(`${url}/video/${clipId}`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('uploadClip()', () => {
    it('should call the method with the correct URL', () => {
      service.uploadClip(formData).subscribe(res => expect(res).toEqual(clipResponse[0]));

      const req = httpTestingController.expectOne(`${url}/user/upload-video`);
      req.flush(clipResponse[0]);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe(formData);
    });

    it('should propagate errors', () => {
      service.uploadClip(formData).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toEqual(500)
      });

      const req = httpTestingController.expectOne(`${url}/user/upload-video`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('deleteClip()', () => {
    it('should call the method with the correct URL', () => {
      service.deleteClip(clipId).subscribe();

      const req = httpTestingController.expectOne(`${url}/user/${clipId}`);
      req.flush(null);
      expect(req.request.method).toBe('DELETE');
    });

    it('should propagate errors', () => {
      service.deleteClip(clipId).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toEqual(500)
      });

      const req = httpTestingController.expectOne(`${url}/user/${clipId}`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('updateClip()', () => {
    it('should call the method with the correct URL', () => {
      service.updateClip(clipId, clipRequest).subscribe(res => expect(res).toEqual(clipResponse[0]));

      const req = httpTestingController.expectOne(`${url}/user/edit/${clipId}/video`);
      req.flush(clipResponse[0]);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toBe(clipRequest);
    });

    it('should propagate errors', () => {
      service.updateClip(clipId, clipRequest).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toEqual(500)
      });

      const req = httpTestingController.expectOne(`${url}/user/edit/${clipId}/video`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
