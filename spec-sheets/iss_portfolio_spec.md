# ISS Control Panel Portfolio - Complete Implementation Specification

## 1. VISUAL DESIGN SYSTEM

### 1.1 Color Palette
```
Primary Colors:
- Background: #0a0e1a (deep space black)
- Panel Background: #1a1f2e (dark blue-gray metallic)
- Panel Accent: #2a3040 (lighter metallic)
- Primary Text: #e8d4a0 (warm amber CRT glow)
- Secondary Text: #a0b8d0 (cool blue-white)
- Accent Blue: #4a90e2 (ISS display blue)
- Warning Orange: #ff8c42
- Success Green: #5cd65c
- Error Red: #ff4757

Metallic Effects:
- Rivet Color: #6a7080
- Panel Edge: #3a4050
- Button Base: #2d3442
- Button Pressed: #1d2432
```

### 1.2 Typography
```
Primary Font: "IBM Plex Mono" (terminal feel)
Fallback: "Courier New", monospace
Sizes:
- Terminal Text: 16px
- Headings: 24px bold
- Labels: 12px
- Status Text: 14px
```

### 1.3 Visual Effects
- **CRT Scan Lines**: Horizontal lines at 2px intervals, 0.05 opacity
- **Phosphor Glow**: text-shadow: 0 0 5px currentColor, 0 0 10px currentColor
- **Screen Flicker**: Subtle animation (0.5s intervals, 98-100% opacity)
- **Panel Texture**: Subtle noise/grain overlay at 3% opacity
- **Vignette**: Radial gradient from center to edges for depth

---

## 2. LAYOUT ARCHITECTURE

### 2.1 Overall Structure
```
┌─────────────────────────────────────────────────────┐
│  Status Bar (Top, 40px height)                      │
├─────────┬───────────────────────────────────────────┤
│         │                                           │
│  Side   │         Main Terminal View                │
│  Panel  │         (Scrollable Content Area)         │
│  (20%)  │                                           │
│         │                                           │
│         ├───────────────────────────────────────────┤
│         │  Command Input Bar (60px height)          │
└─────────┴───────────────────────────────────────────┘
```

### 2.2 Status Bar Components (Fixed Top)
**Left Section:**
- Mission clock (counting up from page load)
- Format: `MISSION TIME: 00:00:15`

**Center Section:**
- Page title: `ISS TERMINAL v2.1 - [YOUR NAME] PORTFOLIO SYSTEM`

**Right Section:**
- System status indicators:
  - `[COMMS: ONLINE]` (green)
  - `[POWER: 98%]` (blue)
  - `[TEMP: OPTIMAL]` (green)
- Audio toggle button: `[🔊 SFX]` / `[🔇 SFX]`

### 2.3 Side Panel (Physical Control Panel)
**Appearance:**
- Dark metallic texture with rivets in corners
- Subtle 3D beveled edges
- Warning stripe at top (yellow/black diagonal)
- Label: "NAVIGATION CONTROL"

**Button Layout (Vertical Stack):**
Each button styled as physical switch:
```
┌─────────────────┐
│   ▼ HOME        │ ← Lit indicator when active
├─────────────────┤
│   ▼ ABOUT       │
├─────────────────┤
│   ▼ EXPERIENCE  │
├─────────────────┤
│   ▼ PROJECTS    │
├─────────────────┤
│   ▼ EDUCATION   │
├─────────────────┤
│   ▼ MUSIC       │
├─────────────────┤
│   ▼ CONTACT     │
├─────────────────┤
│   ▼ DOWNLOAD    │
│     RESUME      │
└─────────────────┘
```

**Button Design:**
- Base: Raised metallic button with gradient
- Hover: Subtle glow + brightness increase
- Active/Current: Blue LED indicator (◉) next to label
- Click: Brief depression animation (2px down, 100ms)
- Label: Small engraved text above button

**Additional Panel Elements:**
- Small ventilation grilles (decorative)
- Warning label stickers: "AUTHORIZED ACCESS ONLY", "HANDLE WITH CARE"
- Screw/rivet details in corners
- Faint panel number: "PANEL-7A"

---

## 3. TERMINAL SYSTEM

