import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-drum',
    template: `<h1>Drum machine</h1>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrumComponent {}
