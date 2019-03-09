/**
 * $File: vscode_api.ts $
 * $Date: 2019-02-28 23:38:47 $
 * $Revision: $
 * $Creator: Jen-Chieh Shen $
 * $Notice: See LICENSE.txt for modification and distribution information
 *                   Copyright © 2019 by Shen, Jen-Chieh $
 */

import * as vscode from 'vscode';
import { getHashes } from 'crypto';



/**
 * @desc VS Code API class.
 */
export class VSCodeAPI {

    private _editor : vscode.TextEditor;

    /**
     * @desc Use for commands that does not move the cursor point after execution.
     */
    private _savePoint : number = -1;


    /**
     * @desc VSCode API Constructor.
     * @param { vscode.TextEditor } editor : Taget active editor.
     */
    public constructor(editor : vscode.TextEditor) {
        this._editor = editor;
    }


    /**
     * @desc Get the current active text editor.
     * @return { vscode.TextEditor } Active text editor.
     */
    public static getActiveTextEditor() : vscode.TextEditor | undefined {
        return vscode.window.activeTextEditor;
    }


    /**
     * @desc Save the point at this point of execution.
     */
    public savePoint() : void { this._savePoint = this.point(); }

    /**
     * @desc Restore the point from the last time we saved the point.
     */
    public restorePoint() : void { this.gotoChar(this._savePoint); }


    /**
     * @desc Reveal range in the editor.
     */
    public revealRange() : void {
        let revealType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
        this._editor.revealRange(this._editor.selection, revealType);
    }

    /**
     * @desc Execute the command.
     * @param { string } cmd : Command string.
     */
    public executeCommand(cmd : string) : void {
        vscode.commands.executeCommand(cmd);
    }

    /**
     * @desc Execute same commands multiple times.
     * @param { string } cmd : Command string.
     * @param { number } n : execution count.
     */
    public executeCommandLoop(cmd : string, n : number) : void {
        for (let count = 0; count < n; ++count) {
            this.executeCommand(cmd);
        }
    }

    /**
     * @desc Returns current line number.
     * @param { vscode.TextEditor } editor : Active text editor.
     * @return { number } : Current line number.
     */
    public currentLine() : number {
        return this._editor.selection.active.line;
    }

    /**
     * @desc Returns current column number.
     * @return { number } : Current line number.
     */
    public currentColumn() : number {
        return this._editor.selection.active.character;
    }

    /**
     * @desc Is current cursor at the beginning of the line.
     * @return { boolean } : Is beginning of the line?
     */
    public isBeginningOfLine() : boolean {
        return this.currentColumn() === 0;
    }

    /**
     * @desc Is current cursor at the end of the line.
     * @return { boolean } : Is end of the line?
     */
    public isEndOfLine() : boolean {
        this.savePoint();

        let saveCl = this.currentColumn();
        this.endOfLine();
        let endColumn = this.currentColumn();

        this.restorePoint();
        return endColumn === saveCl;
    }

    /**
     * @desc Is current cursor at the beginning of the buffer.
     * @return { boolean } : Is beginning of the buffer?
     */
    public isBeginningOfBuffer() : boolean {
        return this.isBeginningOfLine() && this.currentLine() === 0;
    }

    /**
     * @desc Is current cursor at the end of the buffer.
     * @return { boolean } : Is end of the buffer?
     */
    public isEndOfBuffer() : boolean {
        this.savePoint();

        let saveLn = this.currentLine();
        let saveCl = this.currentColumn();
        this.endOfBuffer();
        let endLine = this.currentLine();
        let endColumn = this.currentColumn();

        this.restorePoint();
        return (saveLn === endLine && saveCl === endColumn);
    }

    /**
     * @desc Goto next line.
     * @param { number } n : Lines to move.
     */
    public nextLine(n : number = 1) : void {
        for (let count = 0; count < n; ++count) {
            this.toLine(this.currentLine() + 1);
        }
    }

    /**
     * @desc Goto previous line.
     * @param { number } n : Lines to move.
     */
    public previousLine(n : number = 1) : void {
        for (let count = 0; count < n; ++count) {
            this.toLine(this.currentLine() - 1);
        }
    }

    /**
     * @desc Move to beginning of the line.
     */
    public beginningOfLine() : void { this.toColumn(0); }

    /**
     * @desc Move to end of the line.
     */
    public endOfLine() : void { this.toColumn(Number.MAX_SAFE_INTEGER); }

    /**
     * @desc Move to beginning of the buffer.
     */
    public beginningOfBuffer() : void { this.gotoChar(0); }

    /**
     * @desc Move to end of the buffer.
     */
    public endOfBuffer() : void { this.gotoChar(Number.MAX_SAFE_INTEGER); }

