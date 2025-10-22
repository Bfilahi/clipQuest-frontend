import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ModalService } from '../../services/modal-service';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  constructor(
    public authService: Auth,
    private modalService: ModalService,
    private router: Router
  ){}



  public openModal(event: Event){
    event.preventDefault();

    this.modalService.toggleModal('auth');
  }

  public logout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // This should be in auth.service.ts ================
  // public async logout(){
  //   await this.router.navigateByUrl('/');
  // }
}
