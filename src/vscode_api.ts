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
     * @return { vscode.TextEditor } Active text editor.
     */
    export function getActiveTextEditor() : vscode.TextEditor | undefined {
        return vscode.window.activeTextEditor;
    }

    /**
     * @desc Reveal range in the editor.
     * @param { vscode.TextEditor } editor : Active text editor.
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
     * @desc Use for commands that does not move the cursor point after execution.
     */
    var SAVE_POINT : number = -1;

    /**
     * @desc Save the point at this point of execution.
     * @param { vscode.TextEditor } editor : Active text editor.
     */
    export function savePoint(editor : vscode.TextEditor) { SAVE_POINT = point(editor); }

    /**
     * @desc Restore the point from the last time we saved the point.
     * @param { vscode.TextEditor } editor : Active text editor.
     */
    export function restorePoint(editor : vscode.TextEditor) { gotoChar(editor, SAVE_POINT); }


    /**
     * @desc Returns current line number.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @return { number } : Current line number.
     */
    export function currentLine(editor : vscode.TextEditor) : number {
        return editor.selection.active.line;
    }

    /**
     * @desc Returns current column number.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @return { number } : Current line number.
     */
    export function currentColumn(editor : vscode.TextEditor) : number {
        return editor.selection.active.character;
    }

    /**
     * @desc Is current cursor at the beginning of the line.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @return { boolean } : Is beginning of the line?
     */
    export function isBeginningOfLine(editor : vscode.TextEditor) : boolean {
        return currentColumn(editor) === 0;
    }

    /**
     * @desc Is current cursor at the end of the line.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @return { boolean } : Is end of the line?
     */
    export function isEndOfLine(editor : vscode.TextEditor) : boolean {
        savePoint(editor);

        let saveCl = currentColumn(editor);
        endOfLine(editor);
        let endColumn = currentColumn(editor);

        restorePoint(editor);
        return endColumn === saveCl;
    }

    /**
     * @desc Is current cursor at the beginning of the buffer.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @return { boolean } : Is beginning of the buffer?
     */
    export function isBeginningOfBuffer(editor : vscode.TextEditor) : boolean {
        return isBeginningOfLine(editor) && currentLine(editor) === 0;
    }

    /**
     * @desc Is current cursor at the end of the buffer.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @return { boolean } : Is end of the buffer?
     */
    export function isEndOfBuffer(editor : vscode.TextEditor) : boolean {
        savePoint(editor);

        let saveLn = currentLine(editor);
        let saveCl = currentColumn(editor);
        endOfBuffer(editor);
        let endLine = currentLine(editor);
        let endColumn = currentColumn(editor);

        restorePoint(editor);
        return (saveLn === endLine && saveCl === endColumn);
    }

    /**
     * @desc Goto next line.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } n : Lines to move.
     */
    export function nextLine(editor : vscode.TextEditor, n : number = 1) : void {
        for (let count = 0; count < n; ++count) {
            toLine(editor, currentLine(editor) + 1);
        }
    }

    /**
     * @desc Goto previous line.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } n : Lines to move.
     */
    export function previousLine(editor : vscode.TextEditor, n : number = 1) : void {
        for (let count = 0; count < n; ++count) {
            toLine(editor, currentLine(editor) - 1);
        }
    }

    /**
     * @desc Move to beginning of the line.
     * @param { vscode.TextEditor } editor : Active text editor.
     */
    export function beginningOfLine(editor : vscode.TextEditor) : void { toColumn(editor, 0); }

    /**
     * @desc Move to end of the line.
     * @param { vscode.TextEditor } editor : Active text editor.
     */
    export function endOfLine(editor : vscode.TextEditor) : void { toColumn(editor, Number.MAX_SAFE_INTEGER); }

    /**
     * @desc Move to beginning of the buffer.
     * @param { vscode.TextEditor } editor : Active text editor.
     */
    export function beginningOfBuffer(editor : vscode.TextEditor) : void { gotoChar(editor, 0); }

    /**
     * @desc Move to end of the buffer.
     * @param { vscode.TextEditor } editor : Active text editor.
     */
    export function endOfBuffer(editor : vscode.TextEditor) : void { gotoChar(editor, Number.MAX_SAFE_INTEGER); }

    /**
     * @desc Forward a character.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } n : Forward n characters.
     */
    export function forwardChar(editor : vscode.TextEditor, n : number = 1) : void { gotoCharDelta(editor, n); }

    /**
     * @desc Backward a character.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } n : Backward n characters.
     */
    export function backwardChar(editor : vscode.TextEditor, n : number = 1) : void { gotoCharDelta(editor, -n); }

    /**
     * @desc Returns the current point position.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @return { number } : Current point position.
     */
    export function point(editor : vscode.TextEditor) : number { return editor.document.offsetAt(position(editor)); }

    /**
     * @desc Get the current cursor position.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @return { vscode.Position } : Current cursor position.
     */
    export function position(editor : vscode.TextEditor) : vscode.Position { return editor.selection.active; }

    /**
     * @desc Move curosr by adding the delta point.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } dp : Delta point.
     */
    export function gotoCharDelta(editor : vscode.TextEditor, dp : number) : void {
        let currentPt = point(editor);
        let newPt = currentPt + dp;
        if (dp > 0) {
            let lns = linesBetweenTwoPoints(editor, currentPt, newPt);
            newPt += lns;
        }
        gotoChar(editor, newPt);
    }

    /**
     * @desc Move cursor to target point.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } pt : Target point.
     */
    export function gotoChar(editor : vscode.TextEditor, pt : number) : void {
        let newPos = editor.document.positionAt(pt);
        editor.selection = new vscode.Selection(newPos, newPos);
        revealRange(editor);
    }

    /**
     * @desc Validate the position in the document.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { vscode.Position } pos : Position to validate.
     */
    export function validatePosition(editor : vscode.TextEditor, pos : vscode.Position) : vscode.Position {
        return editor.document.validatePosition(pos);
    }

    /**
     * @desc Move cursor to target point.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } ln : Target line number.
     * @param { number } cl : Target column.
     */
    export function toPoint(editor : vscode.TextEditor, ln : number, cl : number) : void {
        let newPos = new vscode.Position(ln, cl);
        let valPos = validatePosition(editor, newPos);
        editor.selection =  new vscode.Selection(valPos, valPos);
        revealRange(editor);
    }

    /**
     * @desc Move cursor to target line.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } ln : Target line number.
     */
    export function toLine(editor : vscode.TextEditor, ln : number) : void { toPoint(editor, ln, currentColumn(editor)); }

    /**
     * @desc Move cursor to target column.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } cl : Target column.
     */
    export function toColumn(editor : vscode.TextEditor, cl : number) : void { toPoint(editor, currentLine(editor), cl); }

    /**
     * @desc Insert text to from current cursor position.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { string } txt : Text to insert.
     */
    export function insert(editor : vscode.TextEditor, txt : string) : void {
        editor.edit(textEditorEdit => {
            textEditorEdit.insert(position(editor), txt);
        });
    }

    /**
     * @desc Count the lines between two points.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } minPt : Mininum point.
     * @param { number } maxPt : Maxinum point.
     * @return { number } : Line count.
     */
    export function linesBetweenTwoPoints(
        editor : vscode.TextEditor,
        minPt : number,
        maxPt : number) : number
    {
        if (minPt === maxPt) { return 0; }

        // Ensure `minPt` is always smaller than `maxPt`.
        if (minPt > maxPt) {
            let tmpP1 = minPt;
            minPt = maxPt;
            maxPt = tmpP1;
        }

        savePoint(editor);
        let cnt = 0;

        gotoChar(editor, minPt);

        let currentPt = point(editor);

        while (currentPt < maxPt) {
            endOfLine(editor);
            currentPt = point(editor);

            if (currentPt < maxPt) {
                ++cnt;
                nextLine(editor);
                beginningOfLine(editor);
                currentPt = point(editor);
            }
        }

        restorePoint(editor);
        return cnt;
    }

    /**
     * @desc Insert text to from current cursor position.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } offset : Point offset.
     */
    export function deleteChar(editor : vscode.TextEditor, offset : number) : void {
        editor.edit(textEditorEdit => {
            let currentPt = point(editor);
            let offsetPt = currentPt + offset;

            if (offset > 0) {
                let lns = linesBetweenTwoPoints(editor, currentPt, offsetPt);
                offsetPt += lns;
            }

            let pos = position(editor);
            let pos2 = editor.document.positionAt(offsetPt);
            let range = new vscode.Range(pos, pos2);
            textEditorEdit.delete(range);
        });
    }

    /**
     * @desc Insert a newline.
     * @param { vscode.TextEditor } editor : Active text editor.
     */
    export function newline(editor : vscode.TextEditor) : void { insert(editor, "\n"); }

    /**
     * @desc Backward delete a character.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } n : Characters you want to delete.
     */
    export function backwardDeleteChar(editor : vscode.TextEditor, n : number = -1) : void { deleteChar(editor, n); }

    /**
     * @desc Forward delete a character.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @param { number } n : Characters you want to delete.
     */
    export function forwardDeleteChar(editor : vscode.TextEditor, n : number = 1) : void { deleteChar(editor, n); }

    /**
     * @desc Mininum point from the current file.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @return { number } : Mininum point.
     */
    export function pointMin(editor : vscode.TextEditor) : number { return 0; }

    /**
     * @desc Maxinum point from the current file.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @return { number } : Maxinum point.
     */
    export function pointMax(editor : vscode.TextEditor) : number {
        savePoint(editor);
        endOfBuffer(editor);
        let maxPt = point(editor);
        restorePoint(editor);
        return maxPt;
    }
}