    /**
     * @desc Forward a character.
     * @param { number } n : Forward n characters.
     */
    public forwardChar(n : number = 1) : void { this.gotoCharDelta(n); }

    /**
     * @desc Backward a character.
     * @param { number } n : Backward n characters.
     */
    public backwardChar(n : number = 1) : void { this.gotoCharDelta(-n); }

    /**
     * @desc Returns the current point position.
     * @return { number } : Current point position.
     */
    public point() : number { return this._editor.document.offsetAt(this.position()); }

    /**
     * @desc Get the current cursor position.
     * @return { vscode.Position } : Current cursor position.
     */
    public position() : vscode.Position { return this._editor.selection.active; }

    /**
     * @desc Move curosr by adding the delta point.
     * @param { number } dp : Delta point.
     */
    public gotoCharDelta(dp : number) : void {
        let currentPt = this.point();
        let newPt = currentPt + dp;
        if (dp > 0) {
            let lns = this.linesBetweenTwoPoints(currentPt, newPt);
            newPt += lns;
        }
        this.gotoChar(newPt);
    }

    /**
     * @desc Move cursor to target point.
     * @param { number } pt : Target point.
     */
    public gotoChar(pt : number) : void {
        let newPos = this._editor.document.positionAt(pt);
        this._editor.selection = new vscode.Selection(newPos, newPos);
        this.revealRange();
    }

    /**
     * @desc Validate the position in the document.
     * @param { vscode.Position } pos : Position to validate.
     */
    public validatePosition(pos : vscode.Position) : vscode.Position {
        return this._editor.document.validatePosition(pos);
    }

    /**
     * @desc Move cursor to target point.
     * @param { number } ln : Target line number.
     * @param { number } cl : Target column.
     */
    public toPoint(ln : number, cl : number) : void {
        let newPos = new vscode.Position(ln, cl);
        let valPos = this.validatePosition(newPos);
        this._editor.selection =  new vscode.Selection(valPos, valPos);
        this.revealRange();
    }

    /**
     * @desc Move cursor to target line.
     * @param { number } ln : Target line number.
     */
    public toLine(ln : number) : void { this.toPoint(ln, this.currentColumn()); }

    /**
     * @desc Move cursor to target column.
     * @param { number } cl : Target column.
     */
    public toColumn(cl : number) : void { this.toPoint(this.currentLine(), cl); }

    /**
     * @desc Insert text to from current cursor position.
     * @param { string } txt : Text to insert.
     */
    public insert(txt : string) : void {
        this._editor.edit(textEditorEdit => {
            textEditorEdit.insert(this.position(), txt);
        });
    }

    /**
     * @desc Count the lines between two points.
     * @param { number } minPt : Mininum point.
     * @param { number } maxPt : Maxinum point.
     * @return { number } : Line count.
     */
    public linesBetweenTwoPoints(
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

        this.savePoint();
        let cnt = 0;

        this.gotoChar(minPt);

        let currentPt = this.point();

        while (currentPt < maxPt) {
            this.endOfLine();
            currentPt = this.point();

            if (currentPt < maxPt) {
                ++cnt;
                this.nextLine();
                this.beginningOfLine();
                currentPt = this.point();
            }
        }

        this.restorePoint();
        return cnt;
    }

    /**
     * @desc Insert text to from current cursor position.
     * @param { number } offset : Point offset.
     */
    public deleteChar(offset : number) : void {
        this._editor.edit(textEditorEdit => {
            let currentPt = this.point();
            let offsetPt = currentPt + offset;

            if (offset > 0) {
                let lns = this.linesBetweenTwoPoints(currentPt, offsetPt);
                offsetPt += lns;
            }

            let pos = this.position();
            let pos2 = this._editor.document.positionAt(offsetPt);
            let range = new vscode.Range(pos, pos2);
            textEditorEdit.delete(range);
        });
    }

    /**
     * @desc Insert a newline.
     * @param { vscode.TextEditor } editor : Active text editor.
     */
    public newline() : void { this.insert("\n"); }

    /**
     * @desc Backward delete a character.
     * @param { number } n : Characters you want to delete.
     */
    public backwardDeleteChar(n : number = -1) : void { this.deleteChar(n); }

    /**
     * @desc Forward delete a character.
     * @param { number } n : Characters you want to delete.
     */
    public forwardDeleteChar(n : number = 1) : void { this.deleteChar(n); }

    /**
     * @desc Mininum point from the current file.
     * @return { number } : Mininum point.
     */
    public pointMin() : number { return 0; }

    /**
     * @desc Maxinum point from the current file.
     * @return { number } : Maxinum point.
     */
    public pointMax() : number {
        this.savePoint();
        this.endOfBuffer();
        let maxPt = this.point();
        this.restorePoint();
        return maxPt;
    }
}
