"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import { loadHeartShape } from "@tsparticles/shape-heart";

const HeartParticles = () => {
    const [init, setInit] = useState(false);
    
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
            await loadHeartShape(engine); // Cargar la forma de corazón
        }).then(() => {
            setInit(true);
        });
    }, []);
    
    return (
        init && (
            <div className="m-0">
                <Particles
                    id="tsparticles"
                    options={{
                        fpsLimit: 60,
                        interactivity: {
                            events: {
                                onClick: { enable: true, mode: "push" },
                                onHover: { enable: true, mode: "repulse" },
                            },
                            modes: {
                                push: { quantity: 4 },
                                repulse: { distance: 200, duration: 0.4 },
                            },
                        },
                        particles: {
                            color: { value: "#ff4d6d" }, // Color de los corazones
                            move: {
                                enable: true,
                                speed: 1.5,
                                direction: "none",
                                outModes: { default: "bounce" },
                            },
                            number: {
                                density: { enable: true },
                                value: 50, // Cantidad de corazones
                            },
                            opacity: { value: 0.8 },
                            shape: {
                                type: "heart", // Especifica la forma de corazón
                            },
                            size: { value: { min: 10, max: 20 } }, // Tamaño de los corazones
                        },
                        detectRetina: true,
                    }}
                />
            </div>
        )
    );
};

export default HeartParticles;