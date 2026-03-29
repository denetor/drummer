import { ChangeDetectionStrategy, Component, OnInit, input, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Song } from '../../core/models/song';

@Component({
    selector: 'app-song-header-edit',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './song-header-edit.html',
    styleUrl: './song-header-edit.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongHeaderEditComponent implements OnInit {
    song = input.required<Song>();
    save = output<Song>();
    cancel = output<void>();

    form = new FormGroup({
        title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        artist: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        bpm: new FormControl(120, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    });

    ngOnInit(): void {
        const s = this.song();
        this.form.setValue({
            title: s.title,
            artist: s.artist,
            bpm: s.properties.bpm,
        });
    }

    onSave(): void {
        if (this.form.invalid) return;
        const { title, artist, bpm } = this.form.getRawValue();
        this.save.emit({ ...this.song(), title, artist, properties: { ...this.song().properties, bpm } });
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
