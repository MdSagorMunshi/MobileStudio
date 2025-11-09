# MobileStudio

<div align="center">
  <img src="/public/logo.jpg" alt="MobileStudio Logo" width="120" height="120">
  
  **A powerful mobile-first Progressive Web App code editor**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Monaco Editor](https://img.shields.io/badge/Monaco-Editor-green)](https://microsoft.github.io/monaco-editor/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

---

## 📖 About

MobileStudio is a feature-rich, mobile-first Progressive Web App (PWA) code editor designed to bring the power of desktop IDEs to mobile devices. Built with Next.js 16, React 19, and Monaco Editor, it provides a professional development environment optimized for touch interfaces and small screens.

Whether you're coding on a tablet, smartphone, or desktop, MobileStudio delivers a seamless editing experience with syntax highlighting, live preview, file management, and much more.

---

## ✨ Features

### 🎨 Core Editor
- **Monaco Editor Integration** - VS Code's powerful editor with full syntax highlighting
- **30+ Language Support** - JavaScript, TypeScript, HTML, CSS, Python, Java, and more
- **Multi-tab Editing** - Work on multiple files simultaneously
- **Smart File Tree** - Nested folder support with expand/collapse
- **Touch-Optimized** - Gesture-friendly controls for mobile devices

### 🎯 Advanced Functionality
- **Live Preview** - Real-time HTML/CSS/JS rendering in sandboxed iframe
- **Code Formatting** - Prettier integration with Ctrl+Shift+F
- **Search & Replace** - Advanced find/replace with regex support
- **Terminal Emulator** - Built-in terminal with basic commands (ls, cd, cat, pwd, etc.)
- **Git Integration** - Coming soon with full version control support

### 🎨 Customization
- **Theme Switcher** - Dark, Light, and Hacker themes
- **Editor Settings** - Customize font size, font family, tab size, word wrap
- **Keyboard Shortcuts** - VS Code-style shortcuts for power users
- **Mobile Toolbar** - Quick access to code symbols and actions

### 💾 File Management
- **IndexedDB Storage** - Persistent offline-first file system
- **Context Menus** - Right-click support for files and folders
- **File Upload/Download** - Import/export individual files
- **ZIP Import/Export** - Full project download and upload
- **Project Templates** - Quick start with pre-configured templates

### 📱 PWA Features
- **Offline Support** - Service worker for offline functionality
- **Installable** - Add to home screen on mobile devices
- **Responsive Design** - Adaptive layout for all screen sizes
- **Touch Gestures** - Swipe to toggle sidebar and panels

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/MdSagorMunshi/MobileStudio.git
   cd MobileStudio
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MdSagorMunshi/MobileStudio)

---

## 🎯 Usage Guide

### Creating Files and Folders

- **New File**: Click the `+` icon in the Explorer toolbar or right-click in blank space
- **New Folder**: Click the folder icon in the toolbar or right-click in blank space
- **Inside Folders**: Right-click on any folder to create files/folders inside

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save current file |
| `Ctrl + F` | Find in file |
| `Ctrl + B` | Toggle sidebar |
| `Ctrl + Shift + F` | Format code |
| `Ctrl + Shift + P` | Toggle preview |
| `Shift + ?` | Show all shortcuts |
| `Escape` | Close panels |

### Terminal Commands

- `ls` / `la` - List files
- `cd <directory>` - Change directory
- `cd ..` - Go to parent directory
- `pwd` - Print working directory
- `cat <file>` - Display file contents
- `mkdir <name>` - Create directory
- `touch <name>` - Create file
- `cp <src> <dest>` - Copy file
- `mv <src> <dest>` - Move/rename file
- `rm <file>` - Remove file
- `clear` - Clear terminal
- `help` - Show available commands

### Project Templates

1. Click the **Templates** button in the header
2. Choose from:
   - Blank Project
   - Landing Page
   - Todo App
   - Portfolio

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19.2** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - High-quality React components

### Editor & Tools
- **Monaco Editor** - VS Code's editor core
- **Prettier** - Code formatting
- **isomorphic-git** - Git operations in the browser
- **JSZip** - ZIP file handling

### Storage & PWA
- **IndexedDB** - Client-side database
- **Service Workers** - Offline support
- **File System Access API** - Native file handling

---

## 📁 Project Structure

\`\`\`
MobileStudio/
├── app/
│   ├── layout.tsx          # Root layout with PWA setup
│   ├── page.tsx            # Main editor application
│   └── globals.css         # Global styles and themes
├── components/
│   ├── about-dialog.tsx    # About modal
│   ├── code-editor.tsx     # Monaco editor wrapper
│   ├── file-tree.tsx       # File explorer
│   ├── git-panel.tsx       # Git integration
│   ├── live-preview.tsx    # HTML preview
│   ├── mobile-toolbar.tsx  # Mobile quick actions
│   ├── search-panel.tsx    # Find/replace
│   ├── settings-panel.tsx  # Settings modal
│   ├── shortcuts-panel.tsx # Keyboard shortcuts
│   ├── template-selector.tsx # Project templates
│   └── terminal-panel.tsx  # Terminal emulator
├── lib/
│   ├── code-formatter.ts   # Prettier integration
│   ├── file-operations.ts  # ZIP import/export
│   ├── file-system.ts      # IndexedDB file system
│   ├── git-manager.ts      # Git operations
│   ├── keyboard-shortcuts.ts # Shortcut manager
│   ├── language-detector.ts # Syntax detection
│   ├── project-templates.ts # Template definitions
│   └── settings-store.ts   # Settings persistence
├── hooks/
│   └── use-touch-gestures.ts # Touch gesture handling
├── public/
│   ├── logo.jpg            # App logo
│   ├── icon-192.jpg        # PWA icon
│   ├── icon-512.jpg        # PWA icon
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker
└── README.md
\`\`\`

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Commit your changes**
   \`\`\`bash
   git commit -m 'Add some amazing feature'
   \`\`\`
4. **Push to the branch**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Test your changes on both desktop and mobile
- Update documentation as needed

---

## 🐛 Known Issues

- Git push/pull functionality is under development
- Large file handling (>10MB) may cause performance issues
- Safari iOS has limited File System Access API support

---

## 🗺️ Roadmap

- [ ] Full Git integration with push/pull
- [ ] GitHub/GitLab authentication
- [ ] Cloud sync and backup
- [ ] Collaborative editing
- [ ] Extension system
- [ ] Multiple language support (i18n)
- [ ] Advanced debugging tools
- [ ] Package manager integration (npm, yarn)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ryan Shelby**

- GitHub: [@MdSagorMunshi](https://github.com/MdSagorMunshi)
- GitLab: [@rynex](https://gitlab.com/rynex)

---

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The editor that powers VS Code
- [Next.js](https://nextjs.org/) - The React framework for production
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible components
- [Vercel](https://vercel.com/) - Deployment and hosting platform
- [Prettier](https://prettier.io/) - Code formatter
- [isomorphic-git](https://isomorphic-git.org/) - Git implementation in JavaScript

---

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on [GitHub](https://github.com/MdSagorMunshi/MobileStudio)!

---

<div align="center">
  Made with ❤️ by Ryan Shelby
  
  [Report Bug](https://github.com/MdSagorMunshi/MobileStudio/issues) · [Request Feature](https://github.com/MdSagorMunshi/MobileStudio/issues)
</div>
