import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private ctx: AudioContext | null = null;
  private readonly STORAGE_KEY = 'trevvos_sound_enabled';
  private readonly _enabled = signal(this.loadEnabled());

  enabled(): boolean {
    return this._enabled();
  }

  unlock(): void {
    if (typeof AudioContext === 'undefined') return;
    if (!this.ctx) {
      this.ctx = new AudioContext();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleEnabled(): void {
    const next = !this._enabled();
    this._enabled.set(next);
    try {
      localStorage.setItem(this.STORAGE_KEY, String(next));
    } catch {
      // localStorage indisponível
    }
    if (next) this.unlock();
  }

  playClick(): void {
    this.tone(720, 720, 'sine', 45, 0.12);
  }

  playTab(): void {
    this.tone(520, 760, 'sine', 90, 0.1);
  }

  playModalOpen(): void {
    this.tone(420, 920, 'sine', 180, 0.1);
  }

  playModalClose(): void {
    this.tone(780, 320, 'sine', 140, 0.1);
  }

  playSend(): void {
    this.tone(620, 880, 'sine', 110, 0.1);
  }

  playReceive(): void {
    this.tone(540, 540, 'sine', 60, 0.09);
    setTimeout(() => this.tone(720, 720, 'sine', 60, 0.09), 80);
  }

  playError(): void {
    this.tone(220, 160, 'triangle', 180, 0.1);
  }

  playAdmin(): void {
    this.tone(380, 380, 'square', 60, 0.07);
    setTimeout(() => this.tone(640, 640, 'square', 60, 0.07), 110);
  }

  private tone(
    startFreq: number,
    endFreq: number,
    type: OscillatorType,
    durationMs: number,
    peak: number,
  ): void {
    if (!this._enabled() || !this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const dur = durationMs / 1000;
    const attack = 0.005;
    const release = Math.min(0.012, dur * 0.15);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, now);
    if (startFreq !== endFreq) {
      osc.frequency.linearRampToValueAtTime(endFreq, now + dur);
    }

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + attack);
    gain.gain.setValueAtTime(peak, now + dur - release);
    gain.gain.linearRampToValueAtTime(0, now + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + dur);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  private loadEnabled(): boolean {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored === null ? true : stored === 'true';
    } catch {
      return true;
    }
  }
}
