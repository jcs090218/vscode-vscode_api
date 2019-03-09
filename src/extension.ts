'use strict';

import * as vscode from 'vscode';

import { VSCodeAPI } from "./vscode_api";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let testCommands = vscode.commands.registerCommand(
        'vscode-api.testStatus',
        () => {
            let editor = VSCodeAPI.getActiveTextEditor();
            if (!editor) {
                return;
            }

            let vscode_api = new VSCodeAPI(editor);

            console.log("----------------- Start VSCode API Test -----------------");

            console.log("Is beginnnig of line? " + vscode_api.isBeginningOfLine());
            console.log("Is end of line? " + vscode_api.isEndOfLine());
            console.log("Is beginnnig of buffer? " + vscode_api.isBeginningOfBuffer());
            console.log("Is end of buffer? " + vscode_api.isEndOfBuffer());

            console.log("Current line number: " + vscode_api.currentLine());
            console.log("Current column: " + vscode_api.currentColumn());

            console.log("----------------- End VSCode API Test -----------------");
        });

    let testStatus = vscode.commands.registerCommand(
        'vscode-api.testCommands',
        () => {
            let editor = VSCodeAPI.getActiveTextEditor();
            if (!editor) {
                return;
            }

            let vscode_api = new VSCodeAPI(editor);

            vscode_api.backwardDeleteChar();
            //console.log("BP: " + vscode_api.linesBetweenTwoPoints(50, 0));
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
            let editor = VSCodeAPI.getActiveTextEditor();
            if (!editor) {
                return;
            }
            let vscode_api = new VSCodeAPI(editor);

            vscode_api.nextLine();
        });

    let previousLine = vscode.commands.registerCommand(
        'vscode-api.previousLine',
        () => {
            let editor = VSCodeAPI.getActiveTextEditor();
            if (!editor) {
                return;
            }
            let vscode_api = new VSCodeAPI(editor);

            vscode_api.previousLine();
        });

    let forwardChar = vscode.commands.registerCommand(
        'vscode-api.forwardChar',
        () => {
            let editor = VSCodeAPI.getActiveTextEditor();
            if (!editor) {
                return;
            }
            let vscode_api = new VSCodeAPI(editor);

            vscode_api.forwardChar();
        });

    let backwardChar = vscode.commands.registerCommand(
        'vscode-api.backwardChar',
        () => {
            let editor = VSCodeAPI.getActiveTextEditor();
            if (!editor) {
                return;
            }
            let vscode_api = new VSCodeAPI(editor);

            vscode_api.backwardChar();
        });


    context.subscriptions.push(nextLine);
    context.subscriptions.push(previousLine);
}
