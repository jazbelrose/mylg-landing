import React from 'react';
import { resolveStoredFileUrl } from '../utils/media';

interface ProjectAvatarProps {
  thumb?: string;
  name: string;
  className?: string;
}

const ProjectAvatar: React.FC<ProjectAvatarProps> = ({ thumb, name, className }) => {
  const src = resolveStoredFileUrl(thumb);

  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <div className={`project-avatar ${className || ''}`}>
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <div className="avatar-initials">{initials}</div>
      )}
    </div>
  );
};

export default ProjectAvatar;