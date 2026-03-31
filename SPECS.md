# Project Specifications

## Overview

Angular (Material) application implementing a browser-based drum machine (step sequencer).

The user composes drum grooves by activating steps on a grid. Each row represents a drum instrument 
(e.g. kick, snare, hi-hat, tom); each column represents a 16th-note subdivision of one bar. 
The user toggles individual steps on/off to define the rhythm pattern for each instrument.

The sequencer plays the pattern in a loop at a configurable BPM. On each step, the application 
triggers audio samples for all active instruments in that column.

Key interactions:
- Toggle steps on/off by clicking grid cells
- Start/stop playback
- Adjust tempo (BPM)
- Clear or randomize the pattern

The application targets desktop browsers. Audio playback uses the Web Audio API.

---

## Data Structures

Common data structures are described in `src/app/code/models`.

### Song
A Song is composed of multiple Tracks, one for each instrument (guitar, keyboard, drums, voice, ...).
A Track is a list of Measures.
A Measure is a chunk of time (usually 4/4) containing a serie of notes.

#### Measure structure

A Measure is represented as an array of Steps. Each Step can hold multiple simultaneous Notes (e.g. chord voicings, or multiple drum hits on the same subdivision).

```typescript
interface Note {
    velocity: number;   // hit intensity, 0–127
    pitch: string;      // note, if pitched instrument or drum type on drumd e.g. "d4" for kick, "c5" fr snare, "g5" for hi-hat...
    duration?: number;  // length in steps, default 1
}

interface Step {
    notes: Note[];      // empty = silence; one or more = active
}

interface Measure {
    beatsPerBar: number;    // time signature numerator (e.g. 4 in 4/4)
    beatUnit: number;       // time signature denominator (e.g. 4 for quarter note)
    stepsPerBeat: number;   // subdivision: 4 = sixteenth notes, 2 = eighth notes
    steps: Step[];          // length = beatsPerBar × stepsPerBeat
}
```

A typical 4/4 drum machine measure at sixteenth-note resolution has 16 steps (`beatsPerBar: 4`, `stepsPerBeat: 4`). An empty step (`notes: []`) represents silence; toggling a step on means adding a Note to it.

Perché questa struttura

┌───────────────────────────────────────────┬────────────────────────────────────────────┐                                                                                                                                                                                                                       
│                 Esigenza                  │              Come la gestisce              │
├───────────────────────────────────────────┼────────────────────────────────────────────┤                                                                                                                                                                                                                       
│ Toggle on/off per il drum machine         │ step.notes.length === 0 = silenzio         │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ Colpi multipli simultanei (kick + hi-hat) │ notes: Note[] — più note nello stesso step │                                                                                                                                                                                                                       
├───────────────────────────────────────────┼────────────────────────────────────────────┤                                                                                                                                                                                                                       
│ Accordi chitarra                          │ stessa cosa, con pitch valorizzato         │                                                                                                                                                                                                                       
├───────────────────────────────────────────┼────────────────────────────────────────────┤                                                                                                                                                                                                                       
│ Misure non 4/4 (3/4, 7/8…)                │ beatsPerBar + beatUnit                     │
├───────────────────────────────────────────┼────────────────────────────────────────────┤                                                                                                                                                                                                                       
│ Sedicesimi, ottavi, trentaduesimi         │ stepsPerBeat                               │
├───────────────────────────────────────────┼────────────────────────────────────────────┤                                                                                                                                                                                                                       
│ Velocity                                  │ campo su Note                              │
├───────────────────────────────────────────┼────────────────────────────────────────────┤                                                                                                                                                                                                                       
│ Display a pentagramma (v0.7)              │ pitch è già presente, opzionale            │
└───────────────────────────────────────────┴────────────────────────────────────────────┘

Valori tipici per un drum machine 4/4 a sedicesimi
```typescript
const measure: Measure = {
    beatsPerBar: 4,                                                                                                                                                                                                                                                                                              
    beatUnit: 4,
    stepsPerBeat: 4,                                                                                                                                                                                                                                                                                             
    steps: Array.from({ length: 16 }, () => ({ notes: [] })),
};
```

Information abount Measure representation can be found in the file `resources/measure-representation.md`.

---

## Features

---

## Milestones

### v0.1 — Empty application
- [x] Empty current application: write only "hello world" in the only page available.
- [x] dockerized environment
- [x] Install and use the Angular Material UI library
- [x] Add a `drum` route displaying only a "Drum machine" title
- [x] make `drum` the default route when entering the application

### v0.2 — Song edit page, without song rows
- [x] Add the data model for the song configuration 
- [x] In the drum component, have a default instance of Song, displaying the song title as page title, the artist and the bpm value
- [x] Allow edit of song title, artist and bpm
- [x] Add a placeholder for the song rows in the drum component

### v0.3 — Add measure and notes details to structure. Tab row display component (must be replaceable with other future components)
- [x] Define data structure to store the beats in a measure
- [x] In the Drum component, add a dropdown to choose the track to display: for now only the "drums" option is available and selected 
- [x] Rename `app-song-rows` component in `app-song-track`
- [x] Display all measures of the track selected in the track dropdown: each measure must be displayed with a `MeasureComponent`
- [x] Make the measures wrappable when too many elements are not fitting the browser width

### v0.4 — Play instrument sounds
- [x] Find some sound samples for the main drums/cymbals
- [x] Create a SongControlBar component with BPM selection, start/pause/stop buttons, not connected with anything. Place the controller in a row below the track selector dropdown
- [x] Think about a way to connect audio samples with the track instrument
- [x] Think and create a Player component to play the song using Web audio API
- [x] Connect BPM and music control buttons
- [x] Add a metronome toggler to the SongControlBar component, and make it play sound when starting each measure beat. The first beat of a measure should have a higher pitch
- [x] Highlight the current playing measure while playing the song

### v0.5 — Edit song rows: copy and delete rows and measures; add notes to measures
- [x] Add an `edit` toggle to SongControlBar. This will put the SongTrackComponent in edit mode
- [x] Add a `New Measure` button at the end of SongTrackComponent. This creates a new empty measure with the same properties as the previous (but without the notes)
- [x] Add a small `edit` icon button below each measure. This will be visible only when the track is in edit mode
- [x] Think the best way to edit a measure: inline changing the display mode of measures (to allow a span for each beat step) or in a modal window
- [x] Add to MeasureEditorComponent a control to play in loop the measure currently being edited. If the user closes the MeasureEditorComponent, the loop playback must stop
- [ ] In edit mode, add a button to duplicate the corresponding measure
- [ ] In edit mode, add a button to delete a measure
- [ ] In edit mode, add a button to copy a measure to another one

### v0.6 — Export and import song json

### v0.7 — Component to show rows as pentagram

### v0.8 — Measures library

### v1.0 — Release
- [ ] Deploy scripts

### v1.1 — Connection to API server to save own songs, measure library, ...

---

## TODO

Tasks that don't belong to a specific milestone yet.
- [ ] Play or loop play only a section of a track
- [ ] Copy track sections
- [ ] Add comments to measures to be displayed on top or below

---

## Open Questions

Questions that need an answer before implementation can proceed.

