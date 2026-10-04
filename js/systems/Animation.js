export class Animation {

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async swap(cellAEl, cellBEl) {

        const rectA = cellAEl.getBoundingClientRect();
        const rectB = cellBEl.getBoundingClientRect();

        const dx = rectB.left - rectA.left;
        const dy = rectB.top - rectA.top;

        cellAEl.style.transform = `translate(${dx}px, ${dy}px)`;
        cellBEl.style.transform = `translate(${-dx}px, ${-dy}px)`;

        cellAEl.classList.add("swap");
        cellBEl.classList.add("swap");

        await this.sleep(200);

        cellAEl.style.transform = "";
        cellBEl.style.transform = "";

        cellAEl.classList.remove("swap");
        cellBEl.classList.remove("swap");
    }

    static async pop(elements) {

        for (const el of elements) {
            el.classList.add("pop");
        }

        await this.sleep(350);
    }

    static async appear(elements) {

        for (const el of elements) {
            el.classList.add("owner-appear");
        }

        await this.sleep(250);

        for (const el of elements) {
            el.classList.remove("owner-appear");
        }
    }

    static async fall(board, game, previousPositions) {

        const fallingElements = [];

        for (let y = 0; y < board.size; y++) {
            for (let x = 0; x < board.size; x++) {
                const cell = board.get(x, y);
                const previousPosition = previousPositions.get(cell.tile);

                if (!previousPosition) continue;

                const el = game.getCellElement(x, y);
                const finalPosition = el.getBoundingClientRect();
                const dx = previousPosition.left - finalPosition.left;
                const dy = previousPosition.top - finalPosition.top;

                if (dx === 0 && dy === 0) continue;

                el.classList.add("fall");
                el.style.transition = "none";
                el.style.transform = `translate(${dx}px, ${dy}px)`;
                fallingElements.push(el);
            }
        }

        if (fallingElements.length === 0) return;

        for (const el of fallingElements) {
            void el.offsetWidth;
        }

        await new Promise(resolve => requestAnimationFrame(resolve));

        for (const el of fallingElements) {
            el.style.transition = "";
            el.style.transform = "";
        }

        await this.sleep(350);

        for (const el of fallingElements) {
            el.classList.remove("fall");
        }
    }
}
