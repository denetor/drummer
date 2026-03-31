import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Track } from '../../core/models/track';
import { PlayerService } from '../../core/audio/player.service';
import { MeasureComponent } from '../measure/measure';

@Component({
    selector: 'app-song-track',
    imports: [MeasureComponent, MatButtonModule, MatIconModule],
    template: `
        <div class="song-track">
            @for (measure of track().measures; track $index) {
                <app-measure
                    [measure]="measure"
                    [instrument]="track().instrument"
                    [active]="player.currentMeasureIndex() === $index"
                    [editMode]="editMode()"
                />
            }
            @if (editMode()) {
                <button mat-stroked-button class="new-measure-btn" (click)="newMeasure.emit()">
                    <mat-icon>add</mat-icon>
                    New Measure
                </button>
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
            align-items: flex-start;
        }

        .new-measure-btn {
            align-self: center;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongTrackComponent {
    track = input.required<Track>();
    editMode = input(false);
    newMeasure = output<void>();
    protected readonly player = inject(PlayerService);
}