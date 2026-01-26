import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/home/home').then(m => m.Home)
    },
    {
        path: 'manage', 
        loadComponent: () => import('./components/video/manage/manage').then(m => m.Manage), 
        canActivate: [authGuard]
    },
    {
        path: 'upload', 
        loadComponent: () => import('./components/video/upload/upload').then(m => m.Upload),
        canActivate: [authGuard]
    },
    {
        path: 'clip/:id',
        loadComponent: () => import('./components/clip/clip').then(m => m.Clip)
    },
    {
        path: '**',
        loadComponent: () => import('./components/page-not-found/page-not-found').then(m => m.PageNotFound)
    }
];
