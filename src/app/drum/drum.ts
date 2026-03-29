import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Song } from '../core/models/song';
import { SongHeaderComponent } from './song-header/song-header';

const DEFAULT_SONG: Song = {
    artist: 'The Mission',
    title: 'Kingdom come',
    properties: { bpm: 120 },
    tracks: [],
};

@Component({
    selector: 'app-drum',
    imports: [SongHeaderComponent],
    template: `<app-song-header [song]="song()" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrumComponent {
    song = signal<Song>(DEFAULT_SONG);
}
