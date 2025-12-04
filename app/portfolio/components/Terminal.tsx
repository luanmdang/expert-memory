'use client';

import * as React from 'react';
import styles from '../styles/terminal.module.scss';
import { Command, FileNode, ViewerState } from '../types';
import { fileSystem, findNodeByPath, getFileIcon } from '../data/fileSystem';
import { executeCommand, getCompletions } from '../utils/commandParser';
import { audioManager } from '../utils/audioManager';
import TextViewer from './viewers/TextViewer';
import AudioPlayer from './viewers/AudioPlayer';
import PDFViewer from './viewers/PDFViewer';
import InlineAudioPlayer from './viewers/InlineAudioPlayer';
import MatrixLoader from '@components/MatrixLoader';
import BarProgress from '@components/BarProgress';
import Tooltip from '@components/Tooltip';
import { onHandleAppearanceChange } from '@common/utilities';

// Navigation sections with tooltip hints
const NAV_SECTIONS = [
  { id: 'home', label: 'home', path: '~/portfolio', icon: '>', hint: 'back to root directory' },
  { id: 'about', label: 'about', path: '~/portfolio/about', icon: '>', hint: 'bio & introduction' },
  { id: 'experience', label: 'experience', path: '~/portfolio/experience', icon: '>', hint: 'work & research' },
  { id: 'projects', label: 'projects', path: '~/portfolio/projects', icon: '>', hint: 'coding projects' },
  { id: 'education', label: 'education', path: '~/portfolio/education', icon: '>', hint: 'academic background' },
  { id: 'music', label: 'music', path: '~/portfolio/music', icon: '>', hint: 'beats & productions' },
  { id: 'skills', label: 'skills', path: '~/portfolio/skills', icon: '>', hint: 'tech stack' },
  { id: 'contact', label: 'contact', path: '~/portfolio/contact', icon: '>', hint: 'get in touch' },
  { id: 'resume', label: 'resume.pdf', path: '~/portfolio/resume.pdf', icon: '>', hint: 'download cv' },
];

// Boot messages - terse
const BOOT_MESSAGES = [
  { text: 'filesystem mounted', type: 'ok' },
  { text: 'shell initialized', type: 'ok' },
  { text: '', type: 'info' },
];

const ASCII_LOGO = `
 _                      
| |_   _  __ _ _ __    
| | | | |/ _\` | '_ \\   
| | |_| | (_| | | | |  
|_|\\__,_|\\__,_|_| |_|  
`;

