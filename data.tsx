import { HomeIcon, BarChart } from "lucide-react";


export const itemsNavbar = [
    {
        id: 1,
        title: "Home",
        icon: <HomeIcon size={25} color="#fff" strokeWidth={1} />,
        link: "/",
    },
    {
        id: 2,
        title: "Charts",
        icon: <BarChart size={25} color="#fff" strokeWidth={1} />,
        link: "/about-me",
    },
];