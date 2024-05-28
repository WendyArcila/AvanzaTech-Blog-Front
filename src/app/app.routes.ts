import { Routes } from '@angular/router';
import { DetailComponent } from './domains/posts/components/detail/detail.component';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./domains/posts/components/list/list.component').then(m => m.ListComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./domains/users/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./domains/users/components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./domains/posts/components/detail/detail.component').then(m => m.DetailComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./domains/posts/components/create/create.component').then(m => m.CreateComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./domains/posts/components/edit/edit.component').then(m => m.EditComponent)
  },
];
