import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { AuthModal } from "./components/user/auth-modal/auth-modal";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, AuthModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
