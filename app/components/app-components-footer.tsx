import React from 'react';
import { Link } from "@remix-run/react";

interface FooterProps {
  isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background py-2 px-4 w-full h-16">
      <div className="container mx-auto h-full flex items-center justify-between">
        <p className="text-xs">&copy; {currentYear} HUDSON AGUSTIN</p>
        <nav>
          <ul className="flex space-x-4 text-xs">
            <li>
              <Link to="/privacy-policy" className="hover:underline">
                PRIVACY
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="hover:underline">
                TERMS & CONDITIONS
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                CONTACT
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}