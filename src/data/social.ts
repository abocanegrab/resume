import type { IconType } from 'react-icons';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';

// Single source for contact details; accessible labels live in contact:social.links.<id>
export const EMAIL = 'abocanegrab@gmail.com';
export const EMAIL_URL = `mailto:${EMAIL}`;

export type SocialId = 'github' | 'linkedin' | 'email' | 'phone';

export interface SocialLink {
  id: SocialId;
  icon: IconType;
  url: string;
  // Opens in a new tab (target="_blank" + rel="noopener noreferrer")
  external: boolean;
}

export const socialLinks: SocialLink[] = [
  { id: 'github', icon: FaGithub, url: 'https://github.com/abocanegra', external: true },
  { id: 'linkedin', icon: FaLinkedin, url: 'https://www.linkedin.com/in/aaronbocanegra/', external: true },
  { id: 'email', icon: FaEnvelope, url: EMAIL_URL, external: false },
  { id: 'phone', icon: FaPhone, url: 'tel:+51915063391', external: false },
];

export const externalLinkProps = (link: SocialLink) =>
  link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
