import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal, ProgressBar, Tab, Tabs, Table } from 'react-bootstrap';

import { useNotifications } from '../../App';import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal, ProgressBar, Tab, Tabs, Table } from 'react-bootstrap';

import AuthAPI from '../../utils/authAPI';

import './Account.css';import { useNotifications } from '../../App';import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal, ProgressBar, Tab, Tabs, Table } from 'react-bootstrap';



function Account() {import AuthAPI from '../../utils/authAPI';

  const { showNotification } = useNotifications();

  const authAPI = new AuthAPI();import './Account.css';import { useNotifications } from '../../App';import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal, ProgressBar, Tab, Tabs, Table } from 'react-bootstrap';import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal, ProgressBar, Tab, Tabs, Table, ListGroup } from 'react-bootstrap';

  

  const [activeTab, setActiveTab] = useState('profile');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loading, setLoading] = useState(true);function Account() {import AuthAPI from '../../utils/authAPI';

  

  const [settings, setSettings] = useState({  const { showNotification } = useNotifications();

    emailNotifications: true,

    browserNotifications: false,  const authAPI = new AuthAPI();import './Account.css';import { useNotifications } from '../../App';import { useNotifications } from '../../App';

    portfolioUpdates: true,

    systemUpdates: false,  

    marketingEmails: false,

    darkMode: false  // Enhanced user state management

  });

    const [activeTab, setActiveTab] = useState('profile');

  const [userInfo, setUserInfo] = useState({

    name: 'Guest User',  const [isLoggedIn, setIsLoggedIn] = useState(false);function Account() {import AuthAPI from '../../utils/authAPI';import AuthAPI from '../../utils/authAPI';

    email: 'guest@example.com',

    memberSince: new Date().toISOString().split('T')[0],  const [authUser, setAuthUser] = useState(null);

    avatar: null,

    bio: '',  const [loading, setLoading] = useState(true);  const { showNotification } = useNotifications();

    location: '',

    website: '',  

    accountType: 'guest'

  });  // User profile and settings  const authAPI = new AuthAPI();import './Account.css';import './Account.css';

  

  const [showEditProfile, setShowEditProfile] = useState(false);  const [settings, setSettings] = useState({

  const [editUserInfo, setEditUserInfo] = useState(userInfo);

  const [profileCompletion, setProfileCompletion] = useState(60);    emailNotifications: true,  

  const [preferencesSaved, setPreferencesSaved] = useState(false);

  const [activityLog, setActivityLog] = useState([]);    browserNotifications: false,



  useEffect(() => {    portfolioUpdates: true,  // Enhanced user state management

    loadUserData();

  }, []);    systemUpdates: false,



  const loadUserData = async () => {    marketingEmails: false,  const [activeTab, setActiveTab] = useState('profile');

    try {

      setLoading(true);    darkMode: false,

      const token = localStorage.getItem('auth_token');

          language: 'en',  const [isLoggedIn, setIsLoggedIn] = useState(false);function Account() {function Account() {

      if (token) {

        try {    timezone: 'UTC'

          const userData = await authAPI.getProfile();

          setUserInfo(userData);  });  const [authUser, setAuthUser] = useState(null);

          setEditUserInfo(userData);

          setIsLoggedIn(true);  

        } catch (error) {

          console.error('Failed to load user data from API:', error);  const [userInfo, setUserInfo] = useState({  const [loading, setLoading] = useState(true);  const { showNotification } = useNotifications();  const { showNotification } = useNotifications();

          loadLocalData();

        }    name: 'Guest User',

      } else {

        loadLocalData();    email: 'guest@example.com',  

      }

          memberSince: new Date().toISOString().split('T')[0],

      calculateProfileCompletion();

    } catch (error) {    avatar: null,  // User profile and settings  const authAPI = new AuthAPI();  const authAPI = new AuthAPI();

      console.error('Error loading user data:', error);

      showNotification('Failed to load user data', 'danger');    bio: '',

    } finally {

      setLoading(false);    location: '',  const [settings, setSettings] = useState({

    }

  };    website: '',



  const loadLocalData = () => {    validationLevel: 0,    emailNotifications: true,    

    try {

      const savedSettings = localStorage.getItem('user_notification_settings');    accountType: 'guest'

      if (savedSettings) {

        setSettings({ ...settings, ...JSON.parse(savedSettings) });  });    browserNotifications: false,

      }

        

      const savedUserInfo = localStorage.getItem('user_profile_info');

      if (savedUserInfo) {  // Modal states    portfolioUpdates: true,  // Enhanced user state management  // Enhanced user state management

        const parsedUserInfo = JSON.parse(savedUserInfo);

        setUserInfo(parsedUserInfo);  const [showEditProfile, setShowEditProfile] = useState(false);

        setEditUserInfo(parsedUserInfo);

      }  const [showChangePassword, setShowChangePassword] = useState(false);    systemUpdates: false,

      

      const mockActivity = [  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

        {

          id: 1,  const [editUserInfo, setEditUserInfo] = useState(userInfo);    marketingEmails: false,  const [activeTab, setActiveTab] = useState('profile');  const [activeTab, setActiveTab] = useState('profile');

          action: 'Visited Portfolio',

          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),  

          ip: '192.168.1.1',

          device: 'Desktop Browser'  // Form states    darkMode: false,

        }

      ];  const [passwordForm, setPasswordForm] = useState({

      setActivityLog(mockActivity);

          currentPassword: '',    language: 'en',  const [isLoggedIn, setIsLoggedIn] = useState(false);  const [isLoggedIn, setIsLoggedIn] = useState(false);

    } catch (error) {

      console.error('Error loading local data:', error);    newPassword: '',

    }

  };    confirmPassword: ''    timezone: 'UTC'



  const calculateProfileCompletion = () => {  });

    let score = 0;

    const fields = ['name', 'email', 'bio', 'avatar', 'location'];  const [deleteConfirmation, setDeleteConfirmation] = useState('');  });  const [authUser, setAuthUser] = useState(null);  const [authUser, setAuthUser] = useState(null);

    

    fields.forEach(field => {  

      if (userInfo[field] && userInfo[field] !== 'Guest User' && userInfo[field] !== 'guest@example.com') {

        score += 20;  // UI states  

      }

    });  const [profileCompletion, setProfileCompletion] = useState(60);

    

    setProfileCompletion(score);  const [preferencesSaved, setPreferencesSaved] = useState(false);  const [userInfo, setUserInfo] = useState({  const [loading, setLoading] = useState(true);  const [loading, setLoading] = useState(true);

  };

  const [activityLog, setActivityLog] = useState([]);

  const handleSettingChange = async (setting) => {

    const newSettings = {  const [securitySettings, setSecuritySettings] = useState({    name: 'Guest User',

      ...settings,

      [setting]: !settings[setting]    twoFactorEnabled: false,

    };

        loginNotifications: true,    email: 'guest@example.com',    

    setSettings(newSettings);

    setPreferencesSaved(true);    sessionTimeout: '24h'

    

    try {  });    memberSince: new Date().toISOString().split('T')[0],

      if (isLoggedIn) {

        await authAPI.updateSettings(newSettings);

      }

        // Initialize component    avatar: null,  // User profile and settings  // User profile and settings

      localStorage.setItem('user_notification_settings', JSON.stringify(newSettings));

        useEffect(() => {

      showNotification(

        `${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newSettings[setting] ? 'enabled' : 'disabled'}`,     loadUserData();    bio: '',

        'success', 

        2000  }, []);

      );

          location: '',  const [settings, setSettings] = useState({  const [settings, setSettings] = useState({

      setTimeout(() => setPreferencesSaved(false), 3000);

    } catch (error) {  const loadUserData = async () => {

      console.error('Failed to save settings:', error);

      showNotification('Failed to save settings', 'danger');    try {    website: '',

    }

  };      setLoading(true);



  const saveProfile = async () => {      const token = localStorage.getItem('auth_token');    validationLevel: 0,    emailNotifications: true,    emailNotifications: true,

    try {

      setUserInfo(editUserInfo);      

      setShowEditProfile(false);

            if (token) {    accountType: 'guest'

      if (isLoggedIn) {

        await authAPI.updateProfile(editUserInfo);        // User is logged in - load from API

      }

              try {  });    browserNotifications: false,    browserNotifications: false,

      localStorage.setItem('user_profile_info', JSON.stringify(editUserInfo));

                const userData = await authAPI.getProfile();

      showNotification('Profile updated successfully!', 'success', 3000);

      calculateProfileCompletion();          setAuthUser(userData);  

    } catch (error) {

      console.error('Error saving profile:', error);          setUserInfo(userData);

      showNotification('Failed to save profile', 'danger');

    }          setEditUserInfo(userData);  // Modal states    portfolioUpdates: true,    portfolioUpdates: true,

  };

          setIsLoggedIn(true);

  const exportUserData = () => {

    const userData = {            const [showEditProfile, setShowEditProfile] = useState(false);

      profile: userInfo,

      settings: settings,          // Load activity log

      activityLog: activityLog,

      exportDate: new Date().toISOString()          const activity = await authAPI.getActivityLog();  const [showChangePassword, setShowChangePassword] = useState(false);    systemUpdates: false,    systemUpdates: false,

    };

              setActivityLog(activity || []);

    const dataStr = JSON.stringify(userData, null, 2);

    const dataBlob = new Blob([dataStr], { type: 'application/json' });            const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');        } catch (error) {

    link.href = url;

    link.download = `colin-nebula-portfolio-data-${new Date().toISOString().split('T')[0]}.json`;          console.error('Failed to load user data from API:', error);  const [editUserInfo, setEditUserInfo] = useState(userInfo);    marketingEmails: false,    marketingEmails: false,

    link.click();

              // Fall back to localStorage

    showNotification('User data exported successfully!', 'success', 3000);

  };          loadLocalData();  



  const testNotification = () => {        }

    showNotification('This is a test notification!', 'info');

  };      } else {  // Form states    darkMode: false,    darkMode: false,



  const getAccountTypeBadge = (type) => {        // Guest user - load from localStorage

    const badges = {

      'guest': { variant: 'secondary', icon: '👤', text: 'Guest' },        loadLocalData();  const [passwordForm, setPasswordForm] = useState({

      'user': { variant: 'primary', icon: '👤', text: 'User' },

      'premium': { variant: 'warning', icon: '⭐', text: 'Premium' },      }

      'admin': { variant: 'danger', icon: '👑', text: 'Admin' }

    };          currentPassword: '',    language: 'en',    language: 'en',

    

    const badge = badges[type] || badges.guest;      calculateProfileCompletion();

    return (

      <Badge bg={badge.variant} className="account-type-badge">    } catch (error) {    newPassword: '',

        <span className="me-1">{badge.icon}</span>

        {badge.text}      console.error('Error loading user data:', error);

      </Badge>

    );      showNotification('Failed to load user data', 'danger');    confirmPassword: ''    timezone: 'UTC'    timezone: 'UTC'

  };

    } finally {

  if (loading) {

    return (      setLoading(false);  });

      <Container fluid className="account-container py-4 text-center">

        <div className="loading-spinner">    }

          <div className="spinner-border" role="status">

            <span className="visually-hidden">Loading...</span>  };  const [deleteConfirmation, setDeleteConfirmation] = useState('');  });  });

          </div>

          <p className="mt-3">Loading your account...</p>

        </div>

      </Container>  const loadLocalData = () => {  

    );

  }    try {



  return (      // Load settings from localStorage  // UI states    

    <Container fluid className="account-container py-4">

      <Row className="justify-content-center">      const savedSettings = localStorage.getItem('user_notification_settings');

        <Col lg={10} xl={8}>

          <div className="account-header mb-4">      if (savedSettings) {  const [profileCompletion, setProfileCompletion] = useState(60);

            <div className="d-flex align-items-center mb-3">

              <div className="account-avatar me-3">        setSettings({ ...settings, ...JSON.parse(savedSettings) });

                {userInfo.avatar ? (

                  <img src={userInfo.avatar} alt="Avatar" className="rounded-circle" width="60" height="60" />      }  const [preferencesSaved, setPreferencesSaved] = useState(false);  const [userInfo, setUserInfo] = useState({  const [userInfo, setUserInfo] = useState({

                ) : (

                  <div className="avatar-placeholder rounded-circle">      

                    <i className="fas fa-user fa-2x"></i>

                  </div>      // Load user info from localStorage  const [activityLog, setActivityLog] = useState([]);

                )}

              </div>      const savedUserInfo = localStorage.getItem('user_profile_info');

              <div>

                <h2 className="mb-1">      if (savedUserInfo) {  const [securitySettings, setSecuritySettings] = useState({    name: 'Guest User',    name: 'Guest User',

                  {userInfo.name}

                  <span className="ms-2">{getAccountTypeBadge(userInfo.accountType)}</span>        const parsedUserInfo = JSON.parse(savedUserInfo);

                </h2>

                <p className="text-muted mb-0">{userInfo.email}</p>        setUserInfo(parsedUserInfo);    twoFactorEnabled: false,

                <small className="text-muted">Member since: {userInfo.memberSince}</small>

              </div>        setEditUserInfo(parsedUserInfo);

            </div>

                  }    loginNotifications: true,    email: 'guest@example.com',    email: 'guest@example.com',

            <div className="profile-completion mb-3">

              <div className="d-flex justify-content-between align-items-center mb-2">      

                <span>Profile Completion</span>

                <span>{profileCompletion}%</span>      // Load mock activity for guest users    sessionTimeout: '24h'

              </div>

              <ProgressBar now={profileCompletion} variant="success" />      const mockActivity = [

            </div>

          </div>        {  });    memberSince: new Date().toISOString().split('T')[0],    memberSince: new Date().toISOString().split('T')[0],



          <Tabs          id: 1,

            activeKey={activeTab}

            onSelect={(tab) => setActiveTab(tab)}          action: 'Visited Portfolio',

            className="account-tabs mb-4"

          >          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),

            <Tab eventKey="profile" title="Profile">

              <Card className="account-card">          ip: '192.168.1.1',  // Initialize component    avatar: null,    avatar: null,

                <Card.Body>

                  <div className="d-flex justify-content-between align-items-center mb-3">          device: 'Desktop Browser'

                    <h5 className="mb-0">Profile Information</h5>

                    <Button variant="outline-primary" onClick={() => setShowEditProfile(true)}>        },  useEffect(() => {

                      <i className="fas fa-edit me-1"></i>Edit Profile

                    </Button>        {

                  </div>

                            id: 2,    loadUserData();    bio: '',    bio: '',

                  <Row>

                    <Col md={6}>          action: 'Viewed About Page',

                      <div className="info-item">

                        <strong>Name:</strong> {userInfo.name}          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),  }, []);

                      </div>

                      <div className="info-item">          ip: '192.168.1.1',

                        <strong>Email:</strong> {userInfo.email}

                      </div>          device: 'Desktop Browser'    location: '',    location: '',

                      <div className="info-item">

                        <strong>Location:</strong> {userInfo.location || 'Not specified'}        }

                      </div>

                    </Col>      ];  const loadUserData = async () => {

                    <Col md={6}>

                      <div className="info-item">      setActivityLog(mockActivity);

                        <strong>Website:</strong> {userInfo.website || 'Not specified'}

                      </div>          try {    website: '',    website: '',

                      <div className="info-item">

                        <strong>Member Since:</strong> {userInfo.memberSince}    } catch (error) {

                      </div>

                      <div className="info-item">      console.error('Error loading local data:', error);      setLoading(true);

                        <strong>Account Type:</strong> {getAccountTypeBadge(userInfo.accountType)}

                      </div>    }

                    </Col>

                  </Row>  };      const token = localStorage.getItem('auth_token');    validationLevel: 0,    validationLevel: 0,

                  

                  {userInfo.bio && (

                    <div className="mt-3">

                      <strong>Bio:</strong>  const calculateProfileCompletion = () => {      

                      <p className="mt-1">{userInfo.bio}</p>

                    </div>    let score = 0;

                  )}

                </Card.Body>    const fields = ['name', 'email', 'bio', 'avatar', 'location'];      if (token) {    accountType: 'guest'    accountType: 'guest'

              </Card>

            </Tab>    



            <Tab eventKey="settings" title="Settings">    fields.forEach(field => {        // User is logged in - load from API

              <Card className="account-card">

                <Card.Body>      if (userInfo[field] && userInfo[field] !== 'Guest User' && userInfo[field] !== 'guest@example.com') {

                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="mb-0">Notification Preferences</h5>        score += 20;        try {  });  });

                    {preferencesSaved && (

                      <Badge bg="success" className="pulse-animation">      }

                        <i className="fas fa-check me-1"></i>Saved

                      </Badge>    });          const userData = await authAPI.getProfile();

                    )}

                  </div>    

                  

                  <Form>    setProfileCompletion(score);          setAuthUser(userData);    

                    <div className="setting-group">

                      <h6>Email Notifications</h6>  };

                      {[

                        { key: 'emailNotifications', label: 'General email notifications', icon: '📧' },          setUserInfo(userData);

                        { key: 'portfolioUpdates', label: 'Portfolio updates', icon: '🎨' },

                        { key: 'systemUpdates', label: 'System updates', icon: '⚙️' },  const handleSettingChange = async (setting) => {

                        { key: 'marketingEmails', label: 'Marketing emails', icon: '📢' }

                      ].map(setting => (    const newSettings = {          setEditUserInfo(userData);  // Modal states  // Modal states

                        <Form.Check 

                          key={setting.key}      ...settings,

                          type="switch"

                          id={setting.key}      [setting]: !settings[setting]          setIsLoggedIn(true);

                          label={

                            <span>    };

                              <span className="me-2">{setting.icon}</span>

                              {setting.label}                const [showEditProfile, setShowEditProfile] = useState(false);  const [showEditProfile, setShowEditProfile] = useState(false);

                            </span>

                          }    setSettings(newSettings);

                          checked={settings[setting.key]}

                          onChange={() => handleSettingChange(setting.key)}    setPreferencesSaved(true);          // Load activity log

                          className="setting-switch"

                        />    

                      ))}

                    </div>    try {          const activity = await authAPI.getActivityLog();  const [showChangePassword, setShowChangePassword] = useState(false);  const [showChangePassword, setShowChangePassword] = useState(false);

                    

                    <div className="setting-group">      // Save to API if logged in

                      <h6>Appearance</h6>

                      <Form.Check       if (isLoggedIn) {          setActivityLog(activity || []);

                        type="switch"

                        id="darkMode"        await authAPI.updateSettings(newSettings);

                        label={

                          <span>      }            const [showDeleteAccount, setShowDeleteAccount] = useState(false);  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

                            <span className="me-2">🌙</span>

                            Dark mode      

                          </span>

                        }      // Always save to localStorage as backup        } catch (error) {

                        checked={settings.darkMode}

                        onChange={() => handleSettingChange('darkMode')}      localStorage.setItem('user_notification_settings', JSON.stringify(newSettings));

                        className="setting-switch"

                      />                console.error('Failed to load user data from API:', error);  const [editUserInfo, setEditUserInfo] = useState(userInfo);  const [editUserInfo, setEditUserInfo] = useState(userInfo);

                    </div>

                  </Form>      showNotification(

                </Card.Body>

              </Card>        `${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newSettings[setting] ? 'enabled' : 'disabled'}`,           // Fall back to localStorage

            </Tab>

        'success', 

            <Tab eventKey="activity" title="Activity">

              <Card className="account-card">        2000,           loadLocalData();    

                <Card.Body>

                  <h5 className="mb-3">Recent Activity</h5>        { icon: newSettings[setting] ? '✅' : '🔕' }

                  

                  <Table hover responsive>      );        }

                    <thead>

                      <tr>      

                        <th>Action</th>

                        <th>Date & Time</th>      setTimeout(() => setPreferencesSaved(false), 3000);      } else {  // Form states  // Form states

                        <th>Device</th>

                        <th>IP Address</th>    } catch (error) {

                      </tr>

                    </thead>      console.error('Failed to save settings:', error);        // Guest user - load from localStorage

                    <tbody>

                      {activityLog.map((activity, index) => (      showNotification('Failed to save settings', 'danger');

                        <tr key={index}>

                          <td>{activity.action}</td>    }        loadLocalData();  const [passwordForm, setPasswordForm] = useState({  const [passwordForm, setPasswordForm] = useState({

                          <td>{new Date(activity.timestamp).toLocaleString()}</td>

                          <td>{activity.device}</td>  };

                          <td>{activity.ip}</td>

                        </tr>      }

                      ))}

                    </tbody>  const saveProfile = async () => {

                  </Table>

                      try {          currentPassword: '',    currentPassword: '',

                  {activityLog.length === 0 && (

                    <div className="text-center text-muted py-4">      setUserInfo(editUserInfo);

                      <i className="fas fa-history fa-2x mb-2"></i>

                      <p>No recent activity</p>      setShowEditProfile(false);      calculateProfileCompletion();

                    </div>

                  )}      

                </Card.Body>

              </Card>      // Save to API if logged in    } catch (error) {    newPassword: '',    newPassword: '',

            </Tab>

      if (isLoggedIn) {

            <Tab eventKey="data" title="Data & Privacy">

              <Card className="account-card">        await authAPI.updateProfile(editUserInfo);      console.error('Error loading user data:', error);

                <Card.Body>

                  <h5 className="mb-3">Data Management</h5>      }

                  

                  <div className="data-section">            showNotification('Failed to load user data', 'danger');    confirmPassword: ''    confirmPassword: ''

                    <h6>Export Your Data</h6>

                    <p className="text-muted mb-3">      // Always save to localStorage as backup

                      Download a copy of all your data including profile information, 

                      settings, and activity history.      localStorage.setItem('user_profile_info', JSON.stringify(editUserInfo));    } finally {

                    </p>

                    <Button variant="outline-info" onClick={exportUserData}>      

                      <i className="fas fa-download me-1"></i>Export Data

                    </Button>      showNotification('Profile updated successfully!', 'success', 3000, { icon: '👤' });      setLoading(false);  });  });

                  </div>

                </Card.Body>      calculateProfileCompletion();

              </Card>

            </Tab>    } catch (error) {    }

          </Tabs>

      console.error('Error saving profile:', error);

          <Card className="account-card">

            <Card.Body>      showNotification('Failed to save profile', 'danger');  };  const [deleteConfirmation, setDeleteConfirmation] = useState('');  const [deleteConfirmation, setDeleteConfirmation] = useState('');

              <h5 className="mb-3">Quick Actions</h5>

              <div className="quick-actions">    }

                <Button variant="outline-primary" className="me-2 mb-2" onClick={testNotification}>

                  <i className="fas fa-bell me-1"></i>Test Notification  };

                </Button>

                <Button variant="outline-success" className="me-2 mb-2">

                  <i className="fas fa-share me-1"></i>Share Portfolio

                </Button>  const handlePasswordChange = async () => {  const loadLocalData = () => {    

                <Button variant="outline-info" className="me-2 mb-2">

                  <i className="fas fa-question-circle me-1"></i>Help & Support    if (passwordForm.newPassword !== passwordForm.confirmPassword) {

                </Button>

              </div>      showNotification('New passwords do not match', 'danger');    try {

            </Card.Body>

          </Card>      return;

        </Col>

      </Row>    }      // Load settings from localStorage  // UI states  // UI states



      <Modal show={showEditProfile} onHide={() => setShowEditProfile(false)} size="lg">    

        <Modal.Header closeButton>

          <Modal.Title>Edit Profile</Modal.Title>    if (passwordForm.newPassword.length < 6) {      const savedSettings = localStorage.getItem('user_notification_settings');

        </Modal.Header>

        <Modal.Body>      showNotification('Password must be at least 6 characters', 'danger');

          <Form>

            <Row>      return;      if (savedSettings) {  const [profileCompletion, setProfileCompletion] = useState(60);  const [profileCompletion, setProfileCompletion] = useState(60);

              <Col md={6}>

                <Form.Group className="mb-3">    }

                  <Form.Label>Name</Form.Label>

                  <Form.Control            setSettings({ ...settings, ...JSON.parse(savedSettings) });

                    type="text"

                    value={editUserInfo.name}    try {

                    onChange={(e) => setEditUserInfo({...editUserInfo, name: e.target.value})}

                  />      if (isLoggedIn) {      }  const [preferencesSaved, setPreferencesSaved] = useState(false);  const [preferencesSaved, setPreferencesSaved] = useState(false);

                </Form.Group>

              </Col>        await authAPI.changePassword(passwordForm.currentPassword, passwordForm.newPassword);

              <Col md={6}>

                <Form.Group className="mb-3">      }      

                  <Form.Label>Email</Form.Label>

                  <Form.Control      

                    type="email"

                    value={editUserInfo.email}      setShowChangePassword(false);      // Load user info from localStorage  const [activityLog, setActivityLog] = useState([]);  const [activityLog, setActivityLog] = useState([]);

                    onChange={(e) => setEditUserInfo({...editUserInfo, email: e.target.value})}

                  />      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

                </Form.Group>

              </Col>      showNotification('Password changed successfully!', 'success', 3000, { icon: '🔐' });      const savedUserInfo = localStorage.getItem('user_profile_info');

            </Row>

                } catch (error) {

            <Row>

              <Col md={6}>      console.error('Password change failed:', error);      if (savedUserInfo) {  const [securitySettings, setSecuritySettings] = useState({  const [securitySettings, setSecuritySettings] = useState({

                <Form.Group className="mb-3">

                  <Form.Label>Location</Form.Label>      showNotification('Failed to change password', 'danger');

                  <Form.Control

                    type="text"    }        const parsedUserInfo = JSON.parse(savedUserInfo);

                    value={editUserInfo.location || ''}

                    onChange={(e) => setEditUserInfo({...editUserInfo, location: e.target.value})}  };

                    placeholder="City, Country"

                  />        setUserInfo(parsedUserInfo);    twoFactorEnabled: false,    twoFactorEnabled: false,

                </Form.Group>

              </Col>  const handleDeleteAccount = async () => {

              <Col md={6}>

                <Form.Group className="mb-3">    if (deleteConfirmation !== 'DELETE') {        setEditUserInfo(parsedUserInfo);

                  <Form.Label>Website</Form.Label>

                  <Form.Control      showNotification('Please type DELETE to confirm', 'danger');

                    type="url"

                    value={editUserInfo.website || ''}      return;      }    loginNotifications: true,    loginNotifications: true,

                    onChange={(e) => setEditUserInfo({...editUserInfo, website: e.target.value})}

                    placeholder="https://yourwebsite.com"    }

                  />

                </Form.Group>          

              </Col>

            </Row>    try {

            

            <Form.Group className="mb-3">      if (isLoggedIn) {      // Load mock activity for guest users    sessionTimeout: '24h'    sessionTimeout: '24h'

              <Form.Label>Bio</Form.Label>

              <Form.Control        await authAPI.deleteAccount();

                as="textarea"

                rows={3}        localStorage.removeItem('auth_token');      const mockActivity = [

                value={editUserInfo.bio || ''}

                onChange={(e) => setEditUserInfo({...editUserInfo, bio: e.target.value})}        localStorage.removeItem('user_profile_info');

                placeholder="Tell us about yourself..."

              />        localStorage.removeItem('user_notification_settings');        {  });  });

            </Form.Group>

          </Form>      }

        </Modal.Body>

        <Modal.Footer>                id: 1,

          <Button variant="secondary" onClick={() => setShowEditProfile(false)}>

            Cancel      showNotification('Account deleted successfully', 'info', 3000, { icon: '👋' });

          </Button>

          <Button variant="primary" onClick={saveProfile}>      setTimeout(() => window.location.href = '/', 2000);          action: 'Visited Portfolio',

            Save Changes

          </Button>    } catch (error) {

        </Modal.Footer>

      </Modal>      console.error('Account deletion failed:', error);          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),

    </Container>

  );      showNotification('Failed to delete account', 'danger');

}

    }          ip: '192.168.1.1',  // Initialize component  // Initialize component

export default Account;
  };

          device: 'Desktop Browser'

  const exportUserData = () => {

    const userData = {        },  useEffect(() => {  useEffect(() => {

      profile: userInfo,

      settings: settings,        {

      activityLog: activityLog,

      exportDate: new Date().toISOString()          id: 2,    loadUserData();    loadUserData();

    };

              action: 'Viewed About Page',

    const dataStr = JSON.stringify(userData, null, 2);

    const dataBlob = new Blob([dataStr], { type: 'application/json' });          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),  }, []);  }, []);

    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');          ip: '192.168.1.1',

    link.href = url;

    link.download = `colin-nebula-portfolio-data-${new Date().toISOString().split('T')[0]}.json`;          device: 'Desktop Browser'

    link.click();

            }

    showNotification('User data exported successfully!', 'success', 3000, { icon: '📥' });

  };      ];  const loadUserData = async () => {  const loadUserData = async () => {



  const handleImageUpload = (event) => {      setActivityLog(mockActivity);

    const file = event.target.files[0];

    if (file) {          try {    try {

      if (file.size > 5 * 1024 * 1024) {

        showNotification('Image size should be less than 5MB', 'warning');    } catch (error) {

        return;

      }      console.error('Error loading local data:', error);      setLoading(true);      setLoading(true);



      if (!file.type.startsWith('image/')) {    }

        showNotification('Please select a valid image file', 'warning');

        return;  };      const token = localStorage.getItem('auth_token');      const token = localStorage.getItem('auth_token');

      }



      const reader = new FileReader();

      reader.onload = (e) => {  const calculateProfileCompletion = () => {            

        setEditUserInfo({...editUserInfo, avatar: e.target.result});

        showNotification('Image uploaded successfully!', 'success', 2000, { icon: '📸' });    let score = 0;

      };

      reader.readAsDataURL(file);    const fields = ['name', 'email', 'bio', 'avatar', 'location'];      if (token) {      if (token) {

    }

  };    



  const testNotification = () => {    fields.forEach(field => {        // User is logged in - load from API        // User is logged in - load from API

    showNotification('This is a test notification!', 'info');

          if (userInfo[field] && userInfo[field] !== 'Guest User' && userInfo[field] !== 'guest@example.com') {

    if (settings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {

      new Notification('Colin Nebula Portfolio', {        score += 20;        try {        try {

        body: 'This is a test browser notification',

        icon: '/favicon.ico'      }

      });

    }    });          const userData = await authAPI.getProfile();          const userData = await authAPI.getProfile();

  };

    

  const getAccountTypeBadge = (type) => {

    const badges = {    setProfileCompletion(score);          setAuthUser(userData);          setAuthUser(userData);

      'guest': { variant: 'secondary', icon: '👤', text: 'Guest' },

      'user': { variant: 'primary', icon: '👤', text: 'User' },  };

      'premium': { variant: 'warning', icon: '⭐', text: 'Premium' },

      'admin': { variant: 'danger', icon: '👑', text: 'Admin' }          setUserInfo(userData);          setUserInfo(userData);

    };

      const handleSettingChange = async (setting) => {

    const badge = badges[type] || badges.guest;

    return (    const newSettings = {          setEditUserInfo(userData);          setEditUserInfo(userData);

      <Badge bg={badge.variant} className="account-type-badge">

        <span className="me-1">{badge.icon}</span>      ...settings,

        {badge.text}

      </Badge>      [setting]: !settings[setting]          setIsLoggedIn(true);          setIsLoggedIn(true);

    );

  };    };



  if (loading) {                        

    return (

      <Container fluid className="account-container py-4 text-center">    setSettings(newSettings);

        <div className="loading-spinner">

          <div className="spinner-border" role="status">    setPreferencesSaved(true);          // Load activity log          // Load activity log

            <span className="visually-hidden">Loading...</span>

          </div>    

          <p className="mt-3">Loading your account...</p>

        </div>    try {          const activity = await authAPI.getActivityLog();          const activity = await authAPI.getActivityLog();

      </Container>

    );      // Save to API if logged in

  }

      if (isLoggedIn) {          setActivityLog(activity || []);          setActivityLog(activity || []);

  return (

    <Container fluid className="account-container py-4">        await authAPI.updateSettings(newSettings);

      <Row className="justify-content-center">

        <Col lg={10} xl={8}>      }                    

          <div className="account-header mb-4">

            <div className="d-flex align-items-center mb-3">      

              <div className="account-avatar me-3">

                {userInfo.avatar ? (      // Always save to localStorage as backup        } catch (error) {        } catch (error) {

                  <img src={userInfo.avatar} alt="Avatar" className="rounded-circle" width="60" height="60" />

                ) : (      localStorage.setItem('user_notification_settings', JSON.stringify(newSettings));

                  <div className="avatar-placeholder rounded-circle">

                    <i className="fas fa-user fa-2x"></i>                console.error('Failed to load user data from API:', error);          console.error('Failed to load user data from API:', error);

                  </div>

                )}      showNotification(

              </div>

              <div>        `${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newSettings[setting] ? 'enabled' : 'disabled'}`,           // Fall back to localStorage          // Fall back to localStorage

                <h2 className="mb-1">

                  {userInfo.name}        'success', 

                  <span className="ms-2">{getAccountTypeBadge(userInfo.accountType)}</span>

                </h2>        2000,           loadLocalData();          loadLocalData();

                <p className="text-muted mb-0">{userInfo.email}</p>

                <small className="text-muted">Member since: {userInfo.memberSince}</small>        { icon: newSettings[setting] ? '✅' : '🔕' }

              </div>

            </div>      );        }        }

            

            <div className="profile-completion mb-3">      

              <div className="d-flex justify-content-between align-items-center mb-2">

                <span>Profile Completion</span>      setTimeout(() => setPreferencesSaved(false), 3000);      } else {      } else {

                <span>{profileCompletion}%</span>

              </div>    } catch (error) {

              <ProgressBar now={profileCompletion} variant="success" />

            </div>      console.error('Failed to save settings:', error);        // Guest user - load from localStorage        // Guest user - load from localStorage

          </div>

      showNotification('Failed to save settings', 'danger');

          <Tabs

            activeKey={activeTab}    }        loadLocalData();        loadLocalData();

            onSelect={(tab) => setActiveTab(tab)}

            className="account-tabs mb-4"  };

          >

            <Tab eventKey="profile" title="Profile">      }      }

              <Card className="account-card">

                <Card.Body>  const saveProfile = async () => {

                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="mb-0">Profile Information</h5>    try {            

                    <Button variant="outline-primary" onClick={() => setShowEditProfile(true)}>

                      <i className="fas fa-edit me-1"></i>Edit Profile      setUserInfo(editUserInfo);

                    </Button>

                  </div>      setShowEditProfile(false);      calculateProfileCompletion();      calculateProfileCompletion();

                  

                  <Row>      

                    <Col md={6}>

                      <div className="info-item">      // Save to API if logged in    } catch (error) {    } catch (error) {

                        <strong>Name:</strong> {userInfo.name}

                      </div>      if (isLoggedIn) {

                      <div className="info-item">

                        <strong>Email:</strong> {userInfo.email}        await authAPI.updateProfile(editUserInfo);      console.error('Error loading user data:', error);      console.error('Error loading user data:', error);

                      </div>

                      <div className="info-item">      }

                        <strong>Location:</strong> {userInfo.location || 'Not specified'}

                      </div>            showNotification('Failed to load user data', 'danger');      showNotification('Failed to load user data', 'danger');

                    </Col>

                    <Col md={6}>      // Always save to localStorage as backup

                      <div className="info-item">

                        <strong>Website:</strong> {userInfo.website || 'Not specified'}      localStorage.setItem('user_profile_info', JSON.stringify(editUserInfo));    } finally {    } finally {

                      </div>

                      <div className="info-item">      

                        <strong>Member Since:</strong> {userInfo.memberSince}

                      </div>      showNotification('Profile updated successfully!', 'success', 3000, { icon: '👤' });      setLoading(false);      setLoading(false);

                      <div className="info-item">

                        <strong>Account Type:</strong> {getAccountTypeBadge(userInfo.accountType)}      calculateProfileCompletion();

                      </div>

                    </Col>    } catch (error) {    }    }

                  </Row>

                        console.error('Error saving profile:', error);

                  {userInfo.bio && (

                    <div className="mt-3">      showNotification('Failed to save profile', 'danger');  };  };

                      <strong>Bio:</strong>

                      <p className="mt-1">{userInfo.bio}</p>    }

                    </div>

                  )}  };

                </Card.Body>

              </Card>

            </Tab>

  const handlePasswordChange = async () => {  const loadLocalData = () => {  const loadLocalData = () => {

            <Tab eventKey="settings" title="Settings">

              <Card className="account-card">    if (passwordForm.newPassword !== passwordForm.confirmPassword) {

                <Card.Body>

                  <div className="d-flex justify-content-between align-items-center mb-3">      showNotification('New passwords do not match', 'danger');    try {    try {

                    <h5 className="mb-0">Notification Preferences</h5>

                    {preferencesSaved && (      return;

                      <Badge bg="success" className="pulse-animation">

                        <i className="fas fa-check me-1"></i>Saved    }      // Load settings from localStorage      // Load settings from localStorage

                      </Badge>

                    )}    

                  </div>

                      if (passwordForm.newPassword.length < 6) {      const savedSettings = localStorage.getItem('user_notification_settings');      const savedSettings = localStorage.getItem('user_notification_settings');

                  <Form>

                    <div className="setting-group">      showNotification('Password must be at least 6 characters', 'danger');

                      <h6>Email Notifications</h6>

                      {[      return;      if (savedSettings) {      if (savedSettings) {

                        { key: 'emailNotifications', label: 'General email notifications', icon: '📧' },

                        { key: 'portfolioUpdates', label: 'Portfolio updates', icon: '🎨' },    }

                        { key: 'systemUpdates', label: 'System updates', icon: '⚙️' },

                        { key: 'marketingEmails', label: 'Marketing emails', icon: '📢' }            setSettings({ ...settings, ...JSON.parse(savedSettings) });        setSettings({ ...settings, ...JSON.parse(savedSettings) });

                      ].map(setting => (

                        <Form.Check     try {

                          key={setting.key}

                          type="switch"      if (isLoggedIn) {      }      }

                          id={setting.key}

                          label={        await authAPI.changePassword(passwordForm.currentPassword, passwordForm.newPassword);

                            <span>

                              <span className="me-2">{setting.icon}</span>      }            

                              {setting.label}

                            </span>      

                          }

                          checked={settings[setting.key]}      setShowChangePassword(false);      // Load user info from localStorage      // Load user info from localStorage

                          onChange={() => handleSettingChange(setting.key)}

                          className="setting-switch"      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

                        />

                      ))}      showNotification('Password changed successfully!', 'success', 3000, { icon: '🔐' });      const savedUserInfo = localStorage.getItem('user_profile_info');      const savedUserInfo = localStorage.getItem('user_profile_info');

                    </div>

                        } catch (error) {

                    <div className="setting-group">

                      <h6>Appearance</h6>      console.error('Password change failed:', error);      if (savedUserInfo) {      if (savedUserInfo) {

                      <Form.Check 

                        type="switch"      showNotification('Failed to change password', 'danger');

                        id="darkMode"

                        label={    }        const parsedUserInfo = JSON.parse(savedUserInfo);        const parsedUserInfo = JSON.parse(savedUserInfo);

                          <span>

                            <span className="me-2">🌙</span>  };

                            Dark mode

                          </span>        setUserInfo(parsedUserInfo);        setUserInfo(parsedUserInfo);

                        }

                        checked={settings.darkMode}  const handleDeleteAccount = async () => {

                        onChange={() => handleSettingChange('darkMode')}

                        className="setting-switch"    if (deleteConfirmation !== 'DELETE') {        setEditUserInfo(parsedUserInfo);        setEditUserInfo(parsedUserInfo);

                      />

                    </div>      showNotification('Please type DELETE to confirm', 'danger');

                  </Form>

                </Card.Body>      return;      }      }

              </Card>

            </Tab>    }



            <Tab eventKey="security" title="Security">                

              <Card className="account-card">

                <Card.Body>    try {

                  <h5 className="mb-3">Security Settings</h5>

                        if (isLoggedIn) {      // Load mock activity for guest users      // Load mock activity for guest users

                  <div className="security-section">

                    <h6>Password & Authentication</h6>        await authAPI.deleteAccount();

                    <div className="d-flex justify-content-between align-items-center mb-3">

                      <div>        localStorage.removeItem('auth_token');      const mockActivity = [      const mockActivity = [

                        <div>Password</div>

                        <small className="text-muted">Last changed 30 days ago</small>        localStorage.removeItem('user_profile_info');

                      </div>

                      <Button         localStorage.removeItem('user_notification_settings');        {        {

                        variant="outline-primary" 

                        onClick={() => setShowChangePassword(true)}      }

                        disabled={!isLoggedIn}

                      >                id: 1,          id: 1,

                        Change Password

                      </Button>      showNotification('Account deleted successfully', 'info', 3000, { icon: '👋' });

                    </div>

                          setTimeout(() => window.location.href = '/', 2000);          action: 'Visited Portfolio',          action: 'Visited Portfolio',

                    <div className="d-flex justify-content-between align-items-center mb-3">

                      <div>    } catch (error) {

                        <div>Two-Factor Authentication</div>

                        <small className="text-muted">Add an extra layer of security</small>      console.error('Account deletion failed:', error);          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),

                      </div>

                      <Form.Check       showNotification('Failed to delete account', 'danger');

                        type="switch"

                        id="twoFactorEnabled"    }          ip: '192.168.1.1',          ip: '192.168.1.1',

                        checked={securitySettings.twoFactorEnabled}

                        onChange={() => setSecuritySettings(prev => ({   };

                          ...prev, 

                          twoFactorEnabled: !prev.twoFactorEnabled           device: 'Desktop Browser'          device: 'Desktop Browser'

                        }))}

                        disabled={!isLoggedIn}  const exportUserData = () => {

                      />

                    </div>    const userData = {        },        },

                  </div>

                </Card.Body>      profile: userInfo,

              </Card>

            </Tab>      settings: settings,        {        {



            <Tab eventKey="activity" title="Activity">      activityLog: activityLog,

              <Card className="account-card">

                <Card.Body>      exportDate: new Date().toISOString()          id: 2,          id: 2,

                  <h5 className="mb-3">Recent Activity</h5>

                      };

                  <Table hover responsive>

                    <thead>              action: 'Viewed About Page',          action: 'Viewed About Page',

                      <tr>

                        <th>Action</th>    const dataStr = JSON.stringify(userData, null, 2);

                        <th>Date & Time</th>

                        <th>Device</th>    const dataBlob = new Blob([dataStr], { type: 'application/json' });          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),

                        <th>IP Address</th>

                      </tr>    const url = URL.createObjectURL(dataBlob);

                    </thead>

                    <tbody>    const link = document.createElement('a');          ip: '192.168.1.1',          ip: '192.168.1.1',

                      {activityLog.map((activity, index) => (

                        <tr key={index}>    link.href = url;

                          <td>{activity.action}</td>

                          <td>{new Date(activity.timestamp).toLocaleString()}</td>    link.download = `colin-nebula-portfolio-data-${new Date().toISOString().split('T')[0]}.json`;          device: 'Desktop Browser'          device: 'Desktop Browser'

                          <td>{activity.device}</td>

                          <td>{activity.ip}</td>    link.click();

                        </tr>

                      ))}            }        }

                    </tbody>

                  </Table>    showNotification('User data exported successfully!', 'success', 3000, { icon: '📥' });

                  

                  {activityLog.length === 0 && (  };      ];      ];

                    <div className="text-center text-muted py-4">

                      <i className="fas fa-history fa-2x mb-2"></i>

                      <p>No recent activity</p>

                    </div>  const handleImageUpload = (event) => {      setActivityLog(mockActivity);      setActivityLog(mockActivity);

                  )}

                </Card.Body>    const file = event.target.files[0];

              </Card>

            </Tab>    if (file) {            



            <Tab eventKey="data" title="Data & Privacy">      if (file.size > 5 * 1024 * 1024) {

              <Card className="account-card">

                <Card.Body>        showNotification('Image size should be less than 5MB', 'warning');    } catch (error) {    } catch (error) {

                  <h5 className="mb-3">Data Management</h5>

                          return;

                  <div className="data-section">

                    <h6>Export Your Data</h6>      }      console.error('Error loading local data:', error);      console.error('Error loading local data:', error);

                    <p className="text-muted mb-3">

                      Download a copy of all your data including profile information, 

                      settings, and activity history.

                    </p>      if (!file.type.startsWith('image/')) {    }    }

                    <Button variant="outline-info" onClick={exportUserData}>

                      <i className="fas fa-download me-1"></i>Export Data        showNotification('Please select a valid image file', 'warning');

                    </Button>

                  </div>        return;  };  };

                  

                  <div className="data-section">      }

                    <h6>Account Deletion</h6>

                    <p className="text-muted mb-3">

                      Permanently delete your account and all associated data. 

                      This action cannot be undone.      const reader = new FileReader();

                    </p>

                    <Button       reader.onload = (e) => {  const calculateProfileCompletion = () => {  const calculateProfileCompletion = () => {

                      variant="outline-danger" 

                      onClick={() => setShowDeleteAccount(true)}        setEditUserInfo({...editUserInfo, avatar: e.target.result});

                      disabled={!isLoggedIn}

                    >        showNotification('Image uploaded successfully!', 'success', 2000, { icon: '📸' });    let score = 0;    let score = 0;

                      <i className="fas fa-trash me-1"></i>Delete Account

                    </Button>      };

                  </div>

                </Card.Body>      reader.readAsDataURL(file);    const fields = ['name', 'email', 'bio', 'avatar', 'location'];    const fields = ['name', 'email', 'bio', 'avatar', 'location'];

              </Card>

            </Tab>    }

          </Tabs>

  };        

          {/* Quick Actions */}

          <Card className="account-card">

            <Card.Body>

              <h5 className="mb-3">Quick Actions</h5>  const requestBrowserNotifications = async () => {    fields.forEach(field => {    fields.forEach(field => {

              <div className="quick-actions">

                <Button variant="outline-primary" className="me-2 mb-2" onClick={testNotification}>    if ('Notification' in window) {

                  <i className="fas fa-bell me-1"></i>Test Notification

                </Button>      const permission = await Notification.requestPermission();      if (userInfo[field] && userInfo[field] !== 'Guest User' && userInfo[field] !== 'guest@example.com') {      if (userInfo[field] && userInfo[field] !== 'Guest User' && userInfo[field] !== 'guest@example.com') {

                <Button variant="outline-success" className="me-2 mb-2">

                  <i className="fas fa-share me-1"></i>Share Portfolio      if (permission === 'granted') {

                </Button>

                <Button variant="outline-info" className="me-2 mb-2">        setSettings(prev => ({ ...prev, browserNotifications: true }));        score += 20;        score += 20;

                  <i className="fas fa-question-circle me-1"></i>Help & Support

                </Button>        showNotification('Browser notifications enabled', 'success');

                <Button variant="outline-warning" className="me-2 mb-2">

                  <i className="fas fa-bug me-1"></i>Report Issue      } else {      }      }

                </Button>

              </div>        showNotification('Browser notifications denied', 'warning');

            </Card.Body>

          </Card>      }    });    });

        </Col>

      </Row>    } else {



      {/* Edit Profile Modal */}      showNotification('Browser notifications not supported', 'warning');        

      <Modal show={showEditProfile} onHide={() => setShowEditProfile(false)} size="lg">

        <Modal.Header closeButton>    }

          <Modal.Title>Edit Profile</Modal.Title>

        </Modal.Header>  };    setProfileCompletion(score);    setProfileCompletion(score);

        <Modal.Body>

          <Form>

            <Row>

              <Col md={12} className="text-center mb-3">  const testNotification = () => {  };  };

                <div className="avatar-upload">

                  {editUserInfo.avatar ? (    showNotification('This is a test notification!', 'info');

                    <img 

                      src={editUserInfo.avatar}     

                      alt="Avatar" 

                      className="rounded-circle mb-2"     if (settings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {

                      width="100" 

                      height="100"       new Notification('Colin Nebula Portfolio', {  const handleSettingChange = async (setting) => {  const handleSettingChange = async (setting) => {

                    />

                  ) : (        body: 'This is a test browser notification',

                    <div className="avatar-placeholder-large rounded-circle mb-2">

                      <i className="fas fa-user fa-3x"></i>        icon: '/favicon.ico'    const newSettings = {    const newSettings = {

                    </div>

                  )}      });

                  <div>

                    <input     }      ...settings,      ...settings,

                      type="file" 

                      accept="image/*"   };

                      onChange={handleImageUpload}

                      className="d-none"      [setting]: !settings[setting]      [setting]: !settings[setting]

                      id="avatar-upload"

                    />  const getAccountTypeBadge = (type) => {

                    <label htmlFor="avatar-upload" className="btn btn-sm btn-outline-primary me-2">

                      Upload Photo    const badges = {    };    };

                    </label>

                    {editUserInfo.avatar && (      'guest': { variant: 'secondary', icon: '👤', text: 'Guest' },

                      <Button 

                        variant="outline-danger"       'user': { variant: 'primary', icon: '👤', text: 'User' },        

                        size="sm"

                        onClick={() => setEditUserInfo({...editUserInfo, avatar: null})}      'premium': { variant: 'warning', icon: '⭐', text: 'Premium' },

                      >

                        Remove      'admin': { variant: 'danger', icon: '👑', text: 'Admin' }    setSettings(newSettings);    setSettings(newSettings);

                      </Button>

                    )}    };

                  </div>

                </div>        setPreferencesSaved(true);    setPreferencesSaved(true);

              </Col>

            </Row>    const badge = badges[type] || badges.guest;

            

            <Row>    return (        

              <Col md={6}>

                <Form.Group className="mb-3">      <Badge bg={badge.variant} className="account-type-badge">

                  <Form.Label>Name</Form.Label>

                  <Form.Control        <span className="me-1">{badge.icon}</span>    try {    try {

                    type="text"

                    value={editUserInfo.name}        {badge.text}

                    onChange={(e) => setEditUserInfo({...editUserInfo, name: e.target.value})}

                  />      </Badge>      // Save to API if logged in      // Save to API if logged in

                </Form.Group>

              </Col>    );

              <Col md={6}>

                <Form.Group className="mb-3">  };      if (isLoggedIn) {      if (isLoggedIn) {

                  <Form.Label>Email</Form.Label>

                  <Form.Control

                    type="email"

                    value={editUserInfo.email}  if (loading) {        await authAPI.updateSettings(newSettings);        await authAPI.updateSettings(newSettings);

                    onChange={(e) => setEditUserInfo({...editUserInfo, email: e.target.value})}

                  />    return (

                </Form.Group>

              </Col>      <Container fluid className="account-container py-4 text-center">      }      }

            </Row>

                    <div className="loading-spinner">

            <Row>

              <Col md={6}>          <div className="spinner-border" role="status">            

                <Form.Group className="mb-3">

                  <Form.Label>Location</Form.Label>            <span className="visually-hidden">Loading...</span>

                  <Form.Control

                    type="text"          </div>      // Always save to localStorage as backup      // Always save to localStorage as backup

                    value={editUserInfo.location || ''}

                    onChange={(e) => setEditUserInfo({...editUserInfo, location: e.target.value})}          <p className="mt-3">Loading your account...</p>

                    placeholder="City, Country"

                  />        </div>      localStorage.setItem('user_notification_settings', JSON.stringify(newSettings));      localStorage.setItem('user_notification_settings', JSON.stringify(newSettings));

                </Form.Group>

              </Col>      </Container>

              <Col md={6}>

                <Form.Group className="mb-3">    );            

                  <Form.Label>Website</Form.Label>

                  <Form.Control  }

                    type="url"

                    value={editUserInfo.website || ''}      showNotification(      showNotification(

                    onChange={(e) => setEditUserInfo({...editUserInfo, website: e.target.value})}

                    placeholder="https://yourwebsite.com"  return (

                  />

                </Form.Group>    <Container fluid className="account-container py-4">        `${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newSettings[setting] ? 'enabled' : 'disabled'}`,         `${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newSettings[setting] ? 'enabled' : 'disabled'}`, 

              </Col>

            </Row>      <Row className="justify-content-center">

            

            <Form.Group className="mb-3">        <Col lg={10} xl={8}>        'success',         'success', 

              <Form.Label>Bio</Form.Label>

              <Form.Control          <div className="account-header mb-4">

                as="textarea"

                rows={3}            <div className="d-flex align-items-center mb-3">        2000,         2000, 

                value={editUserInfo.bio || ''}

                onChange={(e) => setEditUserInfo({...editUserInfo, bio: e.target.value})}              <div className="account-avatar me-3">

                placeholder="Tell us about yourself..."

              />                {userInfo.avatar ? (        { icon: newSettings[setting] ? '✅' : '🔕' }        { icon: newSettings[setting] ? '✅' : '🔕' }

            </Form.Group>

          </Form>                  <img src={userInfo.avatar} alt="Avatar" className="rounded-circle" width="60" height="60" />

        </Modal.Body>

        <Modal.Footer>                ) : (      );      );

          <Button variant="secondary" onClick={() => setShowEditProfile(false)}>

            Cancel                  <div className="avatar-placeholder rounded-circle">

          </Button>

          <Button variant="primary" onClick={saveProfile}>                    <i className="fas fa-user fa-2x"></i>            

            Save Changes

          </Button>                  </div>

        </Modal.Footer>

      </Modal>                )}      setTimeout(() => setPreferencesSaved(false), 3000);      setTimeout(() => setPreferencesSaved(false), 3000);



      {/* Change Password Modal */}              </div>

      <Modal show={showChangePassword} onHide={() => setShowChangePassword(false)}>

        <Modal.Header closeButton>              <div>    } catch (error) {    } catch (error) {

          <Modal.Title>Change Password</Modal.Title>

        </Modal.Header>                <h2 className="mb-1">

        <Modal.Body>

          <Form>                  {userInfo.name}      console.error('Failed to save settings:', error);      console.error('Failed to save settings:', error);

            <Form.Group className="mb-3">

              <Form.Label>Current Password</Form.Label>                  <span className="ms-2">{getAccountTypeBadge(userInfo.accountType)}</span>

              <Form.Control

                type="password"                </h2>      showNotification('Failed to save settings', 'danger');      showNotification('Failed to save settings', 'danger');

                value={passwordForm.currentPassword}

                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}                <p className="text-muted mb-0">{userInfo.email}</p>

              />

            </Form.Group>                <small className="text-muted">Member since: {userInfo.memberSince}</small>    }    }

            <Form.Group className="mb-3">

              <Form.Label>New Password</Form.Label>              </div>

              <Form.Control

                type="password"            </div>  };  };

                value={passwordForm.newPassword}

                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}            

              />

            </Form.Group>            <div className="profile-completion mb-3">

            <Form.Group className="mb-3">

              <Form.Label>Confirm New Password</Form.Label>              <div className="d-flex justify-content-between align-items-center mb-2">

              <Form.Control

                type="password"                <span>Profile Completion</span>  const saveProfile = async () => {  const saveProfile = async () => {

                value={passwordForm.confirmPassword}

                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}                <span>{profileCompletion}%</span>

              />

            </Form.Group>              </div>    try {    try {

          </Form>

        </Modal.Body>              <ProgressBar now={profileCompletion} variant="success" />

        <Modal.Footer>

          <Button variant="secondary" onClick={() => setShowChangePassword(false)}>            </div>      setUserInfo(editUserInfo);      setUserInfo(editUserInfo);

            Cancel

          </Button>          </div>

          <Button variant="primary" onClick={handlePasswordChange}>

            Change Password      setShowEditProfile(false);      setShowEditProfile(false);

          </Button>

        </Modal.Footer>          <Tabs

      </Modal>

            activeKey={activeTab}            

      {/* Delete Account Modal */}

      <Modal show={showDeleteAccount} onHide={() => setShowDeleteAccount(false)}>            onSelect={(tab) => setActiveTab(tab)}

        <Modal.Header closeButton>

          <Modal.Title className="text-danger">Delete Account</Modal.Title>            className="account-tabs mb-4"      // Save to API if logged in      // Save to API if logged in

        </Modal.Header>

        <Modal.Body>          >

          <Alert variant="danger">

            <i className="fas fa-exclamation-triangle me-2"></i>            <Tab eventKey="profile" title="Profile">      if (isLoggedIn) {      if (isLoggedIn) {

            <strong>Warning:</strong> This action is permanent and cannot be undone. 

            All your data will be permanently deleted.              <Card className="account-card">

          </Alert>

          <p>To confirm account deletion, please type <strong>DELETE</strong> below:</p>                <Card.Body>        await authAPI.updateProfile(editUserInfo);        await authAPI.updateProfile(editUserInfo);

          <Form.Control

            type="text"                  <div className="d-flex justify-content-between align-items-center mb-3">

            value={deleteConfirmation}

            onChange={(e) => setDeleteConfirmation(e.target.value)}                    <h5 className="mb-0">Profile Information</h5>      }      }

            placeholder="Type DELETE to confirm"

          />                    <Button variant="outline-primary" onClick={() => setShowEditProfile(true)}>

        </Modal.Body>

        <Modal.Footer>                      <i className="fas fa-edit me-1"></i>Edit Profile            

          <Button variant="secondary" onClick={() => setShowDeleteAccount(false)}>

            Cancel                    </Button>

          </Button>

          <Button                   </div>      // Always save to localStorage as backup      // Always save to localStorage as backup

            variant="danger" 

            onClick={handleDeleteAccount}                  

            disabled={deleteConfirmation !== 'DELETE'}

          >                  <Row>      localStorage.setItem('user_profile_info', JSON.stringify(editUserInfo));      localStorage.setItem('user_profile_info', JSON.stringify(editUserInfo));

            Delete Account

          </Button>                    <Col md={6}>

        </Modal.Footer>

      </Modal>                      <div className="info-item">            

    </Container>

  );                        <strong>Name:</strong> {userInfo.name}

}

                      </div>      showNotification('Profile updated successfully!', 'success', 3000, { icon: '👤' });      showNotification('Profile updated successfully!', 'success', 3000, { icon: '👤' });

export default Account;
                      <div className="info-item">

                        <strong>Email:</strong> {userInfo.email}      calculateProfileCompletion();      calculateProfileCompletion();

                      </div>

                      <div className="info-item">    } catch (error) {    } catch (error) {

                        <strong>Location:</strong> {userInfo.location || 'Not specified'}

                      </div>      console.error('Error saving profile:', error);      console.error('Error saving profile:', error);

                    </Col>

                    <Col md={6}>      showNotification('Failed to save profile', 'danger');      showNotification('Failed to save profile', 'danger');

                      <div className="info-item">

                        <strong>Website:</strong> {userInfo.website || 'Not specified'}    }    }

                      </div>

                      <div className="info-item">  };  };

                        <strong>Member Since:</strong> {userInfo.memberSince}

                      </div>

                      <div className="info-item">

                        <strong>Account Type:</strong> {getAccountTypeBadge(userInfo.accountType)}  const handlePasswordChange = async () => {  const handlePasswordChange = async () => {

                      </div>

                    </Col>    if (passwordForm.newPassword !== passwordForm.confirmPassword) {    if (passwordForm.newPassword !== passwordForm.confirmPassword) {

                  </Row>

                        showNotification('New passwords do not match', 'danger');      showNotification('New passwords do not match', 'danger');

                  {userInfo.bio && (

                    <div className="mt-3">      return;      return;

                      <strong>Bio:</strong>

                      <p className="mt-1">{userInfo.bio}</p>    }    }

                    </div>

                  )}        

                </Card.Body>

              </Card>    if (passwordForm.newPassword.length < 6) {    if (passwordForm.newPassword.length < 6) {

            </Tab>

      showNotification('Password must be at least 6 characters', 'danger');      showNotification('Password must be at least 6 characters', 'danger');

            <Tab eventKey="settings" title="Settings">

              <Card className="account-card">      return;      return;

                <Card.Body>

                  <div className="d-flex justify-content-between align-items-center mb-3">    }    }

                    <h5 className="mb-0">Notification Preferences</h5>

                    {preferencesSaved && (        

                      <Badge bg="success" className="pulse-animation">

                        <i className="fas fa-check me-1"></i>Saved    try {    try {

                      </Badge>

                    )}      if (isLoggedIn) {      if (isLoggedIn) {

                  </div>

                          await authAPI.changePassword(passwordForm.currentPassword, passwordForm.newPassword);        await authAPI.changePassword(passwordForm.currentPassword, passwordForm.newPassword);

                  <Form>

                    <div className="setting-group">      }      }

                      <h6>Email Notifications</h6>

                      {[            

                        { key: 'emailNotifications', label: 'General email notifications', icon: '📧' },

                        { key: 'portfolioUpdates', label: 'Portfolio updates', icon: '🎨' },      setShowChangePassword(false);      setShowChangePassword(false);

                        { key: 'systemUpdates', label: 'System updates', icon: '⚙️' },

                        { key: 'marketingEmails', label: 'Marketing emails', icon: '📢' }      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

                      ].map(setting => (

                        <Form.Check       showNotification('Password changed successfully!', 'success', 3000, { icon: '🔐' });      showNotification('Password changed successfully!', 'success', 3000, { icon: '🔐' });

                          key={setting.key}

                          type="switch"    } catch (error) {    } catch (error) {

                          id={setting.key}

                          label={      console.error('Password change failed:', error);      console.error('Password change failed:', error);

                            <span>

                              <span className="me-2">{setting.icon}</span>      showNotification('Failed to change password', 'danger');      showNotification('Failed to change password', 'danger');

                              {setting.label}

                            </span>    }    }

                          }

                          checked={settings[setting.key]}  };  };

                          onChange={() => handleSettingChange(setting.key)}

                          className="setting-switch"

                        />

                      ))}  const handleDeleteAccount = async () => {  const handleDeleteAccount = async () => {

                    </div>

                        if (deleteConfirmation !== 'DELETE') {    if (deleteConfirmation !== 'DELETE') {

                    <div className="setting-group">

                      <h6>Browser Notifications</h6>      showNotification('Please type DELETE to confirm', 'danger');      showNotification('Please type DELETE to confirm', 'danger');

                      <Form.Check 

                        type="switch"      return;      return;

                        id="browserNotifications"

                        label={    }    }

                          <span>

                            <span className="me-2">🔔</span>        

                            Browser notifications

                          </span>    try {    try {

                        }

                        checked={settings.browserNotifications}      if (isLoggedIn) {      if (isLoggedIn) {

                        onChange={() => {

                          if (!settings.browserNotifications) {        await authAPI.deleteAccount();        await authAPI.deleteAccount();

                            requestBrowserNotifications();

                          } else {        localStorage.removeItem('auth_token');        localStorage.removeItem('auth_token');

                            handleSettingChange('browserNotifications');

                          }        localStorage.removeItem('user_profile_info');        localStorage.removeItem('user_profile_info');

                        }}

                        className="setting-switch"        localStorage.removeItem('user_notification_settings');        localStorage.removeItem('user_notification_settings');

                      />

                    </div>      }      }

                    

                    <div className="setting-group">            

                      <h6>Appearance</h6>

                      <Form.Check       showNotification('Account deleted successfully', 'info', 3000, { icon: '👋' });      showNotification('Account deleted successfully', 'info', 3000, { icon: '👋' });

                        type="switch"

                        id="darkMode"      setTimeout(() => window.location.href = '/', 2000);      setTimeout(() => window.location.href = '/', 2000);

                        label={

                          <span>    } catch (error) {    } catch (error) {

                            <span className="me-2">🌙</span>

                            Dark mode      console.error('Account deletion failed:', error);      console.error('Account deletion failed:', error);

                          </span>

                        }      showNotification('Failed to delete account', 'danger');      showNotification('Failed to delete account', 'danger');

                        checked={settings.darkMode}

                        onChange={() => handleSettingChange('darkMode')}    }    }

                        className="setting-switch"

                      />  };  };

                    </div>

                  </Form>

                </Card.Body>

              </Card>  const exportUserData = () => {  const exportUserData = () => {

            </Tab>

    const userData = {    const userData = {

            <Tab eventKey="security" title="Security">

              <Card className="account-card">      profile: userInfo,      profile: userInfo,

                <Card.Body>

                  <h5 className="mb-3">Security Settings</h5>      settings: settings,      settings: settings,

                  

                  <div className="security-section">      activityLog: activityLog,      activityLog: activityLog,

                    <h6>Password & Authentication</h6>

                    <div className="d-flex justify-content-between align-items-center mb-3">      exportDate: new Date().toISOString()      exportDate: new Date().toISOString()

                      <div>

                        <div>Password</div>    };    };

                        <small className="text-muted">Last changed 30 days ago</small>

                      </div>        

                      <Button 

                        variant="outline-primary"     const dataStr = JSON.stringify(userData, null, 2);    const dataStr = JSON.stringify(userData, null, 2);

                        onClick={() => setShowChangePassword(true)}

                        disabled={!isLoggedIn}    const dataBlob = new Blob([dataStr], { type: 'application/json' });    const dataBlob = new Blob([dataStr], { type: 'application/json' });

                      >

                        Change Password    const url = URL.createObjectURL(dataBlob);    const url = URL.createObjectURL(dataBlob);

                      </Button>

                    </div>    const link = document.createElement('a');    const link = document.createElement('a');

                    

                    <div className="d-flex justify-content-between align-items-center mb-3">    link.href = url;    link.href = url;

                      <div>

                        <div>Two-Factor Authentication</div>    link.download = `colin-nebula-portfolio-data-${new Date().toISOString().split('T')[0]}.json`;    link.download = `colin-nebula-portfolio-data-${new Date().toISOString().split('T')[0]}.json`;

                        <small className="text-muted">Add an extra layer of security</small>

                      </div>    link.click();    link.click();

                      <Form.Check 

                        type="switch"        

                        id="twoFactorEnabled"

                        checked={securitySettings.twoFactorEnabled}    showNotification('User data exported successfully!', 'success', 3000, { icon: '📥' });    showNotification('User data exported successfully!', 'success', 3000, { icon: '📥' });

                        onChange={() => setSecuritySettings(prev => ({ 

                          ...prev,   };  };

                          twoFactorEnabled: !prev.twoFactorEnabled 

                        }))}

                        disabled={!isLoggedIn}

                      />  const handleImageUpload = (event) => {  const handleImageUpload = (event) => {

                    </div>

                  </div>    const file = event.target.files[0];    const file = event.target.files[0];

                  

                  <div className="security-section">    if (file) {    if (file) {

                    <h6>Login Settings</h6>

                    <Form.Check       if (file.size > 5 * 1024 * 1024) {      if (file.size > 5 * 1024 * 1024) {

                      type="switch"

                      id="loginNotifications"        showNotification('Image size should be less than 5MB', 'warning');        showNotification('Image size should be less than 5MB', 'warning');

                      label="Notify me of new login attempts"

                      checked={securitySettings.loginNotifications}        return;        return;

                      onChange={() => setSecuritySettings(prev => ({ 

                        ...prev,       }      }

                        loginNotifications: !prev.loginNotifications 

                      }))}

                      className="mb-3"

                    />      if (!file.type.startsWith('image/')) {      if (!file.type.startsWith('image/')) {

                    

                    <Form.Group className="mb-3">        showNotification('Please select a valid image file', 'warning');        showNotification('Please select a valid image file', 'warning');

                      <Form.Label>Session Timeout</Form.Label>

                      <Form.Select         return;        return;

                        value={securitySettings.sessionTimeout}

                        onChange={(e) => setSecuritySettings(prev => ({       }      }

                          ...prev, 

                          sessionTimeout: e.target.value 

                        }))}

                      >      const reader = new FileReader();      const reader = new FileReader();

                        <option value="1h">1 hour</option>

                        <option value="24h">24 hours</option>      reader.onload = (e) => {      reader.onload = (e) => {

                        <option value="7d">7 days</option>

                        <option value="30d">30 days</option>        setEditUserInfo({...editUserInfo, avatar: e.target.result});        setEditUserInfo({...editUserInfo, avatar: e.target.result});

                      </Form.Select>

                    </Form.Group>        showNotification('Image uploaded successfully!', 'success', 2000, { icon: '📸' });        showNotification('Image uploaded successfully!', 'success', 2000, { icon: '📸' });

                  </div>

                </Card.Body>      };      };

              </Card>

            </Tab>      reader.readAsDataURL(file);      reader.readAsDataURL(file);



            <Tab eventKey="activity" title="Activity">    }    }

              <Card className="account-card">

                <Card.Body>  };  };

                  <h5 className="mb-3">Recent Activity</h5>

                  

                  <Table hover responsive>

                    <thead>  const requestBrowserNotifications = async () => {  const getAccountTypeBadge = (type) => {

                      <tr>

                        <th>Action</th>    if ('Notification' in window) {    const badges = {

                        <th>Date & Time</th>

                        <th>Device</th>      const permission = await Notification.requestPermission();      'guest': { variant: 'secondary', icon: '👤', text: 'Guest' },

                        <th>IP Address</th>

                      </tr>      if (permission === 'granted') {      'user': { variant: 'primary', icon: '�', text: 'User' },

                    </thead>

                    <tbody>        setSettings(prev => ({ ...prev, browserNotifications: true }));      'premium': { variant: 'warning', icon: '⭐', text: 'Premium' },

                      {activityLog.map((activity, index) => (

                        <tr key={index}>        showNotification('Browser notifications enabled', 'success');      'admin': { variant: 'danger', icon: '👑', text: 'Admin' }

                          <td>{activity.action}</td>

                          <td>{new Date(activity.timestamp).toLocaleString()}</td>      } else {    };

                          <td>{activity.device}</td>

                          <td>{activity.ip}</td>        showNotification('Browser notifications denied', 'warning');    

                        </tr>

                      ))}      }    const badge = badges[type] || badges.guest;

                    </tbody>

                  </Table>    } else {    return (

                  

                  {activityLog.length === 0 && (      showNotification('Browser notifications not supported', 'warning');      <Badge bg={badge.variant} className="account-type-badge">

                    <div className="text-center text-muted py-4">

                      <i className="fas fa-history fa-2x mb-2"></i>    }        <span className="me-1">{badge.icon}</span>

                      <p>No recent activity</p>

                    </div>  };        {badge.text}

                  )}

                </Card.Body>      </Badge>

              </Card>

            </Tab>  const testNotification = () => {    );



            <Tab eventKey="data" title="Data & Privacy">    showNotification('This is a test notification!', 'info');  };

              <Card className="account-card">

                <Card.Body>    

                  <h5 className="mb-3">Data Management</h5>

                      if (settings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {  if (loading) {

                  <div className="data-section">

                    <h6>Export Your Data</h6>      new Notification('Colin Nebula Portfolio', {    return (

                    <p className="text-muted mb-3">

                      Download a copy of all your data including profile information,         body: 'This is a test browser notification',      <Container fluid className="account-container py-4 text-center">

                      settings, and activity history.

                    </p>        icon: '/favicon.ico'        <div className="loading-spinner">

                    <Button variant="outline-info" onClick={exportUserData}>

                      <i className="fas fa-download me-1"></i>Export Data      });          <div className="spinner-border" role="status">

                    </Button>

                  </div>    }            <span className="visually-hidden">Loading...</span>

                  

                  <div className="data-section">  };          </div>

                    <h6>Account Deletion</h6>

                    <p className="text-muted mb-3">          <p className="mt-3">Loading your account...</p>

                      Permanently delete your account and all associated data. 

                      This action cannot be undone.  const getAccountTypeBadge = (type) => {        </div>

                    </p>

                    <Button     const badges = {      </Container>

                      variant="outline-danger" 

                      onClick={() => setShowDeleteAccount(true)}      'guest': { variant: 'secondary', icon: '👤', text: 'Guest' },    );

                      disabled={!isLoggedIn}

                    >      'user': { variant: 'primary', icon: '👤', text: 'User' },  }

                      <i className="fas fa-trash me-1"></i>Delete Account

                    </Button>      'premium': { variant: 'warning', icon: '⭐', text: 'Premium' },

                  </div>

                </Card.Body>      'admin': { variant: 'danger', icon: '👑', text: 'Admin' }  return (

              </Card>

            </Tab>    };    <Container fluid className="account-container py-4">

          </Tabs>

          <Row className="justify-content-center">

          {/* Quick Actions */}

          <Card className="account-card">    const badge = badges[type] || badges.guest;        <Col lg={10} xl={8}>

            <Card.Body>

              <h5 className="mb-3">Quick Actions</h5>    return (          <div className="account-header mb-4">

              <div className="quick-actions">

                <Button variant="outline-primary" className="me-2 mb-2" onClick={testNotification}>      <Badge bg={badge.variant} className="account-type-badge">            <div className="d-flex align-items-center mb-3">

                  <i className="fas fa-bell me-1"></i>Test Notification

                </Button>        <span className="me-1">{badge.icon}</span>              <div className="account-avatar me-3">

                <Button variant="outline-success" className="me-2 mb-2">

                  <i className="fas fa-share me-1"></i>Share Portfolio        {badge.text}                {userInfo.avatar ? (

                </Button>

                <Button variant="outline-info" className="me-2 mb-2">      </Badge>                  <img src={userInfo.avatar} alt="Avatar" className="rounded-circle" width="60" height="60" />

                  <i className="fas fa-question-circle me-1"></i>Help & Support

                </Button>    );                ) : (

                <Button variant="outline-warning" className="me-2 mb-2">

                  <i className="fas fa-bug me-1"></i>Report Issue  };                  <div className="avatar-placeholder rounded-circle">

                </Button>

              </div>                    <i className="fas fa-user fa-2x"></i>

            </Card.Body>

          </Card>  if (loading) {                  </div>

        </Col>

      </Row>    return (                )}



      {/* Edit Profile Modal */}      <Container fluid className="account-container py-4 text-center">              </div>

      <Modal show={showEditProfile} onHide={() => setShowEditProfile(false)} size="lg">

        <Modal.Header closeButton>        <div className="loading-spinner">              <div>

          <Modal.Title>Edit Profile</Modal.Title>

        </Modal.Header>          <div className="spinner-border" role="status">                <h2 className="mb-1">

        <Modal.Body>

          <Form>            <span className="visually-hidden">Loading...</span>                  {userInfo.name}

            <Row>

              <Col md={12} className="text-center mb-3">          </div>                  <span className="ms-2">{getAccountTypeBadge(userInfo.accountType)}</span>

                <div className="avatar-upload">

                  {editUserInfo.avatar ? (          <p className="mt-3">Loading your account...</p>                </h2>

                    <img 

                      src={editUserInfo.avatar}         </div>                <p className="text-muted mb-0">{userInfo.email}</p>

                      alt="Avatar" 

                      className="rounded-circle mb-2"       </Container>                <small className="text-muted">Member since: {userInfo.memberSince}</small>

                      width="100" 

                      height="100"     );              </div>

                    />

                  ) : (  }            </div>

                    <div className="avatar-placeholder-large rounded-circle mb-2">

                      <i className="fas fa-user fa-3x"></i>            

                    </div>

                  )}  return (            <div className="profile-completion mb-3">

                  <div>

                    <input     <Container fluid className="account-container py-4">              <div className="d-flex justify-content-between align-items-center mb-2">

                      type="file" 

                      accept="image/*"       <Row className="justify-content-center">                <span>Profile Completion</span>

                      onChange={handleImageUpload}

                      className="d-none"        <Col lg={10} xl={8}>                <span>{profileCompletion}%</span>

                      id="avatar-upload"

                    />          <div className="account-header mb-4">              </div>

                    <label htmlFor="avatar-upload" className="btn btn-sm btn-outline-primary me-2">

                      Upload Photo            <div className="d-flex align-items-center mb-3">              <ProgressBar now={profileCompletion} variant="success" />

                    </label>

                    {editUserInfo.avatar && (              <div className="account-avatar me-3">            </div>

                      <Button 

                        variant="outline-danger"                 {userInfo.avatar ? (          </div>

                        size="sm"

                        onClick={() => setEditUserInfo({...editUserInfo, avatar: null})}                  <img src={userInfo.avatar} alt="Avatar" className="rounded-circle" width="60" height="60" />

                      >

                        Remove                ) : (          <Tabs

                      </Button>

                    )}                  <div className="avatar-placeholder rounded-circle">            activeKey={activeTab}

                  </div>

                </div>                    <i className="fas fa-user fa-2x"></i>            onSelect={(tab) => setActiveTab(tab)}

              </Col>

            </Row>                  </div>            className="account-tabs mb-4"

            

            <Row>                )}          >

              <Col md={6}>

                <Form.Group className="mb-3">              </div>            <Tab eventKey="profile" title="Profile">

                  <Form.Label>Name</Form.Label>

                  <Form.Control              <div>              <Card className="account-card">

                    type="text"

                    value={editUserInfo.name}                <h2 className="mb-1">                <Card.Body>

                    onChange={(e) => setEditUserInfo({...editUserInfo, name: e.target.value})}

                  />                  {userInfo.name}                  <div className="d-flex justify-content-between align-items-center mb-3">

                </Form.Group>

              </Col>                  <span className="ms-2">{getAccountTypeBadge(userInfo.accountType)}</span>                    <h5 className="mb-0">Profile Information</h5>

              <Col md={6}>

                <Form.Group className="mb-3">                </h2>                    <Button variant="outline-primary" onClick={() => setShowEditProfile(true)}>

                  <Form.Label>Email</Form.Label>

                  <Form.Control                <p className="text-muted mb-0">{userInfo.email}</p>                      <i className="fas fa-edit me-1"></i>Edit Profile

                    type="email"

                    value={editUserInfo.email}                <small className="text-muted">Member since: {userInfo.memberSince}</small>                    </Button>

                    onChange={(e) => setEditUserInfo({...editUserInfo, email: e.target.value})}

                  />              </div>                  </div>

                </Form.Group>

              </Col>            </div>                  

            </Row>

                                          <Row>

            <Row>

              <Col md={6}>            <div className="profile-completion mb-3">                    <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>Location</Form.Label>              <div className="d-flex justify-content-between align-items-center mb-2">                      <div className="info-item">

                  <Form.Control

                    type="text"                <span>Profile Completion</span>                        <strong>Name:</strong> {userInfo.name}

                    value={editUserInfo.location || ''}

                    onChange={(e) => setEditUserInfo({...editUserInfo, location: e.target.value})}                <span>{profileCompletion}%</span>                      </div>

                    placeholder="City, Country"

                  />              </div>                      <div className="info-item">

                </Form.Group>

              </Col>              <ProgressBar now={profileCompletion} variant="success" />                        <strong>Email:</strong> {userInfo.email}

              <Col md={6}>

                <Form.Group className="mb-3">            </div>                      </div>

                  <Form.Label>Website</Form.Label>

                  <Form.Control          </div>                      <div className="info-item">

                    type="url"

                    value={editUserInfo.website || ''}                        <strong>Location:</strong> {userInfo.location || 'Not specified'}

                    onChange={(e) => setEditUserInfo({...editUserInfo, website: e.target.value})}

                    placeholder="https://yourwebsite.com"          <Tabs                      </div>

                  />

                </Form.Group>            activeKey={activeTab}                    </Col>

              </Col>

            </Row>            onSelect={(tab) => setActiveTab(tab)}                    <Col md={6}>

            

            <Form.Group className="mb-3">            className="account-tabs mb-4"                      <div className="info-item">

              <Form.Label>Bio</Form.Label>

              <Form.Control          >                        <strong>Website:</strong> {userInfo.website || 'Not specified'}

                as="textarea"

                rows={3}            <Tab eventKey="profile" title="Profile">                      </div>

                value={editUserInfo.bio || ''}

                onChange={(e) => setEditUserInfo({...editUserInfo, bio: e.target.value})}              <Card className="account-card">                      <div className="info-item">

                placeholder="Tell us about yourself..."

              />                <Card.Body>                        <strong>Member Since:</strong> {userInfo.memberSince}

            </Form.Group>

          </Form>                  <div className="d-flex justify-content-between align-items-center mb-3">                      </div>

        </Modal.Body>

        <Modal.Footer>                    <h5 className="mb-0">Profile Information</h5>                      <div className="info-item">

          <Button variant="secondary" onClick={() => setShowEditProfile(false)}>

            Cancel                    <Button variant="outline-primary" onClick={() => setShowEditProfile(true)}>                        <strong>Account Type:</strong> {getAccountTypeBadge(userInfo.accountType)}

          </Button>

          <Button variant="primary" onClick={saveProfile}>                      <i className="fas fa-edit me-1"></i>Edit Profile                      </div>

            Save Changes

          </Button>                    </Button>                    </Col>

        </Modal.Footer>

      </Modal>                  </div>                  </Row>



      {/* Change Password Modal */}                                    

      <Modal show={showChangePassword} onHide={() => setShowChangePassword(false)}>

        <Modal.Header closeButton>                  <Row>                  {userInfo.bio && (

          <Modal.Title>Change Password</Modal.Title>

        </Modal.Header>                    <Col md={6}>                    <div className="mt-3">

        <Modal.Body>

          <Form>                      <div className="info-item">                      <strong>Bio:</strong>

            <Form.Group className="mb-3">

              <Form.Label>Current Password</Form.Label>                        <strong>Name:</strong> {userInfo.name}                      <p className="mt-1">{userInfo.bio}</p>

              <Form.Control

                type="password"                      </div>                    </div>

                value={passwordForm.currentPassword}

                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}                      <div className="info-item">                  )}

              />

            </Form.Group>                        <strong>Email:</strong> {userInfo.email}                </Card.Body>

            <Form.Group className="mb-3">

              <Form.Label>New Password</Form.Label>                      </div>              </Card>

              <Form.Control

                type="password"                      <div className="info-item">            </Tab>

                value={passwordForm.newPassword}

                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}                        <strong>Location:</strong> {userInfo.location || 'Not specified'}

              />

            </Form.Group>                      </div>            <Tab eventKey="settings" title="Settings">

            <Form.Group className="mb-3">

              <Form.Label>Confirm New Password</Form.Label>                    </Col>              <Card className="account-card">

              <Form.Control

                type="password"                    <Col md={6}>                <Card.Body>

                value={passwordForm.confirmPassword}

                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}                      <div className="info-item">                  <div className="d-flex justify-content-between align-items-center mb-3">

              />

            </Form.Group>                        <strong>Website:</strong> {userInfo.website || 'Not specified'}                    <h5 className="mb-0">Notification Preferences</h5>

          </Form>

        </Modal.Body>                      </div>                    {preferencesSaved && (

        <Modal.Footer>

          <Button variant="secondary" onClick={() => setShowChangePassword(false)}>                      <div className="info-item">                      <Badge bg="success" className="pulse-animation">

            Cancel

          </Button>                        <strong>Member Since:</strong> {userInfo.memberSince}                        <i className="fas fa-check me-1"></i>Saved

          <Button variant="primary" onClick={handlePasswordChange}>

            Change Password                      </div>                      </Badge>

          </Button>

        </Modal.Footer>                      <div className="info-item">                    )}

      </Modal>

                        <strong>Account Type:</strong> {getAccountTypeBadge(userInfo.accountType)}                  </div>

      {/* Delete Account Modal */}

      <Modal show={showDeleteAccount} onHide={() => setShowDeleteAccount(false)}>                      </div>                  

        <Modal.Header closeButton>

          <Modal.Title className="text-danger">Delete Account</Modal.Title>                    </Col>                  <Form>

        </Modal.Header>

        <Modal.Body>                  </Row>                    <div className="setting-group">

          <Alert variant="danger">

            <i className="fas fa-exclamation-triangle me-2"></i>                                        <h6>Email Notifications</h6>

            <strong>Warning:</strong> This action is permanent and cannot be undone. 

            All your data will be permanently deleted.                  {userInfo.bio && (                      {[

          </Alert>

          <p>To confirm account deletion, please type <strong>DELETE</strong> below:</p>                    <div className="mt-3">                        { key: 'emailNotifications', label: 'General email notifications', icon: '📧' },

          <Form.Control

            type="text"                      <strong>Bio:</strong>                        { key: 'portfolioUpdates', label: 'Portfolio updates', icon: '🎨' },

            value={deleteConfirmation}

            onChange={(e) => setDeleteConfirmation(e.target.value)}                      <p className="mt-1">{userInfo.bio}</p>                        { key: 'systemUpdates', label: 'System updates', icon: '⚙️' },

            placeholder="Type DELETE to confirm"

          />                    </div>                        { key: 'marketingEmails', label: 'Marketing emails', icon: '📢' }

        </Modal.Body>

        <Modal.Footer>                  )}                      ].map(setting => (

          <Button variant="secondary" onClick={() => setShowDeleteAccount(false)}>

            Cancel                </Card.Body>                        <Form.Check 

          </Button>

          <Button               </Card>                          key={setting.key}

            variant="danger" 

            onClick={handleDeleteAccount}            </Tab>                          type="switch"

            disabled={deleteConfirmation !== 'DELETE'}

          >                          id={setting.key}

            Delete Account

          </Button>            <Tab eventKey="settings" title="Settings">                          label={

        </Modal.Footer>

      </Modal>              <Card className="account-card">                            <span>

    </Container>

  );                <Card.Body>                              <span className="me-2">{setting.icon}</span>

}

                  <div className="d-flex justify-content-between align-items-center mb-3">                              {setting.label}

export default Account;
                    <h5 className="mb-0">Notification Preferences</h5>                            </span>

                    {preferencesSaved && (                          }

                      <Badge bg="success" className="pulse-animation">                          checked={settings[setting.key]}

                        <i className="fas fa-check me-1"></i>Saved                          onChange={() => handleSettingChange(setting.key)}

                      </Badge>                          className="setting-switch"

                    )}                        />

                  </div>                      ))}

                                      </div>

                  <Form>                    

                    <div className="setting-group">                    <div className="setting-group">

                      <h6>Email Notifications</h6>                      <h6>Browser Notifications</h6>

                      {[                      <Form.Check 

                        { key: 'emailNotifications', label: 'General email notifications', icon: '📧' },                        type="switch"

                        { key: 'portfolioUpdates', label: 'Portfolio updates', icon: '🎨' },                        id="browserNotifications"

                        { key: 'systemUpdates', label: 'System updates', icon: '⚙️' },                        label={

                        { key: 'marketingEmails', label: 'Marketing emails', icon: '📢' }                          <span>

                      ].map(setting => (                            <span className="me-2">🔔</span>

                        <Form.Check                             Browser notifications

                          key={setting.key}                          </span>

                          type="switch"                        }

                          id={setting.key}                        checked={settings.browserNotifications}

                          label={                        onChange={() => handleSettingChange('browserNotifications')}

                            <span>                        className="setting-switch"

                              <span className="me-2">{setting.icon}</span>                      />

                              {setting.label}                    </div>

                            </span>                    

                          }                    <div className="setting-group">

                          checked={settings[setting.key]}                      <h6>Appearance</h6>

                          onChange={() => handleSettingChange(setting.key)}                      <Form.Check 

                          className="setting-switch"                        type="switch"

                        />                        id="darkMode"

                      ))}                        label={

                    </div>                          <span>

                                                <span className="me-2">🌙</span>

                    <div className="setting-group">                            Dark mode

                      <h6>Browser Notifications</h6>                          </span>

                      <Form.Check                         }

                        type="switch"                        checked={settings.darkMode}

                        id="browserNotifications"                        onChange={() => handleSettingChange('darkMode')}

                        label={                        className="setting-switch"

                          <span>                      />

                            <span className="me-2">🔔</span>                    </div>

                            Browser notifications                  </Form>

                          </span>                </Card.Body>

                        }              </Card>

                        checked={settings.browserNotifications}            </Tab>

                        onChange={() => {

                          if (!settings.browserNotifications) {            <Tab eventKey="security" title="Security">

                            requestBrowserNotifications();              <Card className="account-card">

                          } else {                <Card.Body>

                            handleSettingChange('browserNotifications');                  <h5 className="mb-3">Security Settings</h5>

                          }                  

                        }}                  <div className="security-section">

                        className="setting-switch"                    <h6>Password & Authentication</h6>

                      />                    <div className="d-flex justify-content-between align-items-center mb-3">

                    </div>                      <div>

                                            <div>Password</div>

                    <div className="setting-group">                        <small className="text-muted">Last changed 30 days ago</small>

                      <h6>Appearance</h6>                      </div>

                      <Form.Check                       <Button 

                        type="switch"                        variant="outline-primary" 

                        id="darkMode"                        onClick={() => setShowChangePassword(true)}

                        label={                        disabled={!isLoggedIn}

                          <span>                      >

                            <span className="me-2">🌙</span>                        Change Password

                            Dark mode                      </Button>

                          </span>                    </div>

                        }                    

                        checked={settings.darkMode}                    <div className="d-flex justify-content-between align-items-center mb-3">

                        onChange={() => handleSettingChange('darkMode')}                      <div>

                        className="setting-switch"                        <div>Two-Factor Authentication</div>

                      />                        <small className="text-muted">Add an extra layer of security</small>

                    </div>                      </div>

                  </Form>                      <Form.Check 

                </Card.Body>                        type="switch"

              </Card>                        id="twoFactorEnabled"

            </Tab>                        checked={securitySettings.twoFactorEnabled}

                        onChange={() => setSecuritySettings(prev => ({ 

            <Tab eventKey="security" title="Security">                          ...prev, 

              <Card className="account-card">                          twoFactorEnabled: !prev.twoFactorEnabled 

                <Card.Body>                        }))}

                  <h5 className="mb-3">Security Settings</h5>                        disabled={!isLoggedIn}

                                        />

                  <div className="security-section">                    </div>

                    <h6>Password & Authentication</h6>                  </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">                  

                      <div>                  <div className="security-section">

                        <div>Password</div>                    <h6>Login Settings</h6>

                        <small className="text-muted">Last changed 30 days ago</small>                    <Form.Check 

                      </div>                      type="switch"

                      <Button                       id="loginNotifications"

                        variant="outline-primary"                       label="Notify me of new login attempts"

                        onClick={() => setShowChangePassword(true)}                      checked={securitySettings.loginNotifications}

                        disabled={!isLoggedIn}                      onChange={() => setSecuritySettings(prev => ({ 

                      >                        ...prev, 

                        Change Password                        loginNotifications: !prev.loginNotifications 

                      </Button>                      }))}

                    </div>                      className="mb-3"

                                        />

                    <div className="d-flex justify-content-between align-items-center mb-3">                    

                      <div>                    <Form.Group className="mb-3">

                        <div>Two-Factor Authentication</div>                      <Form.Label>Session Timeout</Form.Label>

                        <small className="text-muted">Add an extra layer of security</small>                      <Form.Select 

                      </div>                        value={securitySettings.sessionTimeout}

                      <Form.Check                         onChange={(e) => setSecuritySettings(prev => ({ 

                        type="switch"                          ...prev, 

                        id="twoFactorEnabled"                          sessionTimeout: e.target.value 

                        checked={securitySettings.twoFactorEnabled}                        }))}

                        onChange={() => setSecuritySettings(prev => ({                       >

                          ...prev,                         <option value="1h">1 hour</option>

                          twoFactorEnabled: !prev.twoFactorEnabled                         <option value="24h">24 hours</option>

                        }))}                        <option value="7d">7 days</option>

                        disabled={!isLoggedIn}                        <option value="30d">30 days</option>

                      />                      </Form.Select>

                    </div>                    </Form.Group>

                  </div>                  </div>

                                  </Card.Body>

                  <div className="security-section">              </Card>

                    <h6>Login Settings</h6>            </Tab>

                    <Form.Check 

                      type="switch"            <Tab eventKey="activity" title="Activity">

                      id="loginNotifications"              <Card className="account-card">

                      label="Notify me of new login attempts"                <Card.Body>

                      checked={securitySettings.loginNotifications}                  <h5 className="mb-3">Recent Activity</h5>

                      onChange={() => setSecuritySettings(prev => ({                   

                        ...prev,                   <Table hover responsive>

                        loginNotifications: !prev.loginNotifications                     <thead>

                      }))}                      <tr>

                      className="mb-3"                        <th>Action</th>

                    />                        <th>Date & Time</th>

                                            <th>Device</th>

                    <Form.Group className="mb-3">                        <th>IP Address</th>

                      <Form.Label>Session Timeout</Form.Label>                      </tr>

                      <Form.Select                     </thead>

                        value={securitySettings.sessionTimeout}                    <tbody>

                        onChange={(e) => setSecuritySettings(prev => ({                       {activityLog.map((activity, index) => (

                          ...prev,                         <tr key={index}>

                          sessionTimeout: e.target.value                           <td>{activity.action}</td>

                        }))}                          <td>{new Date(activity.timestamp).toLocaleString()}</td>

                      >                          <td>{activity.device}</td>

                        <option value="1h">1 hour</option>                          <td>{activity.ip}</td>

                        <option value="24h">24 hours</option>                        </tr>

                        <option value="7d">7 days</option>                      ))}

                        <option value="30d">30 days</option>                    </tbody>

                      </Form.Select>                  </Table>

                    </Form.Group>                  

                  </div>                  {activityLog.length === 0 && (

                </Card.Body>                    <div className="text-center text-muted py-4">

              </Card>                      <i className="fas fa-history fa-2x mb-2"></i>

            </Tab>                      <p>No recent activity</p>

                    </div>

            <Tab eventKey="activity" title="Activity">                  )}

              <Card className="account-card">                </Card.Body>

                <Card.Body>              </Card>

                  <h5 className="mb-3">Recent Activity</h5>            </Tab>

                  

                  <Table hover responsive>            <Tab eventKey="data" title="Data & Privacy">

                    <thead>              <Card className="account-card">

                      <tr>                <Card.Body>

                        <th>Action</th>                  <h5 className="mb-3">Data Management</h5>

                        <th>Date & Time</th>                  

                        <th>Device</th>                  <div className="data-section">

                        <th>IP Address</th>                    <h6>Export Your Data</h6>

                      </tr>                    <p className="text-muted mb-3">

                    </thead>                      Download a copy of all your data including profile information, 

                    <tbody>                      settings, and activity history.

                      {activityLog.map((activity, index) => (                    </p>

                        <tr key={index}>                    <Button variant="outline-info" onClick={exportUserData}>

                          <td>{activity.action}</td>                      <i className="fas fa-download me-1"></i>Export Data

                          <td>{new Date(activity.timestamp).toLocaleString()}</td>                    </Button>

                          <td>{activity.device}</td>                  </div>

                          <td>{activity.ip}</td>                  

                        </tr>                  <div className="data-section">

                      ))}                    <h6>Account Deletion</h6>

                    </tbody>                    <p className="text-muted mb-3">

                  </Table>                      Permanently delete your account and all associated data. 

                                        This action cannot be undone.

                  {activityLog.length === 0 && (                    </p>

                    <div className="text-center text-muted py-4">                    <Button 

                      <i className="fas fa-history fa-2x mb-2"></i>                      variant="outline-danger" 

                      <p>No recent activity</p>                      onClick={() => setShowDeleteAccount(true)}

                    </div>                      disabled={!isLoggedIn}

                  )}                    >

                </Card.Body>                      <i className="fas fa-trash me-1"></i>Delete Account

              </Card>                    </Button>

            </Tab>                  </div>

                </Card.Body>

            <Tab eventKey="data" title="Data & Privacy">              </Card>

              <Card className="account-card">            </Tab>

                <Card.Body>          </Tabs>

                  <h5 className="mb-3">Data Management</h5>

                            {/* Quick Actions */}

                  <div className="data-section">          <Card className="account-card">

                    <h6>Export Your Data</h6>            <Card.Body>

                    <p className="text-muted mb-3">              <h5 className="mb-3">Quick Actions</h5>

                      Download a copy of all your data including profile information,               <div className="quick-actions">

                      settings, and activity history.                <Button variant="outline-primary" className="me-2 mb-2">

                    </p>                  <i className="fas fa-bell me-1"></i>Test Notification

                    <Button variant="outline-info" onClick={exportUserData}>                </Button>

                      <i className="fas fa-download me-1"></i>Export Data                <Button variant="outline-success" className="me-2 mb-2">

                    </Button>                  <i className="fas fa-share me-1"></i>Share Portfolio

                  </div>                </Button>

                                  <Button variant="outline-info" className="me-2 mb-2">

                  <div className="data-section">                  <i className="fas fa-question-circle me-1"></i>Help & Support

                    <h6>Account Deletion</h6>                </Button>

                    <p className="text-muted mb-3">                <Button variant="outline-warning" className="me-2 mb-2">

                      Permanently delete your account and all associated data.                   <i className="fas fa-bug me-1"></i>Report Issue

                      This action cannot be undone.                </Button>

                    </p>              </div>

                    <Button             </Card.Body>

                      variant="outline-danger"           </Card>

                      onClick={() => setShowDeleteAccount(true)}        </Col>

                      disabled={!isLoggedIn}      </Row>

                    >

                      <i className="fas fa-trash me-1"></i>Delete Account      {/* Edit Profile Modal */}

                    </Button>      <Modal show={showEditProfile} onHide={() => setShowEditProfile(false)} size="lg">

                  </div>        <Modal.Header closeButton>

                </Card.Body>          <Modal.Title>Edit Profile</Modal.Title>

              </Card>        </Modal.Header>

            </Tab>        <Modal.Body>

          </Tabs>          <Form>

            <Row>

          {/* Quick Actions */}              <Col md={12} className="text-center mb-3">

          <Card className="account-card">                <div className="avatar-upload">

            <Card.Body>                  {editUserInfo.avatar ? (

              <h5 className="mb-3">Quick Actions</h5>                    <img 

              <div className="quick-actions">                      src={editUserInfo.avatar} 

                <Button variant="outline-primary" className="me-2 mb-2" onClick={testNotification}>                      alt="Avatar" 

                  <i className="fas fa-bell me-1"></i>Test Notification                      className="rounded-circle mb-2" 

                </Button>                      width="100" 

                <Button variant="outline-success" className="me-2 mb-2">                      height="100" 

                  <i className="fas fa-share me-1"></i>Share Portfolio                    />

                </Button>                  ) : (

                <Button variant="outline-info" className="me-2 mb-2">                    <div className="avatar-placeholder-large rounded-circle mb-2">

                  <i className="fas fa-question-circle me-1"></i>Help & Support                      <i className="fas fa-user fa-3x"></i>

                </Button>                    </div>

                <Button variant="outline-warning" className="me-2 mb-2">                  )}

                  <i className="fas fa-bug me-1"></i>Report Issue                  <div>

                </Button>                    <input 

              </div>                      type="file" 

            </Card.Body>                      accept="image/*" 

          </Card>                      onChange={handleImageUpload}

        </Col>                      className="d-none"

      </Row>                      id="avatar-upload"

                    />

      {/* Edit Profile Modal */}                    <label htmlFor="avatar-upload" className="btn btn-sm btn-outline-primary me-2">

      <Modal show={showEditProfile} onHide={() => setShowEditProfile(false)} size="lg">                      Upload Photo

        <Modal.Header closeButton>                    </label>

          <Modal.Title>Edit Profile</Modal.Title>                    {editUserInfo.avatar && (

        </Modal.Header>                      <Button 

        <Modal.Body>                        variant="outline-danger" 

          <Form>                        size="sm"

            <Row>                        onClick={() => setEditUserInfo({...editUserInfo, avatar: null})}

              <Col md={12} className="text-center mb-3">                      >

                <div className="avatar-upload">                        Remove

                  {editUserInfo.avatar ? (                      </Button>

                    <img                     )}

                      src={editUserInfo.avatar}                   </div>

                      alt="Avatar"                 </div>

                      className="rounded-circle mb-2"               </Col>

                      width="100"             </Row>

                      height="100"             

                    />            <Row>

                  ) : (              <Col md={6}>

                    <div className="avatar-placeholder-large rounded-circle mb-2">                <Form.Group className="mb-3">

                      <i className="fas fa-user fa-3x"></i>                  <Form.Label>Name</Form.Label>

                    </div>                  <Form.Control

                  )}                    type="text"

                  <div>                    value={editUserInfo.name}

                    <input                     onChange={(e) => setEditUserInfo({...editUserInfo, name: e.target.value})}

                      type="file"                   />

                      accept="image/*"                 </Form.Group>

                      onChange={handleImageUpload}              </Col>

                      className="d-none"              <Col md={6}>

                      id="avatar-upload"                <Form.Group className="mb-3">

                    />                  <Form.Label>Email</Form.Label>

                    <label htmlFor="avatar-upload" className="btn btn-sm btn-outline-primary me-2">                  <Form.Control

                      Upload Photo                    type="email"

                    </label>                    value={editUserInfo.email}

                    {editUserInfo.avatar && (                    onChange={(e) => setEditUserInfo({...editUserInfo, email: e.target.value})}

                      <Button                   />

                        variant="outline-danger"                 </Form.Group>

                        size="sm"              </Col>

                        onClick={() => setEditUserInfo({...editUserInfo, avatar: null})}            </Row>

                      >            

                        Remove            <Row>

                      </Button>              <Col md={6}>

                    )}                <Form.Group className="mb-3">

                  </div>                  <Form.Label>Location</Form.Label>

                </div>                  <Form.Control

              </Col>                    type="text"

            </Row>                    value={editUserInfo.location || ''}

                                onChange={(e) => setEditUserInfo({...editUserInfo, location: e.target.value})}

            <Row>                    placeholder="City, Country"

              <Col md={6}>                  />

                <Form.Group className="mb-3">                </Form.Group>

                  <Form.Label>Name</Form.Label>              </Col>

                  <Form.Control              <Col md={6}>

                    type="text"                <Form.Group className="mb-3">

                    value={editUserInfo.name}                  <Form.Label>Website</Form.Label>

                    onChange={(e) => setEditUserInfo({...editUserInfo, name: e.target.value})}                  <Form.Control

                  />                    type="url"

                </Form.Group>                    value={editUserInfo.website || ''}

              </Col>                    onChange={(e) => setEditUserInfo({...editUserInfo, website: e.target.value})}

              <Col md={6}>                    placeholder="https://yourwebsite.com"

                <Form.Group className="mb-3">                  />

                  <Form.Label>Email</Form.Label>                </Form.Group>

                  <Form.Control              </Col>

                    type="email"            </Row>

                    value={editUserInfo.email}            

                    onChange={(e) => setEditUserInfo({...editUserInfo, email: e.target.value})}            <Form.Group className="mb-3">

                  />              <Form.Label>Bio</Form.Label>

                </Form.Group>              <Form.Control

              </Col>                as="textarea"

            </Row>                rows={3}

                            value={editUserInfo.bio || ''}

            <Row>                onChange={(e) => setEditUserInfo({...editUserInfo, bio: e.target.value})}

              <Col md={6}>                placeholder="Tell us about yourself..."

                <Form.Group className="mb-3">              />

                  <Form.Label>Location</Form.Label>            </Form.Group>

                  <Form.Control          </Form>

                    type="text"        </Modal.Body>

                    value={editUserInfo.location || ''}        <Modal.Footer>

                    onChange={(e) => setEditUserInfo({...editUserInfo, location: e.target.value})}          <Button variant="secondary" onClick={() => setShowEditProfile(false)}>

                    placeholder="City, Country"            Cancel

                  />          </Button>

                </Form.Group>          <Button variant="primary" onClick={saveProfile}>

              </Col>            Save Changes

              <Col md={6}>          </Button>

                <Form.Group className="mb-3">        </Modal.Footer>

                  <Form.Label>Website</Form.Label>      </Modal>

                  <Form.Control

                    type="url"      {/* Change Password Modal */}

                    value={editUserInfo.website || ''}      <Modal show={showChangePassword} onHide={() => setShowChangePassword(false)}>

                    onChange={(e) => setEditUserInfo({...editUserInfo, website: e.target.value})}        <Modal.Header closeButton>

                    placeholder="https://yourwebsite.com"          <Modal.Title>Change Password</Modal.Title>

                  />        </Modal.Header>

                </Form.Group>        <Modal.Body>

              </Col>          <Form>

            </Row>            <Form.Group className="mb-3">

                          <Form.Label>Current Password</Form.Label>

            <Form.Group className="mb-3">              <Form.Control

              <Form.Label>Bio</Form.Label>                type="password"

              <Form.Control                value={passwordForm.currentPassword}

                as="textarea"                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}

                rows={3}              />

                value={editUserInfo.bio || ''}            </Form.Group>

                onChange={(e) => setEditUserInfo({...editUserInfo, bio: e.target.value})}            <Form.Group className="mb-3">

                placeholder="Tell us about yourself..."              <Form.Label>New Password</Form.Label>

              />              <Form.Control

            </Form.Group>                type="password"

          </Form>                value={passwordForm.newPassword}

        </Modal.Body>                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}

        <Modal.Footer>              />

          <Button variant="secondary" onClick={() => setShowEditProfile(false)}>            </Form.Group>

            Cancel            <Form.Group className="mb-3">

          </Button>              <Form.Label>Confirm New Password</Form.Label>

          <Button variant="primary" onClick={saveProfile}>              <Form.Control

            Save Changes                type="password"

          </Button>                value={passwordForm.confirmPassword}

        </Modal.Footer>                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}

      </Modal>              />

            </Form.Group>

      {/* Change Password Modal */}          </Form>

      <Modal show={showChangePassword} onHide={() => setShowChangePassword(false)}>        </Modal.Body>

        <Modal.Header closeButton>        <Modal.Footer>

          <Modal.Title>Change Password</Modal.Title>          <Button variant="secondary" onClick={() => setShowChangePassword(false)}>

        </Modal.Header>            Cancel

        <Modal.Body>          </Button>

          <Form>          <Button variant="primary" onClick={handlePasswordChange}>

            <Form.Group className="mb-3">            Change Password

              <Form.Label>Current Password</Form.Label>          </Button>

              <Form.Control        </Modal.Footer>

                type="password"      </Modal>

                value={passwordForm.currentPassword}

                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}      {/* Delete Account Modal */}

              />      <Modal show={showDeleteAccount} onHide={() => setShowDeleteAccount(false)}>

            </Form.Group>        <Modal.Header closeButton>

            <Form.Group className="mb-3">          <Modal.Title className="text-danger">Delete Account</Modal.Title>

              <Form.Label>New Password</Form.Label>        </Modal.Header>

              <Form.Control        <Modal.Body>

                type="password"          <Alert variant="danger">

                value={passwordForm.newPassword}            <i className="fas fa-exclamation-triangle me-2"></i>

                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}            <strong>Warning:</strong> This action is permanent and cannot be undone. 

              />            All your data will be permanently deleted.

            </Form.Group>          </Alert>

            <Form.Group className="mb-3">          <p>To confirm account deletion, please type <strong>DELETE</strong> below:</p>

              <Form.Label>Confirm New Password</Form.Label>          <Form.Control

              <Form.Control            type="text"

                type="password"            value={deleteConfirmation}

                value={passwordForm.confirmPassword}            onChange={(e) => setDeleteConfirmation(e.target.value)}

                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}            placeholder="Type DELETE to confirm"

              />          />

            </Form.Group>        </Modal.Body>

          </Form>        <Modal.Footer>

        </Modal.Body>          <Button variant="secondary" onClick={() => setShowDeleteAccount(false)}>

        <Modal.Footer>            Cancel

          <Button variant="secondary" onClick={() => setShowChangePassword(false)}>          </Button>

            Cancel          <Button 

          </Button>            variant="danger" 

          <Button variant="primary" onClick={handlePasswordChange}>            onClick={handleDeleteAccount}

            Change Password            disabled={deleteConfirmation !== 'DELETE'}

          </Button>          >

        </Modal.Footer>            Delete Account

      </Modal>          </Button>

        </Modal.Footer>

      {/* Delete Account Modal */}      </Modal>

      <Modal show={showDeleteAccount} onHide={() => setShowDeleteAccount(false)}>    </Container>

        <Modal.Header closeButton>  );

          <Modal.Title className="text-danger">Delete Account</Modal.Title>}

        </Modal.Header>              <div className="d-flex align-items-center justify-content-between mb-3">

        <Modal.Body>                <h5 className="mb-0">

          <Alert variant="danger">                  <i className="bi bi-star-fill text-warning me-2"></i>

            <i className="fas fa-exclamation-triangle me-2"></i>                  Profile Completion

            <strong>Warning:</strong> This action is permanent and cannot be undone.                 </h5>

            All your data will be permanently deleted.                <Badge bg="primary" className="completion-badge">

          </Alert>                  {profileCompletion}%

          <p>To confirm account deletion, please type <strong>DELETE</strong> below:</p>                </Badge>

          <Form.Control              </div>

            type="text"              <ProgressBar 

            value={deleteConfirmation}                now={profileCompletion} 

            onChange={(e) => setDeleteConfirmation(e.target.value)}                className="elegant-progress mb-2"

            placeholder="Type DELETE to confirm"                animated

          />                striped

        </Modal.Body>              />

        <Modal.Footer>              <small className="text-muted">

          <Button variant="secondary" onClick={() => setShowDeleteAccount(false)}>                Complete your profile to unlock all features

            Cancel              </small>

          </Button>            </Card.Body>

          <Button           </Card>

            variant="danger" 

            onClick={handleDeleteAccount}          {/* Enhanced User Information */}

            disabled={deleteConfirmation !== 'DELETE'}          <Card className="user-info-card mb-4">

          >            <Card.Header className="elegant-card-header">

            Delete Account              <div className="d-flex align-items-center justify-content-between">

          </Button>                <h4 className="mb-0">

        </Modal.Footer>                  <i className="bi bi-person-circle me-2"></i>

      </Modal>                  Profile Information

    </Container>                </h4>

  );                <Button 

}                  variant="outline-primary" 

                  size="sm" 

