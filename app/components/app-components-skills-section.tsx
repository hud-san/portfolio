import React from 'react';
import { Link } from "@remix-run/react";
import InfiniteScrollBanner from '~/components/rotating-banner';
import {
  SiPython,
  SiC,
  SiCplusplus,
  SiKalilinux,
  SiWireshark,
  SiLinux,
  SiGnubash,
  SiGit,
  SiAnsible,
  SiPaloaltonetworks,
  SiAzuredevops,
  SiMetasploit,
  SiSplunk
} from 'react-icons/si';
import { FaCode, FaShieldAlt, FaTools, FaCloud } from 'react-icons/fa';

type Skill = {
  name: string;
  icon: React.ReactNode;
};

type SkillCategory = {
  name: string;
  icon: React.ReactNode;
  skills: Skill[];
  color: string;
};

const size = 24;

const skillCategories: SkillCategory[] = [
  {
    name: 'Languages',
    icon: <FaCode size={size} />,
    skills: [
      { name: 'Python', icon: <SiPython size={size} /> },
      { name: 'C', icon: <SiC size={size} /> },
      { name: 'C++', icon: <SiCplusplus size={size} /> },
    ],
    color: 'blue'
  },
  {
    name: 'Tools',
    icon: <FaShieldAlt size={size} />,
    skills: [
      { name: 'Kali Linux', icon: <SiKalilinux size={size} /> },
      { name: 'Wireshark', icon: <SiWireshark size={size} /> },
      { name: 'Metasploit', icon: <SiMetasploit size={size} /> },
      { name: 'Panorama', icon: <SiPaloaltonetworks size={size} /> }
    ],
    color: 'green'
  },
  {
    name: 'SysDev',
    icon: <FaTools size={size} />,
    skills: [
      { name: 'Linux', icon: <SiLinux size={size} /> },
      { name: 'Bash', icon: <SiGnubash size={size} /> },
      { name: 'Git', icon: <SiGit size={size} /> },
      { name: 'Ansible', icon: <SiAnsible size={size} /> },
      { name: 'AzureDevOps', icon: <SiAzuredevops size={size} /> },
    ],
    color: 'purple'
  },
];

const SkillTag: React.FC<{ skill: Skill; color: string }> = ({ skill, color }) => (
  <div className={`inline-flex items-center bg-${color}-100 border border-${color}-500 text-${color}-800 px-3 py-2 text-sm mr-2 mb-2 transition-colors hover:bg-${color}-200`}>
    {React.cloneElement(skill.icon as React.ReactElement, { size: 16, className: "mr-2" })}
    {skill.name}
  </div>
);

const SkillCategory: React.FC<{ category: SkillCategory }> = ({ category }) => (
  <div className="mb-6">

    <div>
      {category.skills.map((skill) => (
        <SkillTag key={skill.name} skill={skill} color={category.color} />
      ))}
    </div>
  </div>
);

export default function SkillsSection({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div>
        
        <div className="bg-foreground/5 p-4 rounded-lg mb-8">
          <p className="text-sm text-center">
            This is just a brief overview of the technologies & vendors I like or have worked with. For details on how I have applied these, please check out my{' '}
            <Link to="/experience" className="text-primary hover:underline font-semibold">experience</Link> or read about some of my projects in my{' '}
            <Link to="/blog" className="text-primary hover:underline font-semibold">blog</Link>.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 sm:gap-6">
          {skillCategories.map((category) => (
            <SkillCategory key={category.name} category={category} />
          ))}
        </div>
        <InfiniteScrollBanner isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}