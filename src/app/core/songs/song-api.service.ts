import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Song } from '../models/song';
import { SongSummary } from '../models/song-summary';

@Injectable({ providedIn: 'root' })
export class SongApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.apiBaseUrl;

    getSongs(): Observable<SongSummary[]> {
        return this.http.get<SongSummary[]>(`${this.baseUrl}/songs/index.json`);
    }

    getSong(id: string): Observable<Song> {
        return this.http.get<Song>(`${this.baseUrl}/songs/${id}/index.json`);
    }
}
