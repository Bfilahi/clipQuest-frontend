import { TestBed } from '@angular/core/testing';

import { CommentService } from './comment-service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment.development';
import { CommentResponse } from '../response/commentResponse';

describe('CommentService', () => {
  let service: CommentService;
  let httpTestingController: HttpTestingController;
  let commentResponse: CommentResponse[];

  const url: string = `${environment.BASE_URL}/comments`
  const commentId: number = 1;
  const comment: string =
    'All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.';

    
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CommentService);
    httpTestingController = TestBed.inject(HttpTestingController);

    commentResponse = [
      {
        id: 1,
        comment:
          'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
        createdDate: new Date(2025, 10, 3),
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
          'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
        createdDate: new Date(2025, 5, 3),
        user: {
          id: 2,
          firstName: 'Adam',
          lastName: 'Neri',
          age: 31,
          email: 'adam.neri@example.com',
          phoneNumber: '0123456789',
          profilePicture: 'adam-profile-img',
          authorities: [{ authority: 'USER' }, { authority: 'ADMIN'}],
        },
      },
    ];
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getVideoComments()', () => {
    it('should call the method with correct URL', () => {
      service.getVideoComments(commentId).subscribe(res => expect(res).toEqual(commentResponse));

      const req = httpTestingController.expectOne(`${url}/video/${commentId}`);
      req.flush(commentResponse);
      expect(req.request.method).toBe('GET');
    });

    it('should return an empty array when no comments exist', () => {
      service.getVideoComments(commentId).subscribe(res => {
        expect(res).toEqual([]);
        expect(res.length).toBe(0);
      });

      const req = httpTestingController.expectOne(`${url}/video/${commentId}`);
      req.flush([]);
    });

    it('should propagate errors', () => {
      service.getVideoComments(commentId).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toEqual(500)
      });

      const req = httpTestingController.expectOne(`${url}/video/${commentId}`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getUserComments()', () => {
    it('should call the method with the correct URL', () => {
      service.getUserComments(commentId).subscribe(res => expect(res).toEqual(commentResponse));

      const req = httpTestingController.expectOne(`${url}/user/${commentId}`);
      req.flush(commentResponse);
      expect(req.request.method).toBe('GET');
      expect(req.request.body).toBeNull();
    });

    it('should return an empty array when no comments exist', () => {
      service.getUserComments(commentId).subscribe(res => {
        expect(res).toEqual([]);
        expect(res.length).toBe(0);
      });

      const req = httpTestingController.expectOne(`${url}/user/${commentId}`);
      req.flush([]);
    });

    it('should propagate errors', () => {
      service.getUserComments(commentId).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toEqual(500)
      });

      const req = httpTestingController.expectOne(`${url}/user/${commentId}`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('addComment()', () => {
    it('should call the method with the correct URL', () => {
      service.addComment(commentId, comment).subscribe(res => expect(res).toEqual(commentResponse[0]));

      const req = httpTestingController.expectOne(`${url}/user/${commentId}/new-comment`);
      req.flush(commentResponse[0]);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTrue();
      expect(req.request.body.get('comment')).toBe(comment);
    });

    it('should propagate errors', () => {
      service.addComment(commentId, comment).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toEqual(500)
      });

      const req = httpTestingController.expectOne(`${url}/user/${commentId}/new-comment`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('deleteComment()', () => {
    it('should call the method with the correct URL', () => {
      service.deleteComment(commentId).subscribe();

      const req = httpTestingController.expectOne(`${url}/user/${commentId}`);
      req.flush(null);
      expect(req.request.method).toBe('DELETE');
    });

    it('should propagate errors', () => {
      service.deleteComment(commentId).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.status).toEqual(500)
      });

      const req = httpTestingController.expectOne(`${url}/user/${commentId}`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});