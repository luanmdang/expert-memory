# Cursor AI - ISS Portfolio Implementation Prompt

## CONTEXT
You are building a unique portfolio website for a Stanford CS student. The design concept is an ISS (International Space Station) control panel interface with a vintage terminal/command-line aesthetic. The user can interact via both typed commands AND physical-looking buttons.

**READ THE FULL SPECIFICATION DOCUMENT FIRST** before starting implementation.

## YOUR APPROACH

### Phase 1: Project Setup & Architecture
**Goal: Set up the foundation properly**

1. **Initialize React + TypeScript project**
   - Use Vite for fast dev experience
   - Set up TypeScript with strict mode
   - Install dependencies:
     ```
     react, react-dom
     framer-motion (animations)
     zustand (state management)
     wavesurfer.js (audio waveforms)
     react-markdown (markdown rendering)
     ```

2. **Create folder structure:**
   ```
   src/
   ├── components/
   │   ├── StatusBar/
   │   ├── SidePanel/
   │   ├── Terminal/
   │   ├── Viewers/
   │   └── Background/
   ├── hooks/
   ├── utils/
   │   ├── fileSystem.ts
   │   ├── commandParser.ts
   │   └── audioManager.ts
   ├── assets/
   │   ├── sounds/
   │   ├── images/
   │   └── fonts/
   ├── styles/
   └── types/
   ```

