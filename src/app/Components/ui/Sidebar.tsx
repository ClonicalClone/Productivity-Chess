import React from 'react'

const Sidebar = () => {
    return (
        <aside className="fixed left-6 top-28 bottom-6 w-20 hidden xl:flex flex-col items-center py-8 glass-nav rounded-3xl z-40">
            <div className="flex flex-col items-center gap-1 mb-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-white to-neutral-500 p-px">
                    <div className="w-full h-full bg-neutral-900 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>chess</span>
                    </div>
                </div>
                <span className="font-['Inter'] text-[9px] font-black uppercase tracking-widest text-white/40 mt-2">GM</span>
            </div>
            <nav className="flex-1 flex flex-col gap-8">
                <a className="flex flex-col items-center gap-1 group" href="#">
                    <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <span className="material-symbols-outlined text-xl">chess</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white">Play</span>
                </a>
                <a className="flex flex-col items-center gap-1 group" href="#">
                    <div className="w-12 h-12 text-neutral-500 rounded-2xl flex items-center justify-center group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-xl">extension</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 group-hover:text-white">Puzzles</span>
                </a>
                <a className="flex flex-col items-center gap-1 group" href="#">
                    <div className="w-12 h-12 text-neutral-500 rounded-2xl flex items-center justify-center group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-xl">school</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 group-hover:text-white">Learn</span>
                </a>
                <a className="flex flex-col items-center gap-1 group" href="#">
                    <div className="w-12 h-12 text-neutral-500 rounded-2xl flex items-center justify-center group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-xl">query_stats</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 group-hover:text-white">Stats</span>
                </a>
            </nav>
            <div className="mt-auto flex flex-col gap-6">
                <button className="text-neutral-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">help</span>
                </button>
                <button className="text-neutral-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar