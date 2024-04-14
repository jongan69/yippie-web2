'use client'

import Banner from "@/components/banner";
import Landing from "@/components/landing"
import { useCallback, useEffect, useState } from "react"
import { siteConfig } from "@/config/site"
import Modal from "@/components/modal";
import { useRouter } from 'next/navigation'
import useDevice from '@/lib/hooks/useDevice';
import { browserName } from 'react-device-detect';
import { getCoinData } from "@/lib/getCoinData";
import { getPriceData } from "@/lib/getPriceData";
import DexScreenerEmbed from "@/components/chart";

export default function IndexPage() {
  const [coindata, setCoinData] = useState()
  const [price, setPrice] = useState()
  const [showModal, setShowModal] = useState(false);
  const router = useRouter()
  const { isMobile } = useDevice();

  const fetchData = useCallback(async () => {
    const data = await getCoinData();
    setCoinData(data)
    const PriceData = await getPriceData()
    setPrice(PriceData)
  }, [router])

  // on Load
  useEffect(() => {
    fetchData()
  }, [router]); // Dependency array is empty, so this runs once on mount

  // on Launch Button
  function launch() {
    setShowModal(true)
    play()
  }

  // Play Music
  function play() {
    var audio: any = document.getElementById('a1');
    if (audio) {
      audio.play();
    }
  }

  // On Continue in Home Modal
  function navigate() {
    if (!isMobile) {
      router.push('/app')
    }
    if (isMobile && browserName !== "WebKit") {
      try {
        alert("You need to be in Phantom Wallet Buddy")
        document.location = `https://phantom.app/ul/browse/https://www.${siteConfig.baseUrl}/app?ref=https://www.mememe.ooo`;
      } catch (error) {
        alert("Dont be goofy, just open phantom and go to mememe.ooo")
        document.location = `https://phantom.app/ul/v1/connect?redirect_link=https://mememe.ooo/app`
      }
    } else {
      router.push('/app')
    }
  }

  return (
    <div
      className="mx-auto grid items-center justify-center gap-8 p-6"
    >
       {/* <DexScreenerEmbed/> */}
      <div className="flex w-full max-w-xs flex-col items-start gap-4 sm:max-w-xl md:max-w-4xl">
        <Banner price={price} />
        <Modal
          shown={showModal}
          close={() => setShowModal(false)}
          continueFunction={() => navigate()}
        >
          <h3>The App isnt ready but Feel free to continue</h3>
        </Modal>
       
        <br />
        {!showModal && coindata && price && <Landing data={coindata} launch={launch} price={price} />}
      </div>
     
      <audio id='a1'>
        <source src="/cantina.mp3" type='audio/mpeg' />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}
