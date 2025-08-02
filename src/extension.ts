// src/extension.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Default folders/files to ignore
const DEFAULT_IGNORE = new Set([
  'node_modules',
  'build',
  'dist',
  'out',
  '.dart_tool',
  '.git',
  '.DS_Store',
  'flutter_plugins',
  '.idea',
  '.vscode',
  '__pycache__',
  'coverage',
  'tmp',
  'temp',
  '.next',
  'venv',
  '.env',
  'logs',
  'npm-debug.log',
  'yarn-error.log'
]);

function isIgnored(item: string): boolean {
  return DEFAULT_IGNORE.has(item) || item.startsWith('.') || item.endsWith('.log');
}

function buildTree(dir: string, prefix = '', isLast = true, depth = 0, maxDepth = 10): string {
  if (depth > maxDepth) return '';

  try {
    const items = fs.readdirSync(dir).filter(item => !isIgnored(item));
    if (items.length === 0) return '';

    // Sort: directories first, then files
    const sorted = items.sort((a, b) => {
      const aIsDir = fs.statSync(path.join(dir, a)).isDirectory();
      const bIsDir = fs.statSync(path.join(dir, b)).isDirectory();
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

    let tree = '';

    sorted.forEach((item, index) => {
      const isLastItem = index === sorted.length - 1;
      const currentPrefix = prefix + (isLast ? '    ' : '│   ');
      const line = prefix + (isLastItem ? '└── ' : '├── ') + item;
      const fullPath = path.join(dir, item);

      tree += line + '\n';

      if (fs.statSync(fullPath).isDirectory()) {
        tree += buildTree(fullPath, currentPrefix, isLastItem, depth + 1, maxDepth);
      }
    });

    return tree;
  } catch (err) {
    console.error('Error building tree:', err);
    return '';
  }
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('doctree.generateTree', () => {
    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder) {
      vscode.window.showWarningMessage('📁 Open a project folder first.');
      return;
    }

    const rootPath = folder.uri.fsPath;
    const tree = buildTree(rootPath, '', true, 0, 8);

    if (!tree.trim()) {
      vscode.window.showErrorMessage('❌ Could not generate project structure.');
      return;
    }

    const lines = tree.split('\n').filter(l => l.trim());
    const isLarge = lines.length > 50;

    let markdownTree = tree;

    if (isLarge) {
      const preview = lines.slice(0, 20).join('\n');
      markdownTree = `${preview}\n├── ...\n[View full structure →](fs-full.md)\n`;

      const fullTreePath = path.join(rootPath, 'fs-full.md');
      const fullContent = `# Project Structure\n\n\`\`\`\n${tree}\`\`\`\n`;
      try {
        fs.writeFileSync(fullTreePath, fullContent);
        vscode.window.showInformationMessage('📄 Full structure saved to fs-full.md');
      } catch (err) {
        vscode.window.showWarningMessage('⚠️ Could not save fs-full.md');
      }
    }

    const insertText = '```\n' + markdownTree + '```\n\n';
    const readmePath = path.join(rootPath, 'README.md');
    const readmeUri = vscode.Uri.file(readmePath);

    (async () => {
      try {
        await vscode.workspace.fs.stat(readmeUri);

        const choice = await vscode.window.showQuickPick(
          ['Yes, insert in README.md', 'No, insert in current file'],
          { placeHolder: 'README.md found. Insert there?' }
        );

        if (choice?.includes('Yes')) {
          const doc = await vscode.workspace.openTextDocument(readmeUri);
          await vscode.window.showTextDocument(doc, { preview: false });
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            await editor.edit(editBuilder => {
              editBuilder.insert(editor.document.positionAt(0), insertText);
            });
            vscode.window.showInformationMessage('✅ Tree inserted into README.md');
            return;
          }
        }
      } catch {
        const create = await vscode.window.showInformationMessage(
          'No README.md found. Would you like to create one?',
          'Yes',
          'No'
        );

        if (create === 'Yes') {
          const projectName = path.basename(rootPath);
          const readmeContent = `# ${projectName}\n\nA project built with care.\n\n## Project Structure\n${insertText}`;
          await vscode.workspace.fs.writeFile(readmeUri, Buffer.from(readmeContent, 'utf8'));
          
          const doc = await vscode.workspace.openTextDocument(readmeUri);
          await vscode.window.showTextDocument(doc);
          vscode.window.showInformationMessage('📄 README.md created and tree inserted!');
          return;
        }
      }

      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.uri.scheme === 'file') {
        await editor.edit(editBuilder => {
          editBuilder.insert(editor.selection.start, insertText);
        });
        vscode.window.showInformationMessage('✅ Tree inserted into current file!');
      } else {
        await vscode.env.clipboard.writeText(insertText);
        vscode.window.showInformationMessage('📋 Tree copied to clipboard!');
      }
    })();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}