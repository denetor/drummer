import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Song } from '../../core/models/song';

@Component({
    selector: 'app-song-header',
    templateUrl: './song-header.html',
    styleUrl: './song-header.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongHeaderComponent {
    song = input.required<Song>();
}
