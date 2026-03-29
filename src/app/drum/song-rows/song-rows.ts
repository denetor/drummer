import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-song-rows',
    template: `<div class="song-rows-placeholder">Song rows</div>`,
    styles: `
        .song-rows-placeholder {
            padding: 1rem 1.5rem;
            color: var(--mat-sys-on-surface-variant);
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongRowsComponent {}
