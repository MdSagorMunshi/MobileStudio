# MobileStudio Documentation

Complete guide to installing, configuring, and using MobileStudio.

---

## Table of Contents

1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Core Features](#core-features)
4. [Keyboard Shortcuts](#keyboard-shortcuts)
5. [Terminal Commands](#terminal-commands)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)
8. [API Reference](#api-reference)
9. [Virtual Keyboard](#virtual-keyboard)

---

## Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm**, **yarn**, or **pnpm** package manager
- Modern browser with IndexedDB support

### Local Development

\`\`\`bash
# Clone repository
git clone https://github.com/MdSagorMunshi/MobileStudio.git
cd MobileStudio

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

The app will be available at `http://localhost:3000`

### Production Build

\`\`\`bash
# Build for production
npm run build

# Start production server
npm run start
\`\`\`

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MdSagorMunshi/MobileStudio)

Or manually:

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

---

## Getting Started

### Creating Your First Project

1. **Open MobileStudio** in your browser
2. Click the **Menu** button (top-left)
3. Select **File > New Project** or use existing default project
4. Start coding!

### File Management

#### Creating Files and Folders

**Method 1: Toolbar Buttons**
- Click **+** icon for new file
- Click **folder** icon for new folder

**Method 2: Right-Click Menu**
- Right-click in Explorer blank space
- Select "New File" or "New Folder"
- Right-click on folders to create items inside

**Method 3: Keyboard**
- Use terminal: `touch filename.js` or `mkdir foldername`

#### Uploading Files

1. Click **Upload** button in Explorer toolbar
2. Select files from your device
3. Or drag & drop files into the Explorer

#### Downloading Files

- **Single File**: Right-click file > Download
- **Entire Project**: Menu > File > Download Project (ZIP)

### Working with the Editor

#### Opening Files

- Click any file in the Explorer
- Files open in tabs at the top
- Switch between tabs by clicking them

#### Editing Code

- Type naturally with syntax highlighting
- Auto-save is enabled by default (2-second delay)
- Manual save: `Ctrl + S`

#### Code Formatting

- Format current file: `Ctrl + Shift + F`
- Supports: JS, TS, HTML, CSS, JSON, Markdown

---

## Core Features

### Multi-Project Management

Switch between multiple isolated projects:

1. Click **Projects** button in header
2. View all projects with creation dates
3. Create new, rename, duplicate, or delete projects
4. Each project has its own file system and settings

### Code Snippets Library

Store and reuse code templates:

1. Open Snippets: `Ctrl + Shift + K` or header button
2. Browse by category (React, HTML, CSS, etc.)
3. Click **Insert** to add to editor
4. Create custom snippets with **New Snippet** button

**Default Snippets:**
- React Functional Component
- React useState Hook
- HTML5 Boilerplate
- CSS Flexbox Container
- CSS Grid Container
- JavaScript Function
- JavaScript Async/Await
- TypeScript Interface
- And more...

### Live Preview

Real-time preview for web projects:

1. Toggle preview: `Ctrl + Shift + P` or menu
2. Desktop: Split view (editor + preview)
3. Mobile: Full-screen preview mode
4. Open in new tab for full testing

**Integrated Console:**
- View `console.log`, `console.error`, `console.warn`
- See runtime errors and exceptions
- Clear console with button
- Filter by message type

### File Search

Search across all project files:

1. Open search: `Ctrl + Shift + F` or menu
2. Enter search query
3. Toggle options:
   - **Match Case** - Case-sensitive search
   - **Use Regex** - Regular expression patterns
   - **Include/Exclude** - File pattern filters
4. Click results to jump to file

**Example Patterns:**
- Include: `*.js,*.ts` (only JavaScript/TypeScript)
- Exclude: `node_modules,*.min.js` (ignore folders/files)

### Version History

Automatic file snapshots for recovery:

1. Open Version History: Menu > View
2. View timeline of file changes
3. Click **Restore** to revert to previous version
4. Auto-saved every 2 seconds (last 10 versions kept)

### Mobile Keyboard Toolbar

Quick access to coding symbols on mobile:

**Row 1:** `{ } [ ] ( ) < > = + -`
**Row 2:** `" ' \` ; : . , / \ | & #`
**Row 3:** Navigation (←→↑↓), Tab, Actions

**Quick Actions:**
- Undo, Redo, Search, Save
- Insert symbols without switching keyboards

---

## Keyboard Shortcuts

### General

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save current file |
| `Ctrl + F` | Find in file |
| `Ctrl + H` | Find and replace |
| `Ctrl + B` | Toggle sidebar |
| `Escape` | Close panels/dialogs |
| `Shift + ?` | Show shortcuts panel |

### Editor

| Shortcut | Action |
|----------|--------|
| `Ctrl + Shift + F` | Format code |
| `Ctrl + /` | Toggle comment |
| `Ctrl + D` | Select next occurrence |
| `Ctrl + Shift + K` | Delete line |
| `Alt + ↑/↓` | Move line up/down |
| `Ctrl + Space` | Trigger suggestions |

### View

| Shortcut | Action |
|----------|--------|
| `Ctrl + Shift + P` | Toggle preview |
| `Ctrl + \` | Split editor |
| `Ctrl + W` | Close tab |
| `Ctrl + Tab` | Next tab |
| `Ctrl + Shift + Tab` | Previous tab |

### Search

| Shortcut | Action |
|----------|--------|
| `Ctrl + Shift + F` | Search in files |
| `Ctrl + Shift + K` | Open snippets |
| `Ctrl + P` | Quick file open (coming soon) |

---

## Terminal Commands

Built-in terminal for file operations:

### Navigation

\`\`\`bash
pwd              # Print working directory
ls               # List files
la               # List all files (detailed)
cd <directory>   # Change directory
cd ..            # Go to parent directory
\`\`\`

### File Operations

\`\`\`bash
touch <file>     # Create new file
mkdir <folder>   # Create new folder
cat <file>       # Display file contents
cp <src> <dest>  # Copy file
mv <src> <dest>  # Move/rename file
rm <file>        # Delete file
\`\`\`

### Utilities

\`\`\`bash
echo <text>      # Print text
date             # Show current date/time
whoami           # Show username
clear            # Clear terminal
help             # Show all commands
\`\`\`

---

## Configuration

### Settings Panel

Access: Menu > Settings or `Ctrl + ,`

#### Theme

- **Dark** - Professional dark theme (default)
- **Light** - Clean light theme
- **Hacker** - Green terminal-style theme

#### Editor Settings

- **Font Size**: 12-24px (default: 14px)
- **Font Family**: Monospace, Consolas, Fira Code
- **Tab Size**: 2-8 spaces (default: 2)
- **Word Wrap**: On/Off
- **Line Numbers**: On/Off
- **Minimap**: On/Off (recommended off for mobile)
- **Auto Save**: On/Off with delay

---

## Troubleshooting

### Common Issues

#### Files Not Saving

**Problem**: Changes disappear after refresh

**Solution:**
1. Check browser console for errors
2. Ensure IndexedDB is enabled in browser settings
3. Check available storage space
4. Try different browser (Chrome/Edge recommended)

#### Preview Not Working

**Problem**: Live preview shows blank or errors

**Solution:**
1. Check browser console in preview iframe
2. Ensure HTML file includes proper structure
3. Check JavaScript errors in integrated console
4. Try opening preview in new tab

#### Monaco Editor Not Loading

**Problem**: Editor area is blank

**Solution:**
1. Clear browser cache
2. Check internet connection (CDN required)
3. Check browser console for loading errors
4. Try hard refresh: `Ctrl + Shift + R`

#### Mobile Keyboard Issues

**Problem**: Symbols not inserting correctly

**Solution:**
1. Ensure cursor is in editor
2. Try clicking editor before using toolbar
3. Update to latest browser version
4. Report issue if persistent

### Browser Compatibility

**Fully Supported:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+ (limited File System API)
- Mobile browsers (Chrome, Safari, Firefox)

**Not Supported:**
- Internet Explorer
- Browsers with JavaScript disabled
- Browsers without IndexedDB support

### Performance Tips

1. **Large Files**: Split files over 5000 lines
2. **Many Files**: Organize in folders, close unused tabs
3. **Mobile**: Disable minimap and unnecessary features
4. **Auto-Save**: Increase delay if typing is laggy

---

## API Reference

### FileSystem API

\`\`\`typescript
// Initialize file system
await fileSystem.init(projectId: string)

// Save file
await fileSystem.saveFile(fileId: string, content: string)

// Get file content
const content = await fileSystem.getFileContent(fileId: string)

// Create file
const file = await fileSystem.createFile(name: string, parentId: string)

// Delete file
await fileSystem.deleteFile(fileId: string)
\`\`\`

### Snippets API

\`\`\`typescript
// Get all snippets
const snippets = await snippetsStore.getSnippets()

// Add snippet
await snippetsStore.addSnippet({
  name: string,
  description: string,
  code: string,
  language: string,
  category: string
})

// Delete snippet
await snippetsStore.deleteSnippet(id: string)
\`\`\`

### Settings API

\`\`\`typescript
// Get settings
const settings = await settingsStore.getSettings()

// Update settings
await settingsStore.updateSettings({
  theme: 'dark' | 'light' | 'hacker',
  fontSize: number,
  tabSize: number,
  // ... other settings
})
\`\`\`

---

## 💻 Virtual Keyboard

### MScode Keyboard (Built-in)

Full-featured virtual keyboard for mobile devices, eliminating the need for external keyboards.

#### Enabling Virtual Keyboard

**Method 1: Menu**
1. Click **Menu** button (top-left)
2. Select **View > Keyboard Mode**
3. Choose **MScode Keyboard**

**Method 2: Settings**
1. Open Settings panel
2. Find **Keyboard Mode** option
3. Switch to **MScode Keyboard**

#### Keyboard Layout

**QWERTY Layout:**
- Full A-Z alphabet keys
- Numbers 0-9
- Common symbols: `.`, `,`, `!`, `?`

**Programming Symbols:**
- Brackets: `{ } [ ] ( ) < >`
- Operators: `+ - * / = % &`
- Quotes: `" ' \``
- Special: `;`, `:`, `#`, `@`, `$`, `_`, `|`, `\`, `/`

**Function Keys:**
- **Shift** - Toggle uppercase/lowercase
- **Space** - Insert space
- **Tab** - Insert tab (2 or 4 spaces)
- **Enter** - New line
- **Backspace** - Delete character
- **←→** - Move cursor left/right

#### Features

- **Touch Optimized** - Large, finger-friendly keys
- **Visual Feedback** - Active states on key press
- **Editor Integration** - Direct Monaco editor insertion
- **No External Keyboard Required** - Complete coding capability
- **Mobile-First Design** - Optimized for small screens

#### Keyboard Modes

**External Keyboard Mode:**
- Uses your device's physical or on-screen keyboard
- Keyboard toolbar shows symbol shortcuts only
- Recommended for tablets with physical keyboards

**MScode Keyboard Mode:**
- Full virtual keyboard appears at bottom
- Complete A-Z, 0-9, and symbol access
- No need for device keyboard
- Ideal for phones and touch-only devices

#### Tips

- Enable MScode keyboard on mobile for best experience
- Use External keyboard mode with Bluetooth keyboards
- Keyboard preferences save automatically
- Switch modes anytime via menu or settings

---

## Additional Resources

- [GitHub Repository](https://github.com/MdSagorMunshi/MobileStudio)
- [Issue Tracker](https://github.com/MdSagorMunshi/MobileStudio/issues)
- [Feature Requests](https://github.com/MdSagorMunshi/MobileStudio/issues/new)

---

**Need Help?**

If you encounter issues not covered here, please [open an issue](https://github.com/MdSagorMunshi/MobileStudio/issues) on GitHub.

---

<div align="center">
  Made with ❤️ by Ryan Shelby
</div>
