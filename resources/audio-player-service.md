## PlayerService (singleton)

### Prompt
❯ pensa a come fare un componente o un servizio per suonare una `Song`. Vorrei che fosse controllabile dal SongControlBarComponent: start, stop, pausa e che usi i BPM selezionati


### Descrizione
Il cuore della soluzione. Gestisce lo scheduling audio con il pattern lookahead scheduler (standard per Web Audio API): un setTimeout che gira ogni ~25ms e pianifica le note leggermente in anticipo su AudioContext.currentTime, eliminando il jitter dei timer JS.

stato interno:                                                                                                                                                                                                                                                                                                   
state: Signal<'idle' | 'playing' | 'paused'>                                                                                                                                                                                                                                                                   
currentMeasureIndex: Signal<number>   ← utile per highlight futuro

API pubblica:                                                                                                                                                                                                                                                                                                    
play(song, bpm)   ← avvia da zero                                                                                                                                                                                                                                                                              
resume()          ← riprende dal punto di pausa                                                                                                                                                                                                                                                                
pause()                                                                                                                                                                                                                                                                                                        
stop()

Calcolo durata di uno step:                                                                                                                                                                                                                                                                                      
stepDuration = 60 / (bpm * stepsPerBeat)   [secondi]

Aggiornamento SongControlBarComponent

Riceve song come input aggiuntivo (oltre a bpm), inietta PlayerService, e collega i bottoni:

Play   → state === 'paused' ? service.resume() : service.play(song(), currentBpm())                                                                                                                                                                                                                              
Pause  → service.pause()                                                                                                                                                                                                                                                                                         
Stop   → service.stop()

I bottoni vengono abilitati/disabilitati in base a service.state():
- Play disabilitato se playing
- Pause disabilitato se idle o paused
- Stop disabilitato se idle

Aggiornamento DrumComponent

Aggiunge [song]="song()" al tag <app-song-control-bar>.
                                                                                                                                                                                                                                                                                                                   
---                                                                                                                                                                                                                                                                                                              
Schema del flusso

DrumComponent   
└─ SongControlBarComponent [song] [bpm]                                                                                                                                                                                                                                                                        
└─ inject PlayerService                                                                                                                                                                                                                                                                                   
├─ play(song, bpm) ──→ AudioPlayerService.play(instrument, pitch)                                                                                                                                                                                                                                    
└─ state() ──→ abilita/disabilita bottoni                                                                                                                                                                                                                                                            

### Riepilogo delle modifiche

AudioPlayerService — getContext() reso pubblico; aggiunto playAtTime(instrument, pitch, time) che schedula la riproduzione a un preciso istante AudioContext.currentTime; play() ora delega a playAtTime(time=0).

PlayerService (nuovo) — scheduler lookahead: ogni 25ms pianifica tutti gli step che cadono entro i prossimi 100ms. Gestisce play, pause, resume, stop; espone state e currentMeasureIndex come signal. La canzone scorre in loop.

SongControlBarComponent — aggiunto input song; inietta PlayerService; i tre bottoni sono collegati con [disabled] reattivi allo stato; Play gestisce sia start che resume.

DrumComponent — passa [song]="song()" al control bar.   



## Metronomo

### Prompt
voglio aggiungere la funzione metronomo. Aggiungendo un "toggle" al SongControlBar, che quando attivo emette un click all'inizio di ogni Beat di una measure, se si sta riproducendo una canzone. Solo al primo beat di ogni measure il click avrà una nota diversa. I sample dei click del metronomo si trovano
in `public/samples/metronome`. Pensa a come sviluppare questa funzionalità scrivendo codice pulito e manutenibile

### Ragionamento

1. sample-map.ts — aggiungere l'instrument metronome con i pitch BEAT1 e BEAT
2. player.service.ts — aggiungere metronomeEnabled signal + caricare i sample + schedulare i click nei beat
3. song-control-bar.ts — aggiungere il toggle button


### Modifiche effettuate

sample-map.ts

Aggiunto l'instrument metronome con due pitch:
- BEAT1 → metronome-click-0.mp3 (primo beat di ogni misura, nota acuta)
- BEAT → metronome-click-1.mp3 (altri beat, nota grave)

player.service.ts

- metronomeEnabled — signal pubblico scrivibile; il toggle nel componente agisce direttamente su di esso senza bisogno di metodi wrapper
- I sample del metronomo vengono sempre caricati al Play insieme agli altri strumenti (sono solo 2 file da ~2KB, trascurabili)
- scheduleStep() — delega a scheduleMetronomeClick() solo se il metronomo è attivo; la lettura del signal avviene nell'hot path dello scheduler, ma Angular signals sono O(1)
- scheduleMetronomeClick() — separato per singola responsabilità; usa stepIndex % stepsPerBeat === 0 per individuare i beat, e stepIndex === 0 per distinguere il primo beat della misura

song-control-bar.ts

- Pulsante toggle con aria-pressed per accessibilità WCAG
- .metronome-active con var(--mat-sys-primary) per rispettare il tema Material senza hardcodare colori
- Il toggle può essere attivato/disattivato anche durante la riproduzione: il check metronomeEnabled() avviene ad ogni step schedulato, quindi il cambio è istantaneo al beat successivo

