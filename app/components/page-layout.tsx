import React from 'react';
import { useOutletContext } from "@remix-run/react";
import Footer from '~/components/app-components-footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {children}
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}