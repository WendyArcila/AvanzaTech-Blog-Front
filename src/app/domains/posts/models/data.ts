import { Commentary } from "./commentary";
import { Like } from "./like";
import { Post } from "./post";

export interface DataResponsePost {
  count: number;
  current_page: number;
  links: {
    next: string;
    previous: string;
  };
  results: Post[];
  total_pages: number;
}


export interface DataResponseLike {
  count: number;
  current_page: number;
  links: {
    next: string;
    previous: string;
  };
  results: Like[];
  total_pages: number;
}


export interface DataResponseComment {
  count: number;
  current_page: number;
  links: {
    next: string;
    previous: string;
  };
  results: Commentary[];
  total_pages: number;
}
