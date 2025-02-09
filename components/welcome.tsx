"use client"

import { Tangerine } from "next/font/google";

import Image from 'next/image';
import Link from 'next/link';
import styles from './/font.module.css';
import { useSession } from "next-auth/react"

const tangerine = Tangerine({ subsets: ["latin"], weight: ["400", "700"] });

const Welcome = () => {
    const { data: session } = useSession()
    return ( 
        // El cuadro que anda ahi
        <div className="flex items-center justify-center min-h-screen bg-center ">
            <div className="max-w-4xl w-full rounded-lg flex flex-col lg:flex-row overflow-hidden bg-center mx-auto items-center justify-center">
                {/* Seccion izquierda con el logo */}
                <div className="w-1/2 flex flex-col items-center justify-center p-6">
                    <Image
                        src="/Logo.png" 
                        alt="Robocupido Logo" 
                        width={400}
                        height={400}
                        className="mb-1"
                    />
                    <h1 className={`text-5xl ${styles.tangerineParagraph} ${tangerine.className}`}>Robocupido</h1>
                    <p className={`text-2xl text-gray-900 text-md ${styles.tangerineParagraph} ${tangerine.className}`}>by Roborregos</p>
                </div>

                {/* Seccion derecha con el texto */}
                <div className="w-1/2 p-6 flex flex-col justify-center relative">
                    <h2 className='text-lg font-bold text-gray-800 relative text-center'>Find your perfect match for Valentine’s Day!</h2>
                    <p className="text-gray-700 text-md mt-2 relative text-center">
                        Our AI-powered matchmaking system will pair you with your ideal partner.
                    </p>
                    <p className="text-gray-800 text-md font-semibold mt-6 relative text-center">Register now and get matched on February 14th!</p>
                    <Link href={session ? "/register" : "/login"}>
                        <h1 className="mt-6 bg-blue-300 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition transform hover:scale-105 relative text-center text-lg hover:text-white">
                            Register Now!
                        </h1>
                    </Link>
                </div>
            </div>
        </div>
    );
}
 
export default Welcome;