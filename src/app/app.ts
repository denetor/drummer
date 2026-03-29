import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatToolbarModule],
    template: `
        <mat-toolbar color="primary">Drummer</mat-toolbar>
        <router-outlet />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
