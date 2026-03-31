import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Song } from '../core/models/song';
import { Track } from '../core/models/track';
import { SongHeaderComponent } from './song-header/song-header';
import { SongHeaderEditComponent } from './song-header-edit/song-header-edit';
import { SongTrackComponent } from './song-track/song-track';
import { example1Song } from '../core/songs/example1.song';
import { example2Song } from '../core/songs/example2.song';


@Component({
    selector: 'app-drum',
    imports: [SongHeaderComponent, SongHeaderEditComponent, SongTrackComponent, MatFormFieldModule, MatSelectModule],
    template: `
        @if (isEditing()) {
            <app-song-header-edit
                [song]="song()"
                (save)="onSave($event)"
                (cancel)="isEditing.set(false)"
            />
        } @else {
            <app-song-header [song]="song()" (editRequested)="isEditing.set(true)" />
        }
        <div class="track-selector">
            <mat-form-field appearance="outline">
                <mat-label>Track</mat-label>
                <mat-select
                    [value]="selectedTrack()"
                    (valueChange)="selectedTrack.set($event)"
                >
                    @for (track of song().tracks; track track.instrument) {
                        <mat-option [value]="track">{{ track.instrument }}</mat-option>
                    }
                </mat-select>
            </mat-form-field>
        </div>
        <app-song-track [track]="selectedTrack()" />
    `,
    styles: `
        .track-selector {
            padding: 0 1.5rem;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrumComponent {
    song = signal<Song>(example1Song);
    isEditing = signal(false);
    selectedTrack = signal<Track>(this.song().tracks[0]);

    onSave(updated: Song): void {
        this.song.set(updated);
        this.isEditing.set(false);
    }
}
