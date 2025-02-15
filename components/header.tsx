import Link from "next/link";

import { socialNetworks } from "@/data";

const Header = () => {
    return (
        <header className="absolute z-40 w-full top-5 md:top-10 px-20">
            <div className="container justify-between max-w-6xl mx-auto md:flex">
                <Link href="/">
                    {/* Add your logo or text here */}
                </Link>
                <div className="flex items-center justify-center gap-7">
                    {socialNetworks.map(({ logo, src, id }) => (
                        <Link
                            key={id}
                            href={src}
                            target="_blank"
                            className="transition-all duration-300 hover:text-blue-500"
                        >
                            {logo}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}
 
export default Header;