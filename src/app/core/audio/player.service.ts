import { Injectable, inject, signal } from '@angular/core';
import { Song } from '../models/song';
import { AudioPlayerService } from './audio-player.service';

export type PlayerState = 'idle' | 'playing' | 'paused';

@Injectable({ providedIn: 'root' })
export class PlayerService {
    private readonly audioPlayer = inject(AudioPlayerService);

    readonly state = signal<PlayerState>('idle');
    readonly currentMeasureIndex = signal<number>(-1);

    private song: Song | null = null;
    private bpm = 120;
    private schedulerTimer: ReturnType<typeof setTimeout> | null = null;
    private nextStepTime = 0;
    private stepIndex = 0;
    private measureIndex = 0;

    private readonly LOOKAHEAD = 0.1;       // seconds to schedule ahead
    private readonly SCHEDULE_INTERVAL = 25; // ms between scheduler ticks

    async play(song: Song, bpm: number): Promise<void> {
        if (this.state() === 'playing') return;

        this.song = song;
        this.bpm = bpm;

        const instruments = [...new Set(song.tracks.map((t) => t.instrument))];
        await Promise.all(instruments.map((i) => this.audioPlayer.loadInstrument(i)));

        this.measureIndex = 0;
        this.stepIndex = 0;
        this.nextStepTime = this.audioPlayer.getContext().currentTime;

        this.state.set('playing');
        this.currentMeasureIndex.set(0);
        this.startScheduler();
    }

    resume(): void {
        if (this.state() !== 'paused' || !this.song) return;
        this.nextStepTime = this.audioPlayer.getContext().currentTime;
        this.state.set('playing');
        this.startScheduler();
    }

    pause(): void {
        if (this.state() !== 'playing') return;
        this.stopScheduler();
        this.state.set('paused');
    }

    stop(): void {
        this.stopScheduler();
        this.measureIndex = 0;
        this.stepIndex = 0;
        this.state.set('idle');
        this.currentMeasureIndex.set(-1);
    }

    private startScheduler(): void {
        this.scheduler();
    }

    private stopScheduler(): void {
        if (this.schedulerTimer !== null) {
            clearTimeout(this.schedulerTimer);
            this.schedulerTimer = null;
        }
    }

    private scheduler(): void {
        const ctx = this.audioPlayer.getContext();
        while (this.nextStepTime < ctx.currentTime + this.LOOKAHEAD) {
            this.scheduleStep(this.nextStepTime);
            this.advanceStep();
        }
        this.schedulerTimer = setTimeout(() => this.scheduler(), this.SCHEDULE_INTERVAL);
    }

    private scheduleStep(time: number): void {
        if (!this.song) return;
        for (const track of this.song.tracks) {
            const measure = track.measures[this.measureIndex];
            if (!measure) continue;
            const step = measure.steps[this.stepIndex];
            if (!step) continue;
            for (const note of step.notes) {
                if (note.pitch) {
                    this.audioPlayer.playAtTime(track.instrument, note.pitch, time);
                }
            }
        }
    }

    private advanceStep(): void {
        if (!this.song) return;
        const primaryTrack = this.song.tracks[0];
        if (!primaryTrack) return;

        const measure = primaryTrack.measures[this.measureIndex];
        this.nextStepTime += 60 / (this.bpm * measure.stepsPerBeat);
        this.stepIndex++;

        if (this.stepIndex >= measure.steps.length) {
            this.stepIndex = 0;
            this.measureIndex = (this.measureIndex + 1) % primaryTrack.measures.length;
            this.currentMeasureIndex.set(this.measureIndex);
        }
    }
}