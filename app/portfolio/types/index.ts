// ISS Portfolio Type Definitions

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  path: string;
  metadata?: {
    extension?: string;
    url?: string;
    audioUrl?: string;
    images?: string[];
    githubUrl?: string;
    demoUrl?: string;
    tags?: string[];
    bpm?: number;
    duration?: string;
    coverArt?: string;
  };
  children?: FileNode[];
}

export interface Command {
  id: string;
  input: string;
  output: React.ReactNode;
  timestamp: number;
  path: string;
}

export interface TerminalState {
  currentPath: string;
  commandHistory: Command[];
  isAudioEnabled: boolean;
  activeSection: string;
  isLoading: boolean;
}

export type CommandHandler = (
  args: string[],
  currentPath: string,
  fileSystem: FileNode
) => CommandResult;

export interface CommandResult {
  output: React.ReactNode;
  newPath?: string;
  action?: 'open-file' | 'open-url' | 'clear' | 'download';
  payload?: any;
}

export interface ParsedCommand {
  command: string;
  args: string[];
  flags: Record<string, boolean>;
}

export type ViewerType = 'text' | 'project' | 'image' | 'audio' | 'pdf' | null;

export interface ViewerState {
  type: ViewerType;
  file: FileNode | null;
  isOpen: boolean;
}

