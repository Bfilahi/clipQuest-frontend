import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsContainer } from './tabs-container';
import { Tab } from '../tab/tab';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <app-tabs-container>
      <app-tab tabTitle="Login"></app-tab>
      <app-tab tabTitle="Register"></app-tab>
      <app-tab tabTitle="Profile"></app-tab>
    </app-tabs-container>
  `,
  imports: [TabsContainer, Tab],
})
class FakeHostComponent {}


describe('TabsContainer', () => {
  let component: TabsContainer;
  let fixture: ComponentFixture<FakeHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsContainer, FakeHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FakeHostComponent);
    fixture.detectChanges();

    component = fixture.debugElement.query(By.directive(TabsContainer)).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should automatically activate the first tab when no tab is active', () => {
    const tabs = component.tabs!.toArray();

    expect(tabs[0].active).toBeTrue();
    expect(tabs[1].active).toBeFalse();
    expect(tabs[2].active).toBeFalse();
  });

  describe('selectTab()', () => {
    it('should activate one tab at a time', () => {
      const tabs = component.tabs!.toArray();
  
      component.selectTab(tabs[1]);
      fixture.detectChanges();
  
      expect(tabs[0].active).toBeFalse();
      expect(tabs[1].active).toBeTrue();
      expect(tabs[2].active).toBeFalse();
  
      const inactiveTabs = tabs.filter(tab => tab !== tabs[1]);
      expect(inactiveTabs.every(tab => tab.active === false)).toBeTrue();
    });
  
    it('should return false', () => {
      const tabs = component.tabs!.toArray();

      const returnedValue = component.selectTab(tabs[1]);
      fixture.detectChanges();

      expect(returnedValue).toBeFalse();
    });
  });

  describe('template', () => {
    it('should render the correct number of tabs', () => {
      const tabs = component.tabs!.toArray();

      expect(fixture.debugElement.queryAll(By.css('ul li')).length).toBe(tabs.length);
    });

    it('should call selectTab with the correct tab', () => {
      spyOn(component, 'selectTab');
      const links = fixture.debugElement.queryAll(By.css('ul li a'));

      links[1].triggerEventHandler('click', null);

      const expectedTab = component.tabs!.toArray()[1];
      expect(component.selectTab).toHaveBeenCalledWith(expectedTab);
    });
  });

});
