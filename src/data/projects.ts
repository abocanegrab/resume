export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  category: 'enterprise' | 'startup' | 'industrial' | 'government' | 'fullstack';
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  highlights: string[];
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'JobStack 2.0',
    description:
      'Enterprise staffing platform for TrueBlue with microservices architecture, React micro-frontends, and AWS integrations.',
    longDescription:
      'Led development of JobStack 2.0, a comprehensive staffing platform for TrueBlue. Built with .NET microservices and React micro-frontends, featuring Hangfire for background jobs, Amazon Aurora (PostgreSQL) for data persistence, and extensive AWS integrations including SNS, SQS, CloudFormation for infrastructure as code.',
    image: '',
    technologies: ['.NET', 'React', 'PostgreSQL', 'AWS', 'Docker', 'Jenkins', 'Hangfire', 'SCSS'],
    category: 'enterprise',
    featured: true,
    highlights: [
      'Microservices architecture with .NET',
      'React micro-frontends',
      'AWS integrations (SNS, SQS, CloudFormation)',
      'CI/CD with Jenkins & Octopus Deploy',
    ],
  },
  {
    id: '2',
    title: 'TAP - Organizational Culture System',
    description:
      'SaaS platform to measure and analyze organizational culture, built from scratch as a co-founder.',
    longDescription:
      'Co-founded Grodivo and led the development of TAP, a system to measure organizational culture. Designed the entire architecture including .NET 9 microservices, React frontend with TypeScript and Styled Components, and AWS serverless infrastructure with Lambda, SNS, SQS, SES, and S3.',
    image: '',
    technologies: ['.NET 9', 'React', 'TypeScript', 'AWS Lambda', 'Cognito', 'MediatR', 'TurboRepo'],
    category: 'startup',
    featured: true,
    highlights: [
      'Built from scratch as co-founder',
      'Serverless AWS architecture',
      'MediatR for CQRS pattern',
      'Monorepo with TurboRepo',
    ],
  },
  {
    id: '3',
    title: 'Mining Traceability Apps',
    description:
      'Mobile apps for Peru\'s Ministry of Energy and Mines to track mineral transport with QR code generation and scanning.',
    longDescription:
      'Developed two .NET MAUI mobile applications to support Peru\'s informal-mining formalization plan. The Transfer Registration app records mineral transport and generates QR codes, while the Enforcement app allows field inspectors to scan and validate records against cloud databases.',
    image: '',
    technologies: ['.NET 9', '.NET MAUI', 'Oracle', 'GitHub Actions', 'REST API'],
    category: 'government',
    featured: true,
    highlights: [
      'Cross-platform mobile apps with .NET MAUI',
      'QR code generation and scanning',
      'Offline-first with cloud sync',
      'CI/CD with self-hosted runners',
    ],
  },
  {
    id: '4',
    title: 'SJE - Electoral Management System',
    description:
      'Digital transformation project for JNE (National Electoral Jury) with electoral management and document archiving modules.',
    longDescription:
      'Senior developer on the SJE project as part of JNE\'s digital transformation. Designed and implemented modules for electoral management, registration, candidates, authorities, and document archiving. Built a WinForms application for document scanning with barcode recognition integrated with FTP and cloud services.',
    image: '',
    technologies: ['ASP.NET MVC5', 'WinForms', 'WCF', 'Oracle 11g', 'jQuery', 'Bootstrap', 'AngularJS'],
    category: 'government',
    featured: false,
    highlights: [
      'Electoral management modules',
      'Document archiving with barcode recognition',
      'PDF generation and handling',
      'Security and performance improvements',
    ],
  },
  {
    id: '5',
    title: 'APOLO - Refinery Weighing Monitor',
    description:
      'Administration and monitoring system for refinery weighing equipment at Cajamarquilla (Nexa Resources).',
    longDescription:
      'Led development of APOLO, a comprehensive monitoring system for industrial weighing equipment at the Cajamarquilla refinery operated by Nexa Resources. The system provides real-time monitoring, administration, and reporting capabilities for critical weighing operations in the mining and refinery sector.',
    image: '',
    technologies: ['WinForms', 'C#', '.NET Framework', 'SQL Server', 'TCP/IP', 'Industrial 920i'],
    category: 'industrial',
    featured: false,
    highlights: [
      'Real-time equipment monitoring',
      'Industrial device integration',
      'Critical operations reporting',
      'Mining sector implementation',
    ],
  },
  {
    id: '6',
    title: 'PESACON TRUCK',
    description:
      'Multi-point truck weighing system with SAP data exchange, migrated from VB6 to modern .NET.',
    longDescription:
      'Developed PESACON TRUCK, a multi-point truck weighing system that integrates with SAP for real-time data exchange. The project involved migrating from legacy VB6 codebase to modern .NET Framework while maintaining integration with industrial weighing equipment through TCP and RS-232 protocols.',
    image: '',
    technologies: ['.NET Framework', 'WinForms', 'SQL Server', 'SAP RFC', 'TCP/RS-232'],
    category: 'industrial',
    featured: false,
    highlights: [
      'SAP integration via RFC',
      'Multi-point weighing coordination',
      'Legacy VB6 migration',
      'Industrial protocol support',
    ],
  },
];

export const projectCategories = [
  { id: 'all', name: 'All Projects' },
  { id: 'enterprise', name: 'Enterprise' },
  { id: 'startup', name: 'Startup' },
  { id: 'government', name: 'Government' },
  { id: 'industrial', name: 'Industrial' },
  { id: 'fullstack', name: 'Full-Stack' },
];

export default projects;
