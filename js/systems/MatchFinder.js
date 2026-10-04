export class MatchFinder {

    static find(board) {
        const matchedCells = new Set([
            ...this.scan(board, 'x'),
            ...this.scan(board, 'y')
        ]);

        return this.groupConnectedCells(board, matchedCells);
    }

    static hasPossibleMove(board) {

        for (let y = 0; y < board.size; y++) {
            for (let x = 0; x < board.size; x++) {
                const cell = board.get(x, y);

                for (const [dx, dy] of [[1, 0], [0, 1]]) {
                    const neighbour = board.get(x + dx, y + dy);

                    if (!neighbour) continue;

                    if (this.isActivatableIndependentPair(cell, neighbour)) {
                        return true;
                    }

                    board.swap(cell, neighbour);
                    const createsMatch = this.find(board).length > 0;
                    board.swap(cell, neighbour);

                    if (createsMatch) return true;
                }
            }
        }

        return false;
    }

    static isActivatableIndependentPair(cellA, cellB) {
        const tileA = cellA.tile;
        const tileB = cellB.tile;

        return tileA?.isIndependent?.() &&
            tileB?.isIndependent?.() &&
            tileA.name === tileB.name;
    }

    static scan(board, mainAxis) {
        const matchedCells = [];
        const secondaryAxis = mainAxis === 'x' ? 'y' : 'x';

        for (let i = 0; i < board.size; i++) {
            let run = [];
            let currentColor = null;

            for (let j = 0; j < board.size; j++) {
                const coords = { [mainAxis]: j, [secondaryAxis]: i };
                const cell = board.get(coords.x, coords.y);
                const tile = cell.tile;

                const color = tile?.isMedia?.() && !tile.isIndependent()
                    ? tile.color
                    : null;

                if (color && color === currentColor) {
                    run.push(cell);
                } else {
                    if (run.length >= 3) {
                        matchedCells.push(...run);
                    }
                    run = color ? [cell] : [];
                    currentColor = color;
                }
            }

            if (run.length >= 3) {
                matchedCells.push(...run);
            }
        }

        return matchedCells;
    }

    static groupConnectedCells(board, matchedCells) {
        const groups = [];
        const visited = new Set();

        for (const startCell of matchedCells) {
            if (visited.has(startCell)) continue;

            const group = [];
            const color = startCell.tile.color;
            const cellsToVisit = [startCell];
            visited.add(startCell);

            while (cellsToVisit.length > 0) {
                const cell = cellsToVisit.pop();
                group.push(cell);

                for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                    const neighbour = board.get(cell.x + dx, cell.y + dy);

                    if (
                        neighbour &&
                        matchedCells.has(neighbour) &&
                        !visited.has(neighbour) &&
                        neighbour.tile.color === color
                    ) {
                        visited.add(neighbour);
                        cellsToVisit.push(neighbour);
                    }
                }
            }

            groups.push(group);
        }

        return groups;
    }
}
