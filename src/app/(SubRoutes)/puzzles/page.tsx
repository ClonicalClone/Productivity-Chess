"use client";

import React, { useEffect, useState, useCallback } from "react";
import { PieceDropHandlerArgs } from "react-chessboard";
import { PieceSymbol, Square } from "chess.js";

import { useChessGame } from "./game/useChessGame";
import { useEngine } from "./engine/useEngine";
import { useGameState } from "./game/useGameState";
import { usePuzzle } from "./game/usePuzzle";
import { ChessBoardView } from "./ui/ChessBoardView";
import { PromotionDialog } from "./ui/usePromotionDialog";
import { EvaluationBar } from "./ui/EvaluationBar";

// ─── Theme badge colours ────────────────────────────────────────────────────────
const THEME_COLORS: Record<string, string> = {
  crushing: "bg-red-900/60 text-red-300",
  advantage: "bg-blue-900/60 text-blue-300",
  endgame: "bg-purple-900/60 text-purple-300",
  middlegame: "bg-yellow-900/60 text-yellow-300",
  opening: "bg-green-900/60 text-green-300",
  mate: "bg-rose-900/60 text-rose-300",
  fork: "bg-orange-900/60 text-orange-300",
  pin: "bg-cyan-900/60 text-cyan-300",
  hangingPiece: "bg-amber-900/60 text-amber-300",
  long: "bg-neutral-700 text-neutral-300",
  short: "bg-neutral-700 text-neutral-300",
  subapi1: "bg-indigo-900/60 text-indigo-300 border border-indigo-500/30",
  subapi2: "bg-fuchsia-900/60 text-fuchsia-300 border border-fuchsia-500/30",
};

