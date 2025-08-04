import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Chat } from './chat/chat';

export const routes: Routes = [
    {path:'' , component:Login},
    {path:'login' , component:Login},
    {path:'register' , component:Register},
    {path:'home' , component:Chat},
    {path:'*' , component:Login}
    
];
