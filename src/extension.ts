'use strict';

import * as vscode from 'vscode';

import { vscode_api } from "./vscode_api";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let testCommands = vscode.commands.registerCommand('vscode-api.testStatus', () => {
        let editor = vscode_api.getActiveTextEditor();
        if (!editor) {
            return;
        }

        console.log("----------------- Start VSCode API Test -----------------");

        console.log("Is beginnnig of line? " + vscode_api.isBeginningOfLine(editor));
        console.log("Is end of line? " + vscode_api.isEndOfLine(editor));
        console.log("Is beginnnig of buffer? " + vscode_api.isBeginningOfBuffer(editor));
        //console.log("Is end of buffer? " + vscode_api.isEndOfBuffer(editor));

        console.log("Current line number: " + vscode_api.currentLine(editor));
        console.log("Current column: " + vscode_api.currentColumn(editor));

        console.log("----------------- End VSCode API Test -----------------");
    });

    let testStatus = vscode.commands.registerCommand('vscode-api.testCommands', () => {
        let editor = vscode_api.getActiveTextEditor();
        if (!editor) {
            return;
        }

        //vscode_api.toPoint(editor, 7, 51);
        //vscode_api.backwardChar(editor);
        //vscode_api.findEndColumn(editor);
        //vscode_api.findEndColumn(editor);

        vscode_api.endOfLine(editor);
    });


    context.subscriptions.push(testCommands);
    context.subscriptions.push(testStatus);
}

// this method is called when your extension is deactivated
export function deactivate() {}
