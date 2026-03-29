import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Song } from '../core/models/song';
import { SongHeaderComponent } from './song-header/song-header';
import { SongHeaderEditComponent } from './song-header-edit/song-header-edit';
import { SongRowsComponent } from './song-rows/song-rows';

const DEFAULT_SONG: Song = {
    artist: 'The Mission',
    title: 'Kingdom come',
    properties: { bpm: 120 },
    tracks: [],
};

@Component({
    selector: 'app-drum',
    imports: [SongHeaderComponent, SongHeaderEditComponent, SongRowsComponent],
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
        <app-song-rows />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrumComponent {
    song = signal<Song>(DEFAULT_SONG);
    isEditing = signal(false);

    onSave(updated: Song): void {
        this.song.set(updated);
        this.isEditing.set(false);
    }
}
