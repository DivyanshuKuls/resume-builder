import type { Resume } from '@/types/resume'

export const sampleResume: Resume = {
  id: 'default',
  title: 'My Resume',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: 'Alex Johnson',
    jobTitle: 'Senior Software Engineer',
    photo: '',
    photoAlignment: 'left',
  },
  contact: {
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA',
    website: 'alexjohnson.dev',
    github: 'github.com/alexjohnson',
    linkedin: 'linkedin.com/in/alexjohnson',
  },
  summary:
    'Passionate software engineer with 7+ years of experience building scalable web applications. Specialized in React, TypeScript, and Node.js. Led multiple teams to deliver high-impact products used by millions of users.',
  skills: [
    { id: crypto.randomUUID(), name: 'React', level: 'expert' },
    { id: crypto.randomUUID(), name: 'TypeScript', level: 'expert' },
    { id: crypto.randomUUID(), name: 'Node.js', level: 'advanced' },
    { id: crypto.randomUUID(), name: 'PostgreSQL', level: 'advanced' },
    { id: crypto.randomUUID(), name: 'Docker', level: 'intermediate' },
    { id: crypto.randomUUID(), name: 'GraphQL', level: 'intermediate' },
    { id: crypto.randomUUID(), name: 'AWS', level: 'intermediate' },
  ],
  skillGroups: [
    {
      id: crypto.randomUUID(),
      category: 'Frontend',
      skills: [
        { id: crypto.randomUUID(), name: 'React' },
        { id: crypto.randomUUID(), name: 'TypeScript' },
        { id: crypto.randomUUID(), name: 'Next.js' },
        { id: crypto.randomUUID(), name: 'Tailwind CSS' },
      ],
    },
    {
      id: crypto.randomUUID(),
      category: 'Backend',
      skills: [
        { id: crypto.randomUUID(), name: 'Node.js' },
        { id: crypto.randomUUID(), name: 'PostgreSQL' },
        { id: crypto.randomUUID(), name: 'Redis' },
        { id: crypto.randomUUID(), name: 'GraphQL' },
      ],
    },
    {
      id: crypto.randomUUID(),
      category: 'DevOps',
      skills: [
        { id: crypto.randomUUID(), name: 'Docker' },
        { id: crypto.randomUUID(), name: 'AWS' },
        { id: crypto.randomUUID(), name: 'GitHub Actions' },
      ],
    },
  ],
  skillsConfig: { mode: 'grouped', headingStyle: 'inline' },
  experience: [
    {
      id: crypto.randomUUID(),
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      startDate: '2021-01',
      endDate: '',
      current: true,
      location: 'San Francisco, CA',
      description: '',
      highlights: [
        'Led a team of 5 engineers to rebuild the core product with React and TypeScript, shipping 30% faster',
        'Improved application performance by 40% through code splitting and caching strategies',
        'Implemented CI/CD pipeline reducing deployment time from 45 to 8 minutes',
      ],
    },
    {
      id: crypto.randomUUID(),
      company: 'Startup Inc',
      position: 'Software Engineer',
      startDate: '2018-06',
      endDate: '2021-01',
      current: false,
      location: 'New York, NY',
      description: '',
      highlights: [
        'Built RESTful APIs serving 1M+ daily users with 99.9% uptime',
        'Migrated legacy jQuery codebase to React, reducing bundle size by 60%',
      ],
    },
  ],
  projects: [
    {
      id: crypto.randomUUID(),
      name: 'Open Source Resume Builder',
      description:
        'A free, browser-based resume builder with live preview and PDF export. No sign-up required.',
      url: 'github.com/alexjohnson/resume-builder',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand'],
      highlights: ['500+ GitHub stars', 'Used by 10,000+ job seekers worldwide'],
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      institution: 'University of California, Berkeley',
      degree: 'B.S.',
      field: 'Computer Science',
      startDate: '2014-09',
      endDate: '2018-05',
      gpa: '3.8',
      highlights: [],
    },
  ],
  certifications: [
    {
      id: crypto.randomUUID(),
      name: 'AWS Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023-06',
      expiryDate: '2026-06',
      url: '',
      description: '',
    },
  ],
  achievements: [],
  customSections: [],
  theme: {
    primaryColor: '#2563eb',
    fontFamily: 'inter',
    fontSize: 'md',
    accentColor: '#7c3aed',
  },
  sections: [
    { id: 'summary',        type: 'summary',        title: 'Summary',          visible: true,  order: 0, alignment: 'left' },
    { id: 'experience',     type: 'experience',     title: 'Work Experience',  visible: true,  order: 1, alignment: 'left' },
    { id: 'education',      type: 'education',      title: 'Education',        visible: true,  order: 2, alignment: 'left' },
    { id: 'skills',         type: 'skills',         title: 'Skills',           visible: true,  order: 3, alignment: 'left' },
    { id: 'projects',       type: 'projects',       title: 'Projects',         visible: true,  order: 4, alignment: 'left' },
    { id: 'certifications', type: 'certifications', title: 'Certifications',   visible: true,  order: 5, alignment: 'left' },
    { id: 'achievements',   type: 'achievements',   title: 'Achievements',     visible: false, order: 6, alignment: 'left' },
  ],
}
