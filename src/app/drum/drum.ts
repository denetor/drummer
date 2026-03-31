import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Song } from '../core/models/song';
import { Track } from '../core/models/track';
import { SongHeaderComponent } from './song-header/song-header';
import { SongHeaderEditComponent } from './song-header-edit/song-header-edit';
import { SongTrackComponent } from './song-track/song-track';
import { SongControlBarComponent } from './song-control-bar/song-control-bar';
import { example1Song } from '../core/songs/example1.song';
import { example2Song } from '../core/songs/example2.song';
import { example3Song } from '../core/songs/example3.song';


@Component({
    selector: 'app-drum',
    imports: [SongHeaderComponent, SongHeaderEditComponent, SongTrackComponent, SongControlBarComponent, MatFormFieldModule, MatSelectModule],
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
        <app-song-control-bar [song]="song()" [bpm]="song().properties.bpm" (editModeChange)="isTrackEditing.set($event)" (bpmChange)="currentBpm.set($event)" />
        <app-song-track [track]="selectedTrack()" [editMode]="isTrackEditing()" [bpm]="currentBpm()" (newMeasure)="onNewMeasure()" (trackChange)="onTrackChange($event)" />
    `,
    styles: `
        .track-selector {
            padding: 0 1.5rem;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrumComponent {
    song = signal<Song>(example2Song);
    isEditing = signal(false);
    isTrackEditing = signal(false);
    currentBpm = signal<number>(this.song().properties.bpm);
    selectedTrack = signal<Track>(this.song().tracks[0]);

    onSave(updated: Song): void {
        this.song.set(updated);
        this.isEditing.set(false);
    }

    onNewMeasure(): void {
        const track = this.selectedTrack();
        const lastMeasure = track.measures[track.measures.length - 1];
        const newMeasure = {
            beatsPerBar: lastMeasure.beatsPerBar,
            beatUnit: lastMeasure.beatUnit,
            stepsPerBeat: lastMeasure.stepsPerBeat,
            steps: [],
        };
        const updatedTrack = { ...track, measures: [...track.measures, newMeasure] };
        this.song.update((s) => ({
            ...s,
            tracks: s.tracks.map((t) => (t === track ? updatedTrack : t)),
        }));
        this.selectedTrack.set(updatedTrack);
    }

    onTrackChange(updatedTrack: Track): void {
        const currentTrack = this.selectedTrack();
        this.song.update((s) => ({
            ...s,
            tracks: s.tracks.map((t) => (t === currentTrack ? updatedTrack : t)),
        }));
        this.selectedTrack.set(updatedTrack);
    }
}
