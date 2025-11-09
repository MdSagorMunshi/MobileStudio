# Contributing to MobileStudio

Thank you for considering contributing to MobileStudio! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [How to Contribute](#how-to-contribute)
5. [Coding Guidelines](#coding-guidelines)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Bug Reports](#bug-reports)
9. [Feature Requests](#feature-requests)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy toward others

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting remarks
- Publishing others' private information
- Other conduct inappropriate in a professional setting

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Git
- Code editor (VS Code recommended)
- Basic knowledge of React, Next.js, and TypeScript

### Fork and Clone

\`\`\`bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/YOUR_USERNAME/MobileStudio.git
cd MobileStudio

# Add upstream remote
git remote add upstream https://github.com/MdSagorMunshi/MobileStudio.git
\`\`\`

---

## Development Setup

### Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your changes.

### Build for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

### Lint and Format

\`\`\`bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Format with Prettier (if configured)
npm run format
\`\`\`

---

## How to Contribute

### 1. Find an Issue

- Browse [open issues](https://github.com/MdSagorMunshi/MobileStudio/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to claim it

### 2. Create a Branch

\`\`\`bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
\`\`\`

**Branch Naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 3. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test on both desktop and mobile

### 4. Test Your Changes

- Test all affected features
- Check responsive design
- Verify in multiple browsers
- Ensure no console errors

### 5. Commit Changes

\`\`\`bash
git add .
git commit -m "feat: add your feature description"
\`\`\`

See [Commit Guidelines](#commit-guidelines) below.

### 6. Push to Your Fork

\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

### 7. Create Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Fill out the PR template
- Link related issues

---

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible

\`\`\`typescript
// ✅ Good
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
}

// ❌ Bad
const file: any = { ... };
\`\`\`

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks

\`\`\`tsx
// ✅ Good
export function MyComponent({ data }: Props) {
  const [state, setState] = useState(false);
  // ...
}

// ❌ Bad - Avoid class components
class MyComponent extends React.Component { ... }
\`\`\`

### File Organization

\`\`\`
components/     # React components
├── ui/         # shadcn/ui components
lib/            # Utilities and business logic
hooks/          # Custom React hooks
app/            # Next.js pages
\`\`\`

### Naming Conventions

- **Files**: `kebab-case.tsx`
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas
- Use async/await over promises
- Destructure props and state

\`\`\`typescript
// ✅ Good
const { name, age } = user;
const data = await fetchData();

// ❌ Bad
const name = user.name;
fetchData().then(data => { ... });
\`\`\`

---

## Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

### Examples

\`\`\`bash
# Feature
git commit -m "feat(editor): add code folding support"

# Bug fix
git commit -m "fix(preview): resolve iframe sandbox errors"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Multiple changes
git commit -m "feat(snippets): add custom snippet creation

- Add snippet creation dialog
- Implement snippet storage
- Update snippets panel UI

Closes #123"
\`\`\`

---

## Pull Request Process

### PR Checklist

Before submitting, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commits follow convention
- [ ] PR description is clear
- [ ] Screenshots included (for UI changes)
- [ ] Tested on desktop and mobile
- [ ] No console errors or warnings

### PR Template

\`\`\`markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test your changes

## Screenshots
(if applicable)

## Related Issues
Closes #123
\`\`\`

### Review Process

1. Maintainer reviews your PR
2. Requested changes (if any)
3. You update your PR
4. Approval and merge

---

## Bug Reports

### Before Reporting

1. Check [existing issues](https://github.com/MdSagorMunshi/MobileStudio/issues)
2. Verify bug in latest version
3. Test in different browsers

### Bug Report Template

\`\`\`markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Device: [e.g., Desktop, iPhone 13]
- Version: [e.g., v1.0.0]

**Additional Context**
Any other relevant information
\`\`\`

---

## Feature Requests

### Feature Request Template

\`\`\`markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Screenshots, mockups, or examples
\`\`\`

---

## Development Tips

### Hot Reloading

- Save files to see changes instantly
- Hard refresh: `Ctrl + Shift + R` if needed

### Debugging

- Use React DevTools
- Check browser console
- Add `console.log("[v0] ...")` for debugging
- Use breakpoints in browser DevTools

### Testing Mobile

1. **Chrome DevTools**
   - F12 > Toggle device toolbar
   - Test different screen sizes

2. **Real Device**
   - Connect device to same network
   - Access via `http://YOUR_IP:3000`

3. **Browser Specific**
   - Test iOS Safari separately
   - Check Android Chrome

---

## Questions?

If you have questions:

1. Check [Documentation](DOCS.md)
2. Search [Issues](https://github.com/MdSagorMunshi/MobileStudio/issues)
3. Open a [Discussion](https://github.com/MdSagorMunshi/MobileStudio/discussions)
4. Ask in [Pull Request](https://github.com/MdSagorMunshi/MobileStudio/pulls)

---

## Recognition

Contributors will be:

- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

---

Thank you for contributing to MobileStudio! 🚀

---

<div align="center">
  Made with ❤️ by the MobileStudio Community
</div>
