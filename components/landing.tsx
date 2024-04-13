import React, { useMemo, useState } from "react";
import Particles from 'react-tsparticles';
import { loadSnowPreset } from "tsparticles-preset-snow";
import { Canvas } from '@react-three/fiber';
import RotatingTextWithRainingMoney from "@/components/three/RotatingTextWithRainingMoney";
import { useTheme } from "next-themes";
import { buttonVariants } from "./ui/button";
import { siteConfig } from "@/config/site";

function Landing({ children, data, launch, price }: any) {
  const [coindata] = useState(data);
  const [priceData] = useState(price);
  const [center, setCenter] = useState(false);
  const { theme } = useTheme();

  const options: any = useMemo(() => ({
    background: {
      color: {
        value: theme === "light" ? "#ffffff" : "#000000",
      },
    },
    particles: {
      color: {
        value: theme === "light" ? "#000000" : "#ffffff",
      },
      links: {
        color: theme === "light" ? "#000000" : "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        enable: true,
        speed: { min: 1, max: 3 }, // Adjust speed as needed
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "attract",
        },
        onClick: {
          enable: true,
          mode: "push",
        },
      },
      modes: {
        repulse: {
          distance: 100,
        },
        push: {
          quantity: 100,
        },
      },
    },
    detectRetina: true,
    preset: "snow",
    fullScreen: {
      zIndex: -1,
    },
  }), [theme]);

  return (
    <div>
      <Canvas>
        <RotatingTextWithRainingMoney
          data={coindata}
          center={center}
          price={priceData}
        />
      </Canvas>
      <div className="m-2 flex justify-between p-4">
        <button
          onClick={launch}
          className={buttonVariants({ variant: "default" })}>
          Start
        </button>
        <button
          onClick={() => setCenter(!center)}
          className={buttonVariants({ variant: "default" })}
        >
          {center ? "Get Serious" : "weee"}
        </button>
        <div>
          <a
            className={buttonVariants({ variant: "default" })}
            href={`${siteConfig.solscanUrl}`}>
            Solscan
          </a>
        </div>
      </div>
      <Particles id="tsparticles"
        init={async (engine) => await loadSnowPreset(engine)}
        options={options}
      />
      {children}
    </div>
  );
}

export default Landing;
