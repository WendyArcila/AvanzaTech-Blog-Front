import { Post } from "./post";

export interface Commentary{
  author?: string;
  blog_post: Post;
  author_name?: string;
  comment: string;
  created_date?: Date;
}
