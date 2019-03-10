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
// Get the current text editor.
let editor = vscode.window.activeTextEditor;
if (!editor)
    return;

// Create the API.
let api = new VSCodeAPI(editor);
```

### 3. Enjoy!~
Start using the API from this tool. For instance, 
```ts
// Make cursor goto the end of the current line.
api.endOfLine();
```
*Check out the API section for more API informations!!*


## API
List of API that this tool provided.


## Development
Here are the following steps to contribute to this project. 
### 1. Clone this repository
```sh
$ git clone https://github.com/jcs090218/vscode-vscode_api
```

### 2. Start the project with VSCode
```sh
# Goto the project directory.
$ cd vscode-vscode_api

# Start the VSCode and start developing the tool.
$ code .
```

### 3. Make a pull request
Lastly, make a pull request to submit what you had changed to 
this project. There shouldn't be any issue by directly open the 
project from VS Code and you can hit `F5` to start development 
and test.
