import React from 'react';
import TypingEffect from '~/components/typingeffect';

export default function HomeSection({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-8 text-left text-sm">
        <TypingEffect
          content={[
            "hudson a.",
            "A PUBLIC ARCHIVE TO DOCUMENT MY INTERESTS, WORK AND PASSIONS."
          ]}
          typingSpeed={25}
          decipherSpeed={20}
          decipherWidth={10}

        />
      </div>
    </div>
  );
}