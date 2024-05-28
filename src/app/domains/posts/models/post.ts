import { PostCategoryPermission } from "./postcatperm";
import { LikesService } from '../services/likes/likes.service';
import { Like } from "./like";
import { Commentary } from "./commentary";


export interface Post{
  id?: number;
  author?: number;
  title: string;
  excerpt?: string;
  content:string;
  author_name?:string;
  author_team?: string;
  likes?: Like[];
  comments?: Commentary[];
  created_date?: Date;
  post_category_permission: PostCategoryPermission[];
  flag?: boolean;
  edit?: boolean;
}
