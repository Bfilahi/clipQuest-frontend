import { Injectable } from '@angular/core';

interface IModal{
  id: string,
  isVisible: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modals: IModal[] = [];


  public isModalOpen(id: string): boolean{
    return !!this.modals.find(item => item.id === id)?.isVisible;
  }

  public toggleModal(id: string){
    const modal = this.modals.find(item => item.id === id);
    if(modal)
      modal.isVisible = !modal.isVisible;
  }

  public register(id: string){
    this.modals.push({
      id,
      isVisible: false
    });
  }

  public unregister(id: string){
    this.modals.filter(item => {
      item.id !== id;
    });
  }

}
