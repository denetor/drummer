import { Injectable } from '@angular/core';
import { SAMPLE_MAP } from './sample-map';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
    private context: AudioContext | null = null;
    private buffers = new Map<string, AudioBuffer>();

    async loadInstrument(instrument: string): Promise<void> {
        const pitchMap = SAMPLE_MAP[instrument];
        if (!pitchMap) return;

        await Promise.all(
            Object.entries(pitchMap).map(([pitch, path]) =>
                this.loadSample(instrument, pitch, path),
            ),
        );
    }

    getContext(): AudioContext {
        if (!this.context) {
            this.context = new AudioContext();
        }
        return this.context;
    }

    play(instrument: string, pitch: string): void {
        this.playAtTime(instrument, pitch, 0);
    }

    playAtTime(instrument: string, pitch: string, time: number): void {
        const key = this.bufferKey(instrument, pitch);
        const buffer = this.buffers.get(key);
        if (!buffer) return;

        const ctx = this.getContext();
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(time);
    }

    private async loadSample(instrument: string, pitch: string, path: string): Promise<void> {
        const key = this.bufferKey(instrument, pitch);
        if (this.buffers.has(key)) return;

        try {
            const ctx = this.getContext();
            const response = await fetch(path);
            if (!response.ok) return;
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            this.buffers.set(key, audioBuffer);
        } catch {
            // sample missing or unreadable — skip silently
        }
    }

    private bufferKey(instrument: string, pitch: string): string {
        return `${instrument}:${pitch}`;
    }
}