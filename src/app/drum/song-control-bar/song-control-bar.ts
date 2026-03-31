import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, output, signal } from '@angular/core';
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
                    (change)="onBpmChange(+$any($event.target).value)"
                    min="1"
                    max="300"
                />
            </mat-form-field>
            <div class="transport-buttons">
                <button
                    mat-icon-button
                    aria-label="Play"
                    [disabled]="player.state() === 'playing' || editMode()"
                    (click)="onPlay()"
                >
                    <mat-icon>play_arrow</mat-icon>
                </button>
                <button
                    mat-icon-button
                    aria-label="Pause"
                    [disabled]="player.state() !== 'playing' || editMode()"
                    (click)="player.pause()"
                >
                    <mat-icon>pause</mat-icon>
                </button>
                <button
                    mat-icon-button
                    aria-label="Stop"
                    [disabled]="player.state() === 'idle' || editMode()"
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
                [disabled]="editMode()"
                (click)="player.metronomeEnabled.update((v) => !v)"
                title="Toggle metronome"
            >
                <mat-icon>music_note</mat-icon>
            </button>
            <button
                mat-icon-button
                [attr.aria-label]="editMode() ? 'Exit edit mode' : 'Enter edit mode'"
                [attr.aria-pressed]="editMode()"
                [class.edit-active]="editMode()"
                [disabled]="player.state() === 'playing'"
                (click)="toggleEditMode()"
                title="Toggle edit mode"
            >
                <mat-icon>{{ editMode() ? 'edit_off' : 'edit' }}</mat-icon>
            </button>
            <button
                mat-icon-button
                aria-label="Export song as JSON"
                title="Export song as JSON"
                (click)="exportSong()"
            >
                <mat-icon>download</mat-icon>
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

        .edit-active {
            color: var(--mat-sys-primary);
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongControlBarComponent {
    song = input.required<Song>();
    bpm = input.required<number>();
    currentBpm = linkedSignal(() => this.bpm());
    editModeChange = output<boolean>();
    bpmChange = output<number>();

    protected readonly editMode = signal(false);
    protected readonly player = inject(PlayerService);

    onBpmChange(value: number): void {
        this.currentBpm.set(value);
        this.bpmChange.emit(value);
    }

    toggleEditMode(): void {
        this.editMode.update((v) => !v);
        this.editModeChange.emit(this.editMode());
    }

    exportSong(): void {
        const json = JSON.stringify(this.song(), null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.song().title ?? 'song'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    onPlay(): void {
        if (this.player.state() === 'paused') {
            this.player.resume();
        } else {
            this.player.play(this.song(), this.currentBpm());
        }
    }
}
