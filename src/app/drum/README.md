## Component notes

### Song header editing form
L'approccio più pulito è separare nettamente la responsabilità di visualizzazione da quella di editing, tenendo DrumComponent come orchestratore dello stato.

Struttura suggerita

drum/                                                                                                                                                                                                                                                                                                            
drum.ts                        ← orchestratore: song signal + isEditing signal
song-header/                                                                                                                                                                                                                                                                                                   
song-header.ts                 ← display-only, emette editRequested
song-header-edit/                                                                                                                                                                                                                                                                                                     
song-header-edit.ts            ← reactive form per title/artist/bpm, emette save/cancel

Flusso

1. DrumComponent ha due signal: song e isEditing
2. SongHeaderComponent aggiunge un bottone "edit" che emette un output() → DrumComponent imposta isEditing = true
3. SongHeaderEditComponent riceve la song come input(), emette save (con la song aggiornata) o cancel → DrumComponent aggiorna song e imposta isEditing = false
4. Nel template di DrumComponent: @if (isEditing()) { <app-song-header-edit> } @else { <app-song-header> }

Perché è espandibile

- SongHeaderComponent resta puro display: nessuna logica di editing
- SongHeaderEditComponent è isolato e riutilizzabile (es. in futuro in un Material Dialog senza cambiare nulla)
- Aggiungere nuovi campi alla song (es. genre, timeSignature) richiede solo di toccare SongFormComponent
- Lo stato rimane tutto in DrumComponent, un solo posto da cui passa al form/header         
