# HTML Programming Workspace

A comprehensive HTML programming workspace with all essential VS Code extensions pre-configured for professional web development.

## 📁 Project Structure

```
.
├── index.html              # Main HTML file
├── src/
│   ├── styles.css         # Stylesheets
│   └── script.js          # JavaScript files
├── assets/                # Images, fonts, etc.
├── .vscode/               # VS Code settings
└── README.md              # This file
```

## 🚀 Getting Started

1. Open this workspace in VS Code
2. All recommended extensions are automatically installed
3. Start editing HTML, CSS, and JavaScript files
4. Use Live Server to preview changes in real-time

## 📦 Installed Extensions

### HTML & Template Support
- **HTML CSS Support** - CSS id and class attribute completion
- **IntelliSense for CSS** - CSS class and ID suggestions
- **Emmet** - Built-in HTML/CSS abbreviations and snippets

### Code Quality & Formatting
- **ESLint** - JavaScript linting
- **Prettier** - Code formatter
- **CSS Peek** - Peek at CSS definitions from HTML

### Productivity Tools
- **Live Server** - Launch local development server with live reload
- **Bracket Pair Colorizer** - Highlight matching brackets
- **Path Intellisense** - Auto-complete file paths
- **Thunder Client** - API testing

### HTML & CSS
- **HTML Boilerplate** - Quick HTML5 templates
- **Autoprefixer** - Auto-add CSS vendor prefixes
- **W3C Validation** - HTML/CSS validation

### JavaScript Support
- **JavaScript (ES6) code snippets** - Popular snippets
- **Better Comments** - Highlight important comments

### General Development
- **GitLens** - Git blame and history
- **REST Client** - Test REST APIs
- **Markdown Preview Enhanced** - Better markdown preview

## 🛠️ Features

- **Live Server**: Real-time preview with auto-refresh
- **Code Suggestions**: Intelligent IntelliSense for HTML, CSS, and JavaScript
- **Code Formatting**: Automatic code formatting with Prettier
- **Linting**: JavaScript validation with ESLint
- **CSS Validation**: CSS error highlighting and suggestions
- **Git Integration**: Built-in Git support with GitLens
- **Snippets**: Quick code templates for faster development

## 💡 Tips

- Use **Emmet** shortcuts: Type `!` and press Tab for HTML5 boilerplate
- Press **Ctrl+Space** for IntelliSense suggestions
- Use **Live Server** by right-clicking on index.html → "Open with Live Server"
- Format code with **Prettier**: Ctrl+Shift+P → Format Document

## 📝 Quick Commands

- `Ctrl+Shift+P` - Open command palette
- `Ctrl+K Ctrl+F` - Format document
- `Ctrl+/` - Toggle comment
- `Alt+Shift+F` - Format document
- `F5` - Open in browser (with Live Server)

## 🎯 Next Steps

1. Edit `index.html` to create your web pages
2. Customize `src/styles.css` for your design
3. Add functionality with `src/script.js`
4. Use Live Server for instant preview
5. Add more files as your project grows

## 📚 Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [HTML Standard](https://html.spec.whatwg.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript Info](https://javascript.info/)

## ✅ Recommended VS Code Settings

Add to `.vscode/settings.json` for optimal development:

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[html]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[css]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "emmet.includeLanguages": {
        "javascript": "html"
    }
}
```

---

Happy coding! 🎉
