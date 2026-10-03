import { Component, signal } from '@angular/core';

import {
    RouterModule,
    RouterOutlet,
    RouterLink
} from '@angular/router';

@Component({
    imports: [
        RouterOutlet,
        RouterModule,
        RouterLink
    ],
    selector: 'app-root',
    styleUrl: './app.css',
    templateUrl: './app.html'
})
export class App {

    protected readonly title = signal(
        'experiential-learning-registration-system'
    );

}