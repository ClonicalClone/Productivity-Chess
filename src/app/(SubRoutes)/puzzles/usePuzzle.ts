import { useState, useCallback, useRef } from 'react';
import { PieceSymbol, Square } from 'chess.js';




export type PuzzleStatus = 'idle' | 'loading' | 'playing' | 'correct' | 'wrong' | 'solved';

export interface Puzzle {
    fen: string;
    moves: string[];
    rating: number;
    themes: string[];
}

interface UsePuzzleOptions {
    tryMove: (from: Square, to: Square, promotion?: PieceSymbol) => boolean;
    loadFen: (fen: string) => boolean;
}

export function usePuzzle({ tryMove, loadFen }: UsePuzzleOptions) {
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [moveIndex, setMoveIndex] = useState(1);
    const [status, setStatus] = useState<PuzzleStatus>('idle');
    const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
    const [hintSquares, setHintSquares] = useState<{ from: string; to: string } | null>(null);

    // Refs to avoid stale closures in callbacks/timeouts
    const statusRef = useRef<PuzzleStatus>('idle');
    const moveIndexRef = useRef(1);
    const puzzleRef = useRef<Puzzle | null>(null);

    const setStatusSync = (s: PuzzleStatus) => {
        setStatus(s);
        statusRef.current = s;
    };

    const setMoveIndexSync = (idx: number) => {
        setMoveIndex(idx);
        moveIndexRef.current = idx;
    };


    /** Called when player makes a move. Returns true if the move was valid and accepted. */
    const handlePlayerMove = useCallback(
        (from: Square, to: Square, promotion?: PieceSymbol): boolean => {
            const p = puzzleRef.current;
            const idx = moveIndexRef.current;
            const st = statusRef.current;

            if (!p || st !== 'playing') return false;
            if (idx >= p.moves.length) return false;

            const expectedMove = p.moves[idx];
            const expectedFrom = expectedMove.substring(0, 2);
            const expectedTo = expectedMove.substring(2, 4);

            // Wrong move
            if (from !== expectedFrom || to !== expectedTo) {
                setStatusSync('wrong');
                setTimeout(() => setStatusSync('playing'), 900);
                return false;
            }

            // Correct move — apply it
            const promo =
                expectedMove.length > 4 ? (expectedMove[4] as PieceSymbol) : promotion;
            const ok = tryMove(from, to, promo);
            if (!ok) return false;

            setHintSquares(null);

            const nextIdx = idx + 1; // This is the opponent's response move index

            // Puzzle fully solved (no more moves after player's move)
            if (nextIdx >= p.moves.length) {
                setStatusSync('solved');
                return true;
            }

            // Show "correct" flash, then play opponent's response
            setStatusSync('correct');

            // Capture for closure
            const capPuzzle = p;
            const capNextIdx = nextIdx;

            setTimeout(() => {
                const opMove = capPuzzle.moves[capNextIdx];
                const oFrom = opMove.substring(0, 2) as Square;
                const oTo = opMove.substring(2, 4) as Square;
                const oPromo = opMove.length > 4 ? (opMove[4] as PieceSymbol) : undefined;
                tryMove(oFrom, oTo, oPromo);

                const nextPlayerIdx = capNextIdx + 1;
                if (nextPlayerIdx >= capPuzzle.moves.length) {
                    // Opponent's last move ends the puzzle
                    setStatusSync('solved');
                } else {
                    setMoveIndexSync(nextPlayerIdx);
                    setStatusSync('playing');
                }
            }, 600);

            return true;
        },
        [tryMove]
    );

    /** Highlight the correct squares for the current move */
    const getHint = useCallback(() => {
        const p = puzzleRef.current;
        const idx = moveIndexRef.current;
        const st = statusRef.current;

        if (!p || st !== 'playing' || idx >= p.moves.length) return;

        const move = p.moves[idx];
        setHintSquares({
            from: move.substring(0, 2),
            to: move.substring(2, 4),
        });
    }, []);

    return {
        puzzle,
        moveIndex,
        status,
        playerColor,
        hintSquares,
        handlePlayerMove,
        getHint,
    };
}
