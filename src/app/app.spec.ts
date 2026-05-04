import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { ModalService } from './services/modal-service';
import { Auth } from './services/auth';
import { provideRouter } from '@angular/router';

describe('App', () => {
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockAuthService: jasmine.SpyObj<Auth>;

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj(['register', 'unregister']);
    mockAuthService = jasmine.createSpyObj(['']);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: ModalService, useValue: mockModalService },
        { provide: Auth, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
