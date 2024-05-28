import { CommonModule } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { Router, RouterLinkWithHref, RouterModule } from '@angular/router';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetailService } from '../../services/detail/detail.service';
import { LocalStorageService } from '../../../shared/services/storage.service';
import { Post } from '../../models/post';
import Swal from 'sweetalert2';
import { RichtextComponent } from '../../../shared/components/richtext/richtext.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    BtnComponent,
    HeaderComponent,
    MatIconModule,
    RouterLinkWithHref,
    ReactiveFormsModule,
    RichtextComponent
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {

  private detail = inject(DetailService);
  @Input() id?: string;
  form: FormGroup;


  oldPost:Post =(
    {
      title: '',
      content:'',
      post_category_permission:[],
    }
  );

  newPost:Post =(
    {
      title: '',
      content:'',
      post_category_permission:[],
    }
  );

  public:number = 0;
  authenticated:number = 0;
  team:number = 0;
  author:number = 0;



  constructor(
    private router: Router,
    private local: LocalStorageService,
    private FormBuilder: FormBuilder,
  ) {
    this.form = this.FormBuilder.group({
      title:['',  [Validators.required]],
      content: ['',[Validators.required]],
      publicPermission:['', [Validators.required]],
      authenticatedPermission:['', [Validators.required]],
      teamPermission:['', [Validators.required]],
      authorPermission:['', [Validators.required]]
    });
  }

  ngOnInit(){
    if(this.id){
      this.getPost(this.id)
    }
  }

  getPost(id: string){
    this.detail.GetPost(id)
    .subscribe({
      next: (data) => {
        this.oldPost =data
        this.public = this.oldPost.post_category_permission[0].permission
        this.authenticated = this.oldPost.post_category_permission[1].permission
        this.team = this.oldPost.post_category_permission[2].permission
        this.author = this.oldPost.post_category_permission[3].permission
      },
      error: (error) => {
        console.log(error);
      }
    })
  };

  updatePost() {
    this.fillPost();
    if (this.id){
      this.detail.editPost(this.id, this.newPost)
      .subscribe({
          next: (response) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Your post was successfully updated",
              showConfirmButton: false,
              timer: 1500
            }).then((result) => {
              this.router.navigate(['']);
            })
          },
          error: (error) => {
            console.log(error);
          }
        });
    }

  }
  resetForm() {
    if(this.id){
      this.getPost(this.id)
    }
  };

  fillPost(){
    this.title === ''? this.newPost.title = this.oldPost.title : this.newPost.title = this.title;
    this.content === '' ? this.newPost.content = this.oldPost.content : this.newPost.content = this.content;
    this.newPost.post_category_permission= [
      {'permission': this.publicPermissions === ''?  this.public : this.publicPermissions,
        'category': 1
      },
      {'permission': this.authenticatedPermissions  === ''?  this.authenticated : this.authenticatedPermissions,
      'category': 2
      },
      {'permission': this.teamPermissions  === ''?  this.team : this.teamPermissions,
      'category': 3
      },
      {'permission': this.authorPermissions  === ''?  this.author : this.authorPermissions,
      'category': 4
      },
    ]
  }

  get title(){
    return this.form.value.title;
}

  get content(){
    return this.form.value.content;
  }

  get publicPermissions(){
    return this.form.value.publicPermission;
  }

  get authenticatedPermissions(){
    return this.form.value.authenticatedPermission;
  }

  get teamPermissions(){
    return this.form.value.teamPermission;
  }

  get authorPermissions(){
    return this.form.value.authorPermission;
  }

  get titleReder(){
    return this.form.get('title')
  }

  get contentReder(){
    return this.form.get('content')
  }

}
