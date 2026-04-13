# Contributing to LedgerX

Thank you for your interest in contributing to LedgerX! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### 1. Fork the Repository
```bash
# Click "Fork" on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/ledgerx-fullstack.git
cd ledgerx-fullstack
```

### 2. Set Up Development Environment
```bash
# Install dependencies
npm run install:all

# Setup environment variables
cd backend && cp .env.example .env
cd ../frontend && cp .env.example .env

# Start development servers
# Terminal 1
cd backend && npm run start:dev

# Terminal 2
cd frontend && npm run dev
```

### 3. Create a Branch
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 4. Make Your Changes

Follow these guidelines:
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 5. Test Your Changes
```bash
# Frontend
cd frontend
npm run lint
npm run test  # If tests exist

# Backend
cd backend
npm run lint
npm run test
```

### 6. Commit Your Changes
```bash
# Use conventional commits
git add .
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve bug in transaction"
```

#### Commit Message Format
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 7. Push and Create Pull Request
```bash
# Push to your fork
git push origin feature/your-feature-name

# Go to GitHub and create a Pull Request
```

## 📋 Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for new backend code
- Use meaningful variable names
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Add JSDoc comments for functions

### React
- Use functional components with hooks
- Keep components small and focused
- Use meaningful component names (PascalCase)
- Extract reusable logic into custom hooks

### NestJS
- Follow NestJS module structure
- Use DTOs for validation
- Use decorators appropriately
- Implement proper error handling

## 🐛 Reporting Bugs

1. Check if the bug already exists in Issues
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details

## 💡 Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description
   - Use case
   - Proposed implementation (optional)
   - Mockups (if applicable)

## 🔍 Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged

## 📝 Documentation

When adding features:
- Update relevant README files
- Add API documentation
- Update CHANGELOG if applicable
- Add inline code comments

## ✅ Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Changes have been tested locally
- [ ] Documentation has been updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts
- [ ] PR description explains changes

## 🎯 Areas to Contribute

### Frontend
- UI/UX improvements
- New visualizations
- Accessibility improvements
- Performance optimizations
- Mobile responsiveness

### Backend
- New API endpoints
- Performance improvements
- Security enhancements
- Test coverage
- Documentation

### General
- Bug fixes
- Documentation improvements
- Examples and tutorials
- Testing

## 📧 Contact

For questions or discussions:
- Open an issue on GitHub
- Contact: [@aishwary-vansh](https://github.com/aishwary-vansh)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to LedgerX! 🙏
