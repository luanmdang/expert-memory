import { ParsedCommand, CommandResult, FileNode } from '../types';
import { findNodeByPath, resolvePath, getFileIcon, getParentPath } from '../data/fileSystem';
import React from 'react';

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  const command = parts[0]?.toLowerCase() || '';
  const args: string[] = [];
  const flags: Record<string, boolean> = {};

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith('--')) {
      flags[part.slice(2)] = true;
    } else if (part.startsWith('-')) {
      for (const char of part.slice(1)) {
        flags[char] = true;
      }
    } else {
      args.push(part);
    }
  }

  return { command, args, flags };
}

export function executeCommand(
  input: string,
  currentPath: string,
  fileSystem: FileNode
): CommandResult {
  const { command, args, flags } = parseCommand(input);

  switch (command) {
    case 'ls':
      return handleLs(args, currentPath, fileSystem, flags);
    case 'cd':
      return handleCd(args, currentPath, fileSystem);
    case 'cat':
    case 'open':
      return handleOpen(args, currentPath, fileSystem);
    case 'help':
      return handleHelp();
    case 'clear':
      return { output: null, action: 'clear' };
    case 'pwd':
      return { output: currentPath };
    case 'whoami':
      return handleWhoami();
    case 'history':
      return { output: 'Use ↑/↓ arrow keys to navigate command history.' };
    case 'matrix':
      return { output: null, action: 'show-matrix' };
    case 'tree':
      return handleTree(args, currentPath, fileSystem);
    case 'sudo':
      return { output: '[!] Permission denied. Nice try though.' };
    case 'hack':
      return handleHack();
    case 'coffee':
      return { output: '[*] coffee.exe loaded. energy +100%' };
    case 'starwars':
      return handleStarWars();
    case 'neofetch':
      return handleNeofetch();
    case 'styling':
    case 'srcl':
      return {
        output: 'styled using the amazing website www.sacred.computer!',
      };
    case '':
      return { output: null };
    default:
      return {
        output: `Command not found: ${command}. Type 'help' for available commands.`,
      };
  }
}

function handleLs(
  args: string[],
  currentPath: string,
  fileSystem: FileNode,
  flags: Record<string, boolean>
): CommandResult {
  const targetPath = args[0] ? resolvePath(currentPath, args[0]) : currentPath;
  const node = findNodeByPath(targetPath, fileSystem);

  if (!node) {
    return { output: `ls: cannot access '${args[0] || targetPath}': No such file or directory` };
  }

  if (node.type === 'file') {
    return { output: `${getFileIcon(node)} ${node.name}` };
  }

  if (!node.children || node.children.length === 0) {
    return { output: '(empty directory)' };
  }

  const items = node.children.map((child) => ({
    icon: getFileIcon(child),
    name: child.name + (child.type === 'directory' ? '/' : ''),
    isDir: child.type === 'directory',
  }));

  // Sort: directories first, then files
  items.sort((a, b) => {
    if (a.isDir && !b.isDir) return -1;
    if (!a.isDir && b.isDir) return 1;
    return a.name.localeCompare(b.name);
  });

  if (flags.l) {
    // Long format
    const output = items.map((item) => `${item.icon}${item.name}`).join('\n');
    return { output };
  }

  // Grid format (no space between icon and name for cleaner look)
  const output = items.map((item) => `${item.icon}${item.name}`).join('    ');
  return { output };
}

function handleCd(args: string[], currentPath: string, fileSystem: FileNode): CommandResult {
  if (args.length === 0 || args[0] === '~') {
    return { output: null, newPath: '~/portfolio' };
  }

  const targetPath = resolvePath(currentPath, args[0]);
  const node = findNodeByPath(targetPath, fileSystem);

  if (!node) {
    return { output: `cd: ${args[0]}: No such file or directory` };
  }

  if (node.type !== 'directory') {
    return { output: `cd: ${args[0]}: Not a directory` };
  }

  return { output: null, newPath: node.path };
}

