import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "@remix-run/react"
import { Sun, Moon } from 'lucide-react'

const tabs = [
  { id: "home", label: "ABOUT", path: "/" },
  { id: "experience", label: "EXPERIENCE", path: "/experience" },
  { id: "blog", label: "BLOG", path: "/blog" },
  { id: "contact", label: "CONTACT", path: "/contact" },
] as const

type TabId = typeof tabs[number]['id']

interface AnimatedNavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  path: string;
}

export default function AnimatedNavbar({ isDarkMode, toggleDarkMode, path }: AnimatedNavbarProps) {
  const [activeTab, setActiveTab] = useState<TabId>("home")
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const currentPath = path.split('/')[1]; // Get the first segment of the path
    const currentTab = tabs.find(tab => tab.path.startsWith(`/${currentPath}`)) || tabs[0];
    setActiveTab(currentTab.id);
  }, [path])

  useEffect(() => {
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY < 50)
      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 h-16 pt-4 mx-2 transition-transform duration-300 bg-background ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="relative h-full flex items-center justify-between px-4 mx-auto max-w-7xl">
        <ul className="flex space-x-4 relative flex-grow h-full justify-center items-center">
          {tabs.map((tab) => (
            <li key={tab.id} className="relative flex items-center h-7">
              <Link
                to={tab.path}
                className={`px-2 py-1 text-xs sm:text-sm font-medium tracking-tight transition-colors duration-300 relative z-10 block text-center
                  ${activeTab === tab.id 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground '
                  }`}
              >
                {tab.label}
              </Link>
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 bg-secondary"
                  layoutId="activeTabHighlight"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
    </div>
  )
}