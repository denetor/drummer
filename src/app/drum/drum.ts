import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Song } from '../core/models/song';
import { SongHeaderComponent } from './song-header/song-header';
import { SongHeaderEditComponent } from './song-header-edit/song-header-edit';
import { SongRowsComponent } from './song-rows/song-rows';

const DEFAULT_SONG: Song = {
    artist: 'The Mission',
    title: 'Kingdom come',
    properties: { bpm: 120 },
    tracks: [
        {
            instrument: 'drums',
            measures: [
                {
                    beatsPerBar: 4,
                    beatUnit: 4,
                    stepsPerBeat: 2,
                    steps: [
                        // 1
                        {
                            notes: [
                                { velocity: 64, pitch: 'g5' },
                                { velocity: 64, pitch: 'd4' },
                            ],
                        },
                        { notes: [{ velocity: 64, pitch: 'g5' }] },
                        // 2
                        {
                            notes: [
                                { velocity: 64, pitch: 'g5' },
                                { velocity: 64, pitch: 'c5' },
                            ],
                        },
                        { notes: [{ velocity: 64, pitch: 'g5' }] },
                        // 3
                        {
                            notes: [
                                { velocity: 64, pitch: 'g5' },
                                { velocity: 64, pitch: 'd4' },
                            ],
                        },
                        {
                            notes: [
                                { velocity: 64, pitch: 'g5' },
                                { velocity: 64, pitch: 'd4' },
                            ],
                        },
                        // 4
                        {
                            notes: [
                                { velocity: 64, pitch: 'g5' },
                                { velocity: 64, pitch: 'c5' },
                            ],
                        },
                        { notes: [{ velocity: 64, pitch: 'g5' }] },
                    ],
                },
            ],
        },
    ],
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
