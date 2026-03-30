# How measures are represented

## Drums track
When the track instrument is `drums`, the `pitch` field of the `Note` structure represents the single drum or cymbal hit.

### Tab
When measure is displayed as tab the `pitch` field may assume one of these values: 

- C1: cymbal 1
- C2: cymbal 2
- OH: open hi-hat
- HH: closed hi-hat
- HT: high tom
- MT: medium tom
- FT: floor tom
- SN: snare drum
- BS: bass drum

One single measure is represented with fixed width font, with the following rules:
- one row for each single drum/cymbal, starting with the drum/cymbal symbol (e.s. BS, SN, FT)
- at the beginning of each row of measures must be the drum/cymbal symbol
- at the beginning of each measure line must be a pipe character
- for each Step place a '-' when no note is played, and a 'o' if a note is played
- separate each beat of a measure with a pipe character
- each measure line ends with a pipe character
- a bottom row in a measure displays the beat # in the measure

Measure example, with two measures in a row:
```
C1 |----|----|----|----||----|----|----|----|
C2 |----|----|----|----||----|----|----|----|
OH |----|----|----|----||----|----|----|----|
HH |o-o-|o-o-|o-o-|o-o-||o-o-|o-o-|o-o-|o-o-|
HT |----|----|----|----||----|----|----|----|
MT |----|----|----|----||----|----|----|----|
FT |----|----|----|----||----|----|----|----|
SN |----|o---|----|o---||----|o---|----|o---|
BS |0---|----|o-o-|----||0---|----|o-o-|----|
   |1   |2   |3   |4   ||1   |2   |3   |4   |
```
