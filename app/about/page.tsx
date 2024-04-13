"use client"
import { siteConfig } from "@/config/site"
import { useCallback, useEffect, useState } from "react";

export default function IndexPage() {
  const [supply, setSupply] = useState<any>();
  const [burned, setBurned] = useState<any>();

  const fetchData = useCallback(async () => {
    const response1 = await fetch('/api/getSupply');
    const data = await response1.json();
    setSupply(data.named); // Convert to bigint
    const response2 = await fetch('/api/getTotalBurned');
    const data2 = (await response2.json());
    setBurned(data2.named) // Convert to bigint
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          About <br className="hidden sm:inline" />
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {siteConfig.about}
        </p>
      </div>
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Details <br className="hidden sm:inline" />
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {siteConfig.shortAbout} <br className="hidden sm:inline" />
          <br className="hidden sm:inline" />
        </p>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          <br />
          Name: {siteConfig.name} TOKEN <br className="hidden sm:inline" />
          <br className="hidden sm:inline" />
        </p>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Total Minted Supply: 1 Billion {siteConfig.name}s<br className="hidden sm:inline" />
          <br className="hidden sm:inline" />
        </p>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Total Available Supply: {supply?.toString()} {siteConfig.name}s<br className="hidden sm:inline" />
          <br className="hidden sm:inline" />
        </p>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Total Burned: {burned} <br className="hidden sm:inline" />
          <br className="hidden sm:inline" />
          <br />
          <br />
          {siteConfig.aboutRemarks}
        </p>
      </div>
    </section>
  )
}
