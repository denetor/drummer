import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Measure } from '../../core/models/measure';

const DRUM_PITCHES = ['C1', 'C2', 'OH', 'HH', 'HT', 'MT', 'FT', 'SN', 'BS'];

@Component({
    selector: 'app-measure',
    template: `
        <pre
            class="measure-tab"
            role="img"
            [attr.aria-label]="ariaLabel()"
            [class.active]="active()"
        >{{ tabText() }}</pre>
    `,
    styles: `
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
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasureComponent {
    measure = input.required<Measure>();
    instrument = input.required<string>();
    active = input(false);

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
            if (stepsPerBeat === 4) {
                beatRow += String(beat + 1) + 'e&a|';
            } else {
                beatRow += String(beat + 1).padEnd(stepsPerBeat, ' ') + '|';
            }
        }
        lines.push(beatRow);

        return lines.join('\n');
    }
}
