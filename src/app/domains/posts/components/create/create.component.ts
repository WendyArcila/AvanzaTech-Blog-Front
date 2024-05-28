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

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    BtnComponent,
    HeaderComponent,
    MatIconModule,
    RouterLinkWithHref,
    ReactiveFormsModule,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {

  private detail = inject(DetailService);
  @Input() id?: string;
  form: FormGroup;
  post:Post =(
    {
      title: '',
      content:'',
      post_category_permission:[]
    }
  );


  constructor(
    private router: Router,
    private local: LocalStorageService,
    private FormBuilder: FormBuilder,
  ) {
    this.form = this.FormBuilder.group({
      title:['',  [Validators.required]],
      content: ['',[Validators.required]],
      publicPermission:[1, [Validators.required]],
      authenticatedPermission:[1, [Validators.required]],
      teamPermission:[2, [Validators.required]],
      authorPermission:[2, [Validators.required]]
    });
  }

  save(){
    if(this.form.valid){
      this.fillPost()
      this.detail.createPost(this.post)
      .subscribe({
        next: (data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your post was successfully publish",
            showConfirmButton: false,
            timer: 1500
          }).then((result) => {
            this.router.navigate(['']);
        })
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  fillPost(){
    this.post.title = this.title;
    this.post.content = this.content;
    this.post.post_category_permission= [
      {'permission': this.publicPermissions,
        'category': 1
      },
      {'permission': this.authenticatedPermissions,
      'category': 2
      },
      {'permission': this.teamPermissions,
      'category': 3
      },
      {'permission': this.authorPermissions,
      'category': 4
      },
    ]
  }

  get titleReder(){
    return this.form.get('title')
  }

  get contentReder(){
    return this.form.get('content')
  }

  resetForm() {
    this.form.reset();
  };

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


}