### 3.1 File System Structure
```
/home/portfolio/
├── about/
│   ├── bio.txt
│   └── photo.jpg
├── experience/
│   ├── internships.txt
│   ├── research.txt
│   └── leadership.txt
├── projects/
│   ├── project1/
│   │   ├── README.md
│   │   ├── screenshots/
│   │   └── github_link.url
│   ├── project2/
│   └── project3/
├── education/
│   ├── stanford.txt
│   └── coursework.txt
├── music/
│   ├── discography.txt
│   ├── tracks/
│   │   ├── beat1.mp3
│   │   ├── beat2.mp3
│   │   └── instrumental1.mp3
│   └── covers/
│       └── artwork1.jpg
├── skills/
│   └── tech_stack.txt
├── contact/
│   ├── email.txt
│   ├── linkedin.url
│   └── github.url
└── resume.pdf
```

### 3.2 Command System

**Supported Commands:**

1. **`ls [directory]`**
   - Lists contents of current or specified directory
   - Shows file/folder icons: 📁 for directories, 📄 for files, 🎵 for audio
   - Color codes: directories in blue, files in amber, executables in green

2. **`cd <directory>`**
   - Changes to specified directory
   - Supports: `cd ..` (go up), `cd ~` (go home), `cd /path/to/dir`
   - Updates prompt to show current path

3. **`open <file/folder>`**
   - Opens files in appropriate viewer
   - For folders: equivalent to `cd`
   - For text files: displays content in terminal with syntax highlighting
   - For URLs: opens in new tab
   - For images: displays in modal overlay
   - For audio: opens inline audio player
   - For PDFs: opens in modal with PDF viewer

4. **`help`**
   - Displays available commands with descriptions
   - Shows keyboard shortcuts
   - Example usage for each command

5. **`clear`**
   - Clears terminal history

6. **`cat <file>`**
   - Displays file contents (alternative to open for text files)

7. **`whoami`** (Easter egg)
   - Displays ASCII art + fun bio snippet

8. **`history`**
   - Shows command history

**Tab Completion:**
- Pressing TAB completes partially typed commands
- Pressing TAB on directory paths shows available options
- Shows suggestions in dim amber below cursor

### 3.3 Terminal Display

**Prompt Format:**
```
user@iss-terminal:~/portfolio/projects$ _
```

**Output Styling:**
- Command input: Bright amber with cursor blink
- Command output: Slightly dimmer amber
- Errors: Red text with `[ERROR]` prefix
- Success messages: Green text with `[OK]` prefix
- File listings: Formatted in columns with proper spacing

**Command History:**
- All executed commands visible in scrollable area
- Clicking on previous command re-executes it
- Scrollback buffer: unlimited during session
- Each command block shows:
  ```
  user@iss-terminal:~/portfolio$ ls
  📁 about/    📁 experience/    📁 projects/    📄 resume.pdf
  ```

### 3.4 Command Input Bar (Fixed Bottom)

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│ > [INPUT FIELD with blinking cursor]      [EXECUTE] ▶ │
└────────────────────────────────────────────────────────┘
```

**Features:**
- Auto-focus on page load
- Keyboard shortcuts: Enter to execute, Up/Down for history, Tab for completion
- Character typing animation (instant for user typing, animated for clicked commands)
- Mechanical keyboard click sound on each keystroke (toggleable)
- Input validation with error shake animation for invalid commands

---

## 4. CONTENT VIEWERS

### 4.1 Text File Viewer
When opening .txt or .md files:
```
┌─────────────────────────────────────────────┐
│  📄 bio.txt                          [CLOSE] │
├─────────────────────────────────────────────┤
│                                             │
│  [Content rendered with markdown support]   │
│  - Headings in bright amber                 │
│  - Lists with proper indentation            │
│  - Links clickable and underlined           │
│  - Code blocks with syntax highlighting     │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

