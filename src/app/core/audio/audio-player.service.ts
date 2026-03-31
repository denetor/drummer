import { Injectable } from '@angular/core';
import { SAMPLE_MAP } from './sample-map';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
    private context: AudioContext | null = null;
    private buffers = new Map<string, AudioBuffer>();

    /**
     * Asynchronously loads all samples for the specified instrument.
     *
     * @param {string} instrument - The name of the instrument to load samples for.
     * @return {Promise<void>} A promise that resolves when all samples for the instrument are loaded.
     */
    async loadInstrument(instrument: string): Promise<void> {
        const pitchMap = SAMPLE_MAP[instrument];
        if (!pitchMap) return;

        await Promise.all(
            Object.entries(pitchMap).map(([pitch, path]) =>
                this.loadSample(instrument, pitch, path),
            ),
        );
    }

    /**
     * Returns the singleton instance of the AudioContext.
     * If the context doesn't exist, it initializes a new AudioContext.
     *
     * @return {AudioContext} The singleton AudioContext instance.
     */
    getContext(): AudioContext {
        if (!this.context) {
            this.context = new AudioContext();
        }
        return this.context;
    }

    /**
     * Plays a specified musical instrument at a given pitch.
     *
     * @param {string} instrument - The name of the instrument to be played.
     * @param {string} pitch - The pitch at which the instrument should be played.
     * @return {void} No return value.
     */
    play(instrument: string, pitch: string): void {
        this.playAtTime(instrument, pitch, 0);
    }

    /**
     * Plays a specified instrument sound at a given pitch and time.
     *
     * @param {string} instrument - The name of the instrument to be played.
     * @param {string} pitch - The pitch of the sound to be played.
     * @param {number} time - The time (in seconds) at which the sound should start.
     * @return {void}
     */
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

    /**
     * Loads an audio sample for a given instrument and pitch from the specified path,
     * and stores it in the internal buffer if not already loaded.
     *
     * @param {string} instrument - The name of the instrument associated with the sample.
     * @param {string} pitch - The pitch of the sample to be loaded.
     * @param {string} path - The file path to the audio sample.
     * @return {Promise<void>} A promise that resolves when the sample is successfully loaded,
     * or skips silently if the sample is missing or unreadable.
     */
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

    /**
     * Combines the provided instrument and pitch into a single formatted string key.
     *
     * @param {string} instrument - The name of the instrument.
     * @param {string} pitch - The pitch value associated with the instrument.
     * @return {string} A concatenated string in the format "instrument:pitch" to be used as a unique key.
     */
    private bufferKey(instrument: string, pitch: string): string {
        return `${instrument}:${pitch}`;
    }
}
