import { Post } from "./post";

export interface Like{
  author: string;
  blog_post: Post;
  comment : string;
  author_name: string;
  created_date: Date;
}
