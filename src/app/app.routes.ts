import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'drum',
        loadComponent: () => import('./drum/drum').then((m) => m.DrumComponent),
    },
    {
        path: '**',
        redirectTo: 'drum',
    },
];
