import { useState, useEffect, useRef, useCallback } from 'react';

interface TypingEffectProps {
  content: string[];
  typingSpeed?: number;
  decipherSpeed?: number;
  decipherWidth?: number;
  className?: string;
  textClassName?: string;
}

export default function TypingEffect({ 
  content,
  typingSpeed = 50, 
  decipherSpeed = 30, 
  decipherWidth = 15,
  className = "",
  textClassName = ""
}: TypingEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const fullText = content.join('\n\n');
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const hiddenTextRef = useRef<HTMLDivElement>(null);

  const updateContainerSize = useCallback(() => {
    if (hiddenTextRef.current) {
      const { width, height } = hiddenTextRef.current.getBoundingClientRect();
      const maxCharsPerLine = Math.max(...fullText.split('\n').map(line => line.length));
      const maxWidth = maxCharsPerLine * 14; // Assuming each character is roughly 14px wide
      setContainerSize({ width: Math.max(width, maxWidth), height: height * 1.2 });
    }
  }, [fullText]);

  const updateCursorPosition = useCallback(() => {
    if (textRef.current && containerRef.current) {
      const textNode = textRef.current.lastChild as Text | null;
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        const range = document.createRange();
        range.setStart(textNode, textNode.length);
        range.setEnd(textNode, textNode.length);
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        setCursorPosition({
          top: rect.top - containerRect.top,
          left: rect.right - containerRect.left,
        });
      }
    }
  }, []);

  const handleResize = useCallback(() => {
    updateContainerSize();
    updateCursorPosition();
  }, [updateContainerSize, updateCursorPosition]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (isTypingComplete) return;

    const typeNextChar = () => {
      if (displayText.length < fullText.length) {
        const nextChar = fullText[displayText.length];
        setDisplayText(prev => prev + nextChar);
      } else {
        setIsTypingComplete(true);
      }
    };

    const timeout = setTimeout(typeNextChar, typingSpeed);
    return () => clearTimeout(timeout);
  }, [displayText, fullText, isTypingComplete, typingSpeed]);

  useEffect(() => {
    if (isTypingComplete) {
      let decipherIndex = 0;
      const decipherInterval = setInterval(() => {
        if (decipherIndex < fullText.length) {
          setDisplayText(prev => 
            prev.split('').map((char, index) => {
              if (index < decipherIndex) return fullText[index];
              const distance = index - decipherIndex;
              if (distance < decipherWidth) {
                const progress = 1 - (distance / decipherWidth);
                return smoothTransition(char, fullText[index], progress);
              }
              return char;
            }).join('')
          );
          decipherIndex++;
        } else {
          setDisplayText(fullText);
          clearInterval(decipherInterval);
        }
      }, decipherSpeed);
      return () => clearInterval(decipherInterval);
    }
  }, [isTypingComplete, fullText, decipherSpeed, decipherWidth]);

  useEffect(() => {
    updateCursorPosition();
  }, [displayText, updateCursorPosition]);

  useEffect(() => {
    if (isTypingComplete) {
      const blinkInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 530);

      return () => clearInterval(blinkInterval);
    } else {
      setShowCursor(true);
    }
  }, [isTypingComplete]);

  const smoothTransition = (start: string, end: string, progress: number) => {
    if (start === end) return end;
    if (progress >= 1) return end;
    if (progress <= 0) return start;
    
    const startCode = start.charCodeAt(0);
    const endCode = end.charCodeAt(0);
    const currentCode = Math.round(startCode + (endCode - startCode) * progress);
    return String.fromCharCode(currentCode);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto relative ${className}`}>
      <div 
        ref={hiddenTextRef}
        className={`${textClassName} text-foreground whitespace-pre-wrap break-words absolute opacity-0 pointer-events-none left-1/2 transform -translate-x-1/2`}
        style={{ maxWidth: '35ch' }}
      >
        {fullText}
      </div>
      <div 
        ref={containerRef}
        className={`${textClassName} text-foreground relative p-2 whitespace-pre-wrap break-words overflow-hidden mx-auto`}
        style={{ width: `${containerSize.width}px`, height: `${containerSize.height}px`, maxWidth: '35ch' }}
      >
        <div ref={textRef}>{displayText}</div>
        <span 
          className={`inline-block w-[0.2em] h-[1.1em] ml-1 bg-foreground absolute transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            top: `${cursorPosition.top}px`,
            left: `${cursorPosition.left}px`,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}