import type { IconType } from 'react-icons';
import {
  SiSharp,
  SiDotnet,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiPostgresql,
  SiOracle,
  SiDocker,
  SiTerraform,
  SiAmazonwebservices,
  SiGithubactions,
  SiJenkins,
  SiGit,
  SiAngular,
} from 'react-icons/si';
import { TbDatabase } from 'react-icons/tb';

export interface Skill {
  name: string;
  level: number; // 0-100
  icon: IconType;
  color: string;
  category: 'backend' | 'frontend' | 'database' | 'devops' | 'tools';
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'backend',
    name: 'Backend',
    description: '.NET ecosystem and server-side development',
    color: '#512BD4',
  },
  {
    id: 'frontend',
    name: 'Frontend',
    description: 'Building responsive and interactive user interfaces',
    color: '#00D4FF',
  },
  {
    id: 'database',
    name: 'Database',
    description: 'SQL Server, Oracle, PostgreSQL and data management',
    color: '#FF1493',
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    description: 'AWS, CI/CD, containerization, and infrastructure',
    color: '#FF9900',
  },
  {
    id: 'tools',
    name: 'Tools',
    description: 'Development tools and AI assistants',
    color: '#39FF14',
  },
];

export const skills: Skill[] = [
  // Backend
  {
    name: 'C#',
    level: 98,
    icon: SiSharp,
    color: '#512BD4',
    category: 'backend',
  },
  {
    name: '.NET / .NET Core',
    level: 95,
    icon: SiDotnet,
    color: '#512BD4',
    category: 'backend',
  },
  {
    name: 'ASP.NET MVC',
    level: 92,
    icon: SiDotnet,
    color: '#512BD4',
    category: 'backend',
  },
  {
    name: 'Entity Framework',
    level: 90,
    icon: SiDotnet,
    color: '#512BD4',
    category: 'backend',
  },
  {
    name: 'Python',
    level: 75,
    icon: SiPython,
    color: '#3776AB',
    category: 'backend',
  },

  // Frontend
  {
    name: 'React',
    level: 88,
    icon: SiReact,
    color: '#61DAFB',
    category: 'frontend',
  },
  {
    name: 'TypeScript',
    level: 85,
    icon: SiTypescript,
    color: '#3178C6',
    category: 'frontend',
  },
  {
    name: 'JavaScript',
    level: 90,
    icon: SiJavascript,
    color: '#F7DF1E',
    category: 'frontend',
  },
  {
    name: 'Angular',
    level: 78,
    icon: SiAngular,
    color: '#DD0031',
    category: 'frontend',
  },

  // Database
  {
    name: 'SQL Server',
    level: 95,
    icon: TbDatabase,
    color: '#CC2927',
    category: 'database',
  },
  {
    name: 'Oracle',
    level: 88,
    icon: SiOracle,
    color: '#F80000',
    category: 'database',
  },
  {
    name: 'PostgreSQL',
    level: 85,
    icon: SiPostgresql,
    color: '#4169E1',
    category: 'database',
  },

  // DevOps & Cloud
  {
    name: 'AWS',
    level: 85,
    icon: SiAmazonwebservices,
    color: '#FF9900',
    category: 'devops',
  },
  {
    name: 'Docker',
    level: 82,
    icon: SiDocker,
    color: '#2496ED',
    category: 'devops',
  },
  {
    name: 'GitHub Actions',
    level: 85,
    icon: SiGithubactions,
    color: '#2088FF',
    category: 'devops',
  },
  {
    name: 'Jenkins',
    level: 78,
    icon: SiJenkins,
    color: '#D24939',
    category: 'devops',
  },
  {
    name: 'Terraform',
    level: 72,
    icon: SiTerraform,
    color: '#7B42BC',
    category: 'devops',
  },

  // Tools
  {
    name: 'Git',
    level: 92,
    icon: SiGit,
    color: '#F05032',
    category: 'tools',
  },
];

export default skills;
