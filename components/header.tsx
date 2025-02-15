import Link from "next/link";

import { socialNetworks } from "@/data";

const Header = () => {
    return ( 
            <header>
                <div className = "container justify-between max-w-6xl mx-auto md:flex">
                    <Link href = "/">
                    </Link>
                    <div className="flex items-center justify-center gap-7">
                        {socialNetworks.map(({logo,src,id}) => (
                            <Link key={id}
                            href={src}
                            target ="_blank"
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