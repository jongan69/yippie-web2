import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import logo from "../../public/icon.png";
import DexScreenerEmbed from "@/components/chart";

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2" style={{ zIndex: 2 }}>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter text-white dark:text-blue-600 md:text-4xl" z-index={1}>
          Welcome <br className="hidden sm:inline" />
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          ITS TIME TO {siteConfig.name}
        </p>
      </div>
      <div className="flex gap-4" style={{ zIndex: 2 }}>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.pumpUrl}
          className={buttonVariants({ variant: "default" })}
        >
          Click for 10000x
        </Link>
      
      </div>
      <div className="items-center justify-center">
        <Image
          src={logo}
          fill={true}
          objectFit="contain"
          alt="hero" />
      </div>
     
    </section>
  )
}
