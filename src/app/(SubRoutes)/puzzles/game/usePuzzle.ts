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

interface PuzzleFilters {
    minRating?: number;
    maxRating?: number;
    theme?: string;
}

const SHARD_FILES = [
    '/puzzle_shards/puzzles_399_678.csv',
    '/puzzle_shards/puzzles_679_958.csv',
    '/puzzle_shards/puzzles_959_1238.csv',
    '/puzzle_shards/puzzles_1239_1518.csv',
    '/puzzle_shards/puzzles_1519_1797.csv',
    '/puzzle_shards/puzzles_1798_2077.csv',
    '/puzzle_shards/puzzles_2078_2357.csv',
    '/puzzle_shards/puzzles_2358_2637.csv',
    '/puzzle_shards/puzzles_2638_2917.csv',
    '/puzzle_shards/puzzles_2918_3197.csv',
];

const shardCache = new Map<string, Puzzle[]>();

function parseCSVLine(line: string): Puzzle | null {
    const parts = line.split(',');
    if (parts.length < 4) return null;
    
    return {
        fen: parts[0],
        moves: parts[1].split(' '),
        rating: parseInt(parts[2], 10),
        themes: parts[3]?.split(' ').filter(t => t) || [],
    };
}

async function loadShard(url: string): Promise<Puzzle[]> {
    if (shardCache.has(url)) return shardCache.get(url)!;
    
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.trim().split('\n');
    
    const puzzles: Puzzle[] = [];
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const puzzle = parseCSVLine(lines[i]);
        if (puzzle) puzzles.push(puzzle);
    }
    
    shardCache.set(url, puzzles);
    return puzzles;
}

function getShardUrls(filters?: PuzzleFilters): string[] {
    if (!filters || (!filters.minRating && !filters.maxRating)) {
        return SHARD_FILES;
    }
    
    const min = filters.minRating || 0;
    const max = filters.maxRating || 4000;
    
    return SHARD_FILES.filter((url, idx) => {
        const range = url.match(/puzzles_(\d+)_(\d+)/);
        if (!range) return false;
        const shardMin = parseInt(range[1]);
        const shardMax = parseInt(range[2]);
        return shardMin >= min && shardMax <= max;
    });
}

async function getRandomPuzzle(filters?: PuzzleFilters): Promise<Puzzle> {
    const urls = getShardUrls(filters);
    
    if (urls.length === 0) {
        throw new Error('No shards found for rating range');
    }
    
    const randomShardUrl = urls[Math.floor(Math.random() * urls.length)];
    const puzzles = await loadShard(randomShardUrl);
    
    if (puzzles.length === 0) {
        throw new Error('No puzzles in shard');
    }
    
    const randomIdx = Math.floor(Math.random() * puzzles.length);
    return puzzles[randomIdx];
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

    const setPuzzleSync = (p: Puzzle | null) => {
        setPuzzle(p);
        puzzleRef.current = p;
    };

    /** Fetch a random puzzle from the CSV with optional filters */
    const fetchAndLoad = useCallback(async (filters?: PuzzleFilters) => {
        setStatusSync('loading');
        setHintSquares(null);
        
        try {
            const puzzleData = await getRandomPuzzle(filters);
            
            loadFen(puzzleData.fen);
            
            const color = puzzleData.fen.split(' ')[1] as 'w' | 'b';
            setPlayerColor(color);
            
            setPuzzleSync(puzzleData);
            setMoveIndexSync(1);
            setStatusSync('playing');
        } catch (err) {
            console.error('Failed to load puzzle:', err);
            setStatusSync('idle');
        }
    }, [loadFen]);


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
        fetchAndLoad,
    };
}