export default Account;                  className="edit-profile-btn"
                  onClick={() => setShowEditProfile(true)}
                >
                  <i className="bi bi-pencil me-1"></i>Edit
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="user-info-body">
              <Row className="g-4">
                <Col md={4} className="text-center">
                  <div className="profile-avatar mb-3">
                    {userInfo.avatar ? (
                      <img 
                        src={userInfo.avatar} 
                        alt="Profile Avatar" 
                        className="avatar-image"
                      />
                    ) : (
                      <i className="bi bi-person-circle"></i>
                    )}
                  </div>
                  <Badge bg="success" className="status-badge">
                    <i className="bi bi-check-circle me-1"></i>Active
                  </Badge>
                </Col>
                <Col md={8}>
                  <div className="profile-details">
                    <div className="detail-item mb-3">
                      <label className="detail-label">Full Name</label>
                      <div className="detail-value">{userInfo.name}</div>
                    </div>
                    <div className="detail-item mb-3">
                      <label className="detail-label">Email Address</label>
                      <div className="detail-value">{userInfo.email}</div>
                    </div>
                    <div className="detail-item">
                      <label className="detail-label">Member Since</label>
                      <div className="detail-value">
                        {new Date(userInfo.memberSince).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Enhanced Notification Settings */}
          <Card className="notification-settings-card mb-4">
            <Card.Header className="elegant-card-header">
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="mb-0">
                  <i className="bi bi-bell-fill me-2"></i>
                  Notification Preferences
                </h4>
                {preferencesSaved && (
                  <Badge bg="success" className="saved-indicator">
                    <i className="bi bi-check2 me-1"></i>Saved
                  </Badge>
                )}
              </div>
            </Card.Header>
            <Card.Body className="notification-body">
              <Form>
                <Row className="g-4">
                  <Col md={6}>
                    <div className="notification-option">
                      <div className="option-header d-flex align-items-center mb-2">
                        <i className="bi bi-envelope-fill option-icon me-2"></i>
                        <Form.Check
                          type="switch"
                          id="email-notifications"
                          label="Email Notifications"
                          checked={settings.emailNotifications}
                          onChange={() => handleSettingChange('emailNotifications')}
                          className="elegant-switch"
                        />
                      </div>
                      <small className="option-description">
                        Receive email updates about new portfolio items and announcements
                      </small>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="notification-option">
                      <div className="option-header d-flex align-items-center mb-2">
                        <i className="bi bi-browser-chrome option-icon me-2"></i>
                        <Form.Check
                          type="switch"
                          id="browser-notifications"
                          label="Browser Notifications"
                          checked={settings.browserNotifications}
                          onChange={() => handleSettingChange('browserNotifications')}
                          className="elegant-switch"
                        />
                      </div>
                      <small className="option-description">
                        Show desktop notifications in your browser
                      </small>
                      {!settings.browserNotifications && (
                        <div className="mt-2">
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            className="enable-btn"
                            onClick={requestBrowserNotifications}
                          >
                            <i className="bi bi-toggle-on me-1"></i>Enable
                          </Button>
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="notification-option">
                      <div className="option-header d-flex align-items-center mb-2">
                        <i className="bi bi-briefcase-fill option-icon me-2"></i>
                        <Form.Check
                          type="switch"
                          id="portfolio-updates"
                          label="Portfolio Updates"
                          checked={settings.portfolioUpdates}
                          onChange={() => handleSettingChange('portfolioUpdates')}
                          className="elegant-switch"
                        />
                      </div>
                      <small className="option-description">
                        Get notified when new creative work is added
                      </small>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="notification-option">
                      <div className="option-header d-flex align-items-center mb-2">
                        <i className="bi bi-gear-fill option-icon me-2"></i>
                        <Form.Check
                          type="switch"
                          id="system-updates"
                          label="System Updates"
                          checked={settings.systemUpdates}
                          onChange={() => handleSettingChange('systemUpdates')}
                          className="elegant-switch"
                        />
                      </div>
                      <small className="option-description">
                        Receive notifications about website improvements
                      </small>
                    </div>
                  </Col>
                </Row>

                <hr className="elegant-divider my-4" />

                <div className="action-buttons d-flex gap-3 flex-wrap justify-content-center">
                  <Button 
                    variant="primary" 
                    className="action-btn test-btn"
                    onClick={testNotification}
                  >
                    <i className="bi bi-bell me-2"></i>Test Notification
                  </Button>
                  <Button 
                    variant="outline-success" 
                    className="action-btn save-btn"
                    onClick={() => showNotification('All settings are automatically saved!', 'success', 3000, { icon: '💾' })}
                  >
                    <i className="bi bi-check-circle me-2"></i>Auto-Save Active
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="quick-actions-card">
            <Card.Header className="elegant-card-header">
              <h4 className="mb-0">
                <i className="bi bi-lightning-charge-fill me-2"></i>
                Quick Actions
              </h4>
            </Card.Header>
            <Card.Body className="quick-actions-body">
              <Row className="g-3">
                <Col md={4}>
                  <Button 
                    variant="outline-info" 
                    href="/updates" 
                    className="quick-action-btn w-100"
                  >
                    <i className="bi bi-arrow-up-right-circle me-2"></i>
                    <div>
                      <div className="action-title">View Updates</div>
                      <small className="action-subtitle">Latest changes</small>
                    </div>
                  </Button>
                </Col>
                <Col md={4}>
                  <Button 
                    variant="outline-warning" 
                    href="/portfolio" 
                    className="quick-action-btn w-100"
                  >
                    <i className="bi bi-briefcase me-2"></i>
                    <div>
                      <div className="action-title">View Portfolio</div>
                      <small className="action-subtitle">Creative work</small>
                    </div>
                  </Button>
                </Col>
                <Col md={4}>
                  <Button 
                    variant="outline-success" 
                    href="/privacy-policy" 
                    className="quick-action-btn w-100"
                  >
                    <i className="bi bi-shield-check me-2"></i>
                    <div>
                      <div className="action-title">Privacy Policy</div>
                      <small className="action-subtitle">Your data</small>
                    </div>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Edit Profile Modal */}
          <Modal show={showEditProfile} onHide={() => setShowEditProfile(false)} centered>
            <Modal.Header closeButton className="elegant-modal-header">
              <Modal.Title>
                <i className="bi bi-person-gear me-2"></i>
                Edit Profile
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* Avatar Upload Section */}
                <Form.Group className="mb-4">
                  <Form.Label>Profile Picture</Form.Label>
                  <div className="avatar-upload-section">
                    <div className="current-avatar-preview mb-3">
                      <div className="avatar-preview-container">
                        {editUserInfo.avatar ? (
                          <img 
                            src={editUserInfo.avatar} 
                            alt="Avatar Preview" 
                            className="avatar-preview-image"
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            <i className="bi bi-person-circle"></i>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="avatar-upload-controls d-flex gap-2 flex-wrap">
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="d-none"
                        id="avatarUpload"
                      />
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => document.getElementById('avatarUpload').click()}
                      >
                        <i className="bi bi-camera me-1"></i>
                        {editUserInfo.avatar ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                      {editUserInfo.avatar && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={removeAvatar}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Remove
                        </Button>
                      )}
                    </div>
                    <small className="text-muted d-block mt-2">
                      Recommended: Square image, max 5MB (JPG, PNG, GIF)
                    </small>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editUserInfo.name}
                    onChange={(e) => setEditUserInfo({...editUserInfo, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={editUserInfo.email}
                    onChange={(e) => setEditUserInfo({...editUserInfo, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editUserInfo.bio || ''}
                    onChange={(e) => setEditUserInfo({...editUserInfo, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setShowEditProfile(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={saveProfile}>
                <i className="bi bi-check-lg me-1"></i>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}

export default Account;
