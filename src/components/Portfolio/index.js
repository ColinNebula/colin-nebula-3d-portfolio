import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Spinner, Alert, Carousel } from 'react-bootstrap';
import { useNotifications } from '../../App';
import './Portfolio.css';

const Portfolio = () => {
  const { showNotification } = useNotifications();
  
  // State management
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [imageError, setImageError] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Static data
  const categories = {
    all: { label: 'All Projects', icon: '🎯', color: 'primary' },
    '3d-modeling': { label: '3D Modeling', icon: '🎨', color: 'info' },
    animation: { label: 'Animation', icon: '🎬', color: 'success' },
    vfx: { label: 'Visual Effects', icon: '✨', color: 'warning' },
    'game-assets': { label: 'Game Assets', icon: '🎮', color: 'danger' },
    architectural: { label: 'Architectural', icon: '🏗️', color: 'secondary' },
    'motion-graphics': { label: 'Motion Graphics', icon: '🌀', color: 'dark' }
  };

  const technologies = {
    all: 'All Technologies',
    blender: 'Blender',
    maya: 'Maya',
    'after-effects': 'After Effects',
    'zbrush': 'ZBrush',
    'substance-painter': 'Substance Painter',
    'unreal-engine': 'Unreal Engine',
    unity: 'Unity',
    'cinema-4d': 'Cinema 4D',
    'davinci-resolve': 'DaVinci Resolve',
    'premiere-pro': 'Premiere Pro'
  };

  // Enhanced portfolio data
  const portfolioData = [
    {
      id: 1,
      title: 'Stellar Guardian Character',
      description: 'High-poly sci-fi character with complete rigging and animation set. Designed for next-generation gaming applications.',
      category: '3d-modeling',
      technologies: ['blender', 'zbrush', 'substance-painter'],
      images: [
        'https://via.placeholder.com/800x600?text=Stellar+Guardian+Front',
        'https://via.placeholder.com/800x600?text=Stellar+Guardian+Side',
        'https://via.placeholder.com/800x600?text=Stellar+Guardian+Back'
      ],
      featured: true,
      date: '2024-01-15',
      duration: '3 weeks',
      client: 'Independent Project',
      status: 'completed',
      tags: ['character', 'sci-fi', 'high-poly', 'rigging'],
      specifications: {
        polygons: '1.2M triangles',
        textures: '4K PBR textures',
        animations: '58 sequences',
        bones: '120+ bones'
      },
      challenges: 'Creating realistic armor mechanics while maintaining performance optimization.',
      outcome: 'Successfully integrated into multiple game engines with positive feedback from industry professionals.'
    },
    {
      id: 2,
      title: 'Nebula Starship',
      description: 'Detailed spacecraft model with modular construction and realistic physics-based design.',
      category: '3d-modeling',
      technologies: ['blender', 'substance-painter'],
      images: [
        'https://via.placeholder.com/800x600?text=Nebula+Starship+Exterior',
        'https://via.placeholder.com/800x600?text=Nebula+Starship+Interior',
        'https://via.placeholder.com/800x600?text=Nebula+Starship+Blueprint'
      ],
      date: '2023-11-20',
      duration: '4 weeks',
      client: 'Sci-Fi Studios',
      status: 'completed',
      tags: ['spaceship', 'modular', 'hard-surface', 'detailed'],
      specifications: {
        polygons: '2.1M triangles',
        textures: '8K detail textures',
        components: '300+ unique parts',
        variants: 'High/Low poly versions'
      }
    },
    {
      id: 3,
      title: 'Facial Rigging Demo',
      description: 'Advanced facial rig with realistic expressions and lip-sync capabilities.',
      category: 'animation',
      technologies: ['maya', 'zbrush'],
      images: [
        'https://via.placeholder.com/800x600?text=Facial+Rig+Neutral',
        'https://via.placeholder.com/800x600?text=Facial+Rig+Expressions',
        'https://via.placeholder.com/800x600?text=Facial+Rig+Controls'
      ],
      date: '2023-10-10',
      duration: '2 weeks',
      client: 'Animation Studio',
      status: 'completed',
      tags: ['facial-rig', 'expressions', 'lip-sync', 'controls']
    },
    {
      id: 4,
      title: 'Space Battle VFX',
      description: 'Epic space battle sequence with particle effects, explosions, and dynamic lighting.',
      category: 'vfx',
      technologies: ['after-effects', 'blender'],
      images: [
        'https://via.placeholder.com/800x600?text=Space+Battle+Wide',
        'https://via.placeholder.com/800x600?text=Space+Battle+Explosion',
        'https://via.placeholder.com/800x600?text=Space+Battle+Ships'
      ],
      featured: true,
      date: '2023-12-05',
      duration: '5 weeks',
      client: 'Project Nebula',
      status: 'completed',
      tags: ['space', 'particles', 'explosions', 'compositing']
    },
    {
      id: 5,
      title: 'Architectural Visualization',
      description: 'Modern house exterior and interior visualization with realistic lighting and materials.',
      category: 'architectural',
      technologies: ['blender', 'substance-painter'],
      images: [
        'https://via.placeholder.com/800x600?text=Modern+House+Exterior',
        'https://via.placeholder.com/800x600?text=Modern+House+Interior',
        'https://via.placeholder.com/800x600?text=Modern+House+Garden'
      ],
      date: '2023-09-15',
      duration: '3 weeks',
      client: 'Architecture Firm',
      status: 'completed',
      tags: ['architecture', 'realistic', 'lighting', 'materials']
    },
    {
      id: 6,
      title: 'Game Environment Assets',
      description: 'Modular environment pieces for fantasy game including rocks, trees, and structures.',
      category: 'game-assets',
      technologies: ['blender', 'unity', 'substance-painter'],
      images: [
        'https://via.placeholder.com/800x600?text=Game+Environment+Overview',
        'https://via.placeholder.com/800x600?text=Game+Assets+Details',
        'https://via.placeholder.com/800x600?text=Game+Assets+Textures'
      ],
      date: '2024-02-01',
      duration: '6 weeks',
      client: 'Indie Game Studio',
      status: 'in-progress',
      tags: ['game-ready', 'modular', 'fantasy', 'optimized']
    }
  ];

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    const allTags = portfolioData.flatMap(p => p.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.filter(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase()) && 
      searchQuery.length > 0
    ).slice(0, 5);
  }, [searchQuery]);

  // Load portfolio data
  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProjects(portfolioData);
        if (showNotification) {
          showNotification('Portfolio loaded successfully', 'success', 2000, {
            category: 'system',
            icon: '📂'
          });
        }
      } catch (error) {
        console.error('Portfolio loading error:', error);
        if (showNotification) {
          showNotification('Failed to load portfolio', 'danger', 4000, {
            category: 'system',
            icon: '❌'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (projects.length === 0) {
      loadPortfolio();
    }
  }, [projects.length, showNotification]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        if (selectedCategory !== 'all' && project.category !== selectedCategory) {
          return false;
        }
        
        if (selectedTechnology !== 'all' && !project.technologies.includes(selectedTechnology)) {
          return false;
        }
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            project.title.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query) ||
            project.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.date) - new Date(a.date);
          case 'oldest':
            return new Date(a.date) - new Date(b.date);
          case 'title':
            return a.title.localeCompare(b.title);
          case 'featured':
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.date) - new Date(a.date);
          case 'popularity':
            return (b.metrics?.views || 0) - (a.metrics?.views || 0);
          case 'awards':
            return (b.awards?.length || 0) - (a.awards?.length || 0);
          default:
            return 0;
        }
      });
  }, [projects, selectedCategory, selectedTechnology, searchQuery, sortBy]);

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'planning': return 'info';
      default: return 'secondary';
    }
  };

  const handleImageError = (projectId, imageIndex = 0) => {
    setImageError(prev => ({
      ...prev,
      [`${projectId}-${imageIndex}`]: true
    }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  // Render project card
  const renderProjectCard = (project) => (
    <Col key={project.id} xs={12} md={6} lg={4} className="mb-4">
      <Card 
        className={`portfolio-card h-100 ${project.featured ? 'featured-project' : ''} ${project.awards ? 'award-winning' : ''}`}
        onClick={() => {
          setSelectedProject(project);
          setShowProjectModal(true);
          setActiveImageIndex(0);
        }}
        style={{ cursor: 'pointer' }}
      >
        <div className="card-badges">
          {project.featured && (
            <div className="featured-badge">
              Featured
            </div>
          )}
          {project.awards && project.awards.length > 0 && (
            <div className="award-badge">
              Award Winner
            </div>
          )}
          {project.status === 'in-progress' && (
            <div className="progress-badge">
              In Progress
            </div>
          )}
        </div>
        
        <div className="project-image-container">
          <Card.Img 
            variant="top" 
            src={imageError[`${project.id}-0`] ? 'https://via.placeholder.com/800x600?text=Image+Not+Available' : project.images[0]}
            alt={project.title}
            className="project-image"
            onError={() => handleImageError(project.id, 0)}
          />
          <div className="project-overlay">
            <Button variant="outline-light" className="view-project-btn">
              View Project
            </Button>
            {project.links && (
              <div className="quick-links">
                {project.links.demo && (
                  <Button variant="outline-light" size="sm" className="me-2" title="Demo">
                    <span>🎮</span>
                  </Button>
                )}
                {project.links.github && (
                  <Button variant="outline-light" size="sm" title="GitHub">
                    <span>📂</span>
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {project.status === 'in-progress' && (
            <div className="progress-indicator">
              <div className="progress-bar" style={{ width: '70%' }}></div>
            </div>
          )}
        </div>
        
        <Card.Body className="d-flex flex-column">
          <div className="mb-2">
            <Badge 
              bg={categories[project.category]?.color} 
              className="me-2"
              data-category={project.category}
            >
              {categories[project.category]?.icon} {categories[project.category]?.label}
            </Badge>
            <Badge 
              bg={getStatusVariant(project.status)} 
              variant="outline"
              data-status={project.status}
            >
              {project.status.replace('-', ' ')}
            </Badge>
          </div>
          
          <Card.Title className="h5">{project.title}</Card.Title>
          <Card.Text className="flex-grow-1">
            {project.description.length > 100 
              ? `${project.description.substring(0, 100)}...` 
              : project.description
            }
          </Card.Text>
          
          <div className="project-tech mb-2">
            {project.technologies.slice(0, 3).map(tech => (
              <Badge key={tech} bg="light" text="dark" className="me-1 mb-1">
                {technologies[tech]}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge bg="light" text="dark">+{project.technologies.length - 3}</Badge>
            )}
          </div>
          
          {project.metrics && (
            <div className="project-metrics mb-2">
              {project.metrics.views && (
                <small className="text-muted me-3">
                  👁️ {project.metrics.views}
                </small>
              )}
              {project.metrics.engagement && (
                <small className="text-success">
                  📈 {project.metrics.engagement}
                </small>
              )}
            </div>
          )}
          
          <div className="project-meta">
            <small className="text-muted">
              📅 {formatDate(project.date)}
            </small>
            {project.duration && (
              <small className="text-muted ms-2">
                ⏱️ {project.duration}
              </small>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container fluid className="portfolio-container py-5">
      {/* Header with Statistics */}
      <Row className="mb-5">
        <Col className="text-center">
          <h1 className="display-4 fw-bold mb-3">Portfolio</h1>
          <p className="lead text-muted mb-4">
            Showcasing professional 3D work, visual effects, and creative projects
          </p>
          
          <Row className="portfolio-stats mb-4">
            <Col md={3} sm={6}>
              <div className="stat-item">
                <h3 className="stat-number">{portfolioData.length}</h3>
                <p className="stat-label">Total Projects</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-item">
                <h3 className="stat-number">{portfolioData.filter(p => p.featured).length}</h3>
                <p className="stat-label">Featured Works</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-item">
                <h3 className="stat-number">{portfolioData.filter(p => p.awards).length}</h3>
                <p className="stat-label">Award Winners</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-item">
                <h3 className="stat-number">{Object.keys(categories).length - 1}</h3>
                <p className="stat-label">Categories</p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Enhanced Filters */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {Object.entries(categories).map(([key, { label, icon }]) => (
                <option key={key} value={key}>{icon} {label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3} className="mb-3">
          <Form.Group>
            <Form.Label>Technology</Form.Label>
            <Form.Select 
              value={selectedTechnology} 
              onChange={(e) => setSelectedTechnology(e.target.value)}
            >
              {Object.entries(technologies).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={4} className="mb-3">
          <Form.Group>
            <Form.Label>Search</Form.Label>
            <div className="search-container position-relative">
              <Form.Control
                type="text"
                placeholder="Search projects, tags, technologies..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <div className="search-icon">🔍</div>
              
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  {searchSuggestions.map(suggestion => (
                    <div 
                      key={suggestion}
                      className="suggestion-item"
                      onClick={() => handleSearch(suggestion)}
                    >
                      🏷️ {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Form.Group>
        </Col>
        
        <Col md={2} className="mb-3">
          <Form.Group>
            <Form.Label>Sort By</Form.Label>
            <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title</option>
              <option value="featured">Featured</option>
              <option value="popularity">Most Popular</option>
              <option value="awards">Most Awarded</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* View Mode Toggle */}
      <Row className="mb-4 align-items-center">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="text-muted">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              </span>
            </div>
            <div className="btn-group" role="group">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                ⊞ Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                ☰ List
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Projects Display */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading amazing projects...</p>
        </div>
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <Alert variant="info" className="text-center">
              <Alert.Heading>No projects found</Alert.Heading>
              <p>Try adjusting your filters or search terms.</p>
              <Button 
                variant="outline-primary" 
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTechnology('all');
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </Button>
            </Alert>
          ) : (
            <div className={`projects-display ${viewMode}`}>
              <Row>
                {filteredProjects.map(project => renderProjectCard(project))}
              </Row>
            </div>
          )}
        </>
      )}

      {/* Enhanced Project Modal */}
      {selectedProject && (
        <Modal 
          show={showProjectModal} 
          onHide={() => setShowProjectModal(false)}
          size="xl"
          centered
          className="project-modal"
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="d-flex align-items-center">
              {selectedProject.title}
              {selectedProject.awards && (
                <Badge bg="warning" className="ms-2">
                  🏆 Award Winner
                </Badge>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <Row className="g-0">
              <Col md={8}>
                <div className="project-images p-4">
                  {selectedProject.images.length > 1 ? (
                    <Carousel 
                      activeIndex={activeImageIndex} 
                      onSelect={(selectedIndex) => setActiveImageIndex(selectedIndex)}
                      className="project-carousel"
                    >
                      {selectedProject.images.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img 
                            src={imageError[`${selectedProject.id}-${index}`] ? 'https://via.placeholder.com/800x600?text=Image+Not+Available' : image}
                            alt={`${selectedProject.title} ${index + 1}`}
                            className="d-block w-100 rounded"
                            onError={() => handleImageError(selectedProject.id, index)}
                            style={{ cursor: 'zoom-in' }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <img 
                      src={selectedProject.images[0]} 
                      alt={selectedProject.title}
                      className="img-fluid rounded w-100"
                      style={{ cursor: 'zoom-in' }}
                    />
                  )}
                </div>
              </Col>
              
              <Col md={4} className="p-4">
                <div className="project-details">
                  <div className="mb-3">
                    <Badge bg={categories[selectedProject.category]?.color} className="me-2">
                      {categories[selectedProject.category]?.icon} {categories[selectedProject.category]?.label}
                    </Badge>
                    <Badge bg={getStatusVariant(selectedProject.status)}>
                      {selectedProject.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <p className="mb-4">{selectedProject.description}</p>
                  
                  {/* Enhanced project information */}
                  {selectedProject.awards && (
                    <div className="awards mb-4">
                      <h6><i className="bi bi-trophy"></i> Awards & Recognition</h6>
                      <ul className="list-unstyled">
                        {selectedProject.awards.map((award, index) => (
                          <li key={index} className="award-item">
                            <i className="bi bi-award text-warning"></i> {award}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedProject.metrics && (
                    <div className="metrics mb-4">
                      <h6><i className="bi bi-graph-up"></i> Performance Metrics</h6>
                      <div className="metrics-grid">
                        {Object.entries(selectedProject.metrics).map(([key, value]) => (
                          <div key={key} className="metric-item">
                            <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong>
                            <span className="metric-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="project-info mb-4">
                    <h6>Project Information</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>Date:</strong></td>
                          <td>{formatDate(selectedProject.date)}</td>
                        </tr>
                        {selectedProject.duration && (
                          <tr>
                            <td><strong>Duration:</strong></td>
                            <td>{selectedProject.duration}</td>
                          </tr>
                        )}
                        {selectedProject.client && (
                          <tr>
                            <td><strong>Client:</strong></td>
                            <td>{selectedProject.client}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="technologies mb-4">
                    <h6>Technologies Used</h6>
                    <div>
                      {selectedProject.technologies.map(tech => (
                        <Badge key={tech} bg="primary" className="me-2 mb-2">
                          {technologies[tech]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {selectedProject.specifications && (
                    <div className="specifications mb-4">
                      <h6>Technical Specifications</h6>
                      <ul className="list-unstyled">
                        {Object.entries(selectedProject.specifications).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="tags">
                    <h6>Tags</h6>
                    <div>
                      {selectedProject.tags.map(tag => (
                        <Badge key={tag} bg="light" text="dark" className="me-1 mb-1">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <div className="modal-footer-content w-100">
              <div className="footer-links">
                {selectedProject.links && (
                  <>
                    {selectedProject.links.demo && (
                      <Button variant="outline-primary" href={selectedProject.links.demo} target="_blank">
                        🎮 View Demo
                      </Button>
                    )}
                    {selectedProject.links.github && (
                      <Button variant="outline-dark" href={selectedProject.links.github} target="_blank">
                        📂 Source Code
                      </Button>
                    )}
                  </>
                )}
              </div>
              <div className="footer-actions">
                <Button variant="secondary" onClick={() => setShowProjectModal(false)}>
                  Close
                </Button>
                <Button variant="primary">
                  📤 Share Project
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Portfolio;

