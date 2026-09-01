import { Routes } from '@angular/router';

import { Signup } from './signup/signup';
import { Confirmation } from './confirmation/confirmation';

export const routes: Routes = [

  {
    path: '',
    title: 'Sign Up',
    component: Signup,
    pathMatch: 'full'
  },

  {
    path: 'confirmation',
    title: 'Registration Confirmation',
    component: Confirmation
  },

  {
    path: '**',
    redirectTo: ''
  }

];