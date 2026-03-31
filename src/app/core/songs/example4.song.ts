import { Song } from '../models/song';

export const example4Song: Song = {
    artist: 'Beatles',
    title: 'Oh darling',
    properties: { bpm: 70 },
    tracks: [
        {
            instrument: 'drums',
            measures: [
                {
                    beatsPerBar: 4,
                    beatUnit: 4,
                    stepsPerBeat: 6,
                    steps: [
                        // 1
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'BS' },
                            ],
                        },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [] },
                        // 2
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'SN' },
                            ],
                        },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [] },
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'BS' },
                            ],
                        },
                        { notes: [] },
                        // 3
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'BS' },
                            ],
                        },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [] },
                        // 4
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'SN' },
                            ],
                        },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [] },
                    ],
                },
                {
                    beatsPerBar: 4,
                    beatUnit: 4,
                    stepsPerBeat: 6,
                    steps: [
                        // 1
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'BS' },
                            ],
                        },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [] },
                        // 2
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'SN' },
                            ],
                        },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        // 3
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'BS' },
                            ],
                        },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [] },
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'BS' },
                            ],
                        },
                        { notes: [] },
                        // 4
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'SN' },
                            ],
                        },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [] },
                    ],
                },
            ],
        },
    ],
};
