[![Build Status](https://travis-ci.com/jcs090218/vscode_api.svg?branch=master)](https://travis-ci.com/jcs090218/vscode_api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


# VS Code - API

Easier way to use VS Code API.


## Getting Started
### 1. Import this Tool
Add this line to the code to start to use this tool.
```ts
import { vscode_api } from "./vscode_api";
```

### 2. Create API class.
Ensure you are in a valid text editor.
```ts
let editor = vscode.window.activeTextEditor;

if (!editor)
    return;

// Create the API.
let api = new VSCodeAPI(editor);
```

### 3. Enjoy!~


## API
List of API that this tool provided.


## Development

