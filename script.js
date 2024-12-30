document.addEventListener("DOMContentLoaded", () => {
    class MoveNode {
        constructor(index, player) {
            this.index = index;
            this.player = player;
            this.next = null;
        }
    }

    class MoveList {
        constructor() {
            this.head = null;
        }

        addMove(index, player) {
            const newNode = new MoveNode(index, player);
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

    class GameStateNode {
        constructor(board) {
            this.board = board.slice(); 
            this.left = null;
            this.right = null;
        }
    }

    class GraphNode {
        constructor(index) {
            this.index = index;
            this.adjacent = [];
        }

        addAdjacent(node) {
            this.adjacent.push(node);
        }
    }

    function createWinningGraph() {
        const nodes = Array.from({ length: 9 }, (_, i) => new GraphNode(i));
        const winningPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const pattern of winningPatterns) {
            const [a, b, c] = pattern;
            nodes[a].addAdjacent(nodes[b]);
            nodes[a].addAdjacent(nodes[c]);
            nodes[b].addAdjacent(nodes[a]);
            nodes[b].addAdjacent(nodes[c]);
            nodes[c].addAdjacent(nodes[a]);
            nodes[c].addAdjacent(nodes[b]);
        }

        return nodes;
    }

    const board = document.querySelector("#board");
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.querySelector("#reset");
    const message = document.querySelector("#message");
    let currentPlayer = "X";
    let gameState = new GameStateNode(Array(9).fill(""));
    let moves = new MoveList();
    const winningGraph = createWinningGraph();

    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.getAttribute("data-index"));

        if (gameState.board[cellIndex] !== "" || checkWinner()) {
            return;
        }

        gameState.board[cellIndex] = currentPlayer;
        moves.addMove(cellIndex, currentPlayer);
        cell.textContent = currentPlayer;

        if (checkWinner()) {
            message.textContent = `${currentPlayer} wins!`;
        } else if (gameState.board.every(cell => cell !== "")) {
            message.textContent = "It's a draw!";
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    }

    function checkWinner() {
        const board = gameState.board;
        const winningPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const pattern of winningPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
        return false;
    }

    function resetGame() {
        gameState = new GameStateNode(Array(9).fill(""));
        moves.reset();
        currentPlayer = "X";
        message.textContent = "";
        cells.forEach(cell => {
            cell.textContent = "";
        });
    }

    cells.forEach(cell => {
        cell.addEventListener("click", handleCellClick);
    });

    resetButton.addEventListener("click", resetGame);
});
