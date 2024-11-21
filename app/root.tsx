import { useState, useEffect } from "react";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLocation, useOutletContext } from "@remix-run/react";
import AnimatedNavbar from "~/components/animated-navbar-square-island";
import type { LinksFunction } from "@remix-run/node";

import styles from "~/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { 
    rel: "preconnect", 
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  { 
    rel: "preload",
    as: "style",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
    media: "print",
    onLoad: "this.media='all'"
  }
];

export type AppContext = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export function useAppContext() {
  return useOutletContext<AppContext>();
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  return (
    <html lang="en" className={`${isDarkMode ? 'dark' : ''} font-inter`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-foreground antialiased">
        <Outlet context={{ isDarkMode, toggleDarkMode }} />
        <AnimatedNavbar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          path={location.pathname}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}