### 4.2 Project Viewer
When opening project folders:
```
┌─────────────────────────────────────────────────────┐
│  📁 Project Name                            [CLOSE] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Screenshot carousel at top]                       │
│  ← [Image 1 of 3] →                                │
│                                                     │
│  DESCRIPTION:                                       │
│  [Project description text]                         │
│                                                     │
│  TECH STACK:                                        │
│  [React] [Node.js] [MongoDB] [AWS]                 │
│                                                     │
│  LINKS:                                             │
│  [⭐ View on GitHub] [🌐 Live Demo]                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.3 Audio Player (Music Section)
When opening audio files:
```
┌─────────────────────────────────────────────────────┐
│  🎵 beat_name.mp3                           [CLOSE] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Album Artwork Thumbnail]                          │
│                                                     │
│  ┌─────────────────────────────────────────┐       │
│  │     [Waveform Visualization]            │       │
│  │     ▁▂▃▅▇▅▃▂▁▂▃▅▇▅▃▂▁                    │       │
│  └─────────────────────────────────────────┘       │
│                                                     │
│  [◄◄] [▶/⏸] [►►]        00:45 / 03:23             │
│                                                     │
│  ───────────●─────────  [🔊 75%]                   │
│  ^ Scrubber (clickable waveform for seeking)       │
│                                                     │
│  TAGS: [Hip-Hop] [Instrumental] [140 BPM]         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Waveform Features:**
- Pre-rendered waveform visualization using Web Audio API
- Scrubbing: Click anywhere on waveform to jump to that position
- Progress indicator moves along waveform during playback
- Hover shows timestamp preview
- Color: Amber gradient with blue highlights for played sections

**Music Section Main Page:**
When executing `cd music` and `ls`:
```
DISCOGRAPHY
───────────
📁 singles/
📁 eps/
📁 beats/

[Shows grid of tracks with artwork thumbnails]

┌────────┐ ┌────────┐ ┌────────┐
│ [Art1] │ │ [Art2] │ │ [Art3] │
│ Beat 1 │ │ Beat 2 │ │ Beat 3 │
│ 3:45   │ │ 2:30   │ │ 4:12   │
└────────┘ └────────┘ └────────┘
```

### 4.4 Resume Viewer
When clicking download button or opening resume.pdf:
- Modal overlay with embedded PDF viewer
- Download button within modal
- Side-by-side: PDF preview on left, download button on right
- Zoom controls
- Close button

---

## 5. INTERACTIONS & ANIMATIONS

### 5.1 Click Interactions

**Physical Buttons (Side Panel):**
1. Hover: Button glows, cursor changes to pointer
2. Click down: Button depresses 2px, brightness decreases
3. Click release: Button springs back, command executes
4. Duration: 100ms total

**Terminal Clicks:**
- Clicking previous commands or file names: Re-execute/open with silent execution
- Adds command to history even though it was clicked
- Brief highlight flash on clicked element (200ms)

### 5.2 Command Execution Animation
1. User types command or clicks element
2. If clicked: Command appears in input field instantly
3. Press Enter or auto-execute after click
4. Input moves up into history area with slide animation (300ms ease-out)
5. Loading indicator appears if needed: `[PROCESSING...]` with animated dots
6. Result streams in character-by-character for text (50ms per line)
7. For modals/overlays: Fade in (300ms) with slight scale up (0.95 → 1.0)

### 5.3 Page Load Animation
1. Black screen with loading text: `INITIALIZING ISS TERMINAL SYSTEM...`
2. Progress bar in amber (1 second)
3. Text stream effect: ASCII art logo appears line by line
4. Terminal boots up with system messages:
   ```
   [OK] File system mounted
   [OK] Display drivers loaded
   [OK] Audio system initialized
   [OK] Navigation panel online
   
   Welcome to the ISS Portfolio Terminal
   Type 'help' for available commands
   
   user@iss-terminal:~$ _
   ```
5. UI fades in (500ms)

### 5.4 Transition Effects
- Page navigation: Brief static/interference effect (100ms)
- File opening: Slide up from bottom
- Modal closing: Fade out + scale down (250ms)
- Directory changes: Terminal content fades out/in (200ms)

### 5.5 Background Animation
**Space Background:**
- Slowly moving starfield (subtle parallax, 3 layers at different speeds)
- Stars: Small white dots at varying opacities
- Movement: Very slow drift (complete pan over 5 minutes)
- Optional: Occasional shooting star (1 every 30 seconds, quick streak across screen)

