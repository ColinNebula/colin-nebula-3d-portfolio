import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form, Modal, Row, Col, Alert, Card } from 'react-bootstrap';

const UserManagement = ({ onStatsUpdate }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('nebula_users') || '[]');
    
    // Add some demo activity data if not present
    const enhancedUsers = storedUsers.map(user => ({
      ...user,
      lastActivity: user.lastActivity || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      loginCount: user.loginCount || Math.floor(Math.random() * 50) + 1,
      status: user.status || 'active'
    }));
    
    setUsers(enhancedUsers);
    if (onStatsUpdate) onStatsUpdate();
  };

  const filterUsers = () => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }
    
    setFilteredUsers(filtered);
  };

  const handleUserAction = (user, action) => {
    const updatedUsers = users.map(u => {
      if (u.email === user.email) {
        switch (action) {
          case 'promote':
            return { ...u, role: 'administrator', isAdmin: true, permissions: ['read', 'write', 'admin'] };
          case 'demote':
            return { ...u, role: 'user', isAdmin: false, permissions: ['read'] };
          case 'activate':
            return { ...u, status: 'active' };
          case 'suspend':
            return { ...u, status: 'suspended' };
          default:
            return u;
        }
      }
      return u;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem('nebula_users', JSON.stringify(updatedUsers));
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      const updatedUsers = users.filter(u => u.email !== userToDelete.email);
      setUsers(updatedUsers);
      localStorage.setItem('nebula_users', JSON.stringify(updatedUsers));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
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

  const getUserRoleBadge = (user) => {
    if (user.isAdmin || user.role === 'administrator') {
      return <Badge bg="warning">👑 Admin</Badge>;
    }
    return <Badge bg="primary">👤 User</Badge>;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">✅ Active</Badge>;
      case 'suspended':
        return <Badge bg="danger">⛔ Suspended</Badge>;
      default:
        return <Badge bg="secondary">❓ Unknown</Badge>;
    }
  };

  const UserDetailsModal = () => (
    <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedUser && (
          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header><strong>Basic Information</strong></Card.Header>
                <Card.Body>
                  <p><strong>Name:</strong> {selectedUser.name || 'Not provided'}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Role:</strong> {getUserRoleBadge(selectedUser)}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedUser.status)}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header><strong>Activity Information</strong></Card.Header>
                <Card.Body>
                  <p><strong>Created:</strong> {formatDate(selectedUser.createdAt)}</p>
                  <p><strong>Last Activity:</strong> {formatDate(selectedUser.lastActivity)}</p>
                  <p><strong>Login Count:</strong> {selectedUser.loginCount} times</p>
                  <p><strong>Validation Level:</strong> {selectedUser.validationLevel || 0}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12}>
              <Card>
                <Card.Header><strong>Permissions</strong></Card.Header>
                <Card.Body>
                  <div className="d-flex flex-wrap gap-2">
                    {(selectedUser.permissions || ['read']).map(permission => (
                      <Badge key={permission} bg="info">{permission}</Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowUserModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div className="admin-content-area">
      <h3>👥 User Management</h3>
      
      {/* Search and Filter Controls */}
      <Row className="mb-4">
        <Col lg={6} md={8} className="mb-3">
          <Form.Group>
            <Form.Label>Search Users</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-form"
            />
          </Form.Group>
        </Col>
        <Col lg={3} md={4} className="mb-3">
          <Form.Group>
            <Form.Label>Filter by Role</Form.Label>
            <Form.Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="admin-form"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="administrator">Administrators</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col lg={3} md={12} className="mb-3">
          <div className="mt-4 mt-md-0 mt-lg-4">
            <Button variant="success" onClick={loadUsers} className="admin-btn w-100 w-lg-auto">
              🔄 Refresh
            </Button>
          </div>
        </Col>
      </Row>

      {/* Users Summary */}
      <Row className="mb-3">
        <Col>
          <Alert variant="info">
            📊 Showing {filteredUsers.length} of {users.length} total users
          </Alert>
        </Col>
      </Row>

      {/* Users Table */}
      <div className="table-responsive">
        <Table striped bordered hover className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Activity</th>
              <th>Login Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.email}>
                <td>
                  <div>
                    <strong>{user.name || 'Unknown'}</strong>
                    {user.isAdmin && <span className="ms-2">👑</span>}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{getUserRoleBadge(user)}</td>
                <td>{getStatusBadge(user.status)}</td>
                <td>{formatDate(user.lastActivity)}</td>
                <td>
                  <Badge bg="secondary">{user.loginCount}</Badge>
                </td>
                <td>
                  <div className="d-flex gap-1 flex-wrap justify-content-start">
                    <Button
                      size="sm"
                      variant="outline-info"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      title="View Details"
                    >
                      👁️
                    </Button>
                    
                    {!user.isAdmin && (
                      <Button
                        size="sm"
                        variant="outline-warning"
                        onClick={() => handleUserAction(user, 'promote')}
                        title="Promote to Admin"
                      >
                        ⬆️
                      </Button>
                    )}
                    
                    {user.isAdmin && user.email !== 'admin@colin-nebula.com' && (
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => handleUserAction(user, 'demote')}
                        title="Demote to User"
                      >
                        ⬇️
                      </Button>
                    )}
                    
                    {user.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleUserAction(user, 'suspend')}
                        title="Suspend User"
                      >
                        ⛔
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => handleUserAction(user, 'activate')}
                        title="Activate User"
                      >
                        ✅
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteUser(user)}
                      title="Delete User"
                      disabled={user.email === 'admin@colin-nebula.com'}
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

      {filteredUsers.length === 0 && (
        <Alert variant="warning" className="text-center">
          No users found matching your criteria.
        </Alert>
      )}

      {/* User Details Modal */}
      <UserDetailsModal />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user <strong>{userToDelete?.email}</strong>? 
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteUser}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;