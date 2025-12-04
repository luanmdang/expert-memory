'use client';

import * as React from 'react';
import styles from '../../styles/terminal.module.scss';
import { FileNode } from '../../types';

interface AudioPlayerProps {
  file: FileNode;
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ file, onClose }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(0.75);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);

  const audioUrl = file.metadata?.audioUrl || '';
  const bpm = file.metadata?.bpm;
  const tags = file.metadata?.tags || [];

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Generate ASCII progress bar
  const generateProgressBar = (): string => {
    const width = 32;
    const progress = duration > 0 ? currentTime / duration : 0;
    const filled = Math.floor(progress * width);
    const empty = width - filled;
    return '[' + '='.repeat(filled) + (filled < width ? '>' : '=') + '-'.repeat(Math.max(0, empty - 1)) + ']';
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    audioRef.current.currentTime = progress * duration;
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (audioRef.current) audioRef.current.pause();
      onClose();
    }
  };

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (audioRef.current) audioRef.current.pause();
      onClose();
    }
    if (e.key === ' ') {
      e.preventDefault();
      togglePlay();
    }
    if (e.key === 'ArrowLeft' && audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
    if (e.key === 'ArrowRight' && audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
    }
    if (e.key === 'ArrowUp') {
      setVolume((v) => Math.min(1, v + 0.1));
    }
    if (e.key === 'ArrowDown') {
      setVolume((v) => Math.max(0, v - 0.1));
    }
  }, [onClose, duration, togglePlay]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const volumeBars = Math.round(volume * 5);
  const volumeDisplay = '|'.repeat(volumeBars) + '.'.repeat(5 - volumeBars);

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.asciiPlayer}>
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        
        <div className={styles.playerHeader}>
          <span className={styles.playerStatus}>{isPlaying ? '[PLAYING]' : '[PAUSED]'}</span>
          <span className={styles.playerClose} onClick={onClose}>[x]</span>
        </div>

        <div className={styles.playerTrack}>
          {file.name}
        </div>

        <div 
          ref={progressRef}
          className={styles.playerProgress}
          onClick={handleSeek}
        >
          {generateProgressBar()}
        </div>

        <div className={styles.playerTime}>
          {formatTime(currentTime)} / {formatTime(duration || 0)}
        </div>

        <div className={styles.playerControls}>
          <span 
            className={styles.playerControl}
            onClick={() => audioRef.current && (audioRef.current.currentTime = Math.max(0, currentTime - 10))}
          >
            {'<<'}
          </span>
          <span 
            className={styles.playerControl}
            onClick={togglePlay}
          >
            {isPlaying ? '[||]' : '[>]'}
          </span>
          <span 
            className={styles.playerControl}
            onClick={() => audioRef.current && (audioRef.current.currentTime = Math.min(duration, currentTime + 10))}
          >
            {'>>'}
          </span>
        </div>

        <div className={styles.playerVolume}>
          vol [{volumeDisplay}]
          <span 
            className={styles.playerControl}
            onClick={() => setVolume((v) => Math.max(0, v - 0.2))}
          >
            [-]
          </span>
          <span 
            className={styles.playerControl}
            onClick={() => setVolume((v) => Math.min(1, v + 0.2))}
          >
            [+]
          </span>
        </div>

        {(bpm || tags.length > 0) && (
          <div className={styles.playerMeta}>
            {bpm && <span>{bpm} bpm</span>}
            {tags.length > 0 && <span>{tags.join(' / ').toLowerCase()}</span>}
          </div>
        )}

        <div className={styles.playerHelp}>
          space=play  arrows=seek/vol  esc=close
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
