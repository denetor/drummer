import { Step } from './step';

export interface Measure {
    beatsPerBar: number;
    beatUnit: number;
    stepsPerBeat: number;
    steps: Step[];
}
