import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alert } from './alert';

describe('Alert', () => {
  let component: Alert;
  let fixture: ComponentFixture<Alert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Alert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the correct class for each color', () => {
    (['blue', 'green', 'red'] as const).forEach(color => {
      component.color = color;
      expect(component.bgColor).toBe(`bg-${color}-400`);
    });
  });

  it('should apply the bg class to the div', () => {
    component.color = 'red';
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelector('div');
    expect(div.classList).toContain('bg-red-400');
  });
});
