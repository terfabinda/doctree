# 🌲 DocTree – Project Structure Generator

Generate clean, readable directory trees for your `README.md` instantly.  
Perfect for open-source projects, investor docs, and team onboarding.

## 🌟 Features

- **Auto-generate** project structure trees
- **Smart abbreviation** for large projects (shows `...` after 20 lines)
- **Auto-create `README.md`** if missing
- **Save full structure** to `fs-full.md` for deep dives
- **Insert directly** into your file or copy to clipboard
- **Ignores** common folders: `node_modules`, `build`, `.git`, `.dart_tool`, etc.
- **Works in any language project**: Flutter, React, Python, Android, Node.js, and more

## 🛠️ Requirements

- Visual Studio Code
- No additional setup needed
- Works out of the box with any project folder

> 💡 Tip: Open your project root in VS Code for best results

## ⚙️ Extension Settings

This extension currently has no settings, but future versions will support:

- Custom ignore patterns (via `.doctreerc`)
- Insertion depth limit
- Markdown template customization

## 🐛 Known Issues

- May fail if the project has permission restrictions (e.g., system folders)
- Very deeply nested folders may cause slight delays (rare)
- On some Windows systems, long paths may not resolve correctly (Windows path limit)

> We’re actively working to improve performance and compatibility.

## 📢 Release Notes

### 1.0.0 – Initial Release

- First public release
- Tree generation with smart indentation
- Supports directory and file listing
- Ignores common dev folders

### 1.0.1 – Clipboard Fallback

- Added clipboard copy if no editable file is open
- Improved error handling
- Better user feedback with notifications

### 1.1.0 – Auto-Create README & Smart Insert

- ✅ Now detects if `README.md` exists
- Prompts user to insert there or use current file
- If `README.md` is missing, offers to **create it automatically**
- Adds full tree to `fs-full.md` for large projects
- Improved sorting: directories first, then files

---

## 📚 Following Extension Guidelines

This extension follows [Visual Studio Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines):

- ✅ Clear, concise description
- ✅ Proper categorization (`Other`)
- ✅ No unnecessary permissions
- ✅ Respectful of user workflow
- ✅ Lightweight and fast
- ✅ Works offline

---

## 🚀 How to Use

1. Open your project in VS Code
2. Press `Ctrl+Shift+P`
3. Run: **`DocTree: Generate Project Structure`**
4. Watch it insert a clean tree into your `README.md` — or create one if missing!

---

## 🤝 Feedback & Support

We'd love to hear from you!

- 🐞 Report bugs or issues: [GitHub Issues](https://github.com/terfabinda/doctree/issues)
- 💡 Suggest features: [GitHub Discussions](https://github.com/terfabinda/doctree/discussions)
- 📣 For npm CLI help: Visit [GitHub Community - npm](https://github.com/community/discussions?discussions_q=repo%3Anpm/cli)
- 🔍 Troubleshoot builds: Use [Gradle Help](https://help.gradle.org) for build scan insights

---

## 🎉 Thank You!

Thanks for using **DocTree** — the simple, smart way to document your project structure.

Let’s make every `README.md` beautiful. 💫

---

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

**Enjoy!**
