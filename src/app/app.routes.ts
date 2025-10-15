import { Routes } from '@angular/router';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Manage } from './components/video/manage/manage';
import { Upload } from './components/video/upload/upload';
import { Clip } from './components/clip/clip';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'about', component: About},
    {path: 'manage', component: Manage},
    {path: 'upload', component: Upload},
    {path: 'clip/:id', component: Clip},
    {path: '**', component: PageNotFound}
];
