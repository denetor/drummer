import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Song } from '../../core/models/song';
import { PlayerService } from '../../core/audio/player.service';

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
                <button
                    mat-icon-button
                    aria-label="Play"
                    [disabled]="player.state() === 'playing'"
                    (click)="onPlay()"
                >
                    <mat-icon>play_arrow</mat-icon>
                </button>
                <button
                    mat-icon-button
                    aria-label="Pause"
                    [disabled]="player.state() !== 'playing'"
                    (click)="player.pause()"
                >
                    <mat-icon>pause</mat-icon>
                </button>
                <button
                    mat-icon-button
                    aria-label="Stop"
                    [disabled]="player.state() === 'idle'"
                    (click)="player.stop()"
                >
                    <mat-icon>stop</mat-icon>
                </button>
            </div>
            <button
                mat-icon-button
                aria-label="Metronome"
                [attr.aria-pressed]="player.metronomeEnabled()"
                [class.metronome-active]="player.metronomeEnabled()"
                (click)="player.metronomeEnabled.update((v) => !v)"
                title="Toggle metronome"
            >
                <mat-icon>music_note</mat-icon>
            </button>
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

        .metronome-active {
            color: var(--mat-sys-primary);
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongControlBarComponent {
    song = input.required<Song>();
    bpm = input.required<number>();
    currentBpm = linkedSignal(() => this.bpm());

    protected readonly player = inject(PlayerService);

    onPlay(): void {
        if (this.player.state() === 'paused') {
            this.player.resume();
        } else {
            this.player.play(this.song(), this.currentBpm());
        }
    }
}