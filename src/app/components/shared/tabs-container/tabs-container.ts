import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { Tab } from '../tab/tab';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-tabs-container',
  imports: [CommonModule],
  templateUrl: './tabs-container.html',
  styleUrl: './tabs-container.css'
})
export class TabsContainer implements AfterContentInit{

  @ContentChildren(Tab) tabs?: QueryList<Tab>;

  public ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter(tab => tab.active);

    if(!activeTabs || activeTabs.length === 0){
      this.selectTab(this.tabs!.first);
    }
  }

  public selectTab(tab: Tab){
    this.tabs?.forEach(tab => tab.active = false);

    tab.active = true;

    return false;
  }
}
