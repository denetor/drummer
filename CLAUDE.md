# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Specifications
See `./SPECS.md` for milestones, data structures, and TODO lists.

## Development environment
The development environment runs in a Docker container.

```bash
docker-compose build && docker-compose up   # start
docker ps                                   # find container ID (drummer_app_1)
docker exec -ti <container-id> bash         # enter container
```

Commands available inside the container:
```bash
npm start          # Dev server at http://localhost:4200 (auto-reloads)
npm run build      # Production build to dist/
npm test           # Run unit tests with Vitest
npx ng test --include="src/app/path/to/file.spec.ts"  # single test file
```

## Architecture

Browser-based drum machine / step sequencer. Users compose drum grooves by toggling steps on a grid; the app plays them in a loop using the **Web Audio API**.

Standalone Angular 21 app bootstrapped via `bootstrapApplication()` (no NgModules).

- **Entry point:** `src/main.ts` → `src/app/app.config.ts` → `src/app/app.routes.ts`
- **Only route:** `/drum` (default) → `DrumComponent`
- **Styles:** Global SCSS at `src/styles.scss`; per-component SCSS files alongside `.ts`
- **Assets / samples:** `public/samples/` — WAV files loaded by `AudioPlayerService`

### Key conventions
- Test runner is **Vitest** — test files use `.spec.ts` suffix
- Component style language is **SCSS**
- Formatter is **Prettier** with `printWidth: 100` and single quotes
- Detailed Angular/TypeScript/accessibility guidelines are in `.claude/CLAUDE.md`

### Data model hierarchy

```
Song
 └─ Track[]          (one per instrument, e.g. "drums")
     └─ Measure[]    (beatsPerBar, beatUnit, stepsPerBeat)
         └─ Step[]   (length = beatsPerBar × stepsPerBeat)
             └─ Note[] (velocity, pitch, duration?)
```

Model interfaces live in `src/app/core/models/`. An empty `notes: []` means silence; toggling a step on adds a `Note` to it. The `pitch` string identifies the drum type (e.g. `"d4"` = kick, `"c5"` = snare).

### Component hierarchy & responsibilities

```
DrumComponent                    ← state owner (song, bpm, editMode signals)
  ├─ SongHeaderComponent         ← display-only title/artist
  ├─ SongHeaderEditComponent     ← reactive form to edit song metadata
  ├─ SongControlBarComponent     ← transport controls, BPM, metronome, import/export
  └─ SongTrackComponent          ← measure list with duplicate/delete/reorder
      ├─ MeasureComponent        ← read-only drum-tab grid, highlights when active
      └─ MeasureEditorComponent  ← interactive step-toggle grid with loop preview
```

All state changes flow upward through `output()` events; `DrumComponent` owns the `song` signal and updates it immutably (spread operator).

### Audio services

- **`PlayerService`** (`src/app/core/audio/player.service.ts`) — scheduling engine. Runs a 25 ms tick with 100 ms lookahead; exposes signals `state`, `currentMeasureIndex`, `metronomeEnabled`, `currentBpm`. Also supports `playMeasureLoop()` / `updateLoopMeasure()` for the editor preview.
- **`AudioPlayerService`** (`src/app/core/audio/audio-player.service.ts`) — low-level Web Audio API wrapper. Loads/caches `AudioBuffer`s per `instrument:pitch` key; plays them at a precise audio-context timestamp.
- **`SAMPLE_MAP`** (`src/app/core/audio/sample-map.ts`) — maps instrument + pitch to sample file paths.

`PlayerService` is injected in `SongControlBarComponent`, `SongTrackComponent`, and `MeasureEditorComponent`. `AudioPlayerService` is only used internally by `PlayerService`.

### Example songs

`src/app/core/songs/` contains `example1–4.song.ts` — pre-built `Song` objects useful for development and testing.
