import { GAME_STATE } from '../constants.js';

export class Input {

    constructor(game) {

        this.game = game;
        this.pointerStart = null;
    }

    handlePointerDown(cell, event) {
        if (this.game.state !== GAME_STATE.PLAYING || this.game.isBusy) return;

        this.pointerStart = {
            cell,
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY
        };

        event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    async handlePointerUp(event) {

        const start = this.pointerStart;
        this.pointerStart = null;

        if (!start || start.pointerId !== event.pointerId || this.game.isBusy) return;

        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        const minimumSwipeDistance = 16;

        if (Math.max(Math.abs(dx), Math.abs(dy)) < minimumSwipeDistance) return;

        const isHorizontalSwipe = Math.abs(dx) > Math.abs(dy);
        const targetX = start.cell.x + (isHorizontalSwipe ? Math.sign(dx) : 0);
        const targetY = start.cell.y + (isHorizontalSwipe ? 0 : Math.sign(dy));
        const targetCell = this.game.board.get(targetX, targetY);

        if (targetCell) {
            await this.game.swap(start.cell, targetCell);
        }
    }

    handlePointerCancel() {
        this.pointerStart = null;
    }
}
