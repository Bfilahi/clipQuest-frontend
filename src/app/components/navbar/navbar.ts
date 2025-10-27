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

  public logout(event: Event){
    event.preventDefault();
    
    this.authService.logout();
    const currentUrl = this.authService.getReturnUrl();

    const guardedRoutes = ['/manage', '/upload'];
    const isOnGuardedRoute = guardedRoutes.some(route => currentUrl.startsWith(route));

    if(isOnGuardedRoute)
      this.router.navigate(['/']);
  }
}
