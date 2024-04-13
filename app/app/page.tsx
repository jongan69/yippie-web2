"use client"
import { siteConfig } from "@/config/site";
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useWallet, useConnection, ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  createSignInData,
  fetchBalance,
  fetchBtc,
  postWhitelist
} from '../../lib/index';
import { TLog } from '../../types/sol';
import Sidebar from '@/components/sidebar';
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features";
import { WalletAdapterNetwork, Adapter } from "@solana/wallet-adapter-base";
import { verifySignIn } from "@solana/wallet-standard-util";
import { AutoConnectProvider } from "@/components/walletprovider";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { checkWhitelist } from "@/lib/checkWhitelist";
import useRpcEndpoint from "@/lib/hooks/useRpc";
import { createTransferInstruction, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import SignedIn from "@/components/signedin";
import { hasTimePassed } from "@/lib/utils";

// =============================================================================
// Constants
// =============================================================================
const message = 'This app still isnt ready but I love you.';

const StatelessApp = () => {
  
  const { connection } = useConnection();
  const { wallet, publicKey, connect, disconnect, signMessage, signIn, sendTransaction, signTransaction }: any = useWallet();
  const [logs, setLogs] = useState<TLog[]>([]);
  // const [gameData, setGameData] = useState<any>();
  const recipientPublicKey = new PublicKey(siteConfig.devAddress); // The recipient's public key
  // Should all be moved to siteConfig.ETC when ready
  const TOKEN_MINT_ADDRESS = new PublicKey(`${siteConfig.contractAddress}`)
  const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
  const TOKEN_OWNER = new PublicKey('DbvZtMAr8fvMBukqFp82dBoa8k7Bs1opNEFx1JVC7dzx')
  const TOKEN_PROGRAM_OWNER = new PublicKey(`6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`)
  // const ASSOCIATED_TOKEN_ADDRESS = new PublicKey('EPr8KSAbn7eunT4K3hZGKvfunq3h7efcs1ACrNQy5MD');

  function whitelistmessage(balance: any) {
    if (Number(balance) > 0) {
      return postWhitelist(publicKey.toString(), balance).then(answer => alert(`I litterally love you so much gang 4L <3\n ${balance} MEMEME\n ${JSON.stringify(answer)}`))
    } else {
      return alert(`brokie <3 plz buy the token to support  MEMEME Balance: ${balance.toString()}`)
    }
  }

  const createLog = useCallback(
    (log: TLog) => {
      return setLogs((logs) => [...logs, log]);
    },
    [setLogs]
  );

  /** Join Whitelist */
  const joinWhitelist = useCallback(async () => {
    const wlData = await checkWhitelist(publicKey)
    if (wlData) return alert(`You are already on the whitelist!`)
    if (!publicKey || !wallet) return alert(`You gotta connect your wallet ggg`)
    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      createLog({
        status: 'success',
        method: 'signMessage',
        message: `Message signed with signature: ${JSON.stringify(signature)}`,
      });
      fetchBalance(publicKey).then((res: any) => whitelistmessage(res.balance))
    } catch (error: any) {
      alert(error)
      createLog({
        status: 'error',
        method: 'signMessage',
        message: error.message,
      });
    }
  }, [createLog, publicKey, wallet]);

  /** Buy Token */
  const buyToken = useCallback(async () => {
    alert('Please join our telegram for more info! Pump.fun contracts are a bit messy to interact with until fully bonded, please just go to pump.fun for now');
    window.open(siteConfig.pumpUrl)
    if (siteConfig.isDev) return;
    if (!publicKey || !wallet) return alert(`You gotta connect your wallet!`)
    try {
      let buyerTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        TOKEN_MINT_ADDRESS,
        publicKey,
        undefined,
        "confirmed",
        undefined
      );
      alert(`Your MEMEME SPL Token Account Address ${JSON.stringify(buyerTokenAccount?.address)}`)
      const transaction = new Transaction().add(
        createTransferInstruction(
          TOKEN_OWNER, // sender associated token account
          buyerTokenAccount.address, // recipient associated token account
          TOKEN_PROGRAM_OWNER,
          5000, // amount; assuming your token has decimals set to 0
          [],
          TOKEN_PROGRAM_ID
        )
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      transaction.feePayer = publicKey
      transaction.recentBlockhash = blockhash
      signTransaction(transaction)
      const signature = sendTransaction(transaction.serialize());

      await connection.confirmTransaction({
        signature: signature,
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight
      });
    } catch (error: any) {
      console.log(`Here's the deal, we're not selling you shit, but I appreciate you and will keep this in mind, buy off pump.fun for now... ${error}`)
      alert(error)
      createLog({
        status: 'error',
        method: 'signMessage',
        message: error.message,
      });
    }
  }, [createLog, publicKey, wallet]);


  /** TipDev */
  const handleSendTransaction = useCallback(async () => {
    if (!publicKey || !wallet) return alert(`You gotta connect your wallet!`)
    try {
      // 890880 lamports as of 2022-09-01
      const lamports = await connection.getMinimumBalanceForRentExemption(100);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports,
        })
      );
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight }
      } = await connection.getLatestBlockhashAndContext("confirmed");
      const signature = await sendTransaction(transaction, connection, { minContextSlot });
      await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
    } catch (error: any) {
      alert(error)
      createLog({
        status: 'error',
        method: 'signMessage',
        message: error.message,
      });
    }
  }, [publicKey, sendTransaction, connection]);


  /** SignIn */
  const handleSignIn = useCallback(async () => {
    const btcData = await fetchBtc()
    const wlData = await checkWhitelist(publicKey)
    let isTime = false
    if(btcData) isTime = hasTimePassed(btcData)
    if (!publicKey
      || !wallet
      || !wlData
      // || !isTime
    ) {
      alert(`You Need to be whitelisted to use the app!
      It will not be live until the bitcoin halving: ${btcData?.timeUntilHalving}
      Which Happens in ${btcData?.blocksUntilHalving} Blocks (${((btcData?.currentBlockHeight / siteConfig.halvingBlockHeight) * 100).toFixed(2)}%)
      Whitelist Status: ${wlData}`)
      return;
    } else {
      try {
        const signInData = await createSignInData();
        const { account, signedMessage, signature } = await signIn(signInData);
        // Navigate user to app here
        createLog({
          status: 'success',
          method: 'signIn',
          message: `Welcome to MEMEME - WL Status: ${wlData} - Message signed: ${JSON.stringify(signedMessage)} by ${account.address} with signature ${JSON.stringify(signature)}`,
        });

      } catch (error: any) {
        alert(error)
        createLog({
          status: 'error',
          method: 'signIn',
          message: error.message,
        });
      }
    }
  }, [createLog, publicKey, signIn, wallet]);


  /** Connect */
  const handleConnect = useCallback(async () => {
    if (!publicKey || !wallet) return;
    try {
      await connect()
    } catch (error: any) {
      createLog({
        status: 'error',
        method: 'connect',
        message: error.message,
      });
    }
  }, [connect, createLog, publicKey, wallet]);


  /** Disconnect */
  const handleDisconnect = useCallback(async () => {
    if (!publicKey || !wallet) return;
    try {
      await disconnect();
      createLog({
        status: 'warning',
        method: 'disconnect',
        message: '👋',
      });
    } catch (error: any) {
      createLog({
        status: 'error',
        method: 'disconnect',
        message: error.message,
      });
    }
  }, [createLog, disconnect, publicKey, wallet]);


  // All Wallet connected Functions
  const connectedMethods = useMemo(() => {
    return [
      {
        name: 'Join Whitelist',
        onClick: joinWhitelist,
      },
      {
        name: 'Buy Token',
        onClick: buyToken,
      },
      {
        name: 'Sign In',
        onClick: handleSignIn,
      },
      {
        name: 'Tip the Dev',
        onClick: handleSendTransaction,
      },
      {
        name: 'Disconnect',
        onClick: handleDisconnect,
      },
    ];
  }, [
    joinWhitelist,
    buyToken,
    handleSignIn,
    handleSendTransaction,
    handleDisconnect,
  ]);


  return (
    <>
      {logs && (logs[0]?.status === 'success') && (logs[0]?.method === "signIn")
        ? <SignedIn publicKey={publicKey} logs={logs} connectedMethods={connectedMethods} />
        : <Sidebar publicKey={publicKey} connectedMethods={connectedMethods} connect={handleConnect} logs={logs} />
      }
    </>
  );
};

