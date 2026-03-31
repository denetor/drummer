import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Measure } from '../../core/models/measure';
import { Track } from '../../core/models/track';
import { PlayerService } from '../../core/audio/player.service';
import { MeasureComponent } from '../measure/measure';
import { MeasureEditorComponent } from '../measure-editor/measure-editor';

@Component({
    selector: 'app-song-track',
    imports: [MeasureComponent, MeasureEditorComponent, MatButtonModule, MatIconModule],
    template: `
        <div class="song-track">
            @for (measure of track().measures; track $index) {
                <div class="measure-wrapper">
                    <app-measure
                        [measure]="measure"
                        [instrument]="track().instrument"
                        [active]="player.currentMeasureIndex() === $index"
                        [editMode]="editMode()"
                        (editRequested)="editingMeasureIndex.set($index)"
                    />
                    @if (editMode()) {
                        <button
                            mat-icon-button
                            class="duplicate-btn"
                            [attr.aria-label]="'Duplicate measure ' + ($index + 1)"
                            (click)="duplicateMeasure($index)"
                        >
                            <mat-icon>content_copy</mat-icon>
                        </button>
                    }
                </div>
            }
            @if (editMode()) {
                <button mat-stroked-button class="new-measure-btn" (click)="newMeasure.emit()">
                    <mat-icon>add</mat-icon>
                    New Measure
                </button>
            }
        </div>
        @if (editingMeasureIndex() !== null) {
            <app-measure-editor
                [measure]="track().measures[editingMeasureIndex()!]"
                [instrument]="track().instrument"
                [bpm]="bpm()"
                (measureChange)="onMeasureChange($event)"
                (closed)="editingMeasureIndex.set(null)"
            />
        }
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

        .measure-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
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
    bpm = input(120);
    newMeasure = output<void>();
    trackChange = output<Track>();

    editingMeasureIndex = signal<number | null>(null);

    protected readonly player = inject(PlayerService);

    constructor() {
        effect(() => {
            if (!this.editMode()) {
                this.editingMeasureIndex.set(null);
            }
        });
    }

    onMeasureChange(updated: Measure): void {
        const measures = [...this.track().measures];
        measures[this.editingMeasureIndex()!] = updated;
        this.trackChange.emit({ ...this.track(), measures });
    }

    duplicateMeasure(index: number): void {
        const measures = [...this.track().measures];
        const copy = { ...measures[index], steps: [...measures[index].steps] };
        measures.splice(index + 1, 0, copy);
        this.trackChange.emit({ ...this.track(), measures });
    }
}
