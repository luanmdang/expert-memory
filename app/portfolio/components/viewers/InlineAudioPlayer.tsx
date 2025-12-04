'use client';

import * as React from 'react';
import styles from '../../styles/terminal.module.scss';
import { FileNode } from '../../types';

interface InlineAudioPlayerProps {
  file: FileNode;
}

const InlineAudioPlayer: React.FC<InlineAudioPlayerProps> = ({ file }) => {
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
    
    // Progress bar is exactly 34ch wide: '[' + 32 bar chars + ']'
    // Each char = rect.width / 34
    const charWidth = rect.width / 34;
    
    // Skip first char '[', seekable area is chars 1-32 (indices 1-32)
    const seekableStart = charWidth; // After '['
    const seekableWidth = charWidth * 32; // The 32 inner chars
    
    // Calculate position within seekable area
    const seekX = x - seekableStart;
    const progress = Math.max(0, Math.min(1, seekX / seekableWidth));
    
    audioRef.current.currentTime = progress * duration;
  };

  const volumeBars = Math.round(volume * 5);
  const volumeDisplay = '|'.repeat(volumeBars) + '.'.repeat(5 - volumeBars);

  return (
    <div className={styles.inlineAsciiPlayer}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className={styles.inlinePlayerHeader}>
        <span className={styles.inlinePlayerStatus}>{isPlaying ? '[PLAYING]' : '[PAUSED]'}</span>
        <span className={styles.inlinePlayerTrack}>{file.name}</span>
      </div>

      <div 
        ref={progressRef}
        className={styles.inlinePlayerProgress}
        onClick={handleSeek}
      >
        {generateProgressBar()}
      </div>

      <div className={styles.inlinePlayerRow}>
        <span className={styles.inlinePlayerTime}>
          {formatTime(currentTime)} / {formatTime(duration || 0)}
        </span>

        <div className={styles.inlinePlayerControls}>
          <span 
            className={styles.inlinePlayerControl}
            onClick={() => audioRef.current && (audioRef.current.currentTime = Math.max(0, currentTime - 10))}
          >
            {'<<'}
          </span>
          <span 
            className={styles.inlinePlayerControl}
            onClick={togglePlay}
          >
            {isPlaying ? '[||]' : '[>]'}
          </span>
          <span 
            className={styles.inlinePlayerControl}
            onClick={() => audioRef.current && (audioRef.current.currentTime = Math.min(duration, currentTime + 10))}
          >
            {'>>'}
          </span>
        </div>

        <div className={styles.inlinePlayerVolume}>
          vol [{volumeDisplay}]
          <span 
            className={styles.inlinePlayerControl}
            onClick={() => setVolume((v) => Math.max(0, v - 0.2))}
          >
            [-]
          </span>
          <span 
            className={styles.inlinePlayerControl}
            onClick={() => setVolume((v) => Math.min(1, v + 0.2))}
          >
            [+]
          </span>
        </div>
      </div>

      {(bpm || tags.length > 0) && (
        <div className={styles.inlinePlayerMeta}>
          {bpm && <span>{bpm} bpm</span>}
          {tags.length > 0 && <span>{tags.join(' / ').toLowerCase()}</span>}
        </div>
      )}
    </div>
  );
};

export default InlineAudioPlayer;

