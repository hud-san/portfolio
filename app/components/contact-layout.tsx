import React from 'react';
import { Github, Linkedin, BookOpen } from 'lucide-react';

interface ContactLayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
}

const socialLinks = [
  { name: "LinkedIn", icon: <Linkedin />, url: "https://www.linkedin.com/in/yourusername" },
  { name: "GitHub", icon: <Github />, url: "https://github.com/yourusername" },
  { name: "Goodreads", icon: <BookOpen />, url: "https://www.goodreads.com/user/show/youruserid" },
];

export function ContactLayout({ children, isDarkMode }: ContactLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">Get in Touch</h1>
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
        <div className="mt-12 flex justify-center space-x-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}