**If Earth Rotation is Performant:**
- Use Three.js with optimized texture
- Earth in bottom-right corner, 25% of screen height
- Rotation: 1 full rotation every 2 minutes
- Soft glow around Earth edge
- Cloud layer with slight transparency
- Fallback: Static Earth image if performance drops below 50fps

---

## 6. MOBILE RESPONSIVE DESIGN

### 6.1 Layout Changes (< 768px)
```
┌─────────────────────────┐
│  Hamburger Menu [≡]     │  ← Collapsed status bar
├─────────────────────────┤
│                         │
│  Terminal View          │
│  (Full width)           │
│                         │
├─────────────────────────┤
│  [Toggle Terminal] 🖥️   │  ← Button to show/hide
└─────────────────────────┘
```

**Side Panel Becomes:**
- Hamburger menu (top-left)
- Opens as slide-in drawer from left
- Touch-friendly button sizes (minimum 44px height)
- Tap to execute commands

**Terminal Input:**
- Hidden by default
- Toggle button shows/hides terminal input
- Virtual keyboard appears for typing
- Or use button menu for common commands

### 6.2 Touch Interactions
- Swipe left: Open navigation drawer
- Swipe right: Close drawer
- Tap files/commands: Execute
- Long press: Show context menu
- Pinch to zoom: On images/PDF viewer

### 6.3 Audio Player Mobile
- Compact view
- Waveform scales to width
- Controls stack vertically if needed
- Scrubbing via touch drag on waveform

---

## 7. SOUND DESIGN

### 7.1 Mechanical Keyboard Sounds
**Implementation:**
- Use Web Audio API for low-latency playback
- Multiple keystroke samples (5-7 variations) played randomly
- Slight pitch variation (±5%) for realism
- Volume: 30% of max by default
- Sounds: Cherry MX Blue style clicks

**Sound Files Needed:**
- `keystroke1.mp3` through `keystroke7.mp3`
- `enter_key.mp3` (slightly different sound for Enter)
- `space_key.mp3` (lower pitch for spacebar)

**Toggle Control:**
- Button in status bar: `[🔊 SFX]`
- Toggles to `[🔇 SFX]` when off
- Persists preference in localStorage
- Smooth fade out when toggling off

---

## 8. TECHNICAL IMPLEMENTATION

### 8.1 Tech Stack
**Frontend:**
- React 18+ (for component architecture)
- TypeScript (type safety)
- CSS Modules or Styled Components (scoped styling)
- Framer Motion (animations)
- Zustand or React Context (state management)

**Audio:**
- Web Audio API (audio playback)
- WaveSurfer.js or custom implementation (waveform visualization)

**3D (if Earth rotation):**
- Three.js (3D rendering)
- React-three-fiber (React integration)

**Optional:**
- React-markdown (markdown rendering)
- React-pdf (PDF viewing)
- Prism.js (code syntax highlighting)

### 8.2 State Management

**Global State:**
```typescript
interface TerminalState {
  currentPath: string;
  commandHistory: Command[];
  fileSystem: FileNode;
  isAudioEnabled: boolean;
  activeSection: string;
}

interface Command {
  id: string;
  input: string;
  output: React.ReactNode;
  timestamp: number;
}
```

### 8.3 Component Structure
```
App
├── StatusBar
│   ├── MissionClock
│   ├── SystemStatus
│   └── AudioToggle
├── Layout
│   ├── SidePanel
│   │   ├── NavigationButton (x8)
│   │   └── PanelDecorations
│   └── MainTerminal
│       ├── TerminalHistory
│       │   └── CommandBlock (multiple)
│       └── CommandInput
├── Viewers (Modals)
│   ├── TextViewer
│   ├── ProjectViewer
│   ├── AudioPlayer
│   ├── ImageViewer
│   └── PDFViewer
├── Background
│   ├── SpaceBackground
│   └── EarthScene (optional)
└── AudioManager (global)
```

### 8.4 File System Implementation
```typescript
type FileNode = {
  name: string;
  type: 'file' | 'directory';
  content?: string | React.ReactNode;
  path: string;
  metadata?: {
    extension?: string;
    url?: string;
    audioUrl?: string;
    images?: string[];
    githubUrl?: string;
    tags?: string[];
  };
  children?: FileNode[];
};
```

