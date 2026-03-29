import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<h1>Hello world</h1><router-outlet />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
