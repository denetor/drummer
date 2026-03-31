❯ pensa a come fare un componente o un servizio per suonare una `Song`. Vorrei che fosse controllabile dal SongControlBarComponent: start, stop, pausa e che usi i BPM selezionati

## Design proposto

PlayerService (singleton)

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

## Riepilogo delle modifiche

AudioPlayerService — getContext() reso pubblico; aggiunto playAtTime(instrument, pitch, time) che schedula la riproduzione a un preciso istante AudioContext.currentTime; play() ora delega a playAtTime(time=0).

PlayerService (nuovo) — scheduler lookahead: ogni 25ms pianifica tutti gli step che cadono entro i prossimi 100ms. Gestisce play, pause, resume, stop; espone state e currentMeasureIndex come signal. La canzone scorre in loop.

SongControlBarComponent — aggiunto input song; inietta PlayerService; i tre bottoni sono collegati con [disabled] reattivi allo stato; Play gestisce sia start che resume.

DrumComponent — passa [song]="song()" al control bar.   
