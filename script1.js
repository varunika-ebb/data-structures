document.addEventListener("DOMContentLoaded", () => {
    const ROWS = 6;
    const COLS = 7;
    const CONNECT = 4;

    class MoveNode {
        constructor(row, col, player) {
            this.row = row;
            this.col = col;
            this.player = player;
            this.next = null;
        }
    }

    class MoveList {
        constructor() {
            this.head = null;
        }

        addMove(row, col, player) {
            const newNode = new MoveNode(row, col, player);
            if (!this.head) {
                this.head = newNode;
            } else {
                let current = this.head;
                while (current.next) {
                    current = current.next;
                }
                current.next = newNode;
            }
        }

        reset() {
            this.head = null;
        }
    }

    class TreeNode {
        constructor(row, col, player) {
            this.row = row;
            this.col = col;
            this.player = player;
            this.children = [];
        }

        addChild(node) {
            this.children.push(node);
        }
    }

    class GraphNode {
        constructor(row, col) {
            this.row = row;
            this.col = col;
            this.adjacent = [];
        }

        addAdjacent(node) {
            this.adjacent.push(node);
        }
    }

    function createGameGraph() {
        const graph = [];
        for (let r = 0; r < ROWS; r++) {
            graph[r] = [];
            for (let c = 0; c < COLS; c++) {
                graph[r][c] = new GraphNode(r, c);
            }
        }

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (r < ROWS - 1) graph[r][c].addAdjacent(graph[r + 1][c]);
                if (c < COLS - 1) graph[r][c].addAdjacent(graph[r][c + 1]);
                if (r < ROWS - 1 && c < COLS - 1) graph[r][c].addAdjacent(graph[r + 1][c + 1]);
                if (r < ROWS - 1 && c > 0) graph[r][c].addAdjacent(graph[r + 1][c - 1]);
            }
        }
        return graph;
    }

    const board = document.querySelector("#board");
    const resetButton = document.querySelector("#reset");
    const message = document.querySelector("#message");
    const cells = [];

    for (let r = 0; r < ROWS; r++) {
        cells[r] = [];
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = r;
            cell.dataset.col = c;
            board.appendChild(cell);
            cells[r][c] = cell;
        }
    }

    const moveList = new MoveList();
    let currentPlayer = "red";
    const gameGraph = createGameGraph();

    function handleCellClick(event) {
        const cell = event.target;
        const col = parseInt(cell.dataset.col);

        if (checkWinner()) return;

        let targetRow = -1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (!cells[r][col].classList.contains("red") && !cells[r][col].classList.contains("blue")) {
                targetRow = r;
                break;
            }
        }

        if (targetRow === -1) return;

        const playerClass = currentPlayer;
        moveList.addMove(targetRow, col, playerClass);
        cells[targetRow][col].classList.add(playerClass);

        if (checkWinner()) {
            message.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} wins!`;
        } else {
            currentPlayer = currentPlayer === "red" ? "blue" : "red";
        }
    }

    function checkWinner() {
        const directions = [
            [ [0, 1], [0, -1] ],
            [ [1, 0], [-1, 0] ],
            [ [1, 1], [-1, -1] ],
            [ [1, -1], [-1, 1] ]
        ];

        function isValid(row, col) {
            return row >= 0 && row < ROWS && col >= 0 && col < COLS;
        }

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (cells[r][c].classList.contains(currentPlayer)) {
                    for (const direction of directions) {
                        let count = 1;
                        for (const [dr, dc] of direction) {
                            let nr = r + dr;
                            let nc = c + dc;
                            while (isValid(nr, nc) && cells[nr][nc].classList.contains(currentPlayer)) {
                                count++;
                                nr += dr;
                                nc += dc;
                            }
                        }
                        if (count >= CONNECT) return true;
                    }
                }
            }
        }
        return false;
    }

    function resetGame() {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                cells[r][c].classList.remove("red", "blue");
            }
        }
        moveList.reset();
        message.textContent = "";
        currentPlayer = "red";
    }

    cells.forEach(row => {
        row.forEach(cell => {
            cell.addEventListener("click", handleCellClick);
        });
    });

    resetButton.addEventListener("click", resetGame);
});
