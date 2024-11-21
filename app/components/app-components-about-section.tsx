import React from 'react';
import { Separator } from "@radix-ui/react-separator";

export default function AboutSectionComponent({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <div className="align-middle space-y-6 mb-12">
        <div>
          <p className="font-bold mb-2 text-left">WHO AM I?</p>
          <p className="text-xs sm:text-sm md:text-sm text-left">I am a Cybersecurity Analyst based in Melbourne, Australia, with a year of experience in information security. My expertise spans network security engineering and incident response, with a focus on implementing innovative security architectures and automating operations. </p>
          <p className="text-xs sm:text-sm md:text-sm text-left"> As an eager learner in an ever-evolving field, I am passionate about integrating innovative practices to stay ahead of emerging threats and enhance defensive capabilities.</p>
        </div>
        <Separator className="my-4 sm:my-6 md:my-8 bg-foreground h-px opacity-50"/>
        <div>
          <p className="font-bold mb-2 text-left">WHAT ABOUT OUTSIDE OF WORK?</p>
          <p className="text-xs sm:text-sm md:text-sm text-left">Outside of my work, I have a deep passion for fashion, and architecture. I particularly gravitate towards brutalism, catastrophic and regressive design.</p>
          <p className="text-xs sm:text-sm md:text-sm text-left">An inexhaustive list of designers I admire include; Boris Bidjan Saberi, Issey Miyake, Maurizio Amadei, Yohji Yamamoto, Rei Kawakubo, Takahiro Miyashita & more. </p>
          <p className="text-xs sm:text-sm md:text-sm text-left">Aside from the more expensive hobby above, I enjoy bouldering, security labbing & writing code (such as this website.)  </p>
        </div>
      </div>
    </div>
  );
}