import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Chat } from './chat/chat';
import { Dashboard } from './dashboard/dashboard';
import { NotFound } from './not-found/not-found';
import { authGuard } from './shared/guards/auth.guard';
import { guestGuard } from './shared/guards/guest.guard';
import { Stocks } from './stocks/stocks';
import { ChargeBalance } from './charge-balance/charge-balance';

export const routes: Routes = [
    {path:'' , component:Login, canActivate:[guestGuard]},
    {path:'login' , component:Login, canActivate:[guestGuard]},
    {path:'register' , component:Register, canActivate:[guestGuard]},
    {path:'home' , component:Dashboard, canActivate:[authGuard]},
    {path:'chat' , component:Chat, canActivate:[authGuard]},
    {path:'stocks', component:Stocks, canActivate:[authGuard]},
    {path:'charge', component:ChargeBalance, canActivate:[authGuard]},
    {path:'**' , component:NotFound}
    
];
