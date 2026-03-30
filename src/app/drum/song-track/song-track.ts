import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-song-track',
    template: `<div class="song-track-placeholder">Song track</div>`,
    styles: `
        .song-track-placeholder {
            padding: 1rem 1.5rem;
            color: var(--mat-sys-on-surface-variant);
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongTrackComponent {}
