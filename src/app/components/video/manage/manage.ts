import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { ModalService } from '../../../services/modal-service';
import { Edit } from "../edit/edit";


@Component({
  selector: 'app-manage',
  imports: [Edit, RouterLink],
  templateUrl: './manage.html',
  styleUrl: './manage.css'
})
export class Manage implements OnInit{

  public videoOrder: string = '1';
  public activeClip: null = null; // type is: activeClip: IClip | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService
  ){}

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params?.['sort'] === '2' ? params?.['sort'] : '1';
    });
  }

  public sort(event: Event){
    const { value } = (event.target as HTMLSelectElement);

    // this.router.navigateByUrl(`/manage?sort=${value}`);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    })
  }

  public openModal(event: Event){
    event.preventDefault();

    // this.activeClip = clip;   // 'clip' is passed to the function from the template, it contains the data of the clip (title)
                                // because we want to populate the modal with that data.

    this.modalService.toggleModal('editClip');
  }

  public update(event: Event){  // it should be: (event: IClip){}

  }
}
