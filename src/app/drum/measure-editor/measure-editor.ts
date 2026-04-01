import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Measure } from '../../core/models/measure';
import { PlayerService } from '../../core/audio/player.service';

const DRUM_PITCHES = ['C1', 'C2', 'OH', 'HH', 'HT', 'MT', 'FT', 'SN', 'BS'];

@Component({
    selector: 'app-measure-editor',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    template: `
        <div class="editor-panel">
            <div class="editor-header">
                <span class="editor-title">Edit Measure</span>
                <button mat-icon-button aria-label="Close editor" (click)="closed.emit()">
                    <mat-icon>close</mat-icon>
                </button>
            </div>
            <div class="bpm-bar">
                <mat-slide-toggle
                    [checked]="measure().bpm !== undefined"
                    (change)="toggleBpmOverride($event.checked)"
                >
                    Custom BPM
                </mat-slide-toggle>
                @if (measure().bpm !== undefined) {
                    <mat-form-field appearance="outline" class="bpm-field">
                        <mat-label>BPM</mat-label>
                        <input
                            matInput
                            type="number"
                            min="1"
                            [value]="measure().bpm"
                            (change)="updateBpm($event)"
                            aria-label="Measure BPM override"
                        />
                    </mat-form-field>
                }
                @if (measure().bpm === undefined) {
                    <span class="bpm-inherited">Inherited from song: {{ songBpm() }}</span>
                }
                <div class="bpm-bar-actions">
                    <button
                        mat-icon-button
                        aria-label="Clear all cells"
                        title="Clear all cells"
                        (click)="clearAll()"
                    >
                        <mat-icon>delete_sweep</mat-icon>
                    </button>
                    <button
                        mat-icon-button
                        [attr.aria-label]="player.state() === 'playing' ? 'Stop loop' : 'Play loop'"
                        [attr.aria-pressed]="player.state() === 'playing'"
                        [class.loop-active]="player.state() === 'playing'"
                        (click)="toggleLoop()"
                        title="Loop measure"
                    >
                        <mat-icon>{{ player.state() === 'playing' ? 'stop' : 'play_arrow' }}</mat-icon>
                    </button>
                </div>
            </div>
            <div class="editor-body">
                <div class="editor-grid" [style.grid-template-columns]="gridColumns()">
                    <div class="pitch-label"></div>
                    @for (beatIdx of beatIndices(); track beatIdx) {
                        <div
                            class="beat-header"
                            [class.beat-start]="beatIdx > 0"
                            [style.grid-column]="'span ' + measure().stepsPerBeat"
                        >
                            {{ beatIdx + 1 }}
                        </div>
                    }
                    @for (row of rows(); track row.pitch) {
                        <div class="pitch-label">{{ row.pitch }}</div>
                        @for (cell of row.cells; track cell.stepIndex) {
                            <button
                                class="step-btn"
                                [class.step-active]="cell.active"
                                [class.beat-start]="cell.isFirstInBeat && cell.beatIndex > 0"
                                [attr.aria-label]="
                                    row.pitch +
                                    ' beat ' +
                                    (cell.beatIndex + 1) +
                                    ' step ' +
                                    (cell.stepInBeat + 1)
                                "
                                [attr.aria-pressed]="cell.active"
                                (click)="toggle(row.pitch, cell.stepIndex)"
                            ></button>
                        }
                    }
                </div>
            </div>
        </div>
    `,
    styles: `
        .editor-panel {
            margin: 0 1.5rem 1rem;
            border: 1px solid var(--mat-sys-outline-variant);
            border-radius: 8px;
            overflow: hidden;
            background: var(--mat-sys-surface);
        }

        .editor-header {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.25rem 0.25rem 1rem;
            background: var(--mat-sys-surface-variant);
            border-bottom: 1px solid var(--mat-sys-outline-variant);
        }

        .editor-title {
            font-weight: 500;
            font-size: 0.875rem;
            flex: 1;
        }

        .loop-active {
            color: var(--mat-sys-primary);
        }

        .bpm-bar {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.5rem 1rem;
            border-bottom: 1px solid var(--mat-sys-outline-variant);
            background: var(--mat-sys-surface-container-low);
        }

        .bpm-field {
            width: 7rem;

            ::ng-deep .mat-mdc-form-field-subscript-wrapper {
                display: none;
            }
        }

        .bpm-inherited {
            font-size: 0.8125rem;
            color: var(--mat-sys-on-surface-variant);
        }

        .bpm-bar-actions {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            margin-left: auto;
        }

        .editor-body {
            padding: 1rem;
            overflow-x: auto;
        }

        .editor-grid {
            display: grid;
            gap: 3px;
            align-items: center;
        }

        .pitch-label {
            font-family: monospace;
            font-size: 0.75rem;
            text-align: right;
            padding-right: 0.5rem;
            color: var(--mat-sys-on-surface-variant);
            white-space: nowrap;
        }

        .beat-header {
            text-align: center;
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--mat-sys-on-surface-variant);
            padding: 0.125rem 0 0.375rem;

            &.beat-start {
                border-left: 2px solid var(--mat-sys-outline-variant);
                margin-left: 0.25rem;
                padding-left: 0.25rem;
            }
        }

        .step-btn {
            width: 100%;
            min-width: 2.75rem;
            height: 2.75rem;
            border: 1px solid var(--mat-sys-outline-variant);
            border-radius: 4px;
            background: var(--mat-sys-surface-container-low);
            cursor: pointer;
            transition:
                background-color 0.1s,
                border-color 0.1s;
            padding: 0;

            &.beat-start {
                border-left: 2px solid var(--mat-sys-outline);
                margin-left: 0.25rem;
            }

            &.step-active {
                background: var(--mat-sys-primary);
                border-color: var(--mat-sys-primary);
            }

            &:hover:not(.step-active) {
                background: var(--mat-sys-primary-container);
                border-color: var(--mat-sys-primary);
            }

            &:focus-visible {
                outline: 2px solid var(--mat-sys-primary);
                outline-offset: 2px;
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasureEditorComponent {
    measure = input.required<Measure>();
    instrument = input.required<string>();
    songBpm = input.required<number>();
    measureChange = output<Measure>();
    closed = output<void>();

    protected readonly player = inject(PlayerService);

    private effectiveBpm = computed(() => this.measure().bpm ?? this.songBpm());

    constructor() {
        inject(DestroyRef).onDestroy(() => {
            if (this.player.state() === 'playing') {
                this.player.stop();
            }
        });
    }

    async toggleLoop(): Promise<void> {
        if (this.player.state() === 'playing') {
            this.player.stop();
        } else {
            await this.player.playMeasureLoop(
                this.measure(),
                this.instrument(),
                this.effectiveBpm(),
            );
        }
    }

    toggleBpmOverride(enable: boolean): void {
        if (enable) {
            this.measureChange.emit({ ...this.measure(), bpm: this.songBpm() });
        } else {
            const { bpm: _removed, ...rest } = this.measure();
            this.measureChange.emit(rest as Measure);
        }
    }

    updateBpm(event: Event): void {
        const value = Number((event.target as HTMLInputElement).value);
        if (value > 0) {
            this.measureChange.emit({ ...this.measure(), bpm: value });
        }
    }

    gridColumns = computed(() => {
        const { beatsPerBar, stepsPerBeat } = this.measure();
        return `2.5rem repeat(${beatsPerBar * stepsPerBeat}, minmax(2.75rem, 1fr))`;
    });

    beatIndices = computed(() => Array.from({ length: this.measure().beatsPerBar }, (_, i) => i));

    rows = computed(() => {
        const { beatsPerBar, stepsPerBeat, steps } = this.measure();
        return DRUM_PITCHES.map((pitch) => ({
            pitch,
            cells: Array.from({ length: beatsPerBar * stepsPerBeat }, (_, i) => ({
                stepIndex: i,
                beatIndex: Math.floor(i / stepsPerBeat),
                stepInBeat: i % stepsPerBeat,
                isFirstInBeat: i % stepsPerBeat === 0,
                active: steps[i]?.notes.some((n) => n.pitch === pitch) ?? false,
            })),
        }));
    });

    clearAll(): void {
        const measure = this.measure();
        const updated: Measure = { ...measure, steps: measure.steps.map(() => ({ notes: [] })) };
        if (this.player.state() === 'playing') {
            this.player.updateLoopMeasure(updated);
        }
        this.measureChange.emit(updated);
    }

    toggle(pitch: string, stepIndex: number): void {
        const measure = this.measure();
        const steps = [...measure.steps];
        const step = steps[stepIndex];
        const isActive = step?.notes.some((n) => n.pitch === pitch) ?? false;

        if (isActive) {
            steps[stepIndex] = { ...step, notes: step.notes.filter((n) => n.pitch !== pitch) };
        } else {
            steps[stepIndex] = { notes: [...(step?.notes ?? []), { pitch, velocity: 100 }] };
        }

        const updated: Measure = { ...measure, steps };
        if (this.player.state() === 'playing') {
            this.player.updateLoopMeasure(updated);
        }
        this.measureChange.emit(updated);
    }
}
