/**
 * $File: vscode_api.ts $
 * $Date: 2019-02-28 23:38:47 $
 * $Revision: $
 * $Creator: Jen-Chieh Shen $
 * $Notice: See LICENSE.txt for modification and distribution information
 *                   Copyright © 2019 by Shen, Jen-Chieh $
 */

import * as vscode from 'vscode';


export namespace vscode_api {

    /**
     * @desc Get the current active text editor.
     * @return { vscode.TextEditor } Currently active text editor.
     */
    export function getActiveTextEditor() : vscode.TextEditor | undefined {
        return vscode.window.activeTextEditor;
    }

    /**
     * @desc Reveal range in the editor.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     */
    export function revealRange(editor : vscode.TextEditor) : void {
        let revealType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
        editor.revealRange(editor.selection, revealType);
    }

    /**
     * @desc Execute the command.
     * @param { string } cmd : Command string.
     */
    export function executeCommand(cmd : string) : void {
        vscode.commands.executeCommand(cmd);
    }

    /**
     * @desc Execute same commands multiple times.
     * @param { string } cmd : Command string.
     * @param { number } n : execution count.
     */
    function executeCommandLoop(cmd : string, n : number) : void {
        for (let count = 0; count < n; ++count) {
            executeCommand(cmd);
        }
    }

    /**
     * @desc Returns current line number.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @return { number } : Current line number.
     */
    export function currentLine(editor : vscode.TextEditor) : number {
        return editor.selection.active.line;
    }

    /**
     * @desc Returns current column number.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @return { number } : Current line number.
     */
    export function currentColumn(editor : vscode.TextEditor) : number {
        return editor.selection.active.character;
    }

    /**
     * @desc Is current cursor at the beginning of the line.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @return { boolean } : Is beginning of the line?
     */
    export function isBeginningOfLine(editor : vscode.TextEditor) : boolean {
        return currentColumn(editor) === 0;
    }

    /**
     * @desc Is current cursor at the end of the line.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @return { boolean } : Is end of the line?
     */
    export function isEndOfLine(editor : vscode.TextEditor) : boolean {
        let saveCl = currentColumn(editor);
        endOfLine(editor);
        let endColumn = currentColumn(editor);
        toColumn(editor, saveCl);  // Back to original position.
        return endColumn === saveCl;
    }

    /**
     * @desc Is current cursor at the beginning of the buffer.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @return { boolean } : Is beginning of the buffer?
     */
    export function isBeginningOfBuffer(editor : vscode.TextEditor) : boolean {
        return isBeginningOfLine(editor) && currentLine(editor) === 0;
    }

    /**
     * @desc Is current cursor at the end of the buffer.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @return { boolean } : Is end of the buffer?
     */
    export function isEndOfBuffer(editor : vscode.TextEditor) : boolean {
        let saveLn = currentLine(editor);
        let saveCl = currentColumn(editor);
        endOfBuffer(editor);
        let endLine = currentLine(editor);
        let endColumn = currentColumn(editor);
        toPoint(editor, saveLn, saveCl);  // Back to original position.
        return (saveLn === endLine && saveCl === endColumn);
    }

    /** @desc Goto next line. */
    export function nextLine(editor : vscode.TextEditor, n : number = 1) : void {
        for (let count = 0; count < n; ++count) {
            toLine(editor, currentLine(editor) + 1);
        }
    }

    /** @desc Goto previous line. */
    export function previousLine(editor : vscode.TextEditor, n : number = 1) : void {
        for (let count = 0; count < n; ++count) {
            toLine(editor, currentLine(editor) - 1);
        }
    }

    /**
     * @desc Move to beginning of the line.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     */
    export function beginningOfLine(editor : vscode.TextEditor) : void { toColumn(editor, 0); }

    /**
     * @desc Move to end of the line.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     */
    export function endOfLine(editor : vscode.TextEditor) : void { toColumn(editor, Number.MAX_SAFE_INTEGER); }

    /**
     * @desc Move to beginning of the buffer.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     */
    export function beginningOfBuffer(editor : vscode.TextEditor) : void { gotoChar(editor, 0); }

    /**
     * @desc Move to end of the buffer.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     */
    export function endOfBuffer(editor : vscode.TextEditor) : void { gotoChar(editor, Number.MAX_SAFE_INTEGER); }

    /**
     * @desc Forward a character.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @param { number } n : Forward n characters.
     */
    export function forwardChar(editor : vscode.TextEditor, n : number = 1) : void { gotoCharDelta(editor, n); }

    /**
     * @desc Backward a character.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @param { number } n : Backward n characters.
     */
    export function backwardChar(editor : vscode.TextEditor, n : number = 1) : void { gotoCharDelta(editor, -n); }

    /**
     * @desc Move cursor to target point.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @param { number } ln : Target line number.
     * @param { number } cl : Target column.
     */
    export function toPoint(editor : vscode.TextEditor, ln : number, cl : number) : void {
        let newPos = new vscode.Position(ln, cl);
        let valPos = editor.document.validatePosition(newPos);
        editor.selection =  new vscode.Selection(valPos, valPos);
        revealRange(editor);
    }

    /**
     * @desc Move cursor to target point.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @param { number } pt : Target point.
     */
    export function gotoChar(editor : vscode.TextEditor, pt : number) : void {
        let newPos = editor.document.positionAt(pt);
        editor.selection = new vscode.Selection(newPos, newPos);
        revealRange(editor);
    }

    /**
     * @desc Returns the current point position.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @return { number } : Current point position.
     */
    export function getPoint(editor : vscode.TextEditor) : number {
        return editor.document.offsetAt(getPosition(editor));
    }

    /**
     * @desc Get the current cursor position.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @return { vscode.Position } : Current cursor position.
     */
    export function getPosition(editor : vscode.TextEditor) : vscode.Position {
        return editor.selection.active;
    }

    /**
     * @desc Move curosr by adding the delta point.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @param { number } dp : Delta point.
     */
    export function gotoCharDelta(editor : vscode.TextEditor, dp : number) : void {
        let newPt = getPoint(editor) + dp;
        gotoChar(editor, newPt);
    }

    /**
     * @desc Move cursor to target line.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @param { number } ln : Target line number.
     */
    export function toLine(editor : vscode.TextEditor, ln : number) : void {
        toPoint(editor, ln, currentColumn(editor));
    }

    /**
     * @desc Move cursor to target column.
     * @param { vscode.TextEditor } editor : Currently active text editor.
     * @param { number } cl : Target column.
     */
    export function toColumn(editor : vscode.TextEditor, cl : number) : void {
        toPoint(editor, currentLine(editor), cl);
    }
}
