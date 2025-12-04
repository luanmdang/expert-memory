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

Hi! I'm Luan, a Computer Science student passionate about building innovative software and creating music.

## Background
I combine my love for technology with creative expression, building applications that push boundaries while also producing music that moves people.

## What I Do
- [>] Full-stack development
- [~] Music production
- [*] Building impactful projects
- [+] Continuous learning

## Philosophy
I believe in creating things that matter - whether it's code that solves real problems or music that resonates with people. Every project is an opportunity to learn and grow.`,
            },
          ],
        },
        {
          name: 'experience',
          type: 'directory',
          path: '~/portfolio/experience',
          children: [
            {
              name: 'internships.txt',
              type: 'file',
              path: '~/portfolio/experience/internships.txt',
              metadata: { extension: 'txt' },
              content: `# Work Experience

## Software Engineering Intern
**Company Name** | Summer 2024
- Built and deployed production features
- Collaborated with cross-functional teams
- Improved system performance by X%

## Previous Experience
- Research Assistant
- Teaching Assistant
- Open Source Contributor`,
            },
            {
              name: 'research.txt',
              type: 'file',
              path: '~/portfolio/experience/research.txt',
              metadata: { extension: 'txt' },
              content: `# Research Experience

## Research Project Title
**Lab/Institution** | 2023-2024
- Conducted research on [topic]
- Published findings in [venue]
- Collaborated with leading researchers`,
            },
            {
              name: 'leadership.txt',
              type: 'file',
              path: '~/portfolio/experience/leadership.txt',
              metadata: { extension: 'txt' },
              content: `# Leadership & Activities

## Club/Organization
**Position** | 2022-Present
- Led team of X members
- Organized events with Y attendees
- Achieved Z outcomes`,
            },
          ],
        },
        {
          name: 'projects',
          type: 'directory',
          path: '~/portfolio/projects',
          children: [
            {
              name: 'project1',
              type: 'directory',
              path: '~/portfolio/projects/project1',
              metadata: {
                tags: ['React', 'TypeScript', 'Node.js'],
                githubUrl: 'https://github.com/username/project1',
                demoUrl: 'https://project1.demo.com',
                images: [],
              },
              children: [
                {
                  name: 'README.md',
                  type: 'file',
                  path: '~/portfolio/projects/project1/README.md',
                  metadata: { extension: 'md' },
                  content: `# Project One

## Description
A full-stack web application that does amazing things.

## Features
- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Tech Stack
- Frontend: React, TypeScript
- Backend: Node.js, Express
- Database: PostgreSQL

## Impact
- 1000+ users
- 99.9% uptime
- Featured in [publication]`,
                },
              ],
            },
            {
              name: 'project2',
              type: 'directory',
              path: '~/portfolio/projects/project2',
              metadata: {
                tags: ['Python', 'Machine Learning', 'TensorFlow'],
                githubUrl: 'https://github.com/username/project2',
              },
              children: [
                {
                  name: 'README.md',
                  type: 'file',
                  path: '~/portfolio/projects/project2/README.md',
                  metadata: { extension: 'md' },
                  content: `# Project Two

## Description
An ML-powered application for solving complex problems.

## Features
- AI-driven predictions
- Real-time processing
- Intuitive interface

## Tech Stack
- Python, TensorFlow
- FastAPI
- Docker`,
                },
              ],
            },
            {
              name: 'project3',
              type: 'directory',
              path: '~/portfolio/projects/project3',
              metadata: {
                tags: ['Rust', 'Systems', 'Performance'],
                githubUrl: 'https://github.com/username/project3',
              },
              children: [
                {
                  name: 'README.md',
                  type: 'file',
                  path: '~/portfolio/projects/project3/README.md',
                  metadata: { extension: 'md' },
                  content: `# Project Three

## Description
A high-performance systems project.

## Features
- Blazing fast execution
- Memory safe
- Zero dependencies

## Tech Stack
- Rust
- WebAssembly`,
                },
              ],
            },
          ],
        },
        {
          name: 'education',
          type: 'directory',
          path: '~/portfolio/education',
          children: [
            {
              name: 'university.txt',
              type: 'file',
              path: '~/portfolio/education/university.txt',
              metadata: { extension: 'txt' },
              content: `# Education

## Stanford University
**B.S. Computer Science** | Expected 2027

### Relevant Coursework
- CS 106B: Programming Abstractions
- CS 107: Computer Organization & Systems
- CS 109: Probability for Computer Scientists
- CS 161: Design and Analysis of Algorithms
- CS 229: Machine Learning

### GPA: X.XX`,
            },
            {
              name: 'coursework.txt',
              type: 'file',
              path: '~/portfolio/education/coursework.txt',
              metadata: { extension: 'txt' },
              content: `# Notable Coursework

## Computer Science
- Data Structures & Algorithms
- Machine Learning
- Systems Programming
- Database Systems
- Computer Networks

## Mathematics
- Linear Algebra
- Probability & Statistics
- Discrete Mathematics`,
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
- Rust
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
- Music Production (FL Studio, Ableton)
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

Email: your.email@stanford.edu

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
                url: 'https://linkedin.com/in/username',
              },
              content: 'https://linkedin.com/in/username',
            },
            {
              name: 'github.url',
              type: 'file',
              path: '~/portfolio/contact/github.url',
              metadata: {
                extension: 'url',
                url: 'https://github.com/username',
              },
              content: 'https://github.com/username',
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

