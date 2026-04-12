'use client'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import React from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "./drawer"

const Navbar = () => {
    const { data: session } = useSession()
    console.log(session?.user?.image)
    return (
        <nav className="fixed top-6 left-1/2 bg-black border border-black border-t-zinc-700 -translate-x-1/2 w-[calc(100%-3rem)] max-w-7xl z-50 glass-nav rounded-full px-9 py-3 flex justify-between items-center transition-all duration-300">
            <div className="flex items-center gap-10 ">
                <span className="text-xl font-black tracking-tighter text-white whitespace-nowrap">Productivity Chess</span>
                <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
                    <a className="text-white" href="#">Overview</a>
                    <a className="text-on-surface-variant hover:text-white transition-colors" href="#">Tournaments</a>
                    <a className="text-on-surface-variant hover:text-white transition-colors" href="#">Academy</a>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-on-surface-variant">settings</span>
                    </button>
                </div>
                <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold active:scale-95 transition-all">Play Now</button>
                <div className="h-9 w-9 rounded-full overflow-hidden border border-white/20 ">
                    <div className="flex flex-wrap gap-2">

                        <Drawer

                            direction={
                                'right'
                            }
                        >
                            <DrawerTrigger asChild>
                                <img className="h-9 w-9 object-cover z-30!" src={session?.user?.image || 'https://via.placeholder.com/150'} alt="Profile Image" />
                            </DrawerTrigger>
                            <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh] max-w-1/2!">

                                <DrawerHeader>
                                    <DrawerTitle>Move Goal</DrawerTitle>
                                    <DrawerDescription>
                                        Set your daily activity goal.
                                    </DrawerDescription>
                                </DrawerHeader>

                                <div className="no-scrollbar overflow-y-auto px-7 ">
                                    {Array.from({ length: 10 }).map((_, index) => (
                                        <p
                                            key={index}
                                            className="mb-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed"
                                        >
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                            irure dolor in reprehenderit in voluptate velit esse cillum
                                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                            cupidatat non proident, sunt in culpa qui officia deserunt
                                            mollit anim id est laborum.
                                        </p>
                                    ))}
                                </div>
                                <DrawerFooter>
                                    <button>Submit</button>
                                    <DrawerClose asChild>
                                        <button>close</button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>

                        </Drawer>

                    </div></div>
            </div>

        </nav >
    )
}

export default Navbar