function ThemeBadge({ theme }: { theme: string }) {
  const cls = THEME_COLORS[theme] ?? "bg-neutral-800 text-neutral-400";
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${cls}`}>
      {theme}
    </span>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  const color =
    rating >= 2000 ? "text-red-400" :
      rating >= 1600 ? "text-yellow-400" :
        rating >= 1200 ? "text-green-400" : "text-blue-400";
  return (
    <span className={`font-bold text-lg font-mono ${color}`}>{rating}</span>
  );
}

// ─── Overlay ────────────────────────────────────────────────────────────────────
function StatusOverlay({ status }: { status: string }) {
  if (status === "playing" || status === "idle" || status === "loading") return null;

  const configs: Record<string, { bg: string; icon: string; text: string }> = {
    correct: { bg: "bg-green-500/20 border-green-500/40", icon: "✓", text: "Correct!" },
    wrong: { bg: "bg-red-500/20 border-red-500/40", icon: "✗", text: "Wrong move" },
    solved: { bg: "bg-emerald-500/20 border-emerald-500/40", icon: "🎉", text: "Puzzle Solved!" },
  };

  const cfg = configs[status];
  if (!cfg) return null;

  return (
    <div className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none`}>
      <div className={`px-6 py-3 rounded-xl border backdrop-blur-sm ${cfg.bg} flex items-center gap-3`}>
        <span className="text-2xl">{cfg.icon}</span>
        <span className="font-bold text-white text-lg">{cfg.text}</span>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function Home() {
  const game = useChessGame();
  const { evaluation, evaluate, stop, isReady } = useEngine();
  const gameState = useGameState(game.chess);

  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  // ── Puzzle hook ────────────────────────────────────────────────────────────────
  const puzzle = usePuzzle({ tryMove: game.tryMove, loadFen: game.loadFen });

  // ── Filter State ──────────────────────────────────────────────────────────────
  const [ratingRange, setRatingRange] = useState<{ min: number; max: number } | null>(null);
  const [ratingLabel, setRatingLabel] = useState<string>("All Ratings");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");

  const RATING_PRESETS = [
    { label: "All", min: 0, max: 4000 },
    { label: "Basic", min: 0, max: 900 },
    { label: "Intermediate", min: 900, max: 1400 },
    { label: "High Int.", min: 1400, max: 1900 },
    { label: "Advanced", min: 1900, max: 4000 },
  ];

  const THEMES = [
    "all", "mate", "fork", "opening", "middlegame", "endgame", "pin", "crushing",
    "advantage", "hangingPiece", "discoveredAttack", "sacrifice", "promotion",
    "skewer", "trappedPiece", "defensiveMove"
  ];

  const EXTERNAL_SOURCES = [
    { id: "subapi1", label: "Private Server 1" },
    { id: "subapi2", label: "Private Server 2" }
  ];

  const SUBAPI1_CATEGORIES = [
    "anastasiaMate", "arabianMate", "attackingF2F7", "attraction", "backRankMate",
    "balestraMate", "bishopEndgame", "blindSwineMate", "bodenMate",
    "capturingDefender", "castling", "clearance", "cornerMate", "deflection",
    "discoveredCheck", "doubleBishopMate", "doubleCheck"
  ];

  const SUBAPI2_CATEGORIES = [
    "dovetailMate", "enPassant", "hookMate", "interference", "intermezzo",
    "killBoxMate", "knightEndgame", "morphysMate", "operaMate", "pawnEndgame",
    "pillsburysMate", "promotion", "quietMove", "smotheredMate", "triangleMate",
    "underPromotion", "vukovicMate", "xRayAttack", "zugzwang"
  ];

  const [selectedSubTheme, setSelectedSubTheme] = useState<string>("all");

  // ── Auto-orient board based on player color ────────────────────────────────────
  useEffect(() => {
    setBoardOrientation(puzzle.playerColor === "w" ? "white" : "black");
  }, [puzzle.playerColor]);

  // ── Load first puzzle on mount ─────────────────────────────────────────────────


  // ── Continuous Stockfish eval every 500ms ─────────────────────────────────────
  useEffect(() => {
    if (!isReady) return;
    // Kick off immediately
    evaluate(game.position, 12);
    const interval = setInterval(() => {
      stop();                        // stop previous search
      evaluate(game.position, 12);   // restart with current position
    }, 500);
    return () => {
      clearInterval(interval);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, game.position]);

  // ── Square highlight styles ────────────────────────────────────────────────────
  const squareStyles: Record<string, React.CSSProperties> = {
    ...game.optionSquares,
  };

  if (selectedSquare) {
    squareStyles[selectedSquare] = { backgroundColor: "rgba(200, 200, 200, 0.6)" };
  }

  if (puzzle.hintSquares) {
    squareStyles[puzzle.hintSquares.from] = { backgroundColor: "rgba(59, 130, 246, 0.5)" };
    squareStyles[puzzle.hintSquares.to] = { backgroundColor: "rgba(59, 130, 246, 0.45)" };
  }

  // A red flash on wrong answer (briefly highlight all squares)
  if (puzzle.status === "wrong") {
    (game.chess.board().flat().filter(Boolean) as any[]).forEach((sq: any) => {
      if (!squareStyles[sq.square]) {
        squareStyles[sq.square] = { backgroundColor: "rgba(239,68,68,0.08)" };
      }
    });
  }

  // ── onPieceDrop ────────────────────────────────────────────────────────────────
  const onPieceDrop = ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs) => {
    if (!targetSquare) return false;
    // react-chessboard fires onPieceDrop on a plain click (source === target) — ignore those
    if (sourceSquare === targetSquare) return false;
    if (puzzle.status !== "playing") return false;

    const from = sourceSquare as Square;
    const to = targetSquare as Square;

    // Verify this is a legal chess move before validating against the puzzle
    const moves = game.chess.moves({ square: from, verbose: true });
    const isLegal = moves.some(m => m.to === to);
    if (!isLegal) return false;

    // Detect if this is a pawn hitting the promotion rank
    const pieceStr = typeof piece === "string" ? piece : (piece as any)?.pieceType ?? "";
    const isPawn = pieceStr[1]?.toLowerCase() === "p";
    const promotionRank = puzzle.playerColor === "w" ? "8" : "1";

    setSelectedSquare(null);
    game.setOptionSquares({});

    if (isPawn && to[1] === promotionRank) {
      // Look ahead at the expected promotion piece
      const expectedMove = puzzle.puzzle?.moves[puzzle.moveIndex];
      const promo = (expectedMove?.length ?? 0) > 4
        ? (expectedMove![4] as PieceSymbol)
        : "q";
      return puzzle.handlePlayerMove(from, to, promo as PieceSymbol);
    }

    return puzzle.handlePlayerMove(from, to);
  };

  // ── onSquareClick: manual click-to-move ────────────────────────────────────────
  const handleSquareClick = useCallback(
    (args: any) => {
      const { square } = args;

      if (puzzle.status !== "playing") {
        setSelectedSquare(null);
        game.setOptionSquares({});
        return;
      }

      // First click — select a piece
      if (!selectedSquare) {
        const p = game.chess.get(square as Square);
        if (p && p.color === puzzle.playerColor) {
          setSelectedSquare(square);
          // Show legal move dots
          const legalMoves = game.chess.moves({ square: square as Square, verbose: true });
          const styles: Record<string, React.CSSProperties> = {};
          legalMoves.forEach((m) => {
            styles[m.to] = {
              background: game.chess.get(m.to as Square)
                ? "radial-gradient(circle, rgba(0,0,0,.15) 85%, transparent 85%)"
                : "radial-gradient(circle, rgba(200,200,200,.25) 30%, transparent 30%)",
              borderRadius: "50%",
            };
          });
          styles[square] = { backgroundColor: "rgba(255,255,0,0.4)" };
          game.setOptionSquares(styles);
        }
        return;
      }

      // Clicked same square — deselect
      if (selectedSquare === square) {
        setSelectedSquare(null);
        game.setOptionSquares({});
        return;
      }

      const from = selectedSquare as Square;
      const to = square as Square;

      // If clicking another of your own pieces, just change the selection
      const targetPiece = game.chess.get(to);
      if (targetPiece && targetPiece.color === puzzle.playerColor) {
        setSelectedSquare(to);
        const legalMoves = game.chess.moves({ square: to, verbose: true });
        const styles: Record<string, React.CSSProperties> = {};
        legalMoves.forEach((m) => {
          styles[m.to] = {
            background: game.chess.get(m.to as Square)
              ? "radial-gradient(circle, rgba(0,0,0,.15) 85%, transparent 85%)"
              : "radial-gradient(circle, rgba(255,255,255,.25) 30%, transparent 30%)",
            borderRadius: "50%",
          };
        });
        styles[to] = { backgroundColor: "rgba(255,255,0,0.4)" };
        game.setOptionSquares(styles);
        return;
      }

      // Verify this is a legal chess move before validating against the puzzle
      const moves = game.chess.moves({ square: from, verbose: true });
      const isLegal = moves.some(m => m.to === to);
      if (!isLegal) {
        setSelectedSquare(null);
        game.setOptionSquares({});
        return;
      }

      // Now we know it's a legal move, check for promotion
      const p = game.chess.get(from);
      const promotionRank = puzzle.playerColor === "w" ? "8" : "1";
      if (p?.type === "p" && to[1] === promotionRank) {
        const expectedMove = puzzle.puzzle?.moves[puzzle.moveIndex];
        const promo = (expectedMove?.length ?? 0) > 4 ? (expectedMove![4] as PieceSymbol) : "q";
        puzzle.handlePlayerMove(from, to, promo as PieceSymbol);
        setSelectedSquare(null);
        game.setOptionSquares({});
        return;
      }

      // Regular legal move
      puzzle.handlePlayerMove(from, to);
      setSelectedSquare(null);
      game.setOptionSquares({});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSquare, puzzle.status, puzzle.playerColor, puzzle.moveIndex, puzzle.puzzle]
  );

  // ── Promotion (for edge cases in puzzle mode) ──────────────────────────────────
  const onPromotionSelect = (piece: PieceSymbol) => {
    if (!game.promotionMove) return;
    game.tryMove(game.promotionMove.from, game.promotionMove.to, piece);
    game.setPromotionMove(null);
  };

  // ── Move history for puzzle review ────────────────────────────────────────────
  const history = game.chess.history();

  // ─── Puzzle info computed ──────────────────────────────────────────────────────
  const totalPlayerMoves = puzzle.puzzle
    ? Math.ceil((puzzle.puzzle.moves.length - 1) / 2)
    : 0;
  const currentPlayerMove = puzzle.puzzle
    ? Math.floor((puzzle.moveIndex - 1) / 2)
    : 0;

  // ─── JSX ──────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white selection:text-black flex flex-col items-center justify-center p-4 lg:p-8 relative">

      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-neutral-900 via-black to-black pointer-events-none" />

      {/* Loading spinner */}
      {puzzle.status === "loading" && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
            <span className="text-neutral-500 text-sm font-medium tracking-wide">Loading puzzle...</span>
          </div>
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className="flex flex-col xl:flex-row items-start justify-center gap-5 w-full max-w-[1600px] relative z-10">

        {/* 1. Left — Private Server Options */}
        <div className="w-full xl:w-[300px] bg-neutral-900/60 border border-white/6 rounded-xl flex flex-col h-auto xl:h-[680px] overflow-hidden backdrop-blur-xl shrink-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Private Servers</span>
            </div>
          </div>
          <div className="p-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-1.5">
              </div>


            </div>
          </div>
        </div>

        {/* 2. Center — Eval Bar & Board area */}
        <div className="flex flex-row gap-3 shrink-0">
          {/* Evaluation Bar */}
          <div className="hidden xl:flex items-start h-[620px]">
            <EvaluationBar
              cp={evaluation.turn === "b" && evaluation.cp !== undefined ? -evaluation.cp : evaluation.cp}
              mate={
                evaluation.turn === "b" && evaluation.mate !== undefined
                  ? evaluation.mate.startsWith("-") ? evaluation.mate.substring(1) : "-" + evaluation.mate
                  : evaluation.mate
              }
            />
          </div>

          <div className="flex flex-col gap-3">

            {/* Puzzle metadata bar */}
            <div className="w-[520px] bg-neutral-900/40 border border-white/6 rounded-xl px-4 py-3 flex items-center justify-between backdrop-blur-sm">
              <div className="flex items-center gap-3 min-w-0">
                {puzzle.puzzle ? (
                  <>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-600 font-medium">Rating</span>
                      <RatingBadge rating={puzzle.puzzle.rating} />
                    </div>
                    <div className="h-5 w-px bg-white/10" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-600 font-medium">Turn</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-sm ${puzzle.playerColor === "w" ? "bg-white" : "bg-neutral-800 border border-white/20"}`} />
                        <span className="text-[11px] font-semibold text-white uppercase">{puzzle.playerColor === "w" ? "White" : "Black"}</span>
                      </div>
                    </div>
                    <div className="h-5 w-px bg-white/10" />
                    <div className="flex flex-wrap gap-1 min-w-0">
                      {puzzle.puzzle.themes.slice(0, 5).map((t) => (
                        <ThemeBadge key={t} theme={t} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-5 w-28 bg-neutral-800 rounded animate-pulse" />
                )}
              </div>
              <div className="text-right">
                {puzzle.puzzle && puzzle.status === "playing" && (
                  <span className="text-neutral-500 text-[11px] font-mono whitespace-nowrap">
                    Move <span className="text-white font-semibold">{currentPlayerMove + 1}</span> / {totalPlayerMoves}
                  </span>
                )}
                {puzzle.status === "solved" && (
                  <span className="text-white text-xs font-semibold whitespace-nowrap flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-white rounded-full" /> Solved
                  </span>
                )}
              </div>
            </div>

            {/* Board Container */}
            <div className="relative p-[3px] bg-neutral-800 rounded-lg ring-1 ring-white/4">
              <div className="relative w-[520px] h-[520px] bg-neutral-900 rounded-md overflow-hidden">

                {/* Status overlay */}
                <StatusOverlay status={puzzle.status} />

                {game.promotionMove && (
                  <PromotionDialog
                    onSelect={onPromotionSelect}
                    onCancel={() => game.setPromotionMove(null)}
                  />
                )}
                <ChessBoardView
                  position={game.position}
                  optionSquares={squareStyles}
                  premoves={[]}
                  showAnimations={true}
                  onSquareClick={handleSquareClick}
                  onPieceDrop={onPieceDrop}
                  onSquareRightClick={() => {
                    setSelectedSquare(null);
                    game.setOptionSquares({});
                  }}
                  boardOrientation={boardOrientation}
                />
              </div>
            </div>

            {/* Turn indicator */}
            <div className="w-[520px] flex items-center justify-between px-0.5">
              <div className="flex items-center gap-2.5">
                <div className={`w-3.5 h-3.5 rounded-sm ${puzzle.playerColor === "w" ? "bg-white" : "bg-neutral-900 border border-white/20"}`} />
                <span className="text-neutral-500 text-xs font-medium">
                  Playing as <span className="text-white font-semibold">{puzzle.playerColor === "w" ? "White" : "Black"}</span>
                </span>
              </div>
              <div className="min-w-[80px] text-right">
                {puzzle.status === "wrong" && (
                  <span className="text-neutral-400 text-xs font-medium">✗ Incorrect</span>
                )}
                {puzzle.status === "correct" && (
                  <span className="text-white text-xs font-medium">✓ Correct</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Right — Control Panel */}
        <div className="w-full xl:w-[380px] bg-neutral-900/60 border border-white/5 rounded-xl flex flex-col h-[680px] overflow-hidden backdrop-blur-xl shrink-0">

          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Puzzle Trainer</span>
            </div>
            <span className="text-[10px] text-neutral-600 font-mono">345k puzzles</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-1.5 py-2.5 px-4 border-b border-white/5 bg-white/1">
            <button
              title="Flip Board"
              onClick={() => setBoardOrientation((o) => (o === "white" ? "black" : "white"))}
              className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>

            <div className="border-l border-white/10 h-4 mx-1.5" />

            <button
              title="First Move"
              onClick={() => { if (history.length) { game.loadFen(puzzle.puzzle?.fen ?? ""); } }}
              disabled={history.length === 0}
              className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              title="Undo"
              onClick={() => { game.chess.undo(); game.loadFen(game.chess.fen()); }}
              disabled={history.length === 0}
              className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Move history list */}
          <div className="flex-1 overflow-y-auto px-3 py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-[11px] text-center">Waiting for puzzle</span>
              </div>
            ) : (
              <div className="space-y-0.5 font-mono text-sm">
                {history.reduce((pairs: string[][], move, i) => {
                  if (i % 2 === 0) pairs.push([move]);
                  else pairs[pairs.length - 1].push(move);
                  return pairs;
                }, []).map((pair, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 gap-2 px-3 py-1.5 rounded-lg hover:bg-white/3 transition-colors cursor-pointer group"
                  >
                    <span className="col-span-2 text-neutral-700 text-[11px] flex items-center">{i + 1}.</span>
                    <span className="col-span-5 text-neutral-400 group-hover:text-white transition-colors text-[13px]">{pair[0]}</span>
                    <span className="col-span-5 text-neutral-400 group-hover:text-white transition-colors text-[13px]">{pair[1] ?? ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Solved state */}
          {puzzle.status === "solved" && (
            <div className="p-5 border-t border-white/5 bg-white/1 text-center">
              <div className="text-lg font-semibold text-white mb-0.5">Puzzle Solved</div>
              <div className="text-xs text-neutral-500 mb-4">
                Rating: <span className="text-white font-semibold">{puzzle.puzzle?.rating}</span>
              </div>
              <button
                onClick={() => puzzle.fetchAndLoad({
                  minRating: ratingRange?.min,
                  maxRating: ratingRange?.max,
                  theme: (selectedTheme === 'subapi1' || selectedTheme === 'subapi2')
                    ? (selectedSubTheme === 'all' ? selectedTheme : selectedSubTheme)
                    : selectedTheme
                })}
                className="w-full py-3 bg-white text-black rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-all active:scale-[0.99]"
              >
                Next Puzzle →
              </button>
            </div>
          )}

          {/* Action buttons & Filters */}
          {puzzle.status !== "solved" && (
            <div className="p-4 border-t border-white/5 space-y-3.5 bg-white/1">

              {/* Filters Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-600 font-medium">Rating</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {RATING_PRESETS.map((r) => (
                    <button
                      key={r.label}
                      onClick={() => {
                        setRatingRange(r.label === "All" ? null : { min: r.min, max: r.max });
                        setRatingLabel(r.label);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150 ${ratingLabel === r.label
                        ? "bg-white text-black"
                        : "bg-white/3 text-neutral-500 hover:bg-white/8 hover:text-white"
                        }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <div className="pt-1.5">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-600 font-medium block mb-2">Theme</span>
                  <div className="grid grid-cols-3 gap-1">
                    {THEMES.slice(0, 12).map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTheme(t)}
                        className={`text-[11px] py-1.5 px-2 rounded-md transition-all capitalize truncate ${selectedTheme === t && !EXTERNAL_SOURCES.some(s => s.id === selectedTheme)
                          ? "bg-white text-black font-medium"
                          : "bg-white/3 text-neutral-500 hover:bg-white/8 hover:text-white"
                          }`}
                      >
                        {t === 'all' ? 'All' : t.replace(/([A-Z])/g, ' $1')}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => puzzle.getHint()}
                  disabled={puzzle.status !== "playing"}
                  className="py-2.5 bg-white/5 text-white rounded-lg text-xs font-medium hover:bg-white/[0.1] transition-all flex items-center justify-center gap-1.5 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Hint
                </button>
                <button
                  onClick={() => puzzle.fetchAndLoad({
                    minRating: ratingRange?.min,
                    maxRating: ratingRange?.max,
                    theme: (selectedTheme === 'subapi1' || selectedTheme === 'subapi2')
                      ? (selectedSubTheme === 'all' ? selectedTheme : selectedSubTheme)
                      : selectedTheme
                  })}
                  className="py-2.5 bg-white text-black rounded-lg text-xs font-semibold hover:bg-neutral-200 transition-all active:scale-[0.99]"
                >
                  Next Puzzle
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={async () => { try { await navigator.clipboard.writeText(game.position); } catch { } }}
                  className="py-1.5 text-[11px] font-medium rounded-md text-neutral-600 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                  Copy FEN
                </button>
                <button
                  onClick={() => evaluate(game.position, 15)}
                  className="py-1.5 text-[11px] font-medium rounded-md text-neutral-600 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                  Analyse
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
