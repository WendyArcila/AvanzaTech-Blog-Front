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
import { DataResponseComment } from '../../models/data';
import { Commentary } from '../../models/commentary';


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
  teamUserAuthenticated = signal ('team');
  idUserAuthenticated = signal (-1);
  flagUser = signal (false);
  @Input() id?: string ;
  submit = 'submit'
  form: FormGroup;
  comments= signal<Commentary[]>([])
  urlComments =`http://localhost:8000/comments/?blog_post=${this.id}`




  pageComments = signal<DataResponseComment>({
    count: -1,
    current_page: -1,
    links: {
      next: '',
      previous: '',
    },
    results:[],
    total_pages: -1,
  });

  post = signal<Post>(
    {
      id: -1,
      author: -1,
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
      this.listComments(`http://localhost:8000/comments/?blog_post=${this.id}`)
      this.existUser()
    }
  }

  getPost(id: string){
    this.detail.GetPost(id)
    .subscribe({
      next: (data) => {
        this.post.set(data)
        this.showEdit()
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
              this.listComments(`http://localhost:8000/comments/?blog_post=${this.id}`)
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

  listComments(page:string){
    if(this.id){
      this.comment.listComments(page)
      .subscribe({
          next:(response)=> {
            this.comments.set(response.results)
            this.pageComments.set(response)
          },
          error: (data)=> {
            console.log(data)
          }
      }
    )
    }

  }

  showEdit(){
    const post = this.post()
    if(post.author === Number(this.idUserAuthenticated)){
      if(post.post_category_permission[3].permission === 2){
        post.edit = true;
      }
    }
    else if(post.author_team === String(this.teamUserAuthenticated)){
      if(post.post_category_permission[2].permission === 2){
        post.edit = true;
      }
    }else if (this.local.getStorage('userAuth') !== undefined){
      if(post.post_category_permission[1].permission === 2){
        post.edit = true;
      }
    } else {
      if(post.post_category_permission[0].permission === 2){
        post.edit = true;
      }
    }
    }

  existTeamUser(){
    if (this.local.getStorage('teamUserAuth') !== undefined) {
      this.teamUserAuthenticated.set(this.local.getStorage('teamUserAuth')  || 'team')
    } else {
      this.teamUserAuthenticated.set('team');
    }
  }

  existIdUser(){
    if (this.local.getStorage('idUserAuth') !== undefined) {
      const id = JSON.parse(this.local.getStorage('idUserAuth') || '-1');
      this.idUserAuthenticated.set(id)
    } else {
      this.idUserAuthenticated.set(-1);
    }
  }

  existUser(){
    if (this.local.getStorage('userAuth') !== undefined) {
      this.flagUser.set(true)
    } else {
      this.flagUser.set(false)
    }
  }

  paginationNext(){
    const next = this.pageComments().links.next
    this.listComments(next)
  }


  paginationBack(){
    const back = this.pageComments().links.previous
    this.listComments(back)
  }
}
