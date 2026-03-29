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

### v0.2 — Feature complete
- [ ] Feature C
- [ ] Feature D
- [ ] Polish and accessibility pass

### v1.0 — Release
- [ ] All tests passing
- [ ] Production build optimized
- [ ] Documentation complete

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

