import { Routes } from '@angular/router';

import { AboutComponent } from './about/about';
import { FacultyComponent } from './faculty/faculty';
//import { AdvisorComponent } from './advisor/advisor';
import { AdvisorComponent } from './advisor/advisor';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'about',
        pathMatch: 'full'
    },

    {
        path: 'about',
        component: AboutComponent
    },

    {
        path: 'faculty',
        component: FacultyComponent
    },
    {
        path: 'advisor',
        component: AdvisorComponent
    }

];