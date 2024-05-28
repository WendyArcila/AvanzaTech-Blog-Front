import { CommonModule } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { CommentsService } from '../../services/comments/comments.service';
import { Post } from '../../models/post';
import { LocalStorageService } from '../../../shared/services/storage.service';
import { DetailService } from '../../services/detail/detail.service';
import { RouterLinkWithHref } from '@angular/router'
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { FormGroup, FormBuilder,ReactiveFormsModule, Validators,} from '@angular/forms';


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    BtnComponent,
    HeaderComponent,
    MatIconModule,
    RouterLinkWithHref,
    ReactiveFormsModule,
    ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {

  private detail = inject(DetailService);
  private comment = inject(CommentsService);

  @Input() id?: string;
  submit = 'submit'
  form: FormGroup;

  post = signal<Post>(
    {
      id: -1,
      author: '',
      title: '',
      excerpt : '',
      content:'',
      author_name:'',
      author_team: '',
      likes: [],
      comments: [],
      created_date: undefined,
      post_category_permission:[],
      flag: false,
    }
  );

  constructor(
    private router: Router,
    private local: LocalStorageService,
    private FormBuilder: FormBuilder,
  ) {
    this.form = this.FormBuilder.group({
      comment:['', [Validators.required]]
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
        this.post.set(data)
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  resetForm() {
    this.form.reset();
  };

  saveComment(){
    if(this.form.valid && this.id){
      const num_id = Number(this.id)
      this.comment.saveComment(num_id, this.form.value.comment)
      .subscribe({
        next: () => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your comment has been saved!",
            showConfirmButton: false,
            timer: 1500
          }).then((result) => {
            if(this.id){
              this.getPost(this.id)
            }
        })
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
 }

 deletePost() {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton:"btn btn-success",
      cancelButton:"btn btn-danger"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "Delete?",
    text: "Are you sure you want to delete this post",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",

  }).then((result) => {
    if (result.isConfirmed && this.id) {
      const num_id = Number(this.id)
      this.detail.deletePost(num_id)
      .subscribe({
        next: ()=> {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your post has been deleted.",
            icon: "success"
          }).then((result) => {
            this.router.navigate(['']);
        })
        }, error: (error) => {
          console.log(error);
          if('detail' in error.error){
            if(error.error.detail === 'You do not have permission to delete this post.'){
              swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "You have not been able to delete this post",
                icon: "error"
              });
            }
          }
        }
      })
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Cancelled",
        text: "Your post is safe :)",
        icon: "error"
      });
    }
  });

}

}
