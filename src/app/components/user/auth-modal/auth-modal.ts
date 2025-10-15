import { Component, OnDestroy, OnInit } from '@angular/core';
import { Modal } from "../../shared/modal/modal";
import { ModalService } from '../../../services/modal-service';
import { TabsContainer } from "../../shared/tabs-container/tabs-container";
import { Tab } from "../../shared/tab/tab";
import { Register } from "../register/register";
import { Login } from "../login/login";

@Component({
  selector: 'app-auth-modal',
  imports: [Modal, TabsContainer, Tab, Register, Login],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.css'
})
export class AuthModal implements OnInit, OnDestroy{
  constructor(private modalService: ModalService){}

  public ngOnInit(): void {
    this.modalService.register('auth');
  }

  public ngOnDestroy(): void {
    this.modalService.unregister('auth');
  }
}
