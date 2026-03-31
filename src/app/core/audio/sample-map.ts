const DRUM_SAMPLES: Record<string, string> = {
    HH: 'samples/drums/hi-hat.mp3',
    SN: 'samples/drums/snare.mp3',
    BS: 'samples/drums/bass-drum.mp3',
    HT: 'samples/drums/tom-1.mp3',
    MT: 'samples/drums/tom-2.mp3',
    FT: 'samples/drums/floor-tom.mp3',
};

const METRONOME_SAMPLES: Record<string, string> = {
    BEAT1: 'samples/metronome/metronome-click-hi.mp3', // first beat of each measure (higher pitch)
    BEAT: 'samples/metronome/metronome-click-lo.mp3',  // other beats
};

export const SAMPLE_MAP: Record<string, Record<string, string>> = {
    drums: DRUM_SAMPLES,
    metronome: METRONOME_SAMPLES,
};
