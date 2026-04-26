export const SITE_CONFIG = {
  name: 'Emirhan Cebiroğlu',
  title: 'Emirhan Cebiroğlu — Software Engineer',
  description: 'Software engineer building tools people actually use.',
  url: 'https://emirhancebiroglu.dev',
  github: 'https://github.com/emirhancebiroglu',
  linkedin: 'https://linkedin.com/in/emirhan-cebiroglu',
  twitter: 'https://x.com/EmirhanCeb',
  email: 'hello@emirhancebiroglu.dev',
} as const;

export const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Tools', href: '/tools' },
  { label: 'Contact', href: '#contact' },
] as const;

export type Project = {
  title: string;
  description: string;
  href: string;
  tags: string[];
  status: 'live' | 'building' | 'planned';
};

export const PROJECTS: Project[] = [];
