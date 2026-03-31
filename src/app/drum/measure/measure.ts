import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Measure } from '../../core/models/measure';

const DRUM_PITCHES = ['C1', 'C2', 'OH', 'HH', 'HT', 'MT', 'FT', 'SN', 'BS'];

@Component({
    selector: 'app-measure',
    imports: [MatButtonModule, MatIconModule],
    template: `
        <div class="measure-wrapper">
            <pre
                class="measure-tab"
                role="img"
                [attr.aria-label]="ariaLabel()"
                [class.active]="active()"
            >{{ tabText() }}</pre>
            @if (editMode()) {
                <button
                    mat-icon-button
                    class="edit-btn"
                    aria-label="Edit measure"
                    (click)="editRequested.emit()"
                >
                    <mat-icon>edit</mat-icon>
                </button>
            }
        </div>
    `,
    styles: `
        .measure-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
        }

        .measure-tab {
            font-family: monospace;
            margin: 0;
            line-height: 1.5;
            padding: 0.5rem;
            border-radius: 4px;
            transition: background-color 0.1s ease;
        }

        .measure-tab.active {
            background-color: #fffde7;
        }

        .edit-btn {
            transform: scale(0.75);
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasureComponent {
    measure = input.required<Measure>();
    instrument = input.required<string>();
    active = input(false);
    editMode = input(false);
    editRequested = output<void>();

    tabText = computed(() => {
        if (this.instrument() !== 'drums') return '';
        return this.renderDrumsTab(this.measure());
    });

    ariaLabel = computed(() => `Measure in ${this.instrument()} tab notation`);

    private renderDrumsTab(measure: Measure): string {
        const { beatsPerBar, stepsPerBeat, steps } = measure;
        const lines: string[] = [];

        for (const pitch of DRUM_PITCHES) {
            let line = `${pitch} |`;
            for (let beat = 0; beat < beatsPerBar; beat++) {
                for (let s = 0; s < stepsPerBeat; s++) {
                    const stepIndex = beat * stepsPerBeat + s;
                    const step = steps[stepIndex];
                    const played = step?.notes.some((n) => n.pitch === pitch) ?? false;
                    if (!played) {
                        line += '-';
                    } else {
                        if (['C1', 'C2', 'OH', 'HH'].includes(pitch)) {
                            line += 'x';
                        } else {
                            line += 'o';
                        }
                    }
                }
                line += '|';
            }
            lines.push(line);
        }

        let beatRow = '   |';
        for (let beat = 0; beat < beatsPerBar; beat++) {
            switch (stepsPerBeat) {
                case 2:
                    beatRow += String(beat + 1) + '&|';
                    break;
                case 3:
                    beatRow += String(beat + 1) + ' tt|';
                    break;
                case 4:
                    beatRow += String(beat + 1) + 'e&a|';
                    break;
                case 6:
                    beatRow += String(beat + 1) + ' t t |';
                    break;
                default:
                    beatRow += String(beat + 1).padEnd(stepsPerBeat, ' ') + '|';
            }
        }
        lines.push(beatRow);

        return lines.join('\n');
    }
}