### 8.5 Command Parser
```typescript
function parseCommand(input: string): {
  command: string;
  args: string[];
  flags: Record<string, boolean>;
} {
  // Parse command structure
  // Support flags like --help, -l, etc.
  // Return structured command object
}

function executeCommand(
  command: string,
  args: string[],
  currentPath: string,
  fileSystem: FileNode
): CommandOutput {
  // Route to appropriate command handler
  // Return output to display in terminal
}
```

### 8.6 Performance Optimizations
1. **Lazy Loading:**
   - Load modals only when opened
   - Lazy load audio files
   - Progressive image loading

2. **Virtual Scrolling:**
   - For long command history
   - Render only visible terminal lines

3. **Memoization:**
   - Memo expensive components (Background, Waveforms)
   - useMemo for file system traversal

4. **Asset Optimization:**
   - Compress all images (WebP format)
   - Minify audio files
   - Use CDN for fonts

5. **Animation Optimization:**
   - Use CSS transforms (GPU accelerated)
   - will-change property for animated elements
   - RequestAnimationFrame for custom animations

---

## 9. ACCESSIBILITY

### 9.1 Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals
- Arrow keys for navigation in lists
- All functionality accessible without mouse

### 9.2 Screen Reader Support
- ARIA labels on all buttons
- Alt text on all images
- Role attributes for terminal elements
- Live region announcements for command output

### 9.3 Visual Accessibility
- High contrast mode option
- Adjustable font size
- Focus indicators on all interactive elements
- Skip to content link

---

## 10. CONTENT STRUCTURE EXAMPLES

### 10.1 About Section
```markdown
# About Me

Hi! I'm [Your Name], a Computer Science student at Stanford University.

I'm passionate about [your interests] and have experience in [key areas].

## Background
[Your story]

## Interests
- [Interest 1]
- [Interest 2]
- [Interest 3]
```

### 10.2 Project Structure
```
projects/
  project-name/
    README.md          (Description, tech stack, features)
    screenshots/
      1.png
      2.png
      3.png
    github_link.url    (Contains: https://github.com/...)
    demo_link.url      (Optional: live demo URL)
```

### 10.3 Music Structure
```
music/
  discography.txt      (Overview of your music)
  tracks/
    beat1.mp3
    beat1_cover.jpg
    beat1_info.txt     (BPM, genre, description)
    instrumental1.mp3
    instrumental1_cover.jpg
```

---

## 11. EASTER EGGS & POLISH

### 11.1 Hidden Commands
- `matrix`: Brief Matrix-style falling characters animation
- `starwars`: ASCII Star Wars art
- `sudo`: "Permission denied. Nice try though."
- `hack`: Fake hacking animation
- `coffee`: "☕ Coffee.exe loaded. Energy +100%"

### 11.2 Details & Polish
- Console logs styled to match terminal aesthetic
- Custom favicon (ISS icon)
- Loading screen messages vary randomly
- Occasional glitch effects (very subtle, rare)
- Time-based greetings: "Good morning" / "Good evening"
- Random status messages in status bar

### 11.3 Seasonal Updates
- Comments in code for easy seasonal themes
- Holiday-specific Easter eggs (optional)

---

## 12. DEPLOYMENT CHECKLIST

### 12.1 Pre-Launch
- [ ] All images optimized and compressed
- [ ] Audio files compressed (MP3, 128kbps is fine)
- [ ] Remove console.logs (except styled ones)
- [ ] Add loading states for all async operations
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on iOS Safari and Android Chrome
- [ ] Performance audit (Lighthouse score > 90)
- [ ] Add error boundaries for React components
- [ ] 404 page in terminal style
- [ ] Meta tags for SEO and social sharing
- [ ] Analytics setup (optional)

### 12.2 Content Preparation
- [ ] Write all section content
- [ ] Prepare project screenshots
- [ ] Export music files with appropriate metadata
- [ ] Create album artwork for tracks
- [ ] PDF resume exported and optimized
- [ ] Test all external links

