import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Track } from '../../core/models/track';
import { MeasureComponent } from '../measure/measure';

@Component({
    selector: 'app-song-track',
    imports: [MeasureComponent],
    template: `
        <div class="song-track">
            @for (measure of track().measures; track $index) {
                <app-measure [measure]="measure" [instrument]="track().instrument" />
            }
        </div>
    `,
    styles: `
        .song-track {
            padding: 1rem 1.5rem;
            display: flex;
            flex-direction: row;
            gap: 1rem;
            flex-wrap: wrap;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongTrackComponent {
    track = input.required<Track>();
}