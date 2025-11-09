# Changelog

All notable changes to MobileStudio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned Features
- Full Git push/pull integration
- GitHub/GitLab OAuth authentication
- Command Palette (Ctrl+Shift+P)
- Drag & drop file reorganization
- Export to CodeSandbox/StackBlitz
- Collaborative editing

---

## [1.0.0] - 2025-01-10

### 🎉 Initial Release

Full-featured mobile-first PWA code editor with comprehensive tooling.

### Added - Core Features

**Editor & Code Management**
- Monaco Editor integration with 30+ language support
- Multi-tab editing with file tree navigation
- Syntax highlighting and auto-completion
- Code folding and bracket matching
- Search and replace with regex support
- Code formatting with Prettier integration
- Keyboard shortcuts system (VS Code-style)

**Multi-Project System**
- Create unlimited isolated projects
- Project switcher with metadata display
- Rename, duplicate, and delete projects
- Per-project file system and settings
- Project creation timestamps

**Code Snippets Library**
- 10+ built-in code templates (React, HTML, CSS, JS, TS)
- Custom snippet creation and management
- Category-based organization
- Quick insert and copy functionality
- Search and filter snippets

**Live Preview System**
- Real-time HTML/CSS/JS rendering
- Sandboxed iframe execution
- Split view (desktop) and full-screen (mobile)
- Integrated console with log capture
- Console.log, error, warn, info tracking
- Runtime error and promise rejection handling
- Open preview in new tab

**File Search**
- Global search across all project files
- Regex pattern matching support
- Case-sensitive toggle
- Include/exclude file patterns
- Click-to-jump result navigation
- Match count display

**Version History & Auto-Save**
- Automatic file snapshots (2-second delay)
- Keep last 10 versions per file
- One-click restore to previous versions
- Timestamp display for each version
- Per-file history tracking

### Added - UI & Mobile Optimization

**Mobile Features**
- Custom keyboard toolbar with coding symbols
- Three rows of quick-access symbols
- Navigation controls (arrow keys)
- Quick actions (undo, redo, find, save)
- Touch gesture support (swipe to toggle sidebar)
- Touch-optimized buttons and controls

**Virtual Keyboard System**
- Full MScode keyboard with A-Z, 0-9, and symbols
- QWERTY layout with programming symbols
- Shift, Space, Tab, Enter, Backspace keys
- Cursor navigation with arrow keys
- Keyboard mode toggle (External vs MScode)
- Settings integration for keyboard preferences
- Touch-optimized key sizes
- Visual active states on key press
- Monaco Editor integration for character insertion

**Themes & Customization**
- Dark theme (pure black, OLED-optimized)
- Light theme (clean white)
- Hacker theme (Matrix-style green)
- Custom editor settings (font size, family, tab size)
- Word wrap, line numbers, minimap toggles

**File Management**
- Create files and folders
- Nested folder support with unlimited depth
- Right-click context menus (files, folders, blank space)
- Upload files and ZIP archives
- Download individual files
- Export entire project as ZIP
- File tree with expand/collapse

**Terminal Emulator**
- Built-in terminal with 15+ commands
- Navigation: pwd, ls, la, cd
- File operations: touch, mkdir, cat, cp, mv, rm
- Utilities: echo, date, whoami, clear, help
- Command history with arrow keys
- File system integration

### Added - Developer Experience

**Project Setup**
- Four starter templates (Blank, Landing Page, Todo App, Portfolio)
- PWA support with service workers
- Offline-first architecture
- IndexedDB for persistent storage
- Responsive design for all screen sizes

**Navigation & Controls**
- Collapsible sidebar with toggle button
- Menu system with File, Edit, View, Help
- About dialog with project info and links
- Settings panel with live preview
- Shortcuts panel with full command list

**Branding & Assets**
- Custom MobileStudio logo
- PWA icons (192x192, 512x512)
- Manifest for installable app
- Professional dark theme by default

### Technical

**Dependencies**
- Next.js 16.1.0
- React 19.2.0
- TypeScript 5.x
- Monaco Editor (CDN)
- Prettier 3.4.2
- JSZip 3.10.1
- isomorphic-git 1.27.1
- Tailwind CSS v4
- shadcn/ui components

**Browser Support**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (Chrome, Safari, Firefox)

**Performance**
- Client-side only (no server required)
- IndexedDB for fast local storage
- Service worker caching
- Optimized bundle size
- Lazy loading for editor

---

## Commit History

### Recent Commits

\`\`\`
feat(keyboard): add fully functional virtual keyboard with QWERTY layout
feat(keyboard): implement keyboard mode toggle (External vs MScode)
feat(keyboard): integrate virtual keyboard with Monaco Editor
feat(snippets): add code snippets library with custom templates
feat(projects): implement multi-project management system
feat(console): add integrated console for preview debugging
feat(search): implement global file search with regex support
feat(history): add version history with auto-save and restore
feat(keyboard): create mobile keyboard toolbar with symbols
feat(sidebar): add toggle button for sidebar visibility
docs(readme): create comprehensive documentation suite
chore(license): add Creative Commons BY-NC 4.0 license
\`\`\`

---

## [0.1.0] - 2025-01-09

### Initial Development

- Project scaffolding with Next.js 16
- Basic file system with IndexedDB
- Monaco Editor integration
- File tree component
- Live preview implementation
- Git panel setup
- Terminal emulator
- Mobile toolbar
- Settings system

---

## Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backwards-compatible)
- **PATCH** version for backwards-compatible bug fixes

---

## Links

- [GitHub Repository](https://github.com/MdSagorMunshi/MobileStudio)
- [Issue Tracker](https://github.com/MdSagorMunshi/MobileStudio/issues)
- [Documentation](DOCS.md)

---

<div align="center">
  Made with ❤️ by Ryan Shelby
</div>