3. **Define TypeScript interfaces** (from spec section 8.2):
   ```typescript
   interface FileNode {
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
   }

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

**STOP HERE** and confirm structure is created correctly before proceeding.

---

### Phase 2: Core Terminal System
**Goal: Get basic terminal working with command execution**

1. **Create the file system structure** (spec section 3.1)
   - Build the `/home/portfolio/` tree with all directories
   - Include placeholder content for each section
   - Implement file system navigation utilities

2. **Build command parser** (spec section 8.5):
   - Parse input into command + args
   - Support: `ls`, `cd`, `open`, `help`, `clear`
   - Handle tab completion logic
   - Handle command history (up/down arrows)

3. **Create Terminal component:**
   - Terminal history display (scrollable)
   - Command input field at bottom
   - Prompt that shows current path: `user@iss-terminal:~/portfolio$`
   - Execute commands on Enter
   - Display output with proper formatting

4. **Implement basic commands:**
   - `ls`: List directory contents with icons (📁 📄 🎵)
   - `cd`: Change directory, support `..`, `~`, absolute paths
   - `help`: Show available commands
   - `clear`: Clear terminal history

**CHECKPOINT:** Terminal should work with keyboard input before moving on.

---

### Phase 3: Visual Design System
**Goal: Implement the ISS control panel aesthetic**

1. **Set up global styles** (spec section 1):
   - Import IBM Plex Mono font from Google Fonts
   - Define CSS variables for color palette:
     ```css
     :root {
       --bg-space: #0a0e1a;
       --panel-bg: #1a1f2e;
       --text-amber: #e8d4a0;
       --text-blue: #a0b8d0;
       --accent-blue: #4a90e2;
       /* ... rest from spec section 1.1 */
     }
     ```

2. **Create CRT effects** (spec section 1.3):
   - Scan lines overlay
   - Phosphor glow on text (text-shadow)
   - Subtle flicker animation
   - Vignette effect

3. **Build layout structure** (spec section 2):
   - Fixed status bar at top (40px)
   - Side panel on left (20% width)
   - Main terminal area (remaining space)
   - Command input bar at bottom (60px)

4. **Style terminal:**
   - Background: dark space black
   - Text: amber glow
   - Apply CRT effects
   - Scrollable content area

**CHECKPOINT:** Should look like a retro terminal screen.

---

### Phase 4: Side Panel & Navigation
**Goal: Physical control panel with working buttons**

1. **Create SidePanel component:**
   - Dark metallic background with texture
   - Rivets in corners (use CSS or small images)
   - Warning stripe at top (yellow/black diagonal pattern)
   - Label: "NAVIGATION CONTROL"

2. **Build PhysicalButton component** (spec section 10.15):
   - Raised button appearance with gradient
   - LED indicator (◉) that lights up when active
   - Click animation: depress 2px down
   - Hover glow effect
   - Props: label, active state, onClick handler

3. **Add navigation buttons:**
   - HOME, ABOUT, EXPERIENCE, PROJECTS, EDUCATION, MUSIC, CONTACT, DOWNLOAD RESUME
   - Stack vertically
   - Wire up onClick to execute corresponding `cd` command
   - Show active indicator for current section

4. **Implement click-to-execute:**
   - When button clicked, add command to terminal history silently
   - Execute navigation command
   - Update active button state

**CHECKPOINT:** Clicking buttons should navigate and show in terminal history.

---

### Phase 5: Status Bar
**Goal: Create the top status bar with live elements**

1. **Build StatusBar component** (spec section 2.2):
   - Split into three sections: left, center, right
   - Fixed at top, full width

2. **Add mission clock:**
   - Counts up from page load
   - Format: `MISSION TIME: HH:MM:SS`
   - Use setInterval to update every second

3. **Add center title:**
   - `ISS TERMINAL v2.1 - [YOUR NAME] PORTFOLIO SYSTEM`
   - Amber text

4. **Add status indicators:**
   - `[COMMS: ONLINE]` in green
   - `[POWER: 98%]` in blue
   - `[TEMP: OPTIMAL]` in green
   - Audio toggle: `[🔊 SFX]` / `[🔇 SFX]`

**CHECKPOINT:** Status bar should be visible and mission clock counting.

---

### Phase 6: Background & Atmosphere
**Goal: Create the space environment**

1. **Create SpaceBackground component:**
   - Three layers of slowly moving stars
   - Small white dots at varying opacities
   - Very slow parallax drift (3 different speeds)
   - Subtle shooting stars occasionally (optional)

2. **Add vignette effect:**
   - Radial gradient from center to edges
   - Darkens corners for depth

3. **Performance optimization:**
   - Use CSS transforms for movement (GPU accelerated)
   - Limit number of star elements (100-150 total)
   - Use will-change: transform

**Alternative if you want Earth:**
- Use Three.js with React-three-fiber
- Low-poly Earth model with texture
- Slow rotation (1 full rotation per 2 minutes)
- Position in bottom-right corner
- Only implement if maintaining 60fps

**CHECKPOINT:** Background should move smoothly without affecting performance.

---

### Phase 7: Content Viewers
**Goal: Display different file types properly**

1. **Create TextViewer component:**
   - Modal overlay with close button
   - Render markdown content with react-markdown
   - Syntax highlighting for code blocks
   - Styled with amber text on dark panel background

2. **Create ProjectViewer component:**
   - Image carousel at top (if screenshots exist)
   - Project description
   - Tech stack tags (styled as buttons/pills)
   - GitHub and demo links as styled buttons
   - Close button

3. **Create ImageViewer component:**
   - Full-screen modal
   - Center image with max-width
   - Close button overlay
   - Click outside to close

4. **Wire up `open` command:**
   - Detect file type from extension or metadata
   - Route to appropriate viewer
   - For .txt/.md → TextViewer
   - For folders → cd into them
   - For .url files → open link in new tab
   - For images → ImageViewer

**CHECKPOINT:** Opening files should show appropriate viewer.

---

### Phase 8: Audio Player (Music Section)
**Goal: Fully functional audio player with waveforms**

1. **Install WaveSurfer.js:**
   ```bash
   npm install wavesurfer.js
   ```

2. **Create AudioPlayer component:**
   - Album artwork thumbnail
   - Waveform visualization container
   - Play/pause button, skip buttons
   - Time display (current / total)
   - Volume control
   - Scrubber (clickable waveform)

3. **Initialize WaveSurfer:**
   - Load audio file
   - Generate waveform with amber/blue gradient
   - Enable clicking on waveform to seek
   - Show progress indicator moving along waveform

4. **Add playback controls:**
   - Play/Pause toggle
   - Skip forward/backward buttons (optional if multiple tracks)
   - Volume slider
   - Update time display during playback

5. **Music section layout:**
   - When in `/music/tracks/`, show grid of tracks
   - Each track: thumbnail + name + duration
   - Click to open AudioPlayer modal

**CHECKPOINT:** Should be able to play audio files with working waveform.

---

### Phase 9: Mechanical Keyboard Sounds
**Goal: Add satisfying keyboard feedback**

1. **Prepare audio files:**
   - Generate or download 7 mechanical keyboard click sounds
   - Export as MP3, keep file size small (<50KB each)
   - One special sound for Enter key

2. **Create AudioManager utility:**
   ```typescript
   class AudioManager {
     private sounds: Map<string, HTMLAudioElement> = new Map();
     private enabled: boolean = true;

     preload(soundName: string, url: string) {
       const audio = new Audio(url);
       audio.preload = 'auto';
       this.sounds.set(soundName, audio);
     }

     play(soundName: string) {
       if (!this.enabled) return;
       const audio = this.sounds.get(soundName);
       if (audio) {
         audio.currentTime = 0;
         audio.play().catch(() => {});
       }
     }

     toggle() {
       this.enabled = !this.enabled;
     }
   }
   ```

3. **Play sounds on keypress:**
   - Listen to keyboard events in command input
   - Play random keystroke sound (1 of 7)
   - Different sound for Enter key
   - Add slight pitch variation for realism

4. **Wire up audio toggle:**
   - Status bar button controls AudioManager.toggle()
   - Persist preference in localStorage
   - Update button icon/text

**CHECKPOINT:** Typing should produce satisfying click sounds.

---

### Phase 10: Animations & Polish
**Goal: Make interactions feel smooth and polished**

1. **Command execution animation:**
   - Input slides up into history (300ms ease-out)
   - Loading indicator with animated dots if needed
   - Text streams in line by line (50ms per line)

2. **Modal animations (use Framer Motion):**
   - Fade in with scale up: initial={{ opacity: 0, scale: 0.95 }}
   - Smooth transitions between states
   - Backdrop blur effect

3. **Button interactions:**
   - Hover: glow + brightness increase
   - Active: 2px depression animation
   - Smooth transitions (100-200ms)

4. **Page load sequence:**
   - Black screen with loading text
   - Progress bar animation
   - ASCII art logo appears line by line
   - Boot-up messages stream in
   - UI fades in

5. **Cursor blink animation:**
   - CSS animation for blinking cursor in input
   - 1 second interval

**CHECKPOINT:** All interactions should feel smooth and intentional.

---

### Phase 11: Mobile Responsive
**Goal: Make it work beautifully on phones**

1. **Breakpoint: < 768px**
   - Hide side panel by default
   - Add hamburger menu button (top-left)
   - Terminal goes full-width

2. **Create mobile navigation drawer:**
   - Slide-in from left
   - Touch-friendly button sizes (44px min height)
   - Swipe gestures: swipe left to open, right to close

3. **Mobile terminal input:**
   - Add toggle button to show/hide terminal input
   - Larger tap targets
   - Virtual keyboard handles input

4. **Mobile audio player:**
   - Compact view
   - Stack controls vertically if needed
   - Waveform scales to screen width

5. **Touch interactions:**
   - Tap files/commands to execute
   - Touch-based scrubbing on audio waveform
   - Pinch to zoom on images

**CHECKPOINT:** Test on actual mobile device or Chrome DevTools mobile emulation.

---

### Phase 12: Content Population
**Goal: Add real content**

1. **Create content files:**
   - Write about.md with bio
   - Add experience details
   - Write project descriptions with screenshots
   - Add education information
   - Prepare music files and metadata

2. **Populate fileSystem:**
   - Replace placeholders with real content
   - Add actual GitHub links
   - Include project screenshots in assets
   - Add music tracks with cover art

3. **Resume setup:**
   - Add PDF resume to assets
   - Create download button handler
   - Create PDF viewer modal

**CHECKPOINT:** All sections should have real, meaningful content.

---

### Phase 13: Performance Optimization
**Goal: Ensure fast, smooth experience**

1. **Run Lighthouse audit:**
   - Target: Performance score > 90
   - First Contentful Paint < 1.5s
   - Time to Interactive < 3.5s

2. **Optimize images:**
   - Convert to WebP format
   - Use appropriate sizes
   - Lazy load images in modals

3. **Optimize audio:**
   - Compress music files (128kbps MP3 is fine)
   - Lazy load audio players

4. **Code splitting:**
   - Lazy load viewer components
   - Split vendor bundles

5. **Animation performance:**
   - Use CSS transforms (translate, scale) instead of top/left
   - Add will-change to animated elements
   - Ensure consistent 60fps

**CHECKPOINT:** Lighthouse should show green scores.

---

### Phase 14: Easter Eggs & Final Polish
**Goal: Add delightful details**

1. **Implement hidden commands:**
   - `whoami`: ASCII art + fun bio
   - `matrix`: Falling characters animation
   - `sudo`: "Permission denied" message
   - Other fun commands from spec

2. **Add polish details:**
   - Panel rivets and texture
   - Warning label stickers
   - Occasional glitch effects (very subtle)
   - Time-based greetings in terminal

3. **Error handling:**
   - Invalid commands show helpful message
   - Broken file paths handled gracefully
   - Network errors for external resources

4. **Loading states:**
   - Skeleton screens for slow-loading content
   - Spinners with terminal aesthetic

**CHECKPOINT:** Everything should feel polished and complete.

---

### Phase 15: Testing & Deployment
**Goal: Launch successfully**

1. **Cross-browser testing:**
   - Chrome, Firefox, Safari, Edge
   - iOS Safari and Android Chrome
   - Test audio playback in all browsers

2. **Accessibility check:**
   - Keyboard navigation works
   - Screen reader friendly
   - Focus indicators visible
   - ARIA labels present

3. **Final checks:**
   - All links work
   - All images load
   - Audio files play correctly
   - No console errors
   - Mobile experience smooth

4. **Deploy:**
   - Build production bundle
   - Deploy to Vercel/Netlify/hosting of choice
   - Set up custom domain if desired
   - Add meta tags for social sharing

---

## IMPLEMENTATION GUIDELINES

### Code Quality Standards:
- **TypeScript:** Use proper types, avoid `any`
- **Components:** Keep them small and focused (< 200 lines)
- **Performance:** Profile with React DevTools, optimize re-renders
- **Comments:** Add comments for complex logic
- **Naming:** Use descriptive variable names

### When You Get Stuck:
1. Reference the full specification document
2. Break the problem into smaller pieces
3. Implement MVP version first, then enhance
4. Test frequently at each checkpoint

### Priority Order:
1. Functionality > Aesthetics (get it working first)
2. Desktop experience > Mobile (but mobile is important)
3. Core features > Easter eggs
4. Performance > Feature bloat

---

## EXECUTION STRATEGY

**Work Phase by Phase:** Complete each phase fully before moving to the next. Ask for confirmation at each checkpoint.

**Start with:** "I'm beginning Phase 1: Project Setup & Architecture. I will create the folder structure and install dependencies."

**At each checkpoint:** Pause and confirm the phase is working before proceeding.

**Ask questions if:** Something in the spec is unclear or you need clarification on implementation details.

---

## SUCCESS CRITERIA

By the end, you should have:
- ✅ Working terminal with command execution
- ✅ Beautiful ISS control panel design with CRT effects
- ✅ Physical buttons that feel tactile
- ✅ Audio player with waveforms
- ✅ All content sections accessible
- ✅ Smooth animations and interactions
- ✅ Mechanical keyboard sounds
- ✅ Mobile responsive
- ✅ Fast loading and smooth performance (60fps)
- ✅ Production-ready and deployed

---

**NOW BEGIN WITH PHASE 1.** Let me know when you're ready to start and confirm you've read the full specification document.