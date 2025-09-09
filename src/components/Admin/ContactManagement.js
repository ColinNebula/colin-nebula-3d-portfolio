import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form, Modal, Row, Col, Alert, Card } from 'react-bootstrap';

const ContactManagement = ({ onStatsUpdate }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, filterStatus]);

  const loadContacts = () => {
    const storedContacts = JSON.parse(localStorage.getItem('admin_contact_submissions') || '[]');
    
    // Add demo contacts if none exist
    if (storedContacts.length === 0) {
      const demoContacts = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          subject: 'Website Development Inquiry',
          message: 'Hi Colin, I\'m interested in discussing a potential web development project for my startup. Could we schedule a call?',
          status: 'new',
          priority: 'high',
          source: 'contact_form',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          repliedAt: null,
          reply: null
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@company.com',
          subject: 'Portfolio Review',
          message: 'Your portfolio is impressive! We have some freelance opportunities that might interest you. Please reach out when you have a chance.',
          status: 'replied',
          priority: 'medium',
          source: 'contact_form',
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          repliedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          reply: 'Thank you for reaching out! I\'d be happy to discuss opportunities.'
        },
        {
          id: '3',
          name: 'Mike Chen',
          email: 'mike@techstartup.io',
          subject: 'Mobile App Development',
          message: 'We\'re looking for a React Native developer for our mobile app project. Timeline is flexible. Budget range: $5000-$8000.',
          status: 'read',
          priority: 'high',
          source: 'contact_form',
          submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          repliedAt: null,
          reply: null
        },
        {
          id: '4',
          name: 'Lisa Wong',
          email: 'lisa.wong@design.com',
          subject: 'Collaboration Opportunity',
          message: 'I\'m a UI/UX designer and would love to collaborate on projects. Your development skills complement my design background perfectly.',
          status: 'archived',
          priority: 'low',
          source: 'contact_form',
          submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          repliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          reply: 'Great to connect! I\'m always open to collaborations.'
        }
      ];
      localStorage.setItem('admin_contact_submissions', JSON.stringify(demoContacts));
      setContacts(demoContacts);
    } else {
      setContacts(storedContacts);
    }
    
    if (onStatsUpdate) onStatsUpdate();
  };

  const filterContacts = () => {
    let filtered = contacts;
    
    if (searchTerm) {
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(contact => contact.status === filterStatus);
    }
    
    // Sort by newest first
    filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    setFilteredContacts(filtered);
  };

  const updateContactStatus = (contactId, newStatus) => {
    const updatedContacts = contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, status: newStatus }
        : contact
    );
    setContacts(updatedContacts);
    localStorage.setItem('admin_contact_submissions', JSON.stringify(updatedContacts));
  };

  const handleReply = (contact) => {
    setSelectedContact(contact);
    setReplyText(contact.reply || '');
    setShowContactModal(true);
  };

  const sendReply = () => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }

    const updatedContacts = contacts.map(contact => 
      contact.id === selectedContact.id 
        ? { 
            ...contact, 
            status: 'replied',
            reply: replyText,
            repliedAt: new Date().toISOString()
          }
        : contact
    );
    
    setContacts(updatedContacts);
    localStorage.setItem('admin_contact_submissions', JSON.stringify(updatedContacts));
    setShowContactModal(false);
    setReplyText('');
    setSelectedContact(null);

    // In a real app, you would send the email here
    alert('Reply sent successfully! (In demo mode - no actual email sent)');
  };

  const deleteContact = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const updatedContacts = contacts.filter(contact => contact.id !== contactId);
      setContacts(updatedContacts);
      localStorage.setItem('admin_contact_submissions', JSON.stringify(updatedContacts));
      if (onStatsUpdate) onStatsUpdate();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { bg: 'success', icon: '🆕', label: 'New' },
      read: { bg: 'primary', icon: '👁️', label: 'Read' },
      replied: { bg: 'info', icon: '✅', label: 'Replied' },
      archived: { bg: 'secondary', icon: '📁', label: 'Archived' }
    };
    const config = statusConfig[status] || statusConfig.new;
    return <Badge bg={config.bg}>{config.icon} {config.label}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { bg: 'danger', icon: '🔥', label: 'High' },
      medium: { bg: 'warning', icon: '⚡', label: 'Medium' },
      low: { bg: 'light', icon: '📋', label: 'Low', text: 'dark' }
    };
    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <Badge bg={config.bg} text={config.text}>
        {config.icon} {config.label}
      </Badge>
    );
  };

  const getContactStats = () => {
    return {
      total: contacts.length,
      new: contacts.filter(c => c.status === 'new').length,
      replied: contacts.filter(c => c.status === 'replied').length,
      pending: contacts.filter(c => c.status === 'read').length
    };
  };

  const stats = getContactStats();

  return (
    <div className="admin-content-area">
      <h3>📧 Contact Form Management</h3>
      
      {/* Contact Statistics */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card stat-contacts">
            <Card.Body className="text-center">
              <div className="stat-icon">📧</div>
              <h3>{stats.total}</h3>
              <p>Total Messages</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card stat-users">
            <Card.Body className="text-center">
              <div className="stat-icon">🆕</div>
              <h3>{stats.new}</h3>
              <p>New Messages</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card stat-projects">
            <Card.Body className="text-center">
              <div className="stat-icon">✅</div>
              <h3>{stats.replied}</h3>
              <p>Replied</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="stat-card stat-visitors">
            <Card.Body className="text-center">
              <div className="stat-icon">⏳</div>
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter Controls */}
      <Row className="mb-4">
        <Col lg={6} md={8} className="mb-3">
          <Form.Group>
            <Form.Label>Search Messages</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-form"
            />
          </Form.Group>
        </Col>
        <Col lg={3} md={4} className="mb-3">
          <Form.Group>
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="admin-form"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col lg={3} md={12} className="mb-3">
          <div className="mt-4 mt-md-0 mt-lg-4">
            <Button variant="success" onClick={loadContacts} className="admin-btn w-100 w-lg-auto">
              🔄 Refresh
            </Button>
          </div>
        </Col>
      </Row>

      {/* Contacts Table */}
      <div className="table-responsive">
        <Table striped bordered hover className="admin-table">
          <thead>
            <tr>
              <th>Contact</th>
              <th>Subject</th>
              <th>Message Preview</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Received</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(contact => (
              <tr key={contact.id} className={contact.status === 'new' ? 'table-warning' : ''}>
                <td>
                  <div>
                    <strong>{contact.name}</strong>
                    <br />
                    <small className="text-muted">{contact.email}</small>
                  </div>
                </td>
                <td>
                  <strong>{contact.subject}</strong>
                </td>
                <td>
                  <small>{contact.message.substring(0, 100)}...</small>
                </td>
                <td>{getStatusBadge(contact.status)}</td>
                <td>{getPriorityBadge(contact.priority)}</td>
                <td>{formatDate(contact.submittedAt)}</td>
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-info"
                      onClick={() => handleReply(contact)}
                      title="View/Reply"
                    >
                      💬
                    </Button>
                    
                    {contact.status === 'new' && (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => updateContactStatus(contact.id, 'read')}
                        title="Mark as Read"
                      >
                        👁️
                      </Button>
                    )}
                    
                    {contact.status !== 'archived' && (
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => updateContactStatus(contact.id, 'archived')}
                        title="Archive"
                      >
                        📁
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteContact(contact.id)}
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

      {filteredContacts.length === 0 && (
        <Alert variant="info" className="text-center">
          No contact messages found matching your criteria.
        </Alert>
      )}

      {/* Contact Details and Reply Modal */}
      <Modal show={showContactModal} onHide={() => setShowContactModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>💬 Contact Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedContact && (
            <>
              <Card className="mb-3">
                <Card.Header>
                  <strong>From: {selectedContact.name}</strong>
                  <Badge bg="secondary" className="ms-2">{selectedContact.email}</Badge>
                </Card.Header>
                <Card.Body>
                  <h6><strong>Subject:</strong> {selectedContact.subject}</h6>
                  <p><strong>Received:</strong> {formatDate(selectedContact.submittedAt)}</p>
                  <div className="mb-2">
                    {getStatusBadge(selectedContact.status)}
                    <span className="ms-2">{getPriorityBadge(selectedContact.priority)}</span>
                  </div>
                  <hr />
                  <p><strong>Message:</strong></p>
                  <div className="border p-3 bg-light rounded">
                    {selectedContact.message}
                  </div>
                </Card.Body>
              </Card>

              {selectedContact.reply && (
                <Card className="mb-3">
                  <Card.Header className="bg-success text-white">
                    <strong>Your Reply</strong>
                    <small className="ms-2">Sent: {formatDate(selectedContact.repliedAt)}</small>
                  </Card.Header>
                  <Card.Body>
                    <div className="border p-3 bg-light rounded">
                      {selectedContact.reply}
                    </div>
                  </Card.Body>
                </Card>
              )}

              <Form.Group>
                <Form.Label>
                  <strong>{selectedContact.reply ? 'Update Reply:' : 'Reply to this message:'}</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="admin-form"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowContactModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={sendReply}>
            📤 Send Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContactManagement;