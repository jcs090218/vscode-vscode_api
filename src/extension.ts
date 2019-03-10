'use strict';

import * as vscode from 'vscode';

import { VSCodeAPI } from "./vscode_api";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let testCommands = vscode.commands.registerCommand(
        'vscode-api.testStatus',
        () => {
            let api = getAPI();
            if (!api) { return; }

            console.log("----------------- Start VSCode API Test -----------------");

            console.log("Is beginnnig of line? " + api.isBeginningOfLine());
            console.log("Is end of line? " + api.isEndOfLine());
            console.log("Is beginnnig of buffer? " + api.isBeginningOfBuffer());
            console.log("Is end of buffer? " + api.isEndOfBuffer());

            console.log("Current line number: " + api.currentLine());
            console.log("Current column: " + api.currentColumn());

            console.log("----------------- End VSCode API Test -----------------");
        });

    let testStatus = vscode.commands.registerCommand(
        'vscode-api.testCommands',
        () => {
            let api = getAPI();
            if (!api) { return; }

            api.backwardDeleteChar();
            //console.log("BP: " + api.linesBetweenTwoPoints(50, 0));
        });


    registerVSCodeAPI(context);

    context.subscriptions.push(testCommands);
    context.subscriptions.push(testStatus);
}

// this method is called when your extension is deactivated
export function deactivate() { }

/**
 * @desc Get one instance of VS Code API.
 */
function getAPI() : VSCodeAPI | null {
    let editor = VSCodeAPI.getActiveTextEditor();
    if (!editor) {
        return null;
    }
    return new VSCodeAPI(editor);
}


/**
 * @desc Register all the vscode api to test.
 * @param { vscode.ExtensionContext } context : extension context.
 */
function registerVSCodeAPI(context: vscode.ExtensionContext) {

    let nextLine = vscode.commands.registerCommand(
        'vscode-api.nextLine',
        () => {
            let api = getAPI();
            if (!api) { return; }

            api.nextLine();
        });

    let previousLine = vscode.commands.registerCommand(
        'vscode-api.previousLine',
        () => {
            let api = getAPI();
            if (!api) { return; }

            api.previousLine();
        });

    let forwardChar = vscode.commands.registerCommand(
        'vscode-api.forwardChar',
        () => {
            let api = getAPI();
            if (!api) { return; }

            api.forwardChar();
        });

    let backwardChar = vscode.commands.registerCommand(
        'vscode-api.backwardChar',
        () => {
            let api = getAPI();
            if (!api) { return; }

            api.backwardChar();
        });

    let newline = vscode.commands.registerCommand(
        'vscode-api.newline',
        () => {
            let api = getAPI();
            if (!api) { return; }

            api.newline();
        });


    context.subscriptions.push(nextLine);
    context.subscriptions.push(previousLine);
    context.subscriptions.push(forwardChar);
    context.subscriptions.push(backwardChar);
    context.subscriptions.push(newline);
}
