import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Measure } from '../../core/models/measure';
import { Track } from '../../core/models/track';
import { PlayerService } from '../../core/audio/player.service';
import { MeasureComponent } from '../measure/measure';
import { MeasureEditorComponent } from '../measure-editor/measure-editor';

@Component({
    selector: 'app-song-track',
    imports: [MeasureComponent, MeasureEditorComponent, MatButtonModule, MatIconModule, MatTooltipModule],
    template: `
        <div class="song-track">
            @if (movingMeasureIndex() !== null && isValidDropZone(0)) {
                <button
                    mat-icon-button
                    class="drop-zone"
                    aria-label="Insert here"
                    matTooltip="Insert here"
                    (click)="commitMove(0)"
                >
                    <mat-icon>arrow_downward</mat-icon>
                </button>
            }

            @for (measure of track().measures; track $index) {
                <div
                    class="measure-wrapper"
                    [class.is-moving]="movingMeasureIndex() === $index"
                >
                    <app-measure
                        [measure]="measure"
                        [instrument]="track().instrument"
                        [active]="player.currentMeasureIndex() === $index"
                        [editMode]="editMode()"
                        (editRequested)="onEditRequested($index)"
                    />
                    @if (editMode() && movingMeasureIndex() === null) {
                        <div class="measure-actions">
                            <button
                                mat-icon-button
                                [attr.aria-label]="'Duplicate measure ' + ($index + 1)"
                                matTooltip="Duplicate"
                                (click)="duplicateMeasure($index)"
                            >
                                <mat-icon>content_copy</mat-icon>
                            </button>
                            <button
                                mat-icon-button
                                [attr.aria-label]="'Move measure ' + ($index + 1)"
                                matTooltip="Move"
                                (click)="startMove($index)"
                            >
                                <mat-icon>open_with</mat-icon>
                            </button>
                            <button
                                mat-icon-button
                                [attr.aria-label]="'Delete measure ' + ($index + 1)"
                                matTooltip="Delete"
                                (click)="deleteMeasure($index)"
                            >
                                <mat-icon>delete</mat-icon>
                            </button>
                        </div>
                    }
                    @if (editMode() && movingMeasureIndex() === $index) {
                        <button
                            mat-stroked-button
                            class="cancel-move-btn"
                            (click)="cancelMove()"
                        >
                            Cancel
                        </button>
                    }
                </div>

                @if (movingMeasureIndex() !== null && isValidDropZone($index + 1)) {
                    <button
                        mat-icon-button
                        class="drop-zone"
                        aria-label="Insert here"
                        matTooltip="Insert here"
                        (click)="commitMove($index + 1)"
                    >
                        <mat-icon>arrow_downward</mat-icon>
                    </button>
                }
            }

            @if (editMode() && movingMeasureIndex() === null) {
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
                [songBpm]="bpm()"
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
            gap: 0.5rem;
            flex-wrap: wrap;
            align-items: center;
        }

        .measure-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
            transition: opacity 0.2s;
        }

        .measure-wrapper.is-moving {
            opacity: 0.4;
            outline: 2px dashed currentColor;
            border-radius: 4px;
        }

        .measure-actions {
            display: flex;
            flex-direction: row;
        }

        .cancel-move-btn {
            font-size: 0.75rem;
        }

        .drop-zone {
            color: var(--mat-sys-primary);
            animation: pulse 1s infinite alternate;
        }

        @keyframes pulse {
            from { opacity: 0.5; transform: scale(0.9); }
            to   { opacity: 1;   transform: scale(1.1); }
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
    movingMeasureIndex = signal<number | null>(null);

    protected readonly player = inject(PlayerService);

    constructor() {
        effect(() => {
            if (!this.editMode()) {
                this.editingMeasureIndex.set(null);
                this.movingMeasureIndex.set(null);
            }
        });
    }

    /** A drop zone at position `pos` is valid if it would actually move the measure. */
    isValidDropZone(pos: number): boolean {
        const from = this.movingMeasureIndex();
        if (from === null) return false;
        return pos !== from && pos !== from + 1;
    }

    onEditRequested(index: number): void {
        if (this.movingMeasureIndex() === null) {
            this.editingMeasureIndex.set(index);
        }
    }

    startMove(index: number): void {
        this.editingMeasureIndex.set(null);
        this.movingMeasureIndex.set(index);
    }

    cancelMove(): void {
        this.movingMeasureIndex.set(null);
    }

    commitMove(targetPos: number): void {
        const from = this.movingMeasureIndex();
        if (from === null) return;

        const measures = [...this.track().measures];
        const [moved] = measures.splice(from, 1);
        // After removal, adjust target index if it was after the source
        const insertAt = targetPos > from ? targetPos - 1 : targetPos;
        measures.splice(insertAt, 0, moved);

        this.movingMeasureIndex.set(null);
        this.trackChange.emit({ ...this.track(), measures });
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

    deleteMeasure(index: number): void {
        const measures = [...this.track().measures];
        measures.splice(index, 1);
        if (this.editingMeasureIndex() === index) {
            this.editingMeasureIndex.set(null);
        }
        this.trackChange.emit({ ...this.track(), measures });
    }
}
