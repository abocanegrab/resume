export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | 'Present';
  description: string;
  achievements: string[];
  technologies: string[];
  companyLogo?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'founder';
}

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'HatchWorks Technologies',
    position: 'Senior Fullstack Developer',
    location: 'Remote',
    startDate: 'Jan 2021',
    endDate: 'Present',
    description:
      'Member of the Reimagine team delivering JobStack 2.0 for TrueBlue with agile methodologies and AWS integrations. Leading developer community initiatives and mentoring through the Buddy Program.',
    achievements: [
      'Delivered JobStack 2.0 staffing platform with .NET microservices and React micro-frontends',
      'Conduct technical interviews and contribute to hiring standards and best practices',
      'Lead Hatch-Futures Peru community and growth initiatives',
      'Part of AI Labs developing PoCs and demos with Python, FastAPI, GCP, React, NextJs',
    ],
    technologies: ['.NET', 'React', 'AWS', 'PostgreSQL', 'Docker', 'Jenkins', 'Hangfire'],
    type: 'full-time',
  },
  {
    id: '2',
    company: 'Ministerio de Energía y Minas',
    position: 'Mobile .NET Engineer',
    location: 'Remote',
    startDate: 'Sep 2025',
    endDate: 'Nov 2025',
    description:
      'Developed mobile apps to support Peru\'s informal-mining formalization plan, including Transfer Registration and Enforcement applications for mineral transport traceability.',
    achievements: [
      'Built Transfer Registration app to record mineral transport and generate QR codes',
      'Created Enforcement app to scan QR and persist records to cloud database',
      'Implemented CI/CD on on-premise servers using GitHub Actions self-hosted runners',
      'Designed end-to-end traceability workflow improving oversight for field inspectors',
    ],
    technologies: ['.NET 9', '.NET MAUI', 'Oracle', 'GitHub Actions', 'Git'],
    type: 'contract',
  },
  {
    id: '3',
    company: 'Grodivo',
    position: 'Software Engineer (Co-Founder)',
    location: 'Remote',
    startDate: 'Aug 2024',
    endDate: 'Present',
    description:
      'Co-founded Grodivo and led software development for TAP, a system to measure organizational culture. Designed microservices architecture and established coding standards.',
    achievements: [
      'Co-founded company and led all software development initiatives',
      'Designed and implemented microservices and web UI from scratch',
      'Established coding standards and CI/CD pipelines with GitHub Actions',
      'Built scalable AWS infrastructure with Lambda, SNS, SQS, S3',
    ],
    technologies: ['.NET 9', 'React', 'TypeScript', 'AWS', 'MediatR', 'TurboRepo'],
    type: 'founder',
  },
  {
    id: '4',
    company: 'Jurado Nacional de Elecciones (JNE)',
    position: 'Senior Developer',
    location: 'Lima, Peru',
    startDate: 'Aug 2017',
    endDate: 'Dec 2020',
    description:
      'Senior .NET developer on the SJE project as part of JNE\'s digital transformation. Designed and implemented modules for electoral management and document archiving.',
    achievements: [
      'Implemented modules for electoral management, registration, candidates, and authorities',
      'Developed WinForms app for document scanning with barcode recognition',
      'Improved system performance and security across electoral modules',
      'Built PDF document handling and inbox workflow systems',
    ],
    technologies: ['ASP.NET MVC5', 'WinForms', 'WCF', 'Oracle 11g', 'jQuery', 'AngularJS'],
    type: 'full-time',
  },
  {
    id: '5',
    company: 'Pesonor S.A.C.',
    position: 'External Web Developer',
    location: 'Peru',
    startDate: 'Nov 2018',
    endDate: 'Apr 2020',
    description:
      'Developed industrial applications for weighing-services automation and integration with corporate systems for major clients including Laredo S.A. and Casa Grande S.A.',
    achievements: [
      'Built automation solutions for industrial weighing services',
      'Integrated with corporate systems including Oracle and SQL Server',
      'Implemented TCP and RS-232 integrations with industrial devices',
      'Delivered reliable data capture systems for sugar industry clients',
    ],
    technologies: ['.NET Framework', 'Oracle 11g', 'SQL Server', 'WinForms', 'TCP/RS-232'],
    type: 'freelance',
  },
  {
    id: '6',
    company: 'Proyectos Pesacon S.A.C.',
    position: 'Head of Systems',
    location: 'Peru',
    startDate: 'Oct 2013',
    endDate: 'Sep 2017',
    description:
      'Led the systems department and development team for automation and traceability solutions in industrial weighing environments.',
    achievements: [
      'APOLO: Built monitoring system for refinery weighing equipment (Nexa Resources)',
      'PESACON TRUCK: Developed multi-point truck weighing system with SAP data exchange',
      'PRODUCE: Created monitoring system for anchoveta capture with Ministry servers',
      'SOLDEXA: Implemented formulation system with industrial 920i integration',
    ],
    technologies: ['WinForms', 'C#', '.NET Framework', 'SQL Server', 'SAP RFC', 'TCP/RS-232'],
    type: 'full-time',
  },
];

export default experiences;
