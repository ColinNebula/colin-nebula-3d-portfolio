import React from 'react';
import { SocialIcon } from 'react-social-icons';

const socials = [
  { url: 'https://github.com/ColinNebula', label: 'GitHub', bgColor: '#2a9d8f' },
  { url: 'https://www.linkedin.com/in/colin-nebula-07176022/', label: 'LinkedIn' },
  { url: 'mailto:colinnebula@gmail.com', label: 'Email', bgColor: '#e63946' },
];

export default function SocialIcons({ size = 40, gap = 12, className = '' }) {
  const containerStyle = { display: 'flex', gap, justifyContent: 'center', alignItems: 'center' };
  const iconStyle = { width: size, height: size, transition: 'transform 150ms ease', cursor: 'pointer' };

  const handleEnter = (e) => { e.currentTarget.style.transform = 'scale(1.08)'; };
  const handleLeave = (e) => { e.currentTarget.style.transform = 'scale(1)'; };

  return (
    <nav aria-label="Social links" className={className} style={containerStyle}>
      {socials.map((s) => (
        <SocialIcon
          key={s.url}
          url={s.url}
          bgColor={s.bgColor}
          style={iconStyle}
          title={s.label}
          aria-label={s.label}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onFocus={handleEnter}
          onBlur={handleLeave}
        />
      ))}
    </nav>
  );
}