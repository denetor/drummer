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
- [ ] Add a placeholder for the song rows

### v0.3 — Add song rows, add measures, edit notes. Row display component must be replaceable with other future components
- [ ] Define data structure to store the beats in a measure
- [ ] Create a component to display a row like guitar tabs (one row for each drum)

### v0.4 — Play instrument sounds

### v0.5 — Edit song rows: copy and delete rows and measures; add notes to measures

### v0.6 — Export and import song json

### v0.7 — Component to show rows as pentagram

### v0.8 — Measures library

### v1.0 — Release
- [ ] To be defined

---

## Data Structures

---

## Features


---

## TODO

Tasks that don't belong to a specific milestone yet.

---

## Open Questions

Questions that need an answer before implementation can proceed.

