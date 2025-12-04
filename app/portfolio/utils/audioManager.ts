// Audio Manager for keyboard sounds and SFX
// Uses Web Audio API for low-latency playback

class AudioManager {
  private context: AudioContext | null = null;
  private enabled: boolean = true;
  private initialized: boolean = false;
  private buffers: Map<string, AudioBuffer> = new Map();
  
  // Keystroke sounds - we'll generate them with Web Audio API
  private static readonly KEYSTROKE_FREQUENCIES = [
    800, 900, 850, 950, 820, 880, 920  // 7 variations
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      // Check localStorage for preference
      const saved = localStorage.getItem('iss-terminal-audio');
      this.enabled = saved !== 'false';
    }
  }

  private async init() {
    if (this.initialized || typeof window === 'undefined') return;
    
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  async playKeystroke(isEnter: boolean = false) {
    if (!this.enabled) return;
    
    await this.init();
    if (!this.context) return;

    // Resume context if suspended (browser autoplay policy)
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    try {
      // Create oscillator for the click sound
      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();
      const filter = this.context.createBiquadFilter();

      // Connect nodes
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.context.destination);

      // Configure for click sound
      const baseFreq = isEnter 
        ? 400 // Lower pitch for Enter
        : AudioManager.KEYSTROKE_FREQUENCIES[Math.floor(Math.random() * 7)];
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(baseFreq, this.context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, this.context.currentTime + 0.05);

      // Filter for mechanical click sound
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, this.context.currentTime);
      filter.Q.setValueAtTime(1, this.context.currentTime);

      // Volume envelope
      const volume = isEnter ? 0.15 : 0.08;
      gainNode.gain.setValueAtTime(volume, this.context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + (isEnter ? 0.08 : 0.04));

      // Play
      oscillator.start(this.context.currentTime);
      oscillator.stop(this.context.currentTime + (isEnter ? 0.08 : 0.04));
    } catch (e) {
      // Silently fail if audio playback fails
    }
  }

  async playBootSound() {
    if (!this.enabled) return;
    
    await this.init();
    if (!this.context) return;

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    try {
      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.context.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, this.context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, this.context.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.3);

      oscillator.start(this.context.currentTime);
      oscillator.stop(this.context.currentTime + 0.3);
    } catch (e) {
      // Silently fail
    }
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('iss-terminal-audio', String(this.enabled));
    }
    return this.enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('iss-terminal-audio', String(enabled));
    }
  }
}

// Singleton instance
export const audioManager = new AudioManager();

export default AudioManager;