const Terminal: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const [currentPath, setCurrentPath] = React.useState('~/portfolio');
  const [commandHistory, setCommandHistory] = React.useState<Command[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return audioManager.isEnabled();
    }
    return true;
  });
  const [missionTime, setMissionTime] = React.useState(0);
  const [viewer, setViewer] = React.useState<ViewerState>({ type: null, file: null, isOpen: false });
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showMatrix, setShowMatrix] = React.useState(false);
  const [hoveredNav, setHoveredNav] = React.useState<string | null>(null);
  const [noPopup, setNoPopup] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('noPopup') === 'true';
    }
    return false;
  });
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      // Check localStorage first, then fallback to body class
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) return stored === 'true';
      return document.body.classList.contains('theme-dark');
    }
    return true; // Default to dark for terminal aesthetic
  });

  const terminalHistoryRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const startTimeRef = React.useRef(Date.now());

  // Apply theme on mount and changes
  React.useEffect(() => {
    onHandleAppearanceChange(isDarkMode ? 'theme-dark' : 'theme-light');
  }, [isDarkMode]);

  // Boot sequence
  React.useEffect(() => {
    const bootInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(bootInterval);
          setTimeout(() => {
            setIsLoading(false);
            const bootCommands: Command[] = BOOT_MESSAGES.map((msg, i) => ({
              id: `boot-${i}`,
              input: '',
              output: msg.text ? <span className={styles[msg.type]}>{msg.text}</span> : null,
              timestamp: Date.now(),
              path: '~',
            }));

            bootCommands.push({
              id: 'boot-logo',
              input: '',
              output: <pre className={styles.asciiLogo}>{ASCII_LOGO}</pre>,
              timestamp: Date.now(),
              path: '~',
            });

            bootCommands.push({
              id: 'boot-welcome',
              input: '',
              output: (
                <div className={styles.welcomeMessage}>
                  portfolio shell v1.0
                  <br />
                  type 'help' for commands
                </div>
              ),
              timestamp: Date.now(),
              path: '~',
            });

            setCommandHistory(bootCommands);
          }, 200);
          return 100;
        }
        return prev + 10;
      });
    }, 20);

    return () => clearInterval(bootInterval);
  }, []);

  // Mission clock
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMissionTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  React.useEffect(() => {
    if (terminalHistoryRef.current) {
      terminalHistoryRef.current.scrollTop = terminalHistoryRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Inline text content renderer
  const renderInlineText = (file: FileNode): React.ReactNode => {
    const content = file.content || '';
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className={styles.inlineCode}>
              <code>{codeContent.join('\n')}</code>
            </pre>
          );
          codeContent = [];
        }
        inCodeBlock = !inCodeBlock;
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className={styles.inlineH1}>{line.slice(2)}</h1>);
        return;
      }
      if (line.startsWith('## ')) {
        elements.push(<h2 key={index} className={styles.inlineH2}>{line.slice(3)}</h2>);
        return;
      }
      if (line.startsWith('### ')) {
        elements.push(<h3 key={index} className={styles.inlineH3}>{line.slice(4)}</h3>);
        return;
      }

      if (line.startsWith('- ')) {
        elements.push(<li key={index} className={styles.inlineLi}>{line.slice(2)}</li>);
        return;
      }

      if (line.trim() === '') {
        elements.push(<br key={index} />);
        return;
      }

      elements.push(<div key={index} className={styles.inlineText}>{line}</div>);
    });

    return <div className={styles.inlineContent}>{elements}</div>;
  };

  // Inline audio player renderer - uses the ASCII-style player
  const renderInlineAudio = (file: FileNode): React.ReactNode => {
    return <InlineAudioPlayer file={file} />;
  };

  const handleExecute = (customInput?: string) => {
    const input = customInput || inputValue;
    if (!input.trim()) return;

    const result = executeCommand(input, currentPath, fileSystem);

    const newCommand: Command = {
      id: `cmd-${Date.now()}`,
      input,
      output: result.output,
      timestamp: Date.now(),
      path: currentPath,
    };

    if (result.action === 'clear') {
      setCommandHistory([]);
    } else {
      setCommandHistory((prev) => [...prev, newCommand]);
    }

    if (result.newPath) {
      setCurrentPath(result.newPath);
      
      // Auto-run ls after cd to show directory contents
      const lsResult = executeCommand('ls', result.newPath, fileSystem);
      const lsCommand: Command = {
        id: `auto-ls-${Date.now()}`,
        input: 'ls',
        output: lsResult.output,
        timestamp: Date.now(),
        path: result.newPath,
      };
      setCommandHistory((prev) => [...prev, lsCommand]);
    }

    if (result.action === 'open-file' && result.payload) {
      const { type, file } = result.payload;
      
      // PDFs always use popup regardless of noPopup setting
      if (type === 'pdf') {
        setViewer({ type, file, isOpen: true });
      } else if (noPopup) {
        // Render inline when noPopup is enabled
        let inlineOutput: React.ReactNode;
        if (type === 'text') {
          inlineOutput = renderInlineText(file);
        } else if (type === 'audio') {
          inlineOutput = renderInlineAudio(file);
        } else {
          // For other types, fall back to popup
          setViewer({ type, file, isOpen: true });
          return;
        }
        
        // Add inline content as a command output
        const inlineCommand: Command = {
          id: `inline-${Date.now()}`,
          input: '',
          output: inlineOutput,
          timestamp: Date.now(),
          path: currentPath,
        };
        setCommandHistory((prev) => [...prev, inlineCommand]);
      } else {
        // Normal popup behavior
        setViewer({ type, file, isOpen: true });
      }
    }

    if (result.action === 'open-url' && result.payload) {
      window.open(result.payload, '_blank');
    }

    if (result.action === 'show-matrix') {
      setShowMatrix(true);
      // Auto-close matrix after 5 seconds
      setTimeout(() => setShowMatrix(false), 5000);
    }

    setInputValue('');
    setHistoryIndex(-1);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isAudioEnabled && e.key.length === 1) {
      audioManager.playKeystroke(false);
    }
    
    if (e.key === 'Enter') {
      if (isAudioEnabled) {
        audioManager.playKeystroke(true);
      }
      handleExecute();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const inputCommands = commandHistory.filter((c) => c.input);
      if (historyIndex < inputCommands.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(inputCommands[inputCommands.length - 1 - newIndex]?.input || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const inputCommands = commandHistory.filter((c) => c.input);
        setInputValue(inputCommands[inputCommands.length - 1 - newIndex]?.input || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const completions = getCompletions(inputValue, currentPath, fileSystem);
      if (completions.length === 1) {
        const parts = inputValue.split(' ');
        if (parts.length > 1) {
          parts[parts.length - 1] = completions[0];
          setInputValue(parts.join(' '));
        } else {
          setInputValue(completions[0] + ' ');
        }
        setSuggestions([]);
      } else if (completions.length > 1) {
        setSuggestions(completions);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  const handleNavClick = (path: string) => {
    if (path.endsWith('.pdf')) {
      handleExecute(`open ${path}`);
    } else {
      // Use handleExecute which auto-runs ls after cd
      handleExecute(`cd ${path}`);
    }
    setIsMobileMenuOpen(false);
  };

  const activeSection = NAV_SECTIONS.find((s) => currentPath.startsWith(s.path) && s.path !== '~/portfolio/resume.pdf')?.id || 'home';

  const closeViewer = () => {
    setViewer({ type: null, file: null, isOpen: false });
  };

  // Generate context-aware placeholder hints
  const getPlaceholderHint = (): string => {
    const node = findNodeByPath(currentPath, fileSystem);
    if (!node || node.type !== 'directory' || !node.children) {
      return 'type a command...';
    }

    const dirs = node.children.filter((c) => c.type === 'directory');
    const files = node.children.filter((c) => c.type === 'file');

    if (dirs.length > 0 && files.length > 0) {
      const dirName = dirs[0].name;
      const fileName = files[0].name;
      return `try: cd ${dirName}  or  open ${fileName}`;
    } else if (dirs.length > 0) {
      const examples = dirs.slice(0, 2).map((d) => d.name).join(' | ');
      return `try: cd ${examples}`;
    } else if (files.length > 0) {
      const examples = files.slice(0, 2).map((f) => f.name).join(' | ');
      return `try: open ${examples}`;
    }

    return 'type help for commands';
  };

  // Handle clicking on ls output items
  const handleItemClick = (itemName: string) => {
    const cleanName = itemName.replace(/\/$/, ''); // Remove trailing slash
    const node = findNodeByPath(currentPath, fileSystem);
    if (!node || node.type !== 'directory' || !node.children) return;

    const child = node.children.find((c) => c.name === cleanName);
    if (!child) return;

    if (child.type === 'directory') {
      handleExecute(`cd ${cleanName}`);
    } else {
      handleExecute(`open ${cleanName}`);
    }
  };

  // Render clickable ls output
  const renderClickableLsOutput = (output: React.ReactNode): React.ReactNode => {
    if (typeof output !== 'string') return output;

    // Parse the ls output format: "[icon]name    [icon]name ..."
    const items = output.split(/\s{4}/).filter(Boolean);
    
    return (
      <span className={styles.lsOutput}>
        {items.map((item, i) => {
          // Match pattern like [/]name, [~]name, [#]name, [-]name, etc.
          const match = item.match(/^\[(.)\](.+)$/);
          if (match) {
            const icon = `[${match[1]}]`;
            const name = match[2];
            return (
              <span key={i} className={styles.lsItem}>
                <span className={styles.lsIcon}>{icon}</span>
                <span 
                  className={styles.lsName}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(name);
                  }}
                >
                  {name}
                </span>
                {i < items.length - 1 && <span className={styles.lsSpacer}>    </span>}
              </span>
            );
          }
          return <span key={i}>{item}</span>;
        })}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingText}>initializing...</div>
        <div className={styles.progressBarContainer}>
          <BarProgress progress={loadingProgress} fillChar="█" />
        </div>
        <div className={styles.loadingPercent}>{loadingProgress}%</div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container} onClick={handleTerminalClick}>
        {/* Status Bar */}
        <header className={styles.statusBar}>
          <div className={styles.statusLeft}>
            <span>{formatTime(missionTime)}</span>
          </div>
          <div className={styles.statusCenter}>
            luan@portfolio
          </div>
          <div className={styles.statusRight}>
            <span className={styles.statusIndicator}>{currentPath}</span>
            <button
              className={`${styles.audioToggle} ${!isAudioEnabled ? styles.disabled : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                const newState = audioManager.toggle();
                setIsAudioEnabled(newState);
              }}
            >
              {isAudioEnabled ? '[sfx]' : '[---]'}
            </button>
            <button
              className={`${styles.noPopupToggle} ${noPopup ? styles.active : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                const newState = !noPopup;
                setNoPopup(newState);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('noPopup', String(newState));
                }
              }}
            >
              {noPopup ? '[no-popup]' : '[popup]'}
            </button>
            <button
              className={styles.themeToggle}
              onClick={(e) => {
                e.stopPropagation();
                const newState = !isDarkMode;
                setIsDarkMode(newState);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('darkMode', String(newState));
                }
              }}
            >
              {isDarkMode ? '[dark]' : '[light]'}
            </button>
          </div>
        </header>

        {/* Mobile Menu Button */}
        <button
          className={styles.hamburgerButton}
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
        >
          {isMobileMenuOpen ? 'x' : '='}
        </button>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Side Panel */}
          <aside className={`${styles.sidePanel} ${isMobileMenuOpen ? styles.open : ''}`}>
            <div className={styles.panelHeader}>navigation</div>

            <nav className={styles.navButtons}>
              {NAV_SECTIONS.map((section) => (
                <div key={section.id} className={styles.navButtonWrapper}>
                  <button
                    className={`${styles.navButton} ${activeSection === section.id ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavClick(section.path);
                    }}
                    onMouseEnter={() => setHoveredNav(section.id)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    <span className={styles.navIcon}>{section.icon}</span>
                    <span className={styles.navLabel}>{section.label}</span>
                  </button>
                  {hoveredNav === section.id && (
                    <Tooltip className={styles.navTooltip}>
                      {section.hint}
                    </Tooltip>
                  )}
                </div>
              ))}
            </nav>

            <div className={styles.panelFooter}>
              shell v1.0
            </div>
          </aside>

          {/* Terminal Area */}
          <main className={styles.terminalArea}>
            <div className={styles.terminalHistory} ref={terminalHistoryRef}>
              {commandHistory.map((cmd) => (
                <div key={cmd.id} className={styles.commandBlock}>
                  {cmd.input && (
                    <div>
                      <span className={styles.prompt}>{cmd.path}$ </span>
                      <span className={styles.command}>{cmd.input}</span>
                    </div>
                  )}
                  {cmd.output && (
                    <div className={styles.output}>
                      {cmd.input === 'ls' || cmd.input.startsWith('ls ') 
                        ? renderClickableLsOutput(cmd.output)
                        : cmd.output}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Scroll Hint - always visible when there's content */}
            {commandHistory.length > 3 && (
              <div className={styles.scrollHint}>
                [scroll: mouse wheel or trackpad]
              </div>
            )}

            {/* Command Input */}
            <div className={styles.commandInputBar}>
              <span className={styles.promptSymbol}>{currentPath}$</span>
              <div className={styles.inputWrapper}>
                {suggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    {suggestions.map((s) => (
                      <span
                        key={s}
                        className={styles.suggestion}
                        onClick={(e) => {
                          e.stopPropagation();
                          const parts = inputValue.split(' ');
                          if (parts.length > 1) {
                            parts[parts.length - 1] = s;
                            setInputValue(parts.join(' '));
                          } else {
                            setInputValue(s + ' ');
                          }
                          setSuggestions([]);
                          inputRef.current?.focus();
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.commandInput}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={getPlaceholderHint()}
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <span className={styles.cursor} />
              </div>
              <button className={styles.executeButton} onClick={() => handleExecute()}>
                run
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Viewers */}
      {viewer.isOpen && viewer.type === 'text' && viewer.file && (
        <TextViewer file={viewer.file} onClose={closeViewer} />
      )}
      {viewer.isOpen && viewer.type === 'audio' && viewer.file && (
        <AudioPlayer file={viewer.file} onClose={closeViewer} />
      )}
      {viewer.isOpen && viewer.type === 'pdf' && viewer.file && (
        <PDFViewer file={viewer.file} onClose={closeViewer} />
      )}

      {/* Matrix Easter Egg Overlay */}
      {showMatrix && (
        <div className={styles.matrixOverlay} onClick={() => setShowMatrix(false)}>
          <MatrixLoader rows={30} direction="top-to-bottom" mode="katakana" />
          <div className={styles.matrixMessage}>
            wake up...
            <br />
            <span className={styles.matrixHint}>[click to exit]</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Terminal;
