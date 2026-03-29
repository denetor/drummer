import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Song } from '../../core/models/song';

@Component({
    selector: 'app-song-header',
    imports: [MatIconButton, MatIconModule],
    templateUrl: './song-header.html',
    styleUrl: './song-header.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongHeaderComponent {
    song = input.required<Song>();
    editRequested = output<void>();
}
