# Contributing to DevOdyssey

Thank you for your interest in contributing to DevOdyssey! We welcome contributions from everyone, whether you're fixing bugs, adding new features, improving documentation, or suggesting enhancements.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand what behavior is expected from all contributors.

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git
- A GitHub account

### Setting Up Your Development Environment

1. **Fork the repository**
   
   Click the "Fork" button in the top-right corner of the [DevOdyssey repository](https://github.com/aaditya-dubey09/devodyssey).

2. **Clone your forked repository**

   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/devodyssey.git
   cd devodyssey
   ```

3. **Add the upstream remote**

   ```bash
   git remote add upstream https://github.com/aaditya-dubey09/devodyssey.git
   ```

4. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

5. **Set up environment variables**

   Follow the instructions in the main [README.md](README.md) to configure your `.env` files for both client and server.

6. **Verify your setup**

   ```bash
   # From the root directory
   npm run dev
   ```

   Visit `http://localhost:5173` to ensure everything is working.

## How to Contribute

### Finding Something to Work On

- **Good First Issues**: Check out issues labeled [`good first issue`](https://github.com/aaditya-dubey09/devodyssey/labels/good%20first%20issue) for beginner-friendly tasks
- **Help Wanted**: Look for [`help wanted`](https://github.com/aaditya-dubey09/devodyssey/labels/help%20wanted) issues that need attention
- **Bug Reports**: Browse [open bugs](https://github.com/aaditya-dubey09/devodyssey/labels/bug) and help fix them
- **Feature Requests**: Implement new features from the [feature requests](https://github.com/aaditya-dubey09/devodyssey/labels/enhancement)

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes**: Help us squash bugs
- **New features**: Implement functionality from the roadmap or propose new ideas
- **Documentation**: Improve README files, add code comments, or create guides
- **UI/UX improvements**: Enhance the user interface and experience
- **Performance optimizations**: Make the application faster and more efficient
- **Tests**: Add or improve test coverage
- **Code refactoring**: Improve code quality without changing functionality

## Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
# Update your fork with the latest changes
git checkout main
git pull upstream main

# Create a new branch
git checkout -b <type>/<description>
```

**Branch naming conventions:**

- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring
- `test/description` - for adding or updating tests

**Examples:**

```bash
git checkout -b feature/user-profile-page
git checkout -b fix/login-validation-error
git checkout -b docs/api-endpoints-guide
```

### Making Changes

1. Make your changes in your feature branch
2. Test your changes thoroughly
3. Ensure your code follows our [coding standards](#coding-standards)
4. Update documentation if necessary
5. Add or update tests if applicable

### Keeping Your Branch Updated

Regularly sync your branch with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for clear and organized commit messages.

### Commit Message Format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without functionality changes
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes
- **ci**: CI/CD configuration changes

### Examples

```bash
# Simple commit
git commit -m "feat: add user profile editing functionality"

# Commit with scope
git commit -m "fix(auth): resolve JWT token expiration issue"

# Commit with body and footer
git commit -m "feat(blog): add markdown preview

- Implement live markdown preview
- Add syntax highlighting
- Include preview toggle button

Closes #123"
```

### Best Practices

- Use the imperative mood ("add feature" not "added feature")
- Keep the subject line under 50 characters
- Capitalize the subject line
- Don't end the subject line with a period
- Separate subject from body with a blank line
- Wrap the body at 72 characters
- Use the body to explain what and why, not how

## Pull Request Process

### Before Submitting

Ensure your PR meets these requirements:

- [ ] Code follows the project's coding standards
- [ ] All tests pass (`npm test`)
- [ ] New tests have been added for new features
- [ ] Documentation has been updated
- [ ] Commit messages follow the conventional commits format
- [ ] No merge conflicts with the main branch
- [ ] Code has been tested locally

### Submitting a Pull Request

1. **Push your branch to your fork**

   ```bash
   git push origin <branch-name>
   ```

2. **Open a Pull Request**

   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill out the PR template with:
     - Clear title following conventional commits format
     - Detailed description of changes
     - Related issue numbers (use "Closes #123" or "Fixes #123")
     - Screenshots or GIFs for UI changes
     - Any breaking changes or migrations needed

3. **Address review feedback**

   - Respond to comments promptly
   - Make requested changes in new commits
   - Push updates to the same branch
   - Re-request review when ready

### PR Review Process

- At least one maintainer review is required
- CI/CD checks must pass
- All conversations must be resolved
- Maintainers may request changes or provide suggestions
- Once approved, a maintainer will merge your PR

## Coding Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Follow the DRY (Don't Repeat Yourself) principle
- Keep functions small and focused on a single task
- Use meaningful variable and function names
- Add comments for complex logic
- Remove commented-out code and console.logs before committing

### JavaScript/React Standards

- Use ES6+ syntax (arrow functions, destructuring, etc.)
- Prefer functional components over class components
- Use React Hooks appropriately
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use PropTypes or TypeScript for type checking

### Code Formatting

- Run `npm run lint` before committing
- Use Prettier for consistent formatting
- Follow the existing code style in the project
- Indent with 2 spaces (not tabs)

### File Organization

- Group related files together
- Use clear and descriptive file names
- Keep file sizes reasonable (under 300 lines when possible)
- Export components from index files for cleaner imports

## Testing Guidelines

### Writing Tests

- Write tests for all new features
- Update tests when modifying existing features
- Aim for high test coverage (80%+ is ideal)
- Test edge cases and error conditions
- Use descriptive test names

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Types

- **Unit tests**: Test individual functions and components
- **Integration tests**: Test how components work together
- **E2E tests**: Test complete user workflows

## Documentation

### When to Update Documentation

Update documentation when you:

- Add new features
- Change existing functionality
- Add new API endpoints
- Modify environment variables
- Change deployment procedures
- Update dependencies

### Documentation Standards

- Use clear and concise language
- Include code examples where helpful
- Keep README files up to date
- Add JSDoc comments for functions
- Document API endpoints with parameters and responses

## Community

### Getting Help

- **GitHub Issues**: Ask questions by opening an issue with the `question` label
- **Discussions**: Use GitHub Discussions for general conversations
- **Email**: Contact maintainers at [ad2340033@gmail.com](mailto:ad2340033@gmail.com)

### Communication Guidelines

- Be respectful and professional
- Search for existing issues before creating new ones
- Provide clear and detailed information in issues
- Stay on topic in discussions
- Be patient with maintainers and reviewers

## Recognition

Contributors who submit accepted PRs will be:

- Added to the contributors list
- Credited in release notes
- Mentioned in project documentation

---

Thank you for contributing to DevOdyssey! Your efforts help make this project better for everyone.

**Questions?** Feel free to reach out through GitHub Issues or email us at [ad2340033@gmail.com](mailto:ad2340033@gmail.com).