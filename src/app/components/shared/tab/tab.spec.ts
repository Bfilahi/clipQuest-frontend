import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab } from './tab';
import { Component } from '@angular/core';

@Component({
  imports: [Tab],
  template: `
    <app-tab tabTitle='Login'>
      <p class="projected">Hello</p>
    </app-tab>
  `
})
class FakeHostComponent{}

describe('Tab', () => {
  let component: Tab;
  let fixture: ComponentFixture<Tab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be inactive by default', () => {
    expect(component.active).toBeFalse();
  });

  it('should show element when active is true', () => {
    component.active = true;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('div').classList.contains('hidden')).toBeFalse();
  });

  it('should update visibility when active changes', () => {
    component.active = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('div').classList.contains('hidden')).toBeFalse();

    component.active = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('div').classList.contains('hidden')).toBeTrue();
  });

  it('should accept tabTitle input', () => {
    component.tabTitle = 'My Tab';

    expect(component.tabTitle).toBe('My Tab');
  });

  it('should render projected content when active', () => {
    const hostFixture = TestBed.createComponent(FakeHostComponent);
    fixture.detectChanges();

    const content = hostFixture.nativeElement.querySelector('.projected');
    expect(content).toBeTruthy();
  });

});
