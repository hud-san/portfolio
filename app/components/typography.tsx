import React from 'react';

export const Heading1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => (
  <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 ${className}`} {...props}>
    {children}
  </h1>
);

export const Heading2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => (
  <h2 className={`text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-3 ${className}`} {...props}>
    {children}
  </h2>
);

export const Heading3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => (
  <h3 className={`text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight mb-2 ${className}`} {...props}>
    {children}
  </h3>
);

export const BodyText: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className, ...props }) => (
  <p className={`text-base leading-relaxed tracking-tight mb-4 ${className}`} {...props}>
    {children}
  </p>
);

export const SmallText: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, className, ...props }) => (
  <span className={`text-sm tracking-normal ${className}`} {...props}>
    {children}
  </span>
);

export const LargeText: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className, ...props }) => (
  <p className={`text-lg md:text-xl lg:text-2xl tracking-tight mb-4 ${className}`} {...props}>
    {children}
  </p>
);