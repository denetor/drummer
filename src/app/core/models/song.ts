import { SongProperties } from './song-properties';
import { Track } from './track';

export interface Song {
    artist: string;
    title: string;
    properties: SongProperties;
    tracks: Track[];
}
