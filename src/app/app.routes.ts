import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Chat } from './chat/chat';
import { Dashboard } from './dashboard/dashboard';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
    {path:'' , component:Login},
    {path:'login' , component:Login},
    {path:'register' , component:Register},
    {path:'home' , component:Dashboard},
    {path:'chat' , component:Chat},
    {path:'**' , component:NotFound}
    
];
