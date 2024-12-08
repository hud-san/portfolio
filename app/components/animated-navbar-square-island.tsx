// app/components/animated-navbar.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigation } from "@remix-run/react";
import { Sun, Moon } from 'lucide-react';
import { LoadingBar } from "./loading-bar";

const tabs = [
  { id: "home", label: "ABOUT", path: "/" },
  { id: "experience", label: "EXPERIENCE", path: "/experience" },
  { id: "blog", label: "BLOG", path: "/blog" },
  { id: "contact", label: "CONTACT", path: "/contact" },
] as const;

type TabId = typeof tabs[number]['id'];

interface AnimatedNavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  path: string;
}

export default function AnimatedNavbar({ isDarkMode, toggleDarkMode, path }: AnimatedNavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const navigation = useNavigation();
  const [showLoading, setShowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    const currentPath = path.split('/')[1];
    return (tabs.find(tab => tab.path.startsWith(`/${currentPath}`)) || tabs[0]).id;
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (navigation.state === "loading") {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, 100);
    } else if (showLoading) {
      timer = setTimeout(() => {
        setShowLoading(false);
      }, 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [navigation.state, showLoading]);

  useEffect(() => {
    const currentPath = path.split('/')[1];
    const newTab = (tabs.find(tab => tab.path.startsWith(`/${currentPath}`)) || tabs[0]).id;
    setActiveTab(newTab);
  }, [path]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY < 50);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 inset-x-0 z-[100] h-20 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ width: "100vw" }}
    >
      <nav className="h-full bg-background flex items-center justify-between px-4 mx-4 max-w-7xl lg:mx-auto">
        <ul className="flex justify-center space-x-8 mx-auto">
          {tabs.map((tab) => (
            <li key={tab.id} className="relative flex items-center h-7">
              <Link
                to={tab.path}
                prefetch="intent"
                className={`px-3 py-1 text-xs sm:text-sm font-medium tracking-tight transition-colors duration-300 relative z-10 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                  } ${showLoading ? 'pointer-events-none' : ''}`}
                onClick={(e) => {
                  setActiveTab(tab.id);
                }}
              >
                {tab.label}
              </Link>
              {activeTab === tab.id && (
                <motion.div
                  className={`absolute inset-0 bg-secondary transition-opacity duration-200 ${
                    showLoading ? 'opacity-50' : 'opacity-100'
                  }`}
                  layoutId="activeTabHighlight"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  
                  }}
                  style={{ originY: 'top' }}
                />
              )}
            </li>
          ))}
        </ul>
        <div className="h-7 flex items-center">
          <div className="w-14 h-7 bg-muted flex items-center justify-between px-2.5 relative">
            <Sun className="w-3 h-3 text-muted-foreground absolute left-1" />
            <Moon className="w-3 h-3 text-muted-foreground absolute right-1" />
            <button
              onClick={toggleDarkMode}
              className="w-5 h-5 bg-background absolute top-1 transition-all duration-300 ease-in-out"
              style={{
                left: isDarkMode ? 'calc(100% - 24px)' : '4px'
              }}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            />
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {showLoading && <LoadingBar />}
      </AnimatePresence>
    </div>
  );
}