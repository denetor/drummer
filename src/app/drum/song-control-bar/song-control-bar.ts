import { ChangeDetectionStrategy, Component, input, linkedSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-song-control-bar',
    imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
    template: `
        <div class="control-bar">
            <mat-form-field appearance="outline" class="bpm-field">
                <mat-label>BPM</mat-label>
                <input
                    matInput
                    type="number"
                    [value]="currentBpm()"
                    (change)="currentBpm.set(+$any($event.target).value)"
                    min="1"
                    max="300"
                />
            </mat-form-field>
            <div class="transport-buttons">
                <button mat-icon-button aria-label="Play">
                    <mat-icon>play_arrow</mat-icon>
                </button>
                <button mat-icon-button aria-label="Pause">
                    <mat-icon>pause</mat-icon>
                </button>
                <button mat-icon-button aria-label="Stop">
                    <mat-icon>stop</mat-icon>
                </button>
            </div>
        </div>
    `,
    styles: `
        .control-bar {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0 1.5rem;
        }

        .bpm-field {
            width: 6rem;
        }

        .transport-buttons {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongControlBarComponent {
    bpm = input.required<number>();
    currentBpm = linkedSignal(() => this.bpm());
}