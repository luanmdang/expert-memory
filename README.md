# Virtual Terminal and File System

A fully-functional terminal emulator with a custom Unix-like file system implementation, built entirely in the browser. Features include hierarchical directory structures, path resolution, command parsing with 15+ Unix commands, and multi-format file viewers.

![Screenshot of the terminal interface](https://github.com/luanmdang/virtual-terminal-portfolio/blob/main/virtual-terminal-showcase2.png)
_note: See the demo at https://luandang.vercel.app/

## ✨ Core Features

-   **Unix-like Virtual File System**: A fully simulated file system in memory with a hierarchical directory structure, path resolution (`.`, `..`, `~/`), and support for recursive traversal.
-   **Custom Command-Line Interface (CLI)**: A robust command parser that handles commands, arguments, and flags (e.g., `ls -l`). It includes features like:
    -   **Tab Autocompletion**: For both commands and file paths.
    -   **Command History**: Navigate previous commands using arrow keys.
-   **Multi-Format File Viewer**: Type-safe viewers for various file formats, with lazy loading for large files to ensure a responsive user experience.
    -   📄 Text files (`.txt`, `.md`)
    -   🖼️ Images (`.png`, `.jpg`, `.gif`)
    -   🎵 Audio files (`.mp3`)
    -   📑 PDFs (`.pdf`)
    -   🔗 URL links (`.url`)
-   **Responsive & Themed Design**: Built with a terminal aesthetic that is fully responsive and adapts to different screen sizes.

## 🚀 Available Commands

The terminal supports a variety of commands for file system navigation, file interaction, and some fun extras.

| Command     | Description                                                  | Usage Example              |
| :---------- | :----------------------------------------------------------- | :------------------------- |
| `ls`        | Lists the contents of a directory. Supports `-l` for long format. | `ls -l ./documents`      |
| `cd`        | Changes the current directory.                               | `cd ../projects`           |
| `open`      | Opens a file in the appropriate viewer or follows a URL.     | `open resume.pdf`          |
| `cat`       | Alias for `open`. Displays file content.                     | `cat project-notes.txt`    |
| `tree`      | Displays the directory structure in a tree-like format.      | `tree`                     |
| `pwd`       | Prints the full path of the current working directory.       | `pwd`                      |
| `help`      | Displays a list of available commands and usage info.        | `help`                     |
| `clear`     | Clears all previous output from the terminal screen.         | `clear`                    |
| `history`   | Provides instructions on how to use command history.         | `history`                  |
| `whoami`    | Displays brief user information.                             | `whoami`                   |
| `neofetch`  | Shows mock system information in a classic neofetch style.   | `neofetch`                 |
| `matrix`    | Initiates a Matrix-style digital rain animation.             | `matrix`                   |
| `starwars`  | Displays a classic movie quote.                              | `starwars`                 |

## 🛠️ Tech Stack

-   **Framework**: Next.js 14
-   **Language**: TypeScript
-   **UI Library**: React 18
-   **Styling**: Sass (SCSS Modules)
-   **Build/Package Manager**: npm

## ⚙️ Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    The application will be available at `http://localhost:10000`.
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    To create a production-ready build:
    ```bash
    npm run build
    ```

## 📂 Project Architecture

The core logic for the terminal is organized within the `app/portfolio/` directory, following a clear separation of concerns:

-   `data/fileSystem.ts`: Defines the static, in-memory file system structure and provides utility functions for path resolution and traversal.
-   `utils/commandParser.ts`: Contains the primary logic for parsing user input, executing commands, and handling arguments and flags.
-   `components/Terminal.tsx`: The main React component that manages the terminal's state, renders the UI, and orchestrates interactions.
-   `types/index.ts`: Provides TypeScript definitions for core data structures like `FileNode` (for files/directories) and `CommandResult` (for command outputs).
-   `page.tsx`: The Next.js entry point that renders the `Terminal` component.