// =============================================================================
// Main Component
// =============================================================================
const App = () => {
  // const { signInAuth, session }: any = useContext(AuthContext)
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useRpcEndpoint(network);

  const wallets = useMemo(
    () => [], // confirmed also with `() => []` for wallet-standard only
    [network]
  );

  const autoSignIn = useCallback(async (adapter: Adapter) => {
    if (!('signIn' in adapter)) return true;
    // Fetch the signInInput from the backend
    /*
    const createResponse = await fetch("/backend/createSignInData");
    const input: SolanaSignInInput = await createResponse.json();
    */

    const input: SolanaSignInInput = await createSignInData();
    // Send the signInInput to the wallet and trigger a sign-in request
    const output = await adapter.signIn(input);
    const constructPayload = JSON.stringify({ input, output });

    // Verify the sign-in output against the generated input server-side
    /*
    const verifyResponse = await fetch("/backend/verifySIWS", {
      method: "POST",
      body: strPayload,
    });
    */

    /* ------------------------------------ BACKEND ------------------------------------ */
    // "/backend/verifySIWS" endpoint, `constructPayload` receieved
    const deconstructPayload: { input: SolanaSignInInput; output: SolanaSignInOutput } = JSON.parse(constructPayload);
    const backendInput = deconstructPayload.input;
    const backendOutput: SolanaSignInOutput = {
      account: {
        ...output.account,
        publicKey: new Uint8Array(output.account.publicKey),
      },
      signature: new Uint8Array(output.signature),
      signedMessage: new Uint8Array(output.signedMessage),
    };

    // Check whitelist and store in Auth Context
    const wlData = await checkWhitelist(backendOutput.account.publicKey)

    if (!verifySignIn(backendInput, backendOutput)) {
      console.error(`Sign In verification failed!`)
      throw new Error('Sign In verification failed!');
    }
    /* ------------------------------------ BACKEND ------------------------------------ */
    return wlData;
  }, []);

  const autoConnect = useCallback(async (adapter: Adapter) => {
    adapter.autoConnect().catch(() => {
      return autoSignIn(adapter);
    });
    return false;
  }, [autoSignIn]);

  if (endpoint)
    return (
      <>
        <AutoConnectProvider>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={autoConnect}>
              <WalletModalProvider>
                <StatelessApp />
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </AutoConnectProvider >
      </>
    );
  else {
    return (
      <p> Something went wrong, please try again! </p>
    )
  }
};

export default App;