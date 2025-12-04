import { FileNode } from '../types';

// MP3 files in /public/luan-things/mp3s/
// Format: "NAME BPM ARTIST.mp3" - just drop files here and they auto-populate
const MP3_FILES = [
  'BEAMER 140 LUSKII COHBATT.mp3',
  'memories 134 lexohh luskii.mp3',
  'NOBODY 127 LUSKII.mp3',
];

// Parse MP3 filename into track data
function parseMp3Filename(filename: string): FileNode {
  // Pattern: "NAME BPM ARTIST.mp3"
  const nameWithoutExt = filename.replace('.mp3', '');
  const parts = nameWithoutExt.split(' ');
  
  // First part is track name
  const name = parts[0].toLowerCase();
  
  // Second part is BPM (if it's a number)
  const bpmIndex = parts.findIndex((p, i) => i > 0 && /^\d+$/.test(p));
  const bpm = bpmIndex > 0 ? parseInt(parts[bpmIndex], 10) : undefined;
  
  // Remaining parts are artist names (after BPM)
  const artists = bpmIndex > 0 ? parts.slice(bpmIndex + 1).join(' ') : parts.slice(1).join(' ');
  
  return {
    name: `${name}.mp3`,
    type: 'file',
    path: `~/portfolio/music/tracks/${name}.mp3`,
    metadata: {
      extension: 'mp3',
      audioUrl: `/luan-things/mp3s/${filename}`,
      bpm: bpm,
      tags: artists ? [artists.toUpperCase()] : ['INSTRUMENTAL'],
    },
    content: `Audio file: ${name}.mp3`,
  };
}

// Generate tracks from MP3 files
const generateTracks = (): FileNode[] => {
  return MP3_FILES.map(parseMp3Filename);
};

// File system structure for the portfolio
export const fileSystem: FileNode = {
  name: 'home',
  type: 'directory',
  path: '~',
  children: [
    {
      name: 'portfolio',
      type: 'directory',
      path: '~/portfolio',
      children: [
        {
          name: 'about',
          type: 'directory',
          path: '~/portfolio/about',
          children: [
            {
              name: 'bio.txt',
              type: 'file',
              path: '~/portfolio/about/bio.txt',
              metadata: { extension: 'txt' },
              content: `# About Me

Hi! I'm Luan, a CS student passionate about building innovative software and music production.

## Background
CS @ Stanford University (BS '27)
Prev: Zoom Inc., Neurotrack, Chaudhuri Lab, Stanford IAIS, Thrive Scholars, Strategic Risk Solutions, and more.

## What I Do
- [>] Full-stack development
- [>] AI-powered software
- [>] Machine Learning
- [*] Building impactful and creative projects
- [+] Learning the latest technologies

`
            },
            {
              name: 'coursework.txt',
              type: 'file',
              path: '~/portfolio/about/coursework.txt',
              metadata: { extension: 'txt' },
              content: `# Relevant Coursework

## Computer Science
- Computer Organization and Systems
- Artificial Intelligence Principles and Techniques
- Design and Analysis of Algorithms

## Mathematics
- Linear Algebra
- Multivariable Calculus`,
            },
            // Project directories
            {
              name: 'Notch-prompter.url',
              type: 'file',
              path: '~/portfolio/about/Notch-prompter.url',
              metadata: {
                extension: 'url',
                url: 'https://github.com/luanmdang/notch-prompter',
              },
              content: 'https://github.com/luanmdang/notch-prompter',
            },
            {
              name: 'dang-wire.url',
              type: 'file',
              path: '~/portfolio/about/dang-wire.url',
              metadata: {
                extension: 'url',
                url: 'https://github.com/luanmdang/notch-prompter',
              },
              content: 'https://github.com/luanmdang/notch-prompter',
            },
          ],
        },
        {
          name: 'music',
          type: 'directory',
          path: '~/portfolio/music',
          children: [
            {
              name: 'discography.txt',
              type: 'file',
              path: '~/portfolio/music/discography.txt',
              metadata: { extension: 'txt' },
              content: `# Music Production

As LUSKII, I produce hip-hop beats and instrumentals.

## Style
- Hip-Hop / Trap
- Melodic beats
- Hard-hitting drums

## Streaming
Find my music on all major platforms.

## Collaborations
Open to working with artists and producers.`,
            },
            {
              name: 'tracks',
              type: 'directory',
              path: '~/portfolio/music/tracks',
              children: generateTracks(),
            },
          ],
        },
        {
          name: 'skills',
          type: 'directory',
          path: '~/portfolio/skills',
          children: [
            {
              name: 'tech_stack.txt',
              type: 'file',
              path: '~/portfolio/skills/tech_stack.txt',
              metadata: { extension: 'txt' },
              content: `# Technical Skills

## Languages
- TypeScript / JavaScript
- Python
- C / C++
- SQL

## Frontend
- React / Next.js
- HTML / CSS / SCSS
- Tailwind CSS
- Framer Motion

## Backend
- Node.js / Express
- FastAPI
- PostgreSQL / MongoDB
- Redis

## DevOps & Tools
- Git / GitHub
- Docker
- AWS / GCP
- CI/CD

## Other
- Music Production (FL Studio)
- Video Editing
- Design (Figma)`,
            },
          ],
        },
        {
          name: 'contact',
          type: 'directory',
          path: '~/portfolio/contact',
          children: [
            {
              name: 'email.txt',
              type: 'file',
              path: '~/portfolio/contact/email.txt',
              metadata: { extension: 'txt' },
              content: `# Contact

Email: luandang2023@gmail.com

Feel free to reach out for:
- Job opportunities
- Collaborations
- Questions about my work
- Music production inquiries`,
            },
            {
              name: 'linkedin.url',
              type: 'file',
              path: '~/portfolio/contact/linkedin.url',
              metadata: {
                extension: 'url',
                url: 'https://www.linkedin.com/in/luan-dang/',
              },
              content: 'https://www.linkedin.com/in/luan-dang/',
            },
            {
              name: 'github.url',
              type: 'file',
              path: '~/portfolio/contact/github.url',
              metadata: {
                extension: 'url',
                url: 'https://github.com/luanmdang',
              },
              content: 'https://github.com/luanmdang',
            },
          ],
        },
        {
          name: 'resume.pdf',
          type: 'file',
          path: '~/portfolio/resume.pdf',
          metadata: {
            extension: 'pdf',
            url: '/luan-things/pdfs/Luan Dang 2027 Internship Resume.pdf',
          },
          content: 'PDF Resume',
        },
      ],
    },
  ],
};

