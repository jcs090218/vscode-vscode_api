'use strict';

import * as vscode from 'vscode';

import { vscode_api } from "./vscode_api";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let testCommands = vscode.commands.registerCommand(
        'vscode-api.testStatus',
        () => {
            let editor = vscode_api.getActiveTextEditor();
            if (!editor) {
                return;
            }

            console.log("----------------- Start VSCode API Test -----------------");

            console.log("Is beginnnig of line? " + vscode_api.isBeginningOfLine(editor));
            console.log("Is end of line? " + vscode_api.isEndOfLine(editor));
            console.log("Is beginnnig of buffer? " + vscode_api.isBeginningOfBuffer(editor));
            console.log("Is end of buffer? " + vscode_api.isEndOfBuffer(editor));

            console.log("Current line number: " + vscode_api.currentLine(editor));
            console.log("Current column: " + vscode_api.currentColumn(editor));

            console.log("----------------- End VSCode API Test -----------------");
        });

    let testStatus = vscode.commands.registerCommand(
        'vscode-api.testCommands',
        () => {
            let editor = vscode_api.getActiveTextEditor();
            if (!editor) {
                return;
            }

            vscode_api.backwardDeleteChar(editor);
            //console.log("BP: " + vscode_api.linesBetweenTwoPoints(editor, 50, 0));
        });


    registerVSCodeAPI(context);

    context.subscriptions.push(testCommands);
    context.subscriptions.push(testStatus);
}

// this method is called when your extension is deactivated
export function deactivate() {}


/**
 * @desc Register all the vscode api to test.
 * @param { vscode.ExtensionContext } context : extension context.
 */
function registerVSCodeAPI(context : vscode.ExtensionContext) {

    let nextLine = vscode.commands.registerCommand(
        'vscode-api.nextLine',
        () => {
            let editor = vscode_api.getActiveTextEditor();
            if (!editor) {
                return;
            }
            vscode_api.nextLine(editor);
        });

    let previousLine = vscode.commands.registerCommand(
        'vscode-api.previousLine',
        () => {
            let editor = vscode_api.getActiveTextEditor();
            if (!editor) {
                return;
            }
            vscode_api.previousLine(editor);
        });

    let forwardChar = vscode.commands.registerCommand(
        'vscode-api.forwardChar',
        () => {
            let editor = vscode_api.getActiveTextEditor();
            if (!editor) {
                return;
            }
            vscode_api.forwardChar(editor);
        });

    let backwardChar = vscode.commands.registerCommand(
        'vscode-api.backwardChar',
        () => {
            let editor = vscode_api.getActiveTextEditor();
            if (!editor) {
                return;
            }
            vscode_api.backwardChar(editor);
        });


    context.subscriptions.push(nextLine);
    context.subscriptions.push(previousLine);
}
