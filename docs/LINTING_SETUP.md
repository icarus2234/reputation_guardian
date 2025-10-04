# ESLint & Prettier Setup Guide 🎨

## ✅ Configuration Complete

Your project now has ESLint and Prettier configured and ready to use!

## 📦 Install Required Packages

First, install the new dependencies:

```bash
npm install --save-dev eslint-config-prettier eslint-plugin-prettier prettier
```

Or if you prefer to install all dependencies fresh:

```bash
npm install
```

## 📁 Files Created

### 1. **ESLint Configuration** (`.eslintrc.json`)
- Extends React App defaults
- TypeScript support
- Prettier integration
- Relaxed rules (warnings instead of errors)

### 2. **Prettier Configuration** (`.prettierrc`)
- Single quotes for strings
- Semicolons enabled
- 2 spaces for indentation
- 100 character line width
- Trailing commas (ES5 compatible)

### 3. **Ignore Files**
- `.prettierignore` - Files Prettier should skip
- `.eslintignore` - Files ESLint should skip

### 4. **VS Code Settings** (`.vscode/`)
- Auto-format on save
- Auto-fix ESLint issues on save
- Recommended extensions

## 🚀 Usage

### Format Your Code

```bash
# Format all files
npm run format

# Check if files are formatted (without changing)
npm run format:check
```

### Lint Your Code

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Run Both

```bash
# Format first, then lint
npm run format && npm run lint:fix
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Check for linting errors |
| `npm run lint:fix` | Auto-fix linting errors |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check if files are formatted |

## ⚙️ VS Code Integration

### Recommended Extensions

The project includes recommended VS Code extensions:

1. **ESLint** (`dbaeumer.vscode-eslint`) - Linting support
2. **Prettier** (`esbenp.prettier-vscode`) - Code formatting
3. **ES7+ React Snippets** (`dsznajder.es7-react-js-snippets`) - React snippets
4. **TypeScript** (`ms-vscode.vscode-typescript-next`) - TS support

VS Code will prompt you to install these when you open the project.

### Auto-Format on Save

The workspace settings (`.vscode/settings.json`) enable:
- ✅ Format on save with Prettier
- ✅ Auto-fix ESLint issues on save
- ✅ Consistent line endings (LF)

## 🎨 Prettier Rules

```json
{
  "semi": true,                    // Use semicolons
  "singleQuote": true,             // Use single quotes
  "printWidth": 100,               // Max line length
  "tabWidth": 2,                   // 2 spaces per tab
  "trailingComma": "es5",          // Trailing commas where valid
  "arrowParens": "always",         // Always wrap arrow function params
  "endOfLine": "lf"                // Unix line endings
}
```

### Example

**Before:**
```typescript
const greeting = "Hello World"
const add = (a,b) => {
return a+b
}
```

**After:**
```typescript
const greeting = 'Hello World';
const add = (a, b) => {
  return a + b;
};
```

## 🔍 ESLint Rules

### Current Configuration (Relaxed)

- ✅ **Warnings** instead of errors (won't break build)
- ✅ `no-console` - Warns about console.log
- ✅ `no-debugger` - Warns about debugger statements
- ✅ `prefer-const` - Suggests const over let
- ⚠️ `@typescript-eslint/no-explicit-any` - **OFF** (allows `any` types)
- ⚠️ Unused variables - **Warn** only

### Why Relaxed?

Since you disabled strict TypeScript checking, ESLint is also configured to be more permissive:
- Won't block development
- Warnings instead of errors
- Allows `any` types
- Flexible for rapid prototyping

## 🛠️ Customization

### Make Rules Stricter

Edit `.eslintrc.json` to change rule severity:

```json
{
  "rules": {
    "no-console": "error",              // Change from "warn" to "error"
    "@typescript-eslint/no-explicit-any": "warn"  // Enable any type warnings
  }
}
```

### Prettier Settings

Edit `.prettierrc` to change formatting:

```json
{
  "singleQuote": false,    // Use double quotes
  "printWidth": 120,       // Longer lines
  "tabWidth": 4            // 4 spaces instead of 2
}
```

## 🚨 Common Issues

### ESLint Errors in VS Code

If you see ESLint errors in VS Code:

1. Install the ESLint extension
2. Reload VS Code: `Cmd/Ctrl + Shift + P` → "Reload Window"
3. Check Output panel: View → Output → Select "ESLint"

### Prettier Not Formatting

1. Install Prettier extension for VS Code
2. Set as default formatter: `Cmd/Ctrl + Shift + P` → "Format Document With..." → "Prettier"
3. Enable format on save in settings

### Conflicting Settings

If ESLint and Prettier conflict:

```bash
# This shouldn't happen with our config, but if it does:
npm run format && npm run lint:fix
```

## 📖 Best Practices

### 1. Format Before Committing

```bash
npm run format && npm run lint:fix
```

### 2. Use Git Hooks (Optional)

Install husky and lint-staged for automatic formatting:

```bash
npm install --save-dev husky lint-staged
npx husky install
```

Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --fix"
    ]
  }
}
```

### 3. Team Consistency

Everyone on your team should:
- Install recommended VS Code extensions
- Use the same Prettier/ESLint versions
- Enable format on save

## 🎯 Quick Commands

```bash
# Setup (one time)
npm install

# Daily workflow
npm run dev              # Start dev server
npm run format           # Format code
npm run lint:fix         # Fix linting issues

# Before commit
npm run format && npm run lint:fix && npm run build
```

## 💡 Tips

1. **Auto-format on save** is enabled in VS Code settings
2. **Semicolons** are automatically added
3. **Single quotes** for strings (except JSX props)
4. **Trailing commas** for multi-line arrays/objects
5. **2 spaces** for indentation (not tabs)

## 🔥 Features

- ✅ ESLint + TypeScript integration
- ✅ Prettier code formatting
- ✅ VS Code auto-format on save
- ✅ Auto-fix on save
- ✅ Consistent code style across team
- ✅ Relaxed rules (warnings, not errors)
- ✅ React & JSX support
- ✅ Import sorting (optional)

## 📚 Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [ESLint + Prettier Integration](https://prettier.io/docs/en/integrating-with-linters.html)

## ✨ You're All Set!

Your code will now be automatically formatted and linted. Just save your files and watch the magic happen! 🎨✨

---

**Questions?** Check the main README.md or GETTING_STARTED.md for more information.

