"use client"
import React, { useMemo, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import Link from "next/link";
import Image from 'next/image';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from './ui/button'; // Assuming Button is already styled with TailwindCSS
import { ConnectedMethods } from '@/types/phantom';
import TinderCard from 'react-tinder-card';

// Importing styles for Solana wallet adapter UI components
require('@solana/wallet-adapter-react-ui/styles.css');

interface Props {
    publicKey?: PublicKey;
    connectedMethods: ConnectedMethods[];
    connect: () => Promise<void>;
    logs: any
}

const Sidebar: React.FC<Props> = React.memo(function sidebar({ publicKey, connectedMethods, logs }) {
    const isSignedIn: any = (logs[0]?.status === 'success') && (logs[0]?.method === "signIn") && publicKey

    return (
        <div className="flex h-full min-h-screen flex-col items-center bg-gray-800 text-white">
            <div className="flex-2 my-5">
                <Link href="/home">
                    <Image src="/icon.png" alt="Logo" width={100} height={100} className="size-24 object-contain" />
                </Link>
            </div>
            <WalletMultiButton className="btn mb-5" />
            {!isSignedIn ? (

                <div className="flex flex-col items-center space-y-3 p-3">
                    <div className="text-sm">
                        <span className="text-blue-300"> {publicKey?.toBase58().slice(0, 10)}...</span>
                    </div>
                    {JSON.stringify(logs)}
                    {logs[0]?.status === 'success' && logs[0]?.method === "signIn"}
                    {/* 
                    <div className="text-sm">
                        <>Balance: <span className="text-green-400">{balance ?? 0} MEMEME</span></>
                    </div> */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {connectedMethods.map((method, i) => (
                            <Button key={`${method.name}-${i}`} variant="ghost" onClick={method.onClick}>
                                {method.name}
                            </Button>
                        ))}
                    </div>
                </div>
            )
                : <p className="mb-5 text-center text-red-500">Not Connected</p>}
            <div className="auto p-3 text-sm">
                Made with <span className="text-red-500">❤️</span> by the
                <a href="https://phantom.app" className="ml-1 text-blue-400 hover:text-blue-600">
                    MEMEME team
                </a>
            </div>
        </div>
    );
});

export default Sidebar;
