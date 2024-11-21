import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

interface Technology {
  name: string;
  logoLight: string;
  logoDark: string;
  width: string;
  height: string;
}

const technologies: Technology[] = [
  { 
    name: 'CrowdStrike', 
    logoLight: '/assets/light/crowdstrike.png',
    logoDark: '/assets/dark/crowdstrike.png',
    width: 'w-24 sm:w-28 md:w-32',
    height: 'h-14 sm:h-16 md:h-18',
  },
  { 
    name: 'Palo Alto Networks', 
    logoLight: '/assets/light/paloaltonetworks.png',
    logoDark: '/assets/dark/paloaltonetworks.png',
    width: 'w-28 sm:w-32 md:w-36',
    height: 'h-10 sm:h-11 md:h-12',
  },
  { 
    name: 'RuNZero', 
    logoLight: '/assets/light/runzero.png',
    logoDark: '/assets/dark/runzero.png',
    width: 'w-24 sm:w-28 md:w-32',
    height: 'h-12 sm:h-13 md:h-14',
  },
  { 
    name: 'Splunk', 
    logoLight: '/assets/light/splunk.png',
    logoDark: '/assets/dark/splunk.png',
    width: 'w-20 sm:w-24 md:w-28',
    height: 'h-12 sm:h-14 md:h-16',
  },
  { 
    name: 'Algosec', 
    logoLight: '/assets/light/algosec.png',
    logoDark: '/assets/dark/algosec.png',
    width: 'w-20 sm:w-24 md:w-28',
    height: 'h-10 sm:h-12 md:h-14',
  },
  { 
    name: 'Tenable', 
    logoLight: '/assets/light/tenable.png',
    logoDark: '/assets/dark/tenable.png',
    width: 'w-20 sm:w-24 md:w-28',
    height: 'h-10 sm:h-12 md:h-14',
  }
];

interface InfiniteScrollBannerProps {
  isDarkMode: boolean;
}

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export default function InfiniteScrollBanner({ isDarkMode }: InfiniteScrollBannerProps) {
  const [scrollX, setScrollX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width] = useWindowSize();

  const getResponsiveValues = (screenWidth: number) => {
    if (screenWidth < 640) {
      return { itemWidth: 140, gap: 16, speed: 0.3 };
    } else if (screenWidth < 768) {
      return { itemWidth: 160, gap: 24, speed: 0.4 };
    } else {
      return { itemWidth: 200, gap: 32, speed: 0.5 };
    }
  };

  const { itemWidth, gap, speed } = getResponsiveValues(width);
  const totalWidth = technologies.length * (itemWidth + gap);

  useAnimationFrame(() => {
    setScrollX((prevScrollX) => {
      const newScrollX = prevScrollX - speed;
      return newScrollX <= -totalWidth ? 0 : newScrollX;
    });
  });

  return (
    <div ref={containerRef} className="w-full overflow-hidden py-2 sm:py-3 md:py-4">
      <div className="flex relative h-20 sm:h-24 md:h-32" style={{ width: `${totalWidth * 2}px` }}>
        {[...technologies, ...technologies].map((tech, index) => (
          <motion.div
            key={index}
            className={`flex-shrink-0 mx-2 sm:mx-3 md:mx-4 h-full flex items-center justify-center`}
            style={{
              x: scrollX,
              left: `${index * (itemWidth + gap)}px`,
              position: 'absolute',
              width: `${itemWidth}px`,
            }}
          >
            <div className="flex items-center justify-center">
              <img
                src={isDarkMode ? tech.logoDark : tech.logoLight}
                alt={tech.name}
                className={`object-contain ${tech.width} ${tech.height}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}