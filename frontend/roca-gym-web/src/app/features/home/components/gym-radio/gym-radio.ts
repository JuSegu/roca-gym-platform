import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerService } from '../../../../core/services/audio-player.service';

@Component({
  selector: 'app-gym-radio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gym-radio.html',
  styleUrl: './gym-radio.css',
})
export class GymRadio {
  readonly audio = inject(AudioPlayerService);

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.audio.setVolume(parseFloat(input.value));
  }
}
