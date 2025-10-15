import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsContainer } from './tabs-container';

describe('TabsContainer', () => {
  let component: TabsContainer;
  let fixture: ComponentFixture<TabsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
