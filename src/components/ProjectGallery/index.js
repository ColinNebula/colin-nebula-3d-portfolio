import React from 'react';
import { CardGroup } from 'react-bootstrap';
import { PortfolioCard } from '../PortfolioCard';

const ProjectGallery = ({ projects }) => {
  return (
    <CardGroup>
      {projects.map(project => (
        <PortfolioCard
          key={project.key}
          imageSrc={project.imageSrc}
          title={project.title}
          text={project.text}
          onButtonClick={project.onClick}
          alt={project.alt}
        />
      ))}
    </CardGroup>
  );
};

export default ProjectGallery;