function handleOpen(args: string[], currentPath: string, fileSystem: FileNode): CommandResult {
  if (args.length === 0) {
    return { output: 'Usage: open <file>' };
  }

  const targetPath = resolvePath(currentPath, args[0]);
  const node = findNodeByPath(targetPath, fileSystem);

  if (!node) {
    return { output: `open: ${args[0]}: No such file or directory` };
  }

  if (node.type === 'directory') {
    return { output: null, newPath: node.path };
  }

  const ext = node.metadata?.extension;

  // Handle URL files
  if (ext === 'url' && node.metadata?.url) {
    return {
      output: `Opening ${node.metadata.url}...`,
      action: 'open-url',
      payload: node.metadata.url,
    };
  }

  // Handle PDF files
  if (ext === 'pdf') {
    return {
      output: `Opening ${node.name}...`,
      action: 'open-file',
      payload: { type: 'pdf', file: node },
    };
  }

  // Handle audio files
  if (ext === 'mp3' || ext === 'wav' || ext === 'ogg') {
    return {
      output: `Loading audio player for ${node.name}...`,
      action: 'open-file',
      payload: { type: 'audio', file: node },
    };
  }

  // Handle text/markdown files
  if (ext === 'txt' || ext === 'md') {
    return {
      output: null,
      action: 'open-file',
      payload: { type: 'text', file: node },
    };
  }

  // Handle images
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
    return {
      output: `Opening image ${node.name}...`,
      action: 'open-file',
      payload: { type: 'image', file: node },
    };
  }

  return { output: `Cannot open ${node.name}: Unknown file type` };
}

function handleHelp(): CommandResult {
  const helpText = `usage:
  ls [dir]     list directory
  cd <dir>     change directory
  open <file>  open file
  cat <file>   print file
  tree [dir]   show tree view
  pwd          print path
  clear        clear screen
  styling      site credits
  help         this message

navigation:
  ↑/↓          history
  tab          autocomplete

paths:
  ~/portfolio/about
  ~/portfolio/experience
  ~/portfolio/projects
  ~/portfolio/education
  ~/portfolio/music
  ~/portfolio/skills
  ~/portfolio/contact`;

  return { output: helpText };
}

function handleWhoami(): CommandResult {
  return { output: `luan
cs student / developer / producer` };
}

function handleTree(args: string[], currentPath: string, fileSystem: FileNode): CommandResult {
  const targetPath = args[0] ? resolvePath(currentPath, args[0]) : currentPath;
  const node = findNodeByPath(targetPath, fileSystem);

  if (!node) {
    return { output: `tree: ${args[0] || targetPath}: No such directory` };
  }

  if (node.type !== 'directory') {
    return { output: `tree: ${node.name}: Not a directory` };
  }

  const lines: string[] = [node.name];
  
  function buildTree(node: FileNode, prefix: string, isLast: boolean): void {
    if (!node.children) return;
    
    const children = [...node.children].sort((a, b) => {
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });

    children.forEach((child, index) => {
      const isLastChild = index === children.length - 1;
      const connector = isLastChild ? '└── ' : '├── ';
      const icon = child.type === 'directory' ? '[/]' : getFileIcon(child);
      lines.push(`${prefix}${connector}${icon}${child.name}`);
      
      if (child.type === 'directory' && child.children) {
        const newPrefix = prefix + (isLastChild ? '    ' : '│   ');
        buildTree(child, newPrefix, isLastChild);
      }
    });
  }

  buildTree(node, '', true);
  return { output: lines.join('\n') };
}

function handleHack(): CommandResult {
  return { output: `access denied` };
}

function handleStarWars(): CommandResult {
  return { output: `a long time ago...` };
}

function handleNeofetch(): CommandResult {
  return {
    output: `luan@portfolio
os: shell v1.0
uptime: ${Math.floor(Date.now() / 1000) % 86400}s`,
  };
}

// Tab completion helper
export function getCompletions(
  partial: string,
  currentPath: string,
  fileSystem: FileNode
): string[] {
  const { command, args } = parseCommand(partial);
  
  // Command completion
  if (args.length === 0 && !partial.includes(' ')) {
    const commands = ['ls', 'cd', 'open', 'cat', 'help', 'clear', 'pwd', 'history'];
    return commands.filter((cmd) => cmd.startsWith(command));
  }

  // Path completion
  const pathPart = args[args.length - 1] || '';
  const basePath = pathPart.includes('/') 
    ? resolvePath(currentPath, pathPart.substring(0, pathPart.lastIndexOf('/') + 1))
    : currentPath;
  const searchTerm = pathPart.includes('/')
    ? pathPart.substring(pathPart.lastIndexOf('/') + 1)
    : pathPart;

  const node = findNodeByPath(basePath, fileSystem);
  if (!node || node.type !== 'directory' || !node.children) {
    return [];
  }

  return node.children
    .filter((child) => child.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
    .map((child) => {
      const prefix = pathPart.includes('/') 
        ? pathPart.substring(0, pathPart.lastIndexOf('/') + 1)
        : '';
      return prefix + child.name + (child.type === 'directory' ? '/' : '');
    });
}

