
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LikesService } from '../../services/likes/likes.service';
import { Post } from '../../models/post';
import { ListService } from '../../services/list/list.service';
import { Like } from '../../models/like';
import { Commentary } from '../../models/commentary';
import { LocalStorageService } from '../../../shared/services/storage.service';
import { DetailService } from '../../services/detail/detail.service';
import Swal from 'sweetalert2';
import { DataResponsePost } from '../../models/data';
import { RouterLinkWithHref } from '@angular/router'
import { forEach } from '@tiptap/core/dist/packages/core/src/commands';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    MatIconModule,
    HeaderComponent,
    RouterLinkWithHref
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  private list= inject(ListService);
  private likes = inject(LikesService);
  private detail = inject(DetailService);

  url = 'http://localhost:8000/blogpost/'

  flagUser = signal (false);
  userAuthenticated = signal ('user');
  teamUserAuthenticated = signal ('team');
  idUserAuthenticated = signal (-1);
  commentsByPost = signal<Commentary[][]>([])
  likesByPost = signal<Like[][]>([])
  pagePost = signal<DataResponsePost>({
    count: -1,
    current_page: -1,
    links: {
      next: '',
      previous: '',
    },
    results:[],
    total_pages: -1,
  });
  posts = signal<Post[]>([]);
  showTooltip = signal(false);
  selectedPost = signal(-1);
  isLike = signal(true);


  constructor(
    private router: Router,
    private local: LocalStorageService,
  ) {}

  ngOnInit(){
    this.getDatoLocalStorage()
    this.getAllPosts(this.url)
  }


  getAllPosts(page:string){
    this.list.listPost(page)
    .subscribe({
      next: (data)=>{
        this.pagePost.set(data);
        this.posts.set(data.results);
        this.showEdit()
      },
      error: (data)=>{
        console.log(data)
      }
    })
  }

  getDatoLocalStorage(){
    this.existUser();
    this.existIdUser();
    this.existTeamUser();

  }

  createOrDeleteLike(idPost: number, like: boolean) {
    this.selectedPost.set(idPost);
    if (like === false){
      console.log('CREATING');
      this.likes.createLike({'blog_post':idPost})
      .subscribe({
        next: ()=> {
          this.isLike.set(true);
          this.getAllPosts(this.url)
          },
        error: (error) => {
          console.log(error);
          }
        })
    } else {
      console.log('DELETING');
      this.likes.deleteLike(idPost)
      .subscribe({
        next: ()=> {
          console.log('deleted');
          this.isLike.set(false);
          this.getAllPosts(this.url)
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  deletePost(post_id:number) {
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
      if (result.isConfirmed) {
        this.detail.deletePost(post_id)
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

  paginationNext(){
    const next = this.pagePost().links.next
    this.getAllPosts(next)
  }


  paginationBack(){
    const back = this.pagePost().links.previous
    this.getAllPosts(back)
  }

  changeTooltip(post: number) {
    this.selectedPost.set(post);
    if(this.showTooltip()){
      this.showTooltip.set(false);
    }else{
      this.showTooltip.set(true);
    }
  }

  existUser(){
    if (this.local.getStorage('userAuth') !== undefined) {
      this.flagUser.set(true)
    } else {
      this.flagUser.set(false)
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

  showEdit(){
    this.posts().forEach(post=> {
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

    });

  }

}
