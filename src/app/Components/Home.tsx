'use client'
import { useEffect } from 'react';
import Link from 'next/link';
import { FaChessQueen } from "react-icons/fa6";
import { IoCheckmarkCircle, IoExtensionPuzzleSharp } from "react-icons/io5";
import { RiGraduationCapFill } from "react-icons/ri";
import { MdArrowForward, MdPublic, MdQueryStats } from "react-icons/md";
import { MdPeopleAlt } from "react-icons/md";
import { IoIosAdd, IoMdHelpCircle, IoMdMail } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { FaChessBishop, FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { HiLightningBolt } from "react-icons/hi";
import { MdMilitaryTech } from "react-icons/md";
import Lenis from 'lenis';

const GrandmasterMonolith = () => {
    // Helper to generate chess board squares
    const renderBoardSquares = () => {
        const squares = [];
        for (let i = 0; i < 64; i++) {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const isDark = (row + col) % 2 === 0;

            squares.push(
                <div
                    key={i}
                    className={`rounded-sm m-px ${isDark ? 'bg-secondary-fixed-dim' : 'bg-surface-container-highest'}`}
                />
            );
        }
        return squares;
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
        <div className="bg-background text-on-background selection:bg-primary selection:text-surface">
            {/* TopNavBar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-5!  max-w-7xl! mx-auto rounded-full mt-2 bg-neutral-900/70 backdrop-blur-xl shadow-[0_40px_40px_0_rgba(255,255,255,0.06)] font-['Inter'] tracking-tight text-sm font-medium">
                <div className="flex items-center gap-8">
                    <span className="text-2xl font-black text-white tracking-tighter ml-10">Productivity Chess</span>
                    <div className="hidden md:flex gap-6">
                        <Link href="#" className="text-white font-bold hover:bg-white/10 transition-all duration-300 px-3 py-1 rounded-full">
                            Play
                        </Link>
                        <Link href="#" className="text-neutral-400 hover:text-white transition-all duration-300 px-3 py-1 rounded-full">
                            Puzzles
                        </Link>
                        <Link href="#" className="text-neutral-400 hover:text-white transition-all duration-300 px-3 py-1 rounded-full">
                            Learn
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center bg-white/5 rounded-full px-6 py-2.5 gap-2">
                        <span className="material-symbols-outlined text-neutral-400 text-sm"><FaSearch /></span>
                        <input className="bg-transparent border-none focus:ring-0 text-xs w-32 placeholder:text-neutral-500 outline-none" placeholder="Search masters..." type="text" />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2  text-white hover:bg-white/10 transition-all duration-300 rounded-full active:scale-95">
                            <IoIosNotifications className='text-[23px]' />
                        </button>
                        <button className="p-2 text-white hover:bg-white/10 mr-5 transition-all duration-300 rounded-full active:scale-95">
                            <IoSettingsSharp className='text-[23px]' />
                        </button>
                        <button className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-xs hover:bg-primary-container transition-all active:scale-95">
                            Play Now
                        </button>
                    </div>
                </div>
            </nav>

            {/* SideNavBar */}
            <aside className="fixed left-0 top-18 bottom-0 z-60 flex flex-col items-center py-8! bg-neutral-900/70 backdrop-blur-xl shadow-[0_40px_40px_0_rgba(255,255,255,0.06)] rounded-xl my-4 ml-4 w-20 lg:flex">


                <div className="flex flex-col gap-6 flex-1">
                    {[
                        { icon: <FaChessQueen />, label: 'Play', active: true },
                        { icon: <IoExtensionPuzzleSharp />, label: 'Puzzles' },
                        { icon: <RiGraduationCapFill />, label: 'Learn' },
                        { icon: <MdQueryStats />, label: 'Stats' },
                        { icon: <MdPeopleAlt />, label: 'Social' },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href="#"
                            className={`flex flex-col items-center gap-1 p-3 active:scale-90 duration-200 ${item.active
                                ? 'bg-white/10 text-white rounded-3xl'
                                : 'text-neutral-500 hover:text-white transition-colors'
                                }`}
                        >
                            <span >{item.icon}</span>
                            <span className="font-['Inter'] text-[7px] font-semibold uppercase tracking-widest">{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col gap-4 mt-auto">
                    <button className="text-neutral-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-xl"><IoMdHelpCircle /></span>
                    </button>
                    <button className="text-neutral-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-xl"><MdOutlineLogout /></span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:pl-32 pt-24 min-h-screen">
                {/* Hero Section */}
                <section className="px-8 py-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/15 text-xs font-medium tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            NOW LIVE: WORLD CHAMPIONSHIP FINALS
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] text-white">
                            SILENCE.<br />STRATEGY.<br /><span className="text-neutral-500">PRECISION.</span>
                        </h1>
                        <p className="text-lg text-neutral-400 max-w-md font-light leading-relaxed">
                            Experience chess in its purest form. A sanctuary for intellectual mastery, designed for those who seek the depth of the monolith.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform duration-300">Begin Training</button>
                            <button className="bg-surface-container-high text-white px-10 py-4 rounded-full font-bold text-sm border border-outline-variant/20 hover:bg-surface-container-highest transition-all">Watch Masters</button>
                        </div>
                    </div>

                    <div className="relative aspect-square">
                        <div className="absolute inset-0 bg-linear-to-tr from-surface via-transparent to-transparent z-10"></div>
                        <img
                            alt="Chess King"
                            className="w-full h-full object-cover rounded-xl grayscale contrast-125"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh-Jr4_HM3n-1IcSYSFb1EUolsTts5nCaDzlNWNa1y9WKxxjv9aS8XmGMgde9NCSB4WRVgeT1uvtRNOAbvH1rVBxx7yrtZXU6AakS7pfdNzFV0PcRDa3BfJSw3pyQLvaBCvOo7A79w4QoSiPEd_sZoFBbsvwLXuT_sWIL1-jXYwALhj2sIKYXkhb0yJgm-c1Gw1XZW_VzQB4OVDb7Ar4afBjwqu0KnSTV1KUwlb1tI8D1gvWX7yKyfVaexPB0U5KvbbX5M0sv9JwI"
                        />
                        <div className="absolute -bottom-6 -left-6 glass-panel p-6 rounded-xl border border-white/5 z-20 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-surface bg-neutral-800"></div>
                                    <div className="w-10 h-10 rounded-full border-2 border-surface bg-neutral-700"></div>
                                    <div className="w-10 h-10 rounded-full border-2 border-surface bg-neutral-600"></div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">2,481 Active Players</p>
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest">In training right now</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bento Grid Features */}
                <section className="px-8 py-24 max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-3xl font-black text-white tracking-tight">THE MONOLITH ECOSYSTEM</h2>
                        <div className="h-1 w-24 bg-primary mt-4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Large Feature Card */}
                        <div className="md:col-span-2 bg-surface-container rounded-xl p-8 relative overflow-hidden group min-h-[400px]">
                            <div className="relative z-10 h-full flex flex-col">
                                <span className="material-symbols-outlined text-4xl text-primary mb-6" style={{ fontVariationSettings: "'FILL' 1" }}><MdQueryStats /></span>
                                <h3 className="text-3xl font-bold text-white mb-4">Neural Analysis</h3>
                                <p className="text-neutral-400 max-w-sm mb-8">Deep-engine move evaluation with human-centric explanations. Understand the &apos;why&apos; behind every blunder and brilliance.</p>
                                <div className="mt-auto">
                                    <button className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all text-white">
                                        Explore Analytics <span className="material-symbols-outlined text-sm"><MdArrowForward /></span>
                                    </button>
                                </div>
                            </div>
                            <img
                                alt="Cyber Chess"
                                className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-20 grayscale group-hover:scale-110 transition-transform duration-700"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzSmX3tScyZweA2GGcoWOIibELA7otSJdz6Nk_IRv4cehgcAa1d5Xhm-bka9Pb7lx1BvQnUwWQRge7Wg4Tch3Nn_LEfPoczw5Mh_Q8WSNZaa6wwAOfJRhtyy14mVU-tUbib58JulLMuaesovPmJM8sJ3dlpWoZgnOTXV6sUwtbKRJjj1JieDw3u7oFt31QfF072wkZRspQGrKVYKkJhuZ0w3xDttTXwePD7GtORcaomPtuREuZPXtCOElM1vDRMArsqgQFQiy0JcE"
                            />
                        </div>

                        {/* Vertical Card */}
                        <div className="bg-surface-container-high rounded-xl p-8 flex flex-col justify-between border border-outline-variant/10">
                            <div>
                                <span className="material-symbols-outlined text-3xl text-primary "><RiGraduationCapFill /></span>
                                <div className="mb-4"></div>
                                <h3 className="text-xl font-bold text-white mb-2">Improvement Academy</h3>
                                <p className="text-sm text-neutral-500">Curated paths from top-tier grandmasters focusing on endgame theory and pawn structures.</p>
                            </div>
                            <div className="mt-8 pt-8 border-t border-outline-variant/10">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Progress</span>
                                    <span className="text-xs font-bold text-white">64%</span>
                                </div>
                                <div className="w-full h-1 bg-surface-container mt-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[64%]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Small Cards */}
                        {[
                            { icon: <IoExtensionPuzzleSharp />, title: 'Infinite Puzzles', desc: 'Adaptive tactics that evolve with your playing style.' },
                            { icon: <HiLightningBolt />, title: 'Blitz Arena', desc: 'Instant matchmaking with low-latency global servers.' },
                            { icon: <MdMilitaryTech />, title: 'Pro Circuit', desc: 'Tiered tournaments with real stakes and verified ratings.' }
                        ].map((card) => (
                            <div key={card.title} className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 hover:bg-surface-container transition-colors duration-300">
                                <span className="material-symbols-outlined text-2xl text-neutral-400 mb-4">{card.icon}</span>
                                <div className="mb-4"></div>
                                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                                <p className="text-xs text-neutral-500">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Board Showcase Section */}
                <section className="px-8 py-24 max-w-7xl mx-auto overflow-hidden">
                    <div className="glass-panel rounded-xl p-12 flex flex-col lg:flex-row items-center gap-16 border border-white/5 relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full"></div>

                        <div className="w-full max-w-[500px] aspect-square bg-surface-container-highest rounded-lg grid grid-cols-8 grid-rows-8 p-1 shadow-2xl relative">
                            {renderBoardSquares()}

                            {/* Highlight Layer */}
                            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none">
                                <div className="col-start-4 row-start-4 bg-primary/20 rounded-sm m-px border border-primary/50"></div>
                                <div className="col-start-5 row-start-6 bg-surface-tint/30 rounded-sm m-px flex justify-center items-center text-4xl"><FaChessBishop /></div>
                            </div>
                            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                                <div className="col-start-2 row-start-2 bg-primary/20 rounded-sm m-px border border-primary/50"></div>
                                <div className="col-start-3 row-start-3 bg-surface-tint/30 rounded-sm m-px flex justify-center items-center text-4xl"></div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-6">
                            <h2 className="text-4xl font-black text-white leading-tight">THE ZEN INTERFACE</h2>
                            <p className="text-neutral-400 leading-relaxed font-light">
                                We removed the noise. No ads, no popups, no distracting chat bubbles. Just you, the board, and the engine. Our board is rendered with high-fidelity materials that react to light, providing a tactile feel even in a digital space.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Ultra-low latency move processing',
                                    'Customizable board textures (Marble, Obsidian, Oak)',
                                    'Integrated focus mode and dark environment'
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary text-sm"><IoCheckmarkCircle /></span>
                                        <span className="text-sm font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-8 py-24 max-w-7xl mx-auto text-center">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <h2 className="text-5xl font-black text-white tracking-tighter">THE BOARD IS SET.</h2>
                        <p className="text-neutral-500 text-lg uppercase tracking-[0.3em]">Join the 1% of tactical masters</p>
                        <div className="flex justify-center gap-6 pt-4">
                            <button className="bg-white text-black px-12 py-5 rounded-full font-black text-sm tracking-widest hover:bg-neutral-200 transition-all active:scale-95">CREATE ACCOUNT</button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="px-8 py-16 max-w-7xl mx-auto border-t border-outline-variant/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2">
                            <span className="text-2xl font-black text-white tracking-tighter block mb-6">Productivity Chess</span>
                            <p className="text-sm text-neutral-500 max-w-xs">Building the future of competitive intellectual sports through minimalist design and deep technology.</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">Platform</h4>
                            <ul className="space-y-4 text-sm text-neutral-500">
                                <li><Link href="#" className="hover:text-white transition-colors">Desktop App</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Mobile iOS</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Tournament API</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-neutral-500">
                                <li><Link href="#" className="hover:text-white transition-colors">Fair Play Policy</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-outline-variant/5">
                        <p className="text-[10px] uppercase tracking-widest text-neutral-600">© 2026 Productivity Chess. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="#" className="text-neutral-600 hover:text-white transition-colors"><span className="material-symbols-outlined"><MdPublic /></span></Link>
                            <Link href="#" className="text-neutral-600 hover:text-white transition-colors"><span className="material-symbols-outlined"><IoMdMail /></span></Link>
                        </div>
                    </div>
                </footer>
            </main>

            {/* Floating Action Button */}
            <button className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}><IoIosAdd /></span>
            </button>
        </div>
    );
};

export default GrandmasterMonolith;