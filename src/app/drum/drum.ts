import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Song } from '../core/models/song';
import { SongSummary } from '../core/models/song-summary';
import { Track } from '../core/models/track';
import { PlayerService } from '../core/audio/player.service';
import { SongApiService } from '../core/songs/song-api.service';
import { SongHeaderComponent } from './song-header/song-header';
import { SongHeaderEditComponent } from './song-header-edit/song-header-edit';
import { SongTrackComponent } from './song-track/song-track';
import { SongControlBarComponent } from './song-control-bar/song-control-bar';
import { example1Song } from '../core/songs/example1.song';

@Component({
    selector: 'app-drum',
    imports: [
        SongHeaderComponent,
        SongHeaderEditComponent,
        SongTrackComponent,
        SongControlBarComponent,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSidenavModule,
    ],
    template: `
        <mat-sidenav-container class="sidenav-container">
            <mat-sidenav mode="side" [opened]="sidenavOpen()" class="songs-sidenav">
                <div class="sidenav-title">
                    <span>Songs</span>
                    <button
                        mat-icon-button
                        aria-label="Collapse song list"
                        title="Collapse"
                        (click)="sidenavOpen.set(false)"
                    >
                        <mat-icon>chevron_left</mat-icon>
                    </button>
                </div>
                @if (songList() === undefined) {
                    <div class="sidenav-loading">
                        <mat-spinner diameter="32" />
                    </div>
                } @else {
                    <mat-nav-list>
                        @for (item of songList(); track item.id) {
                            <a
                                mat-list-item
                                [activated]="activeSongId() === item.id"
                                (click)="loadSong(item)"
                            >
                                <span matListItemTitle>{{ item.title }}</span>
                                <span matListItemLine>{{ item.artist }}</span>
                            </a>
                        }
                    </mat-nav-list>
                }
            </mat-sidenav>

            <mat-sidenav-content>
                @if (!sidenavOpen()) {
                    <button
                        mat-icon-button
                        class="sidenav-open-btn"
                        aria-label="Expand song list"
                        title="Expand song list"
                        (click)="sidenavOpen.set(true)"
                    >
                        <mat-icon>menu</mat-icon>
                    </button>
                }
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
                <app-song-control-bar
                    [song]="song()"
                    [bpm]="song().properties.bpm"
                    (editModeChange)="isTrackEditing.set($event)"
                    (bpmChange)="currentBpm.set($event)"
                    (songImport)="onSongImport($event)"
                />
                <app-song-track
                    [track]="selectedTrack()"
                    [editMode]="isTrackEditing()"
                    [bpm]="currentBpm()"
                    (newMeasure)="onNewMeasure()"
                    (trackChange)="onTrackChange($event)"
                />
            </mat-sidenav-content>
        </mat-sidenav-container>
    `,
    styles: `
        .sidenav-container {
            height: 100%;
        }

        .songs-sidenav {
            width: 220px;
            display: flex;
            flex-direction: column;
            border-right: 1px solid var(--mat-sys-outline-variant);
        }

        .sidenav-title {
            display: flex;
            align-items: center;
            padding: 0.25rem 0.25rem 0.25rem 1rem;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--mat-sys-on-surface-variant);

            span {
                flex: 1;
            }
        }

        .sidenav-open-btn {
            position: absolute;
            top: 0.25rem;
            left: 0.25rem;
            z-index: 1;
        }

        .sidenav-loading {
            display: flex;
            justify-content: center;
            padding: 2rem 0;
        }

        .track-selector {
            padding: 0 1.5rem;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrumComponent {
    private readonly songApi = inject(SongApiService);
    private readonly player = inject(PlayerService);
    private readonly destroyRef = inject(DestroyRef);

    song = signal<Song>(example1Song);
    sidenavOpen = signal(true);
    isEditing = signal(false);
    isTrackEditing = signal(false);
    currentBpm = signal<number>(this.song().properties.bpm);
    selectedTrack = signal<Track>(this.song().tracks[0]);
    activeSongId = signal<string | null>(null);

    songList = toSignal(this.songApi.getSongs());

    loadSong(item: SongSummary): void {
        this.songApi
            .getSong(item.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((song) => {
                this.onSongImport(song);
                this.activeSongId.set(item.id);
                this.sidenavOpen.set(false);
            });
    }

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

    onSongImport(imported: Song): void {
        if (this.player.state() !== 'idle') {
            this.player.stop();
        }
        this.player.metronomeEnabled.set(false);
        this.song.set(imported);
        this.selectedTrack.set(imported.tracks[0]);
        this.currentBpm.set(imported.properties.bpm);
        this.isTrackEditing.set(false);
        this.isEditing.set(false);
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
