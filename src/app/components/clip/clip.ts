import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  imports: [],
  templateUrl: './clip.html',
  styleUrl: './clip.css'
})
export class Clip implements OnInit{

  public id: string = '';

  constructor(private route: ActivatedRoute){}

  public ngOnInit(): void {
    // this.id = this.route.snapshot.params?.['id'];
    this.route.params.subscribe((params: Params)=> {
      this.id = params?.['id'];
    })
  }

}