### 12.3 Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Performance: > 90
- Frame rate: Consistent 60fps
- Audio playback latency: < 50ms

---

## 13. FUTURE ENHANCEMENTS (Phase 2)

### Potential Additions:
1. **Visitor tracking**: Show unique visitor count as system metric
2. **Blog section**: Write posts as terminal logs
3. **Guest book**: Let visitors leave messages via terminal
4. **Multiplayer cursor**: See other visitors' cursors moving around
5. **Dark/Light mode**: Switch panel themes
6. **Custom themes**: User can select color schemes
7. **AR view**: Use phone camera to "see" control panel in 3D space
8. **Voice commands**: Speak commands instead of typing
9. **AI assistant**: ChatGPT integration for interactive Q&A
10. **Game Easter egg**: Hidden mini-game (Space Invaders style)

---

## 14. DEVELOPMENT PHASES

### Phase 1: Core Terminal (Week 1)
- Basic file system structure
- Command parser and executor
- Terminal history and input
- Navigation between sections
- Text file viewing

### Phase 2: UI & Polish (Week 2)
- Side panel with physical buttons
- Status bar with live elements
- CRT effects and styling
- Background animation
- Loading states

### Phase 3: Content Viewers (Week 3)
- Project viewer with screenshots
- Audio player with waveforms
- PDF resume viewer
- Image galleries
- Markdown rendering

### Phase 4: Interactions (Week 4)
- Click-to-execute functionality
- Tab completion
- Command history navigation
- Keyboard shortcuts
- Mobile responsive layout

### Phase 5: Audio & Polish (Week 5)
- Mechanical keyboard sounds
- Audio toggle system
- Sound effect timing
- Performance optimization
- Cross-browser testing

### Phase 6: Content & Deploy (Week 6)
- Add all personal content
- Final design tweaks
- Performance audit
- Deploy to hosting
- Analytics setup

---

## 15. CODE SNIPPETS & EXAMPLES

### Example: Command Execution
```typescript
const executeCommand = (input: string) => {
  const { command, args } = parseCommand(input);
  
  switch(command) {
    case 'ls':
      return listDirectory(args[0] || currentPath);
    case 'cd':
      return changeDirectory(args[0]);
    case 'open':
      return openFile(args[0]);
    case 'help':
      return showHelp();
    default:
      return `Command not found: ${command}. Type 'help' for available commands.`;
  }
};
```

### Example: CRT Effect CSS
```css
.terminal {
  position: relative;
  background: #0a0e1a;
  color: #e8d4a0;
  font-family: 'IBM Plex Mono', monospace;
  text-shadow: 0 0 5px currentColor;
}

.terminal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.98; }
}

.terminal {
  animation: flicker 4s infinite;
}
```

### Example: Physical Button Component
```tsx
const PhysicalButton: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => {
  return (
    <button 
      className={`physical-button ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="led-indicator" />
      <span className="button-label">{label}</span>
    </button>
  );
};
```

---

## 16. ASSETS NEEDED

### Images:
- Panel texture (seamless, 512x512)
- Rivet/screw icons (small, ~32x32)
- Warning label graphics
- Project screenshots (as many as needed)
- Music cover art
- Your photo for About section

### Audio:
- Keyboard click sounds (7 variations)
- Enter key sound
- Space bar sound
- Your music tracks (MP3 format)

### Fonts:
- IBM Plex Mono (download from Google Fonts)

### Icons:
- File/folder icons (can use Unicode or custom SVG)
- Control icons (play, pause, next, prev)

---

## FINAL NOTES

This specification provides everything needed to build your ISS control panel portfolio. The design balances retro-futuristic aesthetics with modern UX principles, ensuring it's both stunning and functional.

Key success factors:
1. **Performance first**: Keep animations smooth (60fps)
2. **Mobile-friendly**: Despite the terminal interface, make it accessible on phones
3. **Content is king**: The tech is cool, but your work should shine through
4. **Subtle details**: Panel rivets, status updates, sound effects make it feel real
5. **User choice**: Let users click OR type for maximum accessibility

The result will be a unique portfolio that showcases both your technical skills and creative vision while being genuinely fun to explore. Good luck with the build!