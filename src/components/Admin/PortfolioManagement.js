import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Row, Col, Alert, Card, Badge } from 'react-bootstrap';

const PortfolioManagement = ({ onStatsUpdate }) => {
  const [projects, setProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    demoUrl: '',
    githubUrl: '',
    imageUrl: '',
    category: 'web',
    status: 'published',
    featured: false
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const storedProjects = JSON.parse(localStorage.getItem('admin_portfolio_projects') || '[]');
    
    // Add demo projects if none exist
    if (storedProjects.length === 0) {
      const demoProjects = [
        {
          id: '1',
          title: 'E-Commerce Platform',
          description: 'A full-stack e-commerce solution with React and Node.js',
          technologies: 'React, Node.js, MongoDB, Stripe',
          demoUrl: 'https://demo-ecommerce.com',
          githubUrl: 'https://github.com/user/ecommerce',
          imageUrl: '/assets/images/project1.jpg',
          category: 'web',
          status: 'published',
          featured: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Mobile Weather App',
          description: 'Cross-platform mobile app for weather forecasting',
          technologies: 'React Native, Redux, Weather API',
          demoUrl: '',
          githubUrl: 'https://github.com/user/weather-app',
          imageUrl: '/assets/images/project2.jpg',
          category: 'mobile',
          status: 'published',
          featured: false,
          createdAt: '2024-02-10T14:30:00Z',
          updatedAt: '2024-02-10T14:30:00Z'
        },
        {
          id: '3',
          title: 'Data Visualization Dashboard',
          description: 'Interactive dashboard for business analytics',
          technologies: 'D3.js, Vue.js, Python, Flask',
          demoUrl: 'https://analytics-demo.com',
          githubUrl: 'https://github.com/user/analytics',
          imageUrl: '/assets/images/project3.jpg',
          category: 'data',
          status: 'draft',
          featured: false,
          createdAt: '2024-03-05T09:15:00Z',
          updatedAt: '2024-03-05T09:15:00Z'
        }
      ];
      localStorage.setItem('admin_portfolio_projects', JSON.stringify(demoProjects));
      setProjects(demoProjects);
    } else {
      setProjects(storedProjects);
    }
    
    if (onStatsUpdate) onStatsUpdate();
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        demoUrl: project.demoUrl || '',
        githubUrl: project.githubUrl || '',
        imageUrl: project.imageUrl || '',
        category: project.category,
        status: project.status,
        featured: project.featured
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        demoUrl: '',
        githubUrl: '',
        imageUrl: '',
        category: 'web',
        status: 'published',
        featured: false
      });
    }
    setShowProjectModal(true);
  };

  const handleSaveProject = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in required fields (title and description)');
      return;
    }

    const now = new Date().toISOString();
    const projectData = {
      ...formData,
      id: editingProject ? editingProject.id : Date.now().toString(),
      createdAt: editingProject ? editingProject.createdAt : now,
      updatedAt: now
    };

    let updatedProjects;
    if (editingProject) {
      updatedProjects = projects.map(p => p.id === editingProject.id ? projectData : p);
    } else {
      updatedProjects = [...projects, projectData];
    }

    setProjects(updatedProjects);
    localStorage.setItem('admin_portfolio_projects', JSON.stringify(updatedProjects));
    setShowProjectModal(false);
    if (onStatsUpdate) onStatsUpdate();
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      localStorage.setItem('admin_portfolio_projects', JSON.stringify(updatedProjects));
      if (onStatsUpdate) onStatsUpdate();
    }
  };

  const toggleFeatured = (projectId) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, featured: !p.featured } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('admin_portfolio_projects', JSON.stringify(updatedProjects));
  };

  const toggleStatus = (projectId) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { 
        ...p, 
        status: p.status === 'published' ? 'draft' : 'published' 
      } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem('admin_portfolio_projects', JSON.stringify(updatedProjects));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryBadge = (category) => {
    const categories = {
      web: { bg: 'primary', icon: '🌐', label: 'Web' },
      mobile: { bg: 'success', icon: '📱', label: 'Mobile' },
      desktop: { bg: 'info', icon: '💻', label: 'Desktop' },
      data: { bg: 'warning', icon: '📊', label: 'Data Science' },
      other: { bg: 'secondary', icon: '🔧', label: 'Other' }
    };
    const cat = categories[category] || categories.other;
    return <Badge bg={cat.bg}>{cat.icon} {cat.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    return status === 'published' 
      ? <Badge bg="success">✅ Published</Badge>
      : <Badge bg="warning">📝 Draft</Badge>;
  };

  return (
    <div className="admin-content-area">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>💼 Portfolio Project Management</h3>
        <Button variant="success" onClick={() => handleOpenModal()} className="admin-btn">
          ➕ Add New Project
        </Button>
      </div>

      {/* Project Statistics */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h4>{projects.length}</h4>
              <p>Total Projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h4>{projects.filter(p => p.status === 'published').length}</h4>
              <p>Published</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h4>{projects.filter(p => p.featured).length}</h4>
              <p>Featured</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card">
            <Card.Body className="text-center">
              <h4>{projects.filter(p => p.status === 'draft').length}</h4>
              <p>Drafts</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Projects Table */}
      <div className="table-responsive">
        <Table striped bordered hover className="admin-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Technologies</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id}>
                <td>
                  <div>
                    <strong>{project.title}</strong>
                    <br />
                    <small className="text-muted">
                      {project.description.substring(0, 100)}...
                    </small>
                  </div>
                </td>
                <td>{getCategoryBadge(project.category)}</td>
                <td>
                  <small>{project.technologies}</small>
                </td>
                <td>{getStatusBadge(project.status)}</td>
                <td>
                  <Button
                    size="sm"
                    variant={project.featured ? "warning" : "outline-secondary"}
                    onClick={() => toggleFeatured(project.id)}
                  >
                    {project.featured ? "⭐" : "☆"}
                  </Button>
                </td>
                <td>{formatDate(project.updatedAt)}</td>
                <td>
                  <div className="d-flex gap-1 flex-wrap justify-content-start">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => handleOpenModal(project)}
                      title="Edit"
                    >
                      ✏️
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={project.status === 'published' ? "outline-warning" : "outline-success"}
                      onClick={() => toggleStatus(project.id)}
                      title={project.status === 'published' ? "Unpublish" : "Publish"}
                    >
                      {project.status === 'published' ? "📝" : "✅"}
                    </Button>
                    
                    {project.demoUrl && (
                      <Button
                        size="sm"
                        variant="outline-info"
                        onClick={() => window.open(project.demoUrl, '_blank')}
                        title="View Demo"
                      >
                        👁️
                      </Button>
                    )}
                    
                    {project.githubUrl && (
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => window.open(project.githubUrl, '_blank')}
                        title="View GitHub"
                      >
                        📂
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteProject(project.id)}
                      title="Delete"
                    >
                      🗑️
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {projects.length === 0 && (
        <Alert variant="info" className="text-center">
          No projects found. Click "Add New Project" to get started!
        </Alert>
      )}

      {/* Project Modal */}
      <Modal show={showProjectModal} onHide={() => setShowProjectModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProject ? '✏️ Edit Project' : '➕ Add New Project'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="admin-form">
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter project title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="web">🌐 Web Development</option>
                    <option value="mobile">📱 Mobile App</option>
                    <option value="desktop">💻 Desktop App</option>
                    <option value="data">📊 Data Science</option>
                    <option value="other">🔧 Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your project"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Technologies Used</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., React, Node.js, MongoDB"
                value={formData.technologies}
                onChange={(e) => setFormData({...formData, technologies: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Demo URL</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://your-demo.com"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>GitHub URL</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://github.com/user/repo"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Project Image URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="published">✅ Published</option>
                    <option value="draft">📝 Draft</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="⭐ Featured Project"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="mt-4"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProjectModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProject}>
            {editingProject ? 'Update Project' : 'Create Project'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PortfolioManagement;