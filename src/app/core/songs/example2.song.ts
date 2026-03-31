import { Song } from '../models/song';

export const example2Song: Song = {
    artist: 'Some artist',
    title: 'Example one',
    properties: { bpm: 100 },
    tracks: [
        {
            instrument: 'drums',
            measures: [
                {
                    beatsPerBar: 4,
                    beatUnit: 4,
                    stepsPerBeat: 4,
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
                        // 3
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'BS' },
                            ],
                        },
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
                    ],
                },
                {
                    beatsPerBar: 4,
                    beatUnit: 4,
                    stepsPerBeat: 4,
                    steps: [
                        // 1
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'BS' },
                            ],
                        },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        // 2
                        { notes: [{ velocity: 64, pitch: 'SN' }] },
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
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        {
                            notes: [
                                { velocity: 64, pitch: 'HH' },
                                { velocity: 64, pitch: 'BS' },
                            ],
                        },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        // 4
                        { notes: [{ velocity: 64, pitch: 'SN' }] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                        { notes: [{ velocity: 64, pitch: 'HH' }] },
                    ],
                },
            ],
        },
    ],
};
