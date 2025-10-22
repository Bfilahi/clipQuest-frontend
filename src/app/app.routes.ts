import { Routes } from '@angular/router';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { Home } from './components/home/home';
import { Manage } from './components/video/manage/manage';
import { Upload } from './components/video/upload/upload';
import { Clip } from './components/clip/clip';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'manage', component: Manage, canActivate: [authGuard]},
    {path: 'upload', component: Upload, canActivate: [authGuard]},
    {path: 'clip/:id', component: Clip},
    {path: '**', component: PageNotFound}
];
