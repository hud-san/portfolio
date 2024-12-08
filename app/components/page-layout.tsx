import React from 'react';
import { useOutletContext } from "@remix-run/react";
import Footer from '~/components/app-components-footer';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}