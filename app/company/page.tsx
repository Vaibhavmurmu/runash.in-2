"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Cpu, Globe, Layers, Shield, Zap } from "lucide-react"
import Link from "next/link"
import Head from "next/head"
import ThemeToggle from "@/components/theme-toggle"

export default function CompanyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Company</title>
        <link rel="icon" href="" />
      </Head>

      <main className="mt-16 flex w-full flex-1 flex-col items-center justify-centre px-20 text-center">
        <div className='mt-16 text-1xl card'>
                OUR MISSION
        </div>
        <h1 className="mt-12 text-5xl font-bold">
          We enable retailers to build real selling experience 
        </h1>

        <p className="mt-14 text-2xl">
        We build a live streaming platform for retail businesses
        </p>
        <button className="bg-orange-500 hover:bg-black text-white font-bold py-3 px-16 rounded mt-12">
          <Link href="sigin">
            <a>Join us</a>
          </Link>
        </button>
        <div className="mt-6 flex w-80 flex-wrap item-centre justify-around sm:w-full p-8">
            <a
                href="https://nextjs.org/docs"
                className="mt-6 w-80 h-full rounded-xl border-none p-6 text-centre hover:text-blue-600 focus:text-blue-600"
            >
                <h3 className="text-2xl font-bold">Affordable </h3>
                <p className="mt-4 text-xl">
                    Reduce operation cost
                </p>
            </a>
            <a
                href="https://nextjs.org/learn"
                className="mt-6 w-80  rounded-xl border-none p-6 text-centre hover:text-blue-600 focus:text-blue-600"
                >
                <h3 className="text-2xl font-bold">Sustainable </h3>
                <p className="mt-4 text-xl">
                    Trusted and secure 
                </p>
            </a>     
        </div>
        <div className="mt-6 flex main-h-screen flex-col item-centre justify-left py-2">
        <div className="mt-8 flex w-80 flex-wrap text-left rounded-xl border justify-around bg-shadow-lg sm:w-full p-8">
            <h1 className="text-2xl text-left font-bold ">What we do</h1>
            <p className="mt-4 text-xl w-full text-left">
            We are created new model of live streaming marketplace environment where retailers can meet to buyers and live demonstrate and presentation their products
            <br />
            <Link href="/about">
                <a className="text-blue-600 hover:text-blue-700">Learn more &rarr;</a>
            </Link>
            </p>
        </div>
        <div className="mt-8 flex w-80 flex-wrap text-left rounded-xl border justify-around bg-shadow-lg sm:w-full p-8">
            <h1 className="mt-9 text-2xl text-left font-bold">What we going to make</h1>
            <p className="mt-4 text-xl w-full text-left">
            We are committed to building a live retail streaming hybrid platform for unorganised retailers and new ways to use physical reality experience
            <br />
            <Link href="/about">
                <a className="text-blue-600">Learn more &rarr;</a>
            </Link>
            </p>
        </div>
        <div className="mt-8 flex w-80 flex-wrap text-left rounded-xl border justify-around bg-shadow-lg sm:w-full p-8">
            <h1 className="mt-9 text-2xl font-bold">Founder story</h1>
            <p className="mt-4 text-xl text-left">
            We are both brothers,our business journey started in 2007 from a small offline retail store, the Journey from the school classroom to the board room
            <br />
            <Link href="/about">
                <a className="text-blue-600">Read more &rarr;</a>
            </Link>
            </p>
        </div>
        <div className="mt-8 flex w-80 flex-wrap text-left rounded-xl border justify-around bg-shadow-lg sm:w-full p-8">
            <h1 className="mt-9 text-2xl font-bold">Journey</h1>
            <p className="mt-4 text-xl text-left">
            Journey from a small village in India to Sillicone Valley Y Combinator startup school community member
            <br />
            <Link href="/">
                <a className="text-blue-600">Read more &rarr;</a>
            </Link>
            </p>
        </div>
        </div>
        <p className="mt-6 text-0xl">
            Backed by <Link href="/"><a className='text-blue-600'>MIT</a></Link> <Link href="/"><a className='text-blue-600'> Github</a></Link>


        </p>
         <div className="mt-8 flex w-80 flex-wrap item-centre rounded-xl border justify-around bg-shadow-lg sm:w-full p-8">
          <p className="mt-5 text-1xl text-bold">
            Shape the future of rOS
          </p>
          <input className=" mt-3 w-48 text-sm leading-2 border rounded-md py-2 pl-10" type="text" aria-label="Email address" placeholder="Email address..."></input>
          <button className="mt-3 bg-orange-500 text-white hover:bg-blue-500 hover:text-white font-b py-3 px-16 border rounded-md">Join us</button>
        </div> 
     </main>
    </div>
    )
}
