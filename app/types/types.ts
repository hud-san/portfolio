export interface Post {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    date: string; 
    tag: string;
    references: string[];
    createdAt: string;  
    updatedAt: string;  
  }
  export interface Experience {
    id: string;
    startDate: string;
    endDate: string | null;
    title: string;
    company: string;
    companyUrl: string;
    description: string;
    roles: string[];
    technologies: string[];
  }
  
  export interface Education {
    id: string;
    startDate: string;
    endDate: string | null;
    degree: string;
    institution: string;
    institutionUrl: string;
    description: string | null;
  }