import { MetaFunction, useOutletContext } from "@remix-run/react";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { RiArrowDropDownFill } from "react-icons/ri";
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';
import Footer from '~/components/app-components-footer';
import HomeSection from '~/components/app-components-home-section';
import AboutSection from '~/components/app-components-about-section';
import SkillsSection from '~/components/app-components-skills-section';

export const meta: MetaFunction = () => {
  return [
    { title: "ABOUT - HUDSON AGUSTIN" },
    { name: "description", content: "HUDSON A. A PUBLIC ARCHIVE TO DOCUMENT MY INTERESTS, WORK AND PASSIONS." },
  ];
};



type OutletContext = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

type Section = {
  id: string;
  title: string;
  component: React.ComponentType<{ isDarkMode: boolean }>;
};

const sections: Section[] = [
  { id: 'home', title: 'HOME', component: HomeSection },
  { id: 'about', title: 'ABOUT', component: AboutSection },
  { id: 'skills', title: 'SKILLS', component: SkillsSection },
];

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

function Section({ section, isLastSection, isDarkMode }: { section: Section, isLastSection: boolean, isDarkMode: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useParallax(scrollYProgress, 50);

  const SectionComponent = section.component;

  return (
    <section className="min-h-screen w-full snap-start flex flex-col items-center justify-center relative py-16 sm:py-24">
      <div ref={ref} className="h-full w-full absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-2xl sm:text-3xl md:text-4xl font-thin w-full px-6 sm:px-8 md:px-12 mr-4 sm:mr-6 md:mr-8"
          style={{ y }}
        >
          <SectionComponent isDarkMode={isDarkMode} />
        </motion.div>
      </div>
      {isLastSection && (
        <div className="absolute bottom-0 left-0 right-0">
          <Footer isDarkMode={isDarkMode} />
        </div>
      )}
    </section>
  );
}

export default function Index() {
  const { isDarkMode, toggleDarkMode } = useOutletContext<OutletContext>();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY;
      const currentScroll = container.scrollTop;
      const maxScroll = container.scrollHeight - container.clientHeight;

      if ((delta > 0 && currentScroll < maxScroll) || (delta < 0 && currentScroll > 0)) {
        e.preventDefault();
        container.scrollBy({
          top: delta,
          behavior: 'smooth'
        });
      }
    };

    const handleScroll = () => {
      const newIndex = Math.round(container.scrollTop / window.innerHeight);
      if (newIndex !== currentSectionIndex) {
        setCurrentSectionIndex(newIndex);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [currentSectionIndex]);

  const scrollToSection = (index: number) => {
    containerRef.current?.scrollTo({
      top: index * window.innerHeight,
      behavior: 'smooth'
    });
  };

  const renderFooterArrow = (index: number) => {
    const nextIndex = index + 1;
    if (nextIndex >= sections.length) return null;

    const nextSection = sections[nextIndex];

    return (
      <motion.div 
        className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center group cursor-pointer"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0]) }}
        onClick={() => scrollToSection(nextIndex)}
      >
        <span className="text-xs mb-1 hover:underline uppercase">
          {nextSection.title}
        </span>
        <RiArrowDropDownFill className="h-8 w-8 sm:h-10 sm:w-10 text-foreground transition-transform duration-300 ease-in-out" />
      </motion.div>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-background relative">
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll scroll-smooth"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {sections.map((section, index) => (
          <div key={section.id} className="relative" style={{ scrollSnapAlign: 'start' }}>
            <Section 
              section={section} 
              isLastSection={index === sections.length - 1}
              isDarkMode={isDarkMode}
            />
            {renderFooterArrow(index)}
          </div>
        ))}
      </div>

      <div className="fixed right-2 sm:right-8 md:right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 sm:gap-3 md:gap-4 z-10">
        {sections.map((section, index) => (
          <Button
            key={section.id}
            variant={currentSectionIndex === index ? 'default' : 'outline'}
            size="icon"
            className="w-3 h-3 sm:w-4 sm:h-4 p-0 rounded-none"
            onClick={() => scrollToSection(index)}
            aria-label={`Scroll to ${section.title} section`}
          />
        ))}
      </div>
    </div>
  );
}