// Helper function to find a node by path
export function findNodeByPath(path: string, root: FileNode = fileSystem): FileNode | null {
  // Normalize path
  const normalizedPath = path.replace(/\/+$/, ''); // Remove trailing slashes
  
  if (normalizedPath === '~' || normalizedPath === '') {
    return root;
  }

  const parts = normalizedPath.split('/').filter(Boolean);
  let current: FileNode | null = root;

  for (const part of parts) {
    if (part === '~') continue;
    if (!current || current.type !== 'directory' || !current.children) {
      return null;
    }
    current = current.children.find((child) => child.name === part) || null;
  }

  return current;
}

// Helper function to get parent path
export function getParentPath(path: string): string {
  if (path === '~' || path === '~/portfolio') {
    return '~';
  }
  const parts = path.split('/').filter(Boolean);
  parts.pop();
  return parts.length === 0 ? '~' : parts.join('/');
}

// Helper function to resolve a path (handles .., ., ~)
export function resolvePath(currentPath: string, targetPath: string): string {
  if (targetPath === '~' || targetPath === '') {
    return '~';
  }

  if (targetPath.startsWith('~/')) {
    return targetPath;
  }

  if (targetPath === '..') {
    return getParentPath(currentPath);
  }

  if (targetPath.startsWith('../')) {
    const parentPath = getParentPath(currentPath);
    const remainingPath = targetPath.slice(3);
    return resolvePath(parentPath, remainingPath);
  }

  if (targetPath.startsWith('./')) {
    targetPath = targetPath.slice(2);
  }

  // Relative path
  const basePath = currentPath === '~' ? '~' : currentPath;
  return `${basePath}/${targetPath}`;
}

// Get icon for file type - ASCII symbols only
export function getFileIcon(node: FileNode): string {
  if (node.type === 'directory') {
    return '[/]';
  }

  const ext = node.metadata?.extension;
  switch (ext) {
    case 'mp3':
    case 'wav':
    case 'ogg':
      return '[~]';
    case 'pdf':
      return '[#]';
    case 'url':
      return '[@]';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return '[=]';
    case 'md':
      return '[*]';
    default:
      return '[-]';
  }
}

