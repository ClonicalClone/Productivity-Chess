'use client';
import React, { useEffect } from 'react';
import { useSession } from "next-auth/react";
import '../style.css';
import Lenis from 'lenis';
import Navbar from './ui/Navbar';
import Sidebar from './ui/Sidebar';
import MinSidebar from './ui/MinSidebar';



// --- Mock Data ---
const performanceData = [
    { date: 'Oct 01', rating: 2600 },
    { date: 'Oct 05', rating: 2650 },
    { date: 'Oct 10', rating: 2620 },
    { date: 'Oct 15', rating: 2750 },
    { date: 'Oct 20', rating: 2700 },
    { date: 'Today', rating: 2842 },
];

const encounters = [
    { name: 'Magnus_C', rating: 2850, format: 'Blitz', time: '10 mins ago', result: '1 - 0', status: 'Victory', win: true },
    { name: 'Hikaru_N', rating: 2892, format: 'Bullet', time: '2 hours ago', result: '½ - ½', status: 'Draw', win: false },
    { name: 'Alireza_F', rating: 2810, format: 'Rapid', time: 'Yesterday', result: '1 - 0', status: 'Victory', win: true },
];






// --- Main Page ---

export default function GrandmasterDashboard() {
    const { data: session } = useSession();
    const updateStats = async (newElo: number, newDelta: number, newSolvedCount: number) => {
        try {
            await fetch("/api/updateStats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    elo: newElo,
                    delta_value: newDelta,
                    puzzles_solved: newSolvedCount,
                }),
            });
        } catch (error) {
            console.error("Error updating stats:", error);
        }
    };
    useEffect(() => {
        const lenis = new Lenis();

        // Use requestAnimationFrame to update Lenis on every frame
        function raf(time: any) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy(); // Cleanup on unmount
        };

    }, []);

    return (
        <div className="bg-background text-on-surface min-h-screen selection:bg-white selection:text-black">
            <Navbar />
            <Sidebar />

            {/* Main Content Area */}
            <main className="xl:ml-32 pt-32 pb-24 px-6 md:px-10 max-w-7xl mx-auto">

                {/* Hero Matrix Grid */}
                <div className="grid grid-cols-12 gap-6 mb-12">

                    {/* ELO Card */}
                    <div className="col-span-12 lg:col-span-4 bg-surface rounded-3xl p-8 md:p-10 flex flex-col justify-between border border-white/5 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10  group-hover:opacity-10 transition-opacity duration-700">
                            <span className="material-symbols-outlined text-[15rem]">military_tech</span>
                        </div>
                        <div>
                            <h3 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Current Rating</h3>
                            <div className="flex items-baseline gap-3">
                                <span className="text-7xl md:text-8xl font-black tracking-tighter text-white">{(session?.user as any)?.elo ?? 2842}</span>
                                <span className="text-white/60 font-bold text-xl">{(session?.user as any)?.delta_value > 0 ? '+' : ''}{(session?.user as any)?.delta_value ?? 12}</span>
                            </div>
                            <p className="text-on-surface-variant text-sm mt-3 font-medium">Grandmaster Title • Top 0.1% Globally</p>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-3">
                            <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-full flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Online</span>
                            </div>
                            <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-full flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-on-surface-variant">timer</span>
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Blitz 3+2</span>
                            </div>
                        </div>
                    </div>

                    {/* Performance Graph */}
                    <div className="col-span-12 lg:col-span-8 bg-surface rounded-3xl p-8 md:p-10 border border-white/5 relative flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">Performance Trends</h3>
                            <select className="bg-black text-white border-none rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer">
                                <option>Last 30 Days</option>
                                <option>Last 6 Months</option>
                            </select>
                        </div>
                        <div className="flex-1 min-h-[160px] relative flex items-end justify-between">
                            <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
                                <defs>
                                    <linearGradient id="lineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                                        <stop offset="0%" stopColor="white" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="white" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,85 Q150,80 250,65 T450,70 T650,45 T850,50 T1000,25" fill="none" stroke="white" stroke-linecap="round" strokeWidth="3"></path>
                                <path d="M0,85 Q150,80 250,65 T450,70 T650,45 T850,50 T1000,25 L1000,100 L0,100 Z" fill="url(#lineGrad)"></path>
                            </svg>
                            {/* Grid lines */}
                            <div className="w-px h-full bg-white/5"></div>
                            <div className="w-px h-full bg-white/5"></div>
                            <div className="w-px h-full bg-white/5"></div>
                            <div className="w-px h-full bg-white/5"></div>
                        </div>
                        <div className="flex justify-between mt-6 text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
                            <span>Oct 01</span>
                            <span>Oct 10</span>
                            <span>Oct 20</span>
                            <span>Today</span>
                        </div>
                    </div>
                </div>

                {/* Secondary Grid: Encounters & Mastery */}
                <div className="grid grid-cols-12 gap-8">

                    {/* Recent Encounters */}
                    <div className="col-span-12 lg:col-span-7 xl:col-span-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black tracking-tight text-white uppercase italic">Recent Encounters</h2>
                            <button className="text-[10px] font-bold text-on-surface-variant hover:text-white transition-colors uppercase tracking-[0.2em]">View History</button>
                        </div>
                        <div className="space-y-3">
                            {encounters.map((game, idx) => (
                                <div key={idx} className="group bg-surface hover:bg-surface-container-high border border-white/5 p-5 md:p-6 rounded-2xl flex items-center justify-between transition-all cursor-pointer">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined">person</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-white">{game.name}</span>
                                                <span className="text-[9px] px-2 py-0.5 bg-white/10 text-on-surface-variant rounded-full font-black">{game.rating}</span>
                                            </div>
                                            <span className="text-[10px] text-on-surface-variant uppercase font-medium">{game.time} • {game.format}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xl font-black block leading-none mb-1 ${game.win ? 'text-white' : 'text-white/50'}`}>{game.result}</span>
                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${game.win ? 'text-white/40' : 'text-white/20'}`}>{game.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mastery Sidebar */}
                    <div className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-6">

                        {/* Prominent CTA Card */}
                        <div className="bg-white text-black rounded-3xl p-8 relative overflow-hidden group shadow-[0_20px_50px_rgba(255,255,255,0.05)] cursor-pointer active:scale-[0.98] transition-all">
                            <div className="absolute -right-6 -bottom-6 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700">
                                <span className="material-symbols-outlined text-[12rem]">school</span>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 opacity-50">Next Module</h4>
                                <h2 className="text-3xl font-black tracking-tighter leading-tight mb-5">Sicilian Defense: <br />Najdorf Mastery</h2>
                                <p className="text-sm font-medium leading-relaxed mb-10 opacity-70">Analyze your recent losses with Black and master the counter-attack patterns of elite GMs.</p>
                                <button className="bg-black text-white w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 group-hover:gap-5 transition-all">
                                    Resume Training <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>

                        {/* Mini Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-surface p-6 rounded-2xl border border-white/5">
                                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Win Rate</span>
                                <span className="text-2xl font-black text-white">68.4%</span>
                            </div>
                            <div className="bg-surface p-6 rounded-2xl border border-white/5">
                                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Accuracy</span>
                                <span className="text-2xl font-black text-white">94.2%</span>
                            </div>
                            <div className="bg-surface p-6 rounded-2xl border border-white/5">
                                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Streak</span>
                                <span className="text-2xl font-black text-white">8 Lvl</span>
                            </div>
                            <div className="bg-surface p-6 rounded-2xl border border-white/5">
                                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Puzzles</span>
                                <span className="text-2xl font-black text-white">{(session?.user as any)?.puzzles_solved ?? "1,242"}</span>
                            </div>
                        </div>

                        {/* Aesthetic Block */}
                        <div className="h-44 rounded-2xl overflow-hidden relative border border-white/10">
                            <div className="w-full h-full object-cover grayscale brightness-50" />
                            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] leading-relaxed">The path to mastery is silent.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Nav (Mobile/Tablet) */}
            <MinSidebar />
            {/* FAB */}
            <button className="fixed bottom-24 right-6 xl:bottom-10 xl:right-10 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-40">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            </button>
        </div>
    );
}