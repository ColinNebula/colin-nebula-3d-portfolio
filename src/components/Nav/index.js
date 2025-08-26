import React, { useEffect, useState } from "react";
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import logoM from '../../assets/images/logoM.png';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navigation.css'; // Added import for our custom notification styles

function Navigation(props) {
    const { currentTab, setCurrentTab } = props;

    // control navbar expanded state (so we can close it after clicking an item on mobile)
    const [expanded, setExpanded] = useState(false);
    // announce theme changes for screen readers
    const [themeAnnounce, setThemeAnnounce] = useState('');

    // Enhanced notification state with additional properties
    const [notifications, setNotifications] = useState(() => {
      try { 
        const stored = JSON.parse(localStorage.getItem('nebula_notifications') || '[]');
        return stored.map(n => ({
          ...n,
          // Add priority level if not exists
          priority: n.priority || 'normal',
          // Add read status tracking
          read: !!n.read,
          // Add expiration if not exists
          expires: n.expires || null
        }));
      } catch { 
        return []; 
      }
    });
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifAnnounce, setNotifAnnounce] = useState('');
    
    // Filter out expired notifications
    const activeNotifications = notifications.filter(n => 
      !n.expires || new Date(n.expires) > new Date()
    );
    
    // Count unread notifications
    const unreadCount = activeNotifications.filter(n => !n.read).length;

    // Notification categories
    const notificationCategories = ['all', 'system', 'account', 'updates'];
    const [notifCategory, setNotifCategory] = useState('all');

    // Notification panel size
    const [expandedNotifs, setExpandedNotifs] = useState(false);
    
    // desktop push state (persisted)
    const [pushEnabled, setPushEnabled] = useState(() => {
      try { return localStorage.getItem('nebula_push') === '1'; } catch { return false; }
    });
    const [pushPermission, setPushPermission] = useState(() => {
      try { return (typeof Notification !== 'undefined') ? Notification.permission : 'default'; } catch { return 'default'; }
    });
    
    // per-device web-push subscription (persisted)
    const [pushSubscription, setPushSubscription] = useState(() => {
      try { const s = localStorage.getItem('nebula_push_sub'); return s && s.length ? JSON.parse(s) : null; } catch { return null; }
    });
    
    // subscriber/emailing state (admins)
    const [subscribers, setSubscribers] = useState(() => {
      try { return JSON.parse(localStorage.getItem('nebula_email_subscribers') || '[]'); } catch { return []; }
    });
    const [subscribersBusy, setSubscribersBusy] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    // Enhanced subscriber management
    const [subscriberCategories, setSubscriberCategories] = useState(() => {
      try { return JSON.parse(localStorage.getItem('nebula_subscriber_categories') || '["General", "Newsletter", "Product Updates", "Events"]'); } catch { return ["General", "Newsletter", "Product Updates", "Events"]; }
    });
    const [emailTemplates, setEmailTemplates] = useState(() => {
      try { return JSON.parse(localStorage.getItem('nebula_email_templates') || '[]'); } catch { return []; }
    });
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [useHtmlEmail, setUseHtmlEmail] = useState(true);
    const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
    const [newSubscriber, setNewSubscriber] = useState({ name: '', email: '', category: 'General' });
    const [editSubscriberIndex, setEditSubscriberIndex] = useState(-1);
    const [subscriberFilter, setSubscriberFilter] = useState('all');
    const [subscriberSearch, setSubscriberSearch] = useState('');
    // auth (login) state
    const [authToken, setAuthToken] = useState(() => { try { return localStorage.getItem('nebula_auth_token') || null; } catch { return null; } });
    const [authUser, setAuthUser] = useState(() => { try { return JSON.parse(localStorage.getItem('nebula_auth_user') || 'null'); } catch { return null; } });
    // local admin credentials (persisted in localStorage). Change these via localStorage keys 'nebula_admin_name' / 'nebula_admin_pass' or via setLocalAdmin helper below.
    const [adminCreds, setAdminCreds] = useState(() => {
      try {
        return {
          name: localStorage.getItem('colinnebula@gmail.com') || 'colinnebula@gmail.com',
          pass: localStorage.getItem('nebula_admin_pass') || 'admin123'
        };
      } catch (e) { return { name: 'admin', pass: 'admin123' }; }
    });
    const setLocalAdmin = (name, pass) => {
      try { localStorage.setItem('nebula_admin_name', name); localStorage.setItem('nebula_admin_pass', pass); setAdminCreds({ name, pass }); } catch (e) {}
    };
    // is the current authenticated user an administrator?
    const isAdmin = (() => {
      try {
        if (!authUser) return false;
        if (typeof authUser === 'object') return Boolean(authUser.isAdmin || authUser.admin || (String(authUser.username || authUser.user || authUser).toLowerCase() === (adminCreds.name || '').toLowerCase()));
        return String(authUser).toLowerCase() === (adminCreds.name || '').toLowerCase();
      } catch (e) { return false; }
    })();
    const [showLogin, setShowLogin] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginBusy, setLoginBusy] = useState(false);
    const [loginMsg, setLoginMsg] = useState('');
    const [loginErrors, setLoginErrors] = useState([]); // list of validation errors
    const [loginValid, setLoginValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    // disable page scroll when login modal is open
    useEffect(() => {
      try {
        document.body.style.overflow = showLogin ? 'hidden' : '';
      } catch (e) {}
      return () => { try { document.body.style.overflow = ''; } catch (e) {} };
    }, [showLogin]);

    // simple validation: email format and password length
    useEffect(() => {
      const errs = [];
      const email = (loginEmail || '').trim();
      if (!email) errs.push('Email is required');
      else if (!/\S+@\S+\.\S+/.test(email)) errs.push('Enter a valid email');
      if (!loginPassword || loginPassword.length < 6) errs.push('Password must be at least 6 characters');
      setLoginErrors(errs);
      setLoginValid(errs.length === 0);
    }, [loginEmail, loginPassword]);

    useEffect(() => { try { localStorage.setItem('nebula_push_sub', pushSubscription ? JSON.stringify(pushSubscription) : ''); } catch(e){} }, [pushSubscription]);
    useEffect(() => {
      try {
        if (authToken) localStorage.setItem('nebula_auth_token', authToken);
        else localStorage.removeItem('nebula_auth_token');
        if (authUser) localStorage.setItem('nebula_auth_user', JSON.stringify(authUser));
        else localStorage.removeItem('nebula_auth_user');
      } catch (e) {}
    }, [authToken, authUser]);
 
    useEffect(() => {
      try { localStorage.setItem('nebula_notifications', JSON.stringify(notifications)); } catch (e) {}
    }, [notifications]);
    useEffect(() => { try { localStorage.setItem('nebula_push', pushEnabled ? '1' : '0'); } catch(e){} }, [pushEnabled]);
    // convert URL-safe base64 (VAPID) to Uint8Array
    const urlBase64ToUint8Array = (base64String) => {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
      return outputArray;
    };

    const sendSubscriptionToServer = async (subscription) => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
        await fetch('/api/subscribe', { method: 'POST', headers, body: JSON.stringify({ subscription }) });
      } catch (e) { /* ignore network failures */ }
    };
    const removeSubscriptionFromServer = async (subscription) => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
        await fetch('/api/unsubscribe', { method: 'POST', headers, body: JSON.stringify({ subscription }) });
      } catch (e) {}
    };

    const subscribeForPush = async () => {
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          setNotifAnnounce('Push not supported in this browser'); setTimeout(() => setNotifAnnounce(''), 1400); return;
        }
        if (Notification.permission !== 'granted') {
          await requestPushPermission();
          if (Notification.permission !== 'granted') return;
        }
        const vapidKey = window.__VAPID_PUBLIC_KEY || localStorage.getItem('nebula_vapid');
        if (!vapidKey) { setNotifAnnounce('VAPID key missing; contact server'); setTimeout(() => setNotifAnnounce(''), 1400); return; }
        const reg = await navigator.serviceWorker.register('/sw.js').catch(() => null);
        if (!reg) { setNotifAnnounce('Service worker registration failed'); setTimeout(() => setNotifAnnounce(''), 1400); return; }
        const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapidKey) });
        const js = sub.toJSON ? sub.toJSON() : sub;
        setPushSubscription(js);
        setPushEnabled(true);
        localStorage.setItem('nebula_push_sub', JSON.stringify(js));
        await sendSubscriptionToServer(js);
        setNotifAnnounce('Subscribed for push on this device');
        setTimeout(() => setNotifAnnounce(''), 1600);
      } catch (e) {
        setNotifAnnounce('Subscription failed'); setTimeout(() => setNotifAnnounce(''), 1400);
      }
    };

    const unsubscribePush = async () => {
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) return;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          const js = sub.toJSON ? sub.toJSON() : sub;
          await sub.unsubscribe();
          await removeSubscriptionFromServer(js);
          localStorage.removeItem('nebula_push_sub');
          setPushSubscription(null);
          setPushEnabled(false);
          setNotifAnnounce('Unsubscribed from push');
          setTimeout(() => setNotifAnnounce(''), 1200);
        }
      } catch (e) {
        setNotifAnnounce('Unsubscribe failed'); setTimeout(() => setNotifAnnounce(''), 1200);
      }
    };

    // Enhanced addNotification function with more options and Updates link capability
    const addNotification = (text, options = {}) => {
      const {
        priority = 'normal',
        category = 'system',
        expires = null, // null = no expiration
        icon = null,
        link = null,
        actions = []
      } = options;
      
      // Add a special action for updates notifications that navigates to the Updates page
      if (category === 'update' && !actions.some(a => a.isUpdateLink)) {
        actions.push({
          label: 'View Updates',
          handler: () => navClick('updates'),
          isUpdateLink: true
        });
      }
      
      const n = { 
        id: Date.now(), 
        text, 
        read: false, 
        ts: new Date().toISOString(),
        priority,
        category,
        expires,
        icon,
        link,
        actions
      };
      
      setNotifications(s => [n, ...s]);
      setNotifAnnounce(text);
      
      // desktop push when enabled & permitted
      if (pushEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        sendDesktopNotification('Colin Nebula', text);
      }
      
      return n.id; // Return ID so notifications can be referenced later
    };
    
    // Mark specific notification as read
    const markAsRead = (notificationId) => {
      setNotifications(currentNotifications => 
        currentNotifications.map(n => 
          n.id === notificationId ? {...n, read: true} : n
        )
      );
    };
    
    // Mark all notifications as read
    const markAllRead = () => {
      setNotifications(currentNotifications => 
        currentNotifications.map(n => ({...n, read: true}))
      );
      setNotifAnnounce('All notifications marked as read');
      setTimeout(() => setNotifAnnounce(''), 1200);
    };
    
    // Clear all notifications
    const clearNotifications = () => {
      setNotifications([]);
      setNotifAnnounce('All notifications cleared');
      setTimeout(() => setNotifAnnounce(''), 1200);
    };
    
    // Filter notifications based on category
    const filteredNotifications = activeNotifications.filter(n => 
      notifCategory === 'all' || n.category === notifCategory
    );
    
    // Render individual notification item
    const renderNotificationItem = (notification) => {
      return (
        <li 
          key={notification.id} 
          className={`notification-item ${notification.read ? 'read' : 'unread'} priority-${notification.priority}`}
        >
          <div className="notification-content">
            {notification.icon && <div className="notification-icon">{notification.icon}</div>}
            <div className="notification-text">{notification.text}</div>
            <div className="notification-time">
              {new Date(notification.ts).toLocaleString()}
            </div>
          </div>
          <div className="notification-actions">
            {notification.actions && notification.actions.map((action, idx) => (
              <button 
                key={idx} 
                className="btn btn-sm btn-link" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  action.handler();
                }}
              >
                {action.label}
              </button>
            ))}
            {notification.link && (
              <a 
                href={notification.link} 
                className="notification-link" 
                onClick={(e) => markAsRead(notification.id)}
              >
                View
              </a>
            )}
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(notification.id);
              }}
              title="Mark as read"
              aria-label="Mark as read"
              disabled={notification.read}
            >
              ✓
            </button>
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={(e) => {
                e.stopPropagation();
                deleteNotification(notification.id);
              }}
              title="Delete notification"
              aria-label="Delete notification"
            >
              ×
            </button>
          </div>
        </li>
      );
    };
    
    // Notify all devices (for admin to send push notifications)
    const notifyAllDevices = async (message, options = {}) => {
      const notificationId = addNotification(message, options);
      
      try {
        if (authToken) {
          // Attempt to send to server for push delivery to all subscribed devices
          await fetch('/api/send-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
              message,
              options,
              id: notificationId
            })
          });
        }
      } catch (e) {
        // Silently fail if server push fails - at least local notification was added
      }
      
      return notificationId;
    };
    
    // Delete specific notification
    const deleteNotification = (notificationId) => {
      setNotifications(currentNotifications => 
        currentNotifications.filter(n => n.id !== notificationId)
      );
    };

    // fetch subscribers (server first, fallback to localStorage)
    const fetchSubscribers = async () => {
      setSubscribersBusy(true);
      try {
        let list = [];
        try {
          const headers = { 'Content-Type': 'application/json' };
          if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
          const res = await fetch('/api/subscribers', { method: 'GET', headers, credentials: 'same-origin' });
          if (res.ok) {
            list = await res.json().catch(() => []);
          }
        } catch (e) { /* ignore */ }
        if (!list || !list.length) {
          const saved = localStorage.getItem('nebula_email_subscribers');
          list = saved ? JSON.parse(saved) : [];
        }
        setSubscribers(Array.isArray(list) ? list : []);
        try { localStorage.setItem('nebula_email_subscribers', JSON.stringify(Array.isArray(list) ? list : [])); } catch (e) {}
        setEmailMsg('Subscribers refreshed');
        setTimeout(() => setEmailMsg(''), 1200);
      } catch (e) {
        setEmailMsg('Failed to load subscribers');
        setTimeout(() => setEmailMsg(''), 1400);
      } finally {
        setSubscribersBusy(false);
      }
    };

    // enhanced subscriber management
    const addSubscriber = async (subscriber) => {
      if (!subscriber.email || !subscriber.email.includes('@')) {
        setEmailMsg('Valid email address required');
        return false;
      }
      
      setSubscribersBusy(true);
      try {
        // Try to add subscriber via API first
        try {
          const headers = { 'Content-Type': 'application/json' };
          if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
          
          const res = await fetch('/api/subscribers', { 
            method: 'POST', 
            headers, 
            credentials: 'same-origin',
            body: JSON.stringify({
              ...subscriber,
              ts: new Date().toISOString()
            })
          });
          
          if (res.ok) {
            await fetchSubscribers(); // Refresh the list from server
            setEmailMsg('Subscriber added successfully');
            setTimeout(() => setEmailMsg(''), 1400);
            return true;
          }
        } catch (e) { /* Fall back to local storage */ }
        
        // Fallback: add to local storage
        const newList = [
          {
            ...subscriber,
            id: Date.now(),
            ts: new Date().toISOString()
          },
          ...subscribers
        ];
        
        setSubscribers(newList);
        try { localStorage.setItem('nebula_email_subscribers', JSON.stringify(newList)); } catch (e) {}
        
        setEmailMsg('Subscriber added locally');
        setTimeout(() => setEmailMsg(''), 1400);
        return true;
      } catch (e) {
        setEmailMsg('Failed to add subscriber');
        setTimeout(() => setEmailMsg(''), 1400);
        return false;
} finally {
    setSubscribersBusy(false);
  }
};

const updateSubscriber = async (index, updatedData) => {
  if (!updatedData.email || !updatedData.email.includes('@')) {
    setEmailMsg('Valid email address required');
    return false;
  }
  
  setSubscribersBusy(true);
  try {
    const subscriber = subscribers[index];
    if (!subscriber) {
      setEmailMsg('Subscriber not found');
      return false;
    }
    
    // Try to update via API first
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      
      const res = await fetch(`/api/subscribers/${subscriber.id || index}`, { 
        method: 'PUT', 
        headers, 
        credentials: 'same-origin',
        body: JSON.stringify({
          ...subscriber,
          ...updatedData,
          updated: new Date().toISOString()
        })
      });
      
      if (res.ok) {
        await fetchSubscribers(); // Refresh the list from server
        setEmailMsg('Subscriber updated successfully');
        setTimeout(() => setEmailMsg(''), 1400);
        return true;
      }
    } catch (e) { /* Fall back to local storage */ }
    
    // Fallback: update in local storage
    const updatedList = [...subscribers];
    updatedList[index] = { 
      ...subscriber, 
      ...updatedData,
      updated: new Date().toISOString() 
    };
    
    setSubscribers(updatedList);
    try { localStorage.setItem('nebula_email_subscribers', JSON.stringify(updatedList)); } catch (e) {}
    
    setEmailMsg('Subscriber updated locally');
    setTimeout(() => setEmailMsg(''), 1400);
    return true;
  } catch (e) {
    setEmailMsg('Failed to update subscriber');
    setTimeout(() => setEmailMsg(''), 1400);
    return false;
  } finally {
    setSubscribersBusy(false);
  }
};

const deleteSubscriber = async (index) => {
  setSubscribersBusy(true);
  try {
    const subscriber = subscribers[index];
    if (!subscriber) {
      setEmailMsg('Subscriber not found');
      return false;
    }
    
    // Try to delete via API first
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      
      const res = await fetch(`/api/subscribers/${subscriber.id || index}`, { 
        method: 'DELETE', 
        headers, 
        credentials: 'same-origin'
      });
      
      if (res.ok) {
        await fetchSubscribers(); // Refresh the list from server
        setEmailMsg('Subscriber deleted successfully');
        setTimeout(() => setEmailMsg(''), 1400);
        return true;
      }
    } catch (e) { /* Fall back to local storage */ }
    
    // Fallback: remove from local storage
    const updatedList = subscribers.filter((_, i) => i !== index);
    setSubscribers(updatedList);
    try { localStorage.setItem('nebula_email_subscribers', JSON.stringify(updatedList)); } catch (e) {}
    
    setEmailMsg('Subscriber removed locally');
    setTimeout(() => setEmailMsg(''), 1400);
    return true;
  } catch (e) {
    setEmailMsg('Failed to remove subscriber');
    setTimeout(() => setEmailMsg(''), 1400);
    return false;
  } finally {
    setSubscribersBusy(false);
  }
};

// Save email as template
const saveEmailTemplate = () => {
  if (!emailSubject.trim()) {
    setEmailMsg('Template requires a subject');
    return;
  }
  
  const newTemplate = {
    id: Date.now(),
    name: emailSubject.trim(),
    subject: emailSubject,
    body: emailBody,
    isHtml: useHtmlEmail,
    created: new Date().toISOString()
  };
  
  const updatedTemplates = [...emailTemplates, newTemplate];
  setEmailTemplates(updatedTemplates);
  
  try { localStorage.setItem('nebula_email_templates', JSON.stringify(updatedTemplates)); } catch (e) {}
  
  setEmailMsg('Email template saved');
  setTimeout(() => setEmailMsg(''), 1400);
};

// Load email template
const loadEmailTemplate = (templateId) => {
  const template = emailTemplates.find(t => t.id === templateId);
  if (template) {
    setEmailSubject(template.subject || '');
    setEmailBody(template.body || '');
    setUseHtmlEmail(template.isHtml || false);
    setSelectedTemplate(templateId);
    setEmailMsg('Template loaded');
    setTimeout(() => setEmailMsg(''), 1200);
  }
};

// Delete email template
const deleteEmailTemplate = (templateId) => {
  const updatedTemplates = emailTemplates.filter(t => t.id !== templateId);
  setEmailTemplates(updatedTemplates);
  
  try { localStorage.setItem('nebula_email_templates', JSON.stringify(updatedTemplates)); } catch (e) {}
  
  if (selectedTemplate === templateId) {
    setSelectedTemplate(null);
  }
  
  setEmailMsg('Template deleted');
  setTimeout(() => setEmailMsg(''), 1200);
};

// Export subscribers to CSV
const exportSubscribersToCSV = () => {
  try {
    let csvContent = "data:text/csv;charset=utf-8,Name,Email,Category,Subscribed Date\n";
    
    subscribers.forEach(sub => {
      const name = sub.name || sub.displayName || '';
      const email = sub.email || sub.address || '';
      const category = sub.category || 'General';
      const date = sub.ts ? new Date(sub.ts).toLocaleDateString() : '';
      
      csvContent += `"${name}","${email}","${category}","${date}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setEmailMsg('Subscribers exported to CSV');
    setTimeout(() => setEmailMsg(''), 1400);
  } catch (e) {
    setEmailMsg('Export failed');
    setTimeout(() => setEmailMsg(''), 1400);
  }
};

// Filter subscribers based on search and category
const filteredSubscribers = (() => {
  if (!subscribers || !subscribers.length) return [];
  
  return subscribers.filter(sub => {
    // Apply category filter if not "all"
    if (subscriberFilter !== 'all' && (sub.category || 'General') !== subscriberFilter) {
      return false;
    }
    
    // Apply search filter
    if (subscriberSearch.trim()) {
      const search = subscriberSearch.toLowerCase();
      const name = (sub.name || sub.displayName || '').toLowerCase();
      const email = (sub.email || sub.address || '').toLowerCase();
      
      return name.includes(search) || email.includes(search);
    }
    
    return true;
  });
})();
 
// send email to subscribers via server; fallback to copy emails to clipboard
    const emailSubscribers = async () => {
      if (!emailSubject.trim() || !emailBody.trim()) { setEmailMsg('Subject and body required'); return; }
      setSubscribersBusy(true);
      try {
        const list = (filteredSubscribers || []).map(s => s.email || s.address).filter(Boolean);
        if (!list.length) {
          setEmailMsg('No subscriber emails found');
          setSubscribersBusy(false);
          return;
        }
        // attempt server-side send
        try {
          const headers = { 'Content-Type': 'application/json' };
          if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
          const res = await fetch('/api/email-subscribers', {
            method: 'POST',
            headers,
            credentials: 'same-origin',
            body: JSON.stringify({ 
              subject: emailSubject.trim(), 
              body: emailBody.trim(),
              isHtml: useHtmlEmail,
              trackOpens: true,
              recipients: list
            })
          });
          if (res.ok) {
            setEmailMsg('Emails queued/sent via server');
            setTimeout(() => setEmailMsg(''), 1800);
            setShowEmailModal(false);
            setEmailSubject(''); setEmailBody('');
            return;
          }
        } catch (e) { /* ignore server failure */ }
        // fallback: copy emails to clipboard and notify admin to send via their client
        const all = list.join(', ');
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(all);
        else { const ta = document.createElement('textarea'); ta.value = all; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }
        setEmailMsg('Emails copied to clipboard — paste into your mail client (BCC).');
        setTimeout(() => setEmailMsg(''), 3000);
        setShowEmailModal(false);
      } catch (e) {
        setEmailMsg('Failed to email subscribers');
        setTimeout(() => setEmailMsg(''), 1600);
      } finally {
        setSubscribersBusy(false);
      }
    };

    // sync prior subscription on mount
    useEffect(() => {
      (async () => {
        try {
          if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
          const reg = await navigator.serviceWorker.getRegistration();
          if (!reg) return;
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            const js = sub.toJSON ? sub.toJSON() : sub;
            setPushSubscription(js);
            localStorage.setItem('nebula_push_sub', JSON.stringify(js));
            setPushEnabled(true);
          } else {
            const saved = localStorage.getItem('nebula_push_sub');
            if (saved) setPushSubscription(JSON.parse(saved));
          }
        } catch (e) {}
      })();
    }, []);
 
    // Using already defined unreadCount variable from earlier in the component

    const sendDesktopNotification = (title, body) => {
      try {
        if (typeof Notification === 'undefined') return;
        if (Notification.permission !== 'granted' || !pushEnabled) return;
        new Notification(title || 'Colin Nebula', { body: body || '', icon: logoM });
      } catch (e) {}
    };
    // send a quick test notification and announce outcome
    const testDesktopNotification = () => {
      try {
        if (typeof Notification === 'undefined') {
          setNotifAnnounce('Notifications not supported');
          setTimeout(() => setNotifAnnounce(''), 1400);
          return;
        }
        if (Notification.permission !== 'granted') {
          setNotifAnnounce('Please enable desktop notifications first');
          setTimeout(() => setNotifAnnounce(''), 1400);
          return;
        }
        if (!pushEnabled) {
          setNotifAnnounce('Desktop notifications are disabled in settings');
          setTimeout(() => setNotifAnnounce(''), 1400);
          return;
        }
        sendDesktopNotification('Test — Colin Nebula', 'This is a test notification.');
        setNotifAnnounce('Test notification sent');
        setTimeout(() => setNotifAnnounce(''), 1400);
      } catch (e) {
        setNotifAnnounce('Test failed');
        setTimeout(() => setNotifAnnounce(''), 1400);
      }
    };

    const requestPushPermission = async () => {
      try {
        if (typeof Notification === 'undefined' || !Notification.requestPermission) {
          setNotifAnnounce('Notifications not supported in this browser');
          setTimeout(() => setNotifAnnounce(''), 1400);
          return;
        }
        const p = await Notification.requestPermission();
        setPushPermission(p);
        if (p === 'granted') {
          setPushEnabled(true);
          setNotifAnnounce('Desktop notifications enabled');
        } else {
          setPushEnabled(false);
          setNotifAnnounce(p === 'denied' ? 'Desktop notifications blocked' : 'Desktop notifications not enabled');
        }
        setTimeout(() => setNotifAnnounce(''), 1400);
      } catch (e) {
        setNotifAnnounce('Notification permission request failed');
        setTimeout(() => setNotifAnnounce(''), 1400);
      }
    };

    // small dev hook to add notifications from console
    try { window.__addNebulaNotification = addNotification; } catch(e) {}

    // initialize user-preference: 'light' | 'dark' | 'auto'
    const [theme, setTheme] = useState(() => {
      try {
        const saved = localStorage.getItem('nebula_theme');
        if (saved) return saved; // allow 'auto'
        return 'auto';
      } catch (e) { return 'auto'; }
    });

    // appliedTheme is the actual mode ('light'|'dark') currently in effect
    const [appliedTheme, setAppliedTheme] = useState(() => {
      try {
        const saved = localStorage.getItem('nebula_theme');
        if (saved && saved !== 'auto') return saved;
        if (typeof window !== 'undefined' && window.matchMedia) {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
      } catch (e) {}
      return 'dark';
    });
    // respect reduced-motion preference for transitions
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // sticky header state
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const onScroll = () => setIsSticky(window.scrollY > 10);
      window.addEventListener('scroll', onScroll, { passive: true });
      // set initial state
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // apply theme (supports 'auto' which follows system preference)
    useEffect(() => {
      let mq;
      const apply = (mode) => {
        try {
          // small transition class (skip when user prefers reduced motion)
          if (!prefersReducedMotion) {
            try { document.documentElement.classList.add('theme-transition'); } catch(e){}
            setTimeout(() => { try { document.documentElement.classList.remove('theme-transition'); } catch(e){} }, 240);
          }
          document.body.classList.remove('theme-light', 'theme-dark');
          document.body.classList.add(mode === 'light' ? 'theme-light' : 'theme-dark');
          document.documentElement.setAttribute('data-theme', mode);
          setAppliedTheme(mode);
          setThemeAnnounce(`${mode === 'light' ? 'Light' : 'Dark'} theme active${theme === 'auto' ? ' (auto)' : ''}`);
        } catch (e) {}
      };

      if (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia) {
        mq = window.matchMedia('(prefers-color-scheme: dark)');
        apply(mq.matches ? 'dark' : 'light');
        const onChange = (ev) => apply(ev.matches ? 'dark' : 'light');
        try { mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange); } catch (e) {}
        try { localStorage.setItem('nebula_theme', 'auto'); } catch (e) {}
        const t = setTimeout(() => setThemeAnnounce(''), 1200);
        return () => { try { mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange); } catch(e){}; clearTimeout(t); };
      } else {
        apply(theme === 'light' ? 'light' : 'dark');
        try { localStorage.setItem('nebula_theme', theme); } catch (e) {}
        const t = setTimeout(() => setThemeAnnounce(''), 1200);
        return () => clearTimeout(t);
      }
    }, [theme]);

    // cycle theme: light -> dark -> auto -> light
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'auto' : 'light');
    // keyboard shortcut: 't' toggles theme (ignore typing in inputs)
    useEffect(() => {
      const handler = (e) => {
        if (!e.key) return;
        if (e.key.toLowerCase() !== 't') return;
        const tag = e.target && e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
        toggleTheme();
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [toggleTheme]);

    // restore last tab on mount
    useEffect(() => {
      try {
        const saved = localStorage.getItem('nebula_currentTab');
        if (saved && saved !== currentTab) setCurrentTab(saved);
      } catch (e) { /* ignore */ }
    }, []); // run once

    // central navigation handler
    const navClick = (tab) => {
      setCurrentTab(tab);
      setExpanded(false); // close mobile menu after navigation
      try { localStorage.setItem('nebula_currentTab', tab); } catch (e) {}
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // keyboard activation for accessibility
    const onKeyActivate = (e, tab) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navClick(tab);
      }
    };

    // logout helper (clear auth state and persisted items)
    const logout = async () => {
      try {
        setAuthToken(null);
        setAuthUser(null);
        try {
          localStorage.removeItem('nebula_auth_token');
          localStorage.removeItem('nebula_auth_user');
        } catch (e) {}
        setShowLogin(false);
        setNotifAnnounce('Logged out');
        setTimeout(() => setNotifAnnounce(''), 1000);
      } catch (e) {}
    };

    // login helper (authenticate and persist auth state)
    const login = async () => {
      // prevent submit if invalid client-side
      if (!loginValid) {
        setLoginMsg('Please fix the highlighted errors');
        return;
      }
      try {
        setLoginBusy(true);
        setLoginMsg('');
        const payload = { email: (loginEmail || '').trim(), password: loginPassword || '' };
        // local admin check (short-circuits server call)
        try {
          if (payload.email && payload.password && adminCreds && payload.email.toLowerCase() === (adminCreds.name || '').toLowerCase() && payload.password === (adminCreds.pass || '')) {
            // sign in locally as admin
            setAuthToken('local-admin-token');
            setAuthUser({ username: adminCreds.name, isAdmin: true });
            setShowLogin(false);
            setLoginEmail('');
            setLoginPassword('');
            setLoginMsg('');
            setNotifAnnounce('Admin logged in');
            setTimeout(() => setNotifAnnounce(''), 1000);
            setLoginBusy(false);
            return;
          }
        } catch (e) {}
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          const token = data.token || data.authToken || null;
          const user = data.user || data.username || payload.email || null;
          if (token) {
            setAuthToken(token);
            setAuthUser(user);
            // persist according to rememberMe
            try {
              if (rememberMe) localStorage.setItem('nebula_auth_token', token);
              else sessionStorage.setItem('nebula_auth_token', token);
            } catch (e) {}
            // inform server of current device subscription (if present)
            try { if (pushSubscription) await sendSubscriptionToServer(pushSubscription); } catch (e) { /* ignore */ }
            setShowLogin(false);
            setLoginEmail('');
            setLoginPassword('');
            setLoginMsg('');
            setNotifAnnounce('Logged in');
            setTimeout(() => setNotifAnnounce(''), 1000);
          } else {
            setLoginMsg(data.message || 'Login succeeded but no token returned');
          }
        } else {
          const err = await res.json().catch(() => ({}));
          setLoginMsg(err.message || (res.status === 401 ? 'Invalid email or password' : 'Login failed'));
        }
      } catch (e) {
        setLoginMsg('Network error during login');
      } finally {
        setLoginBusy(false);
      }
    };

    const handleForgot = () => {
      const email = (loginEmail || '').trim();
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setLoginMsg('Enter your email above to receive reset instructions');
        return;
      }
      // graceful fallback: simulate sending reset link
      setLoginMsg('If this email is registered, a reset link has been sent (simulated).');
      setTimeout(() => setLoginMsg(''), 4000);
    };

  // Navigate to account page
  const navigateToAccount = () => {
    setShowNotifications(false);
    navClick('account');
  };
  
  // toggle notifications with 'n'
  useEffect(() => {
    const kHandler = (e) => {
      if (e.key && e.key.toLowerCase() === 'n') {
        // only admins can toggle notifications
        if (!isAdmin) return;
        // ignore typing in inputs
        const tag = e.target && e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
        setShowNotifications(s => !s);
      }
    };
    window.addEventListener('keydown', kHandler);
    return () => window.removeEventListener('keydown', kHandler);
  }, [isAdmin]);
  return (
    <Navbar
      expanded={expanded}
      onToggle={setExpanded}
      bg="dark"
      expand="md"
      variant="dark"
      sticky="top"
      collapseOnSelect
      role="navigation"
      aria-label="Main navigation"
      className={isSticky ? 'navbar navbar-scrolled' : 'navbar'}
      style={{
        transition: prefersReducedMotion ? 'none' : 'box-shadow 200ms, padding 200ms',
        boxShadow: isSticky ? '0 8px 24px rgba(0,0,0,0.20)' : 'none',
        paddingTop: isSticky ? 6 : undefined,
        paddingBottom: isSticky ? 6 : undefined,
      }}
    >
      <Container>
        <Navbar.Brand href="home">
        <img src={logoM} width="90px" height="40px" alt="logo" />
        Colin Nebula 3D 
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" aria-label="Toggle navigation" />
        <Navbar.Collapse id="basic-navbar-nav" aria-label="Primary">
          <Nav className="ms-auto">
            {/* Home */}
            <Nav.Link className={currentTab === "home" ? "mx-2 navActive" : "mx-2"}>
              <button
                type="button"
                className="nav-button"
                onClick={() => navClick("home")}
                onKeyDown={(e) => onKeyActivate(e, "home")}
                aria-current={currentTab === "home" ? "page" : undefined}
                title="Go to Home"
              >
                Home
              </button>
            </Nav.Link>

            {/* Portfolio */}
            <Nav.Link className={currentTab === "portfolio" ? "mx-2 navActive" : "mx-2"}>
              <button
                type="button"
                className="nav-button"
                onClick={() => navClick("portfolio")}
                onKeyDown={(e) => onKeyActivate(e, "portfolio")}
                aria-current={currentTab === "portfolio" ? "page" : undefined}
                title="Go to Portfolio"
              >
                Portfolio
              </button>
            </Nav.Link>

            {/* Artwork */}
            <Nav.Link className={currentTab === "artwork" ? "mx-2 navActive" : "mx-2"}>
              <button
                type="button"
                className="nav-button"
                onClick={() => navClick("artwork")}
                onKeyDown={(e) => onKeyActivate(e, "artwork")}
                aria-current={currentTab === "artwork" ? "page" : undefined}
                title="Go to Artwork"
              >
                Artwork
              </button>
            </Nav.Link>

            {/* Animation */}
            <Nav.Link className={currentTab === "animation" ? "mx-2 navActive" : "mx-2"}>
              <button
                type="button"
                className="nav-button"
                onClick={() => navClick("animation")}
                onKeyDown={(e) => onKeyActivate(e, "animation")}
                aria-current={currentTab === "animation" ? "page" : undefined}
                title="Go to Animation"
              >
                Animation
              </button>
            </Nav.Link>

            {/* VFX / Video Editing */}
            <Nav.Link className={currentTab === "video-editing" ? "mx-2 navActive" : "mx-2"}>
              <button
                type="button"
                className="nav-button"
                onClick={() => navClick("video-editing")}
                onKeyDown={(e) => onKeyActivate(e, "video-editing")}
                aria-current={currentTab === "video-editing" ? "page" : undefined}
                title="Go to VFX"
              >
                VFX
              </button>
            </Nav.Link>

            {/* More dropdown */}
            <NavDropdown title="More" id="nav-more" align="end" menuVariant="dark" aria-label="More links">
              <NavDropdown.Item href="./components/Private-policy" target="_blank" rel="noopener noreferrer" title="Open Privacy Policy">Privacy Policy</NavDropdown.Item>
              <NavDropdown.Item href="mailto:colinnebula@gmail.com" title="Email Colin">Contact</NavDropdown.Item>
              <NavDropdown.Item 
                onClick={() => navClick("resume")} 
                title="View Resume"
              >
                Resume
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="https://github.com/ColinNebula" target="_blank" rel="noopener noreferrer" title="Open GitHub">GitHub</NavDropdown.Item>
            </NavDropdown>
 
            {/* Theme toggle */}
            <div className="mx-2" style={{ display: 'flex', alignItems: 'center' }}>
              {/* Enhanced Notifications with Updates link */}
              <div className="notification-dropdown">
                <button
                  className="notification-bell-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-label={`Notifications (${unreadCount} unread)`}
                  aria-expanded={showNotifications}
                  aria-controls="notification-panel"
                >
                  <span id="notification-bell-icon" className={`notification-icon ${unreadCount > 0 ? 'has-unread' : ''}`}>
                    🔔
                  </span>
                  {unreadCount > 0 && (
                    <span className="notification-badge" aria-hidden="true">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Enhanced Notification Panel with Account and Updates links */}
                {showNotifications && (
                  <div 
                    id="notification-panel" 
                    className={`notification-panel ${expandedNotifs ? 'expanded' : ''}`}
                    role="dialog"
                    aria-label="Notifications"
                  >
                    <div className="notification-header">
                      <h3>Notifications</h3>
                      <div className="notification-actions">
                        <Button
                          variant="link"
                          className="p-0 me-2 btn-updates-link"
                          onClick={() => {
                            setShowNotifications(false);
                            navClick('updates');
                          }}
                          title="View all updates"
                        >
                          <i className="bi bi-arrow-up-right-circle"></i> Updates
                        </Button>
                        <Button
                          variant="link"
                          className="p-0 me-2 btn-account-link"
                          onClick={navigateToAccount}
                          title="Go to account settings"
                        >
                          <i className="bi bi-person-circle"></i> Account
                        </Button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setExpandedNotifs(!expandedNotifs)}
                          aria-label={expandedNotifs ? "Collapse panel" : "Expand panel"}
                        >
                          {expandedNotifs ? '↓' : '↑'}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setShowNotifications(false)}
                          aria-label="Close notifications"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    {/* Notification Controls */}
                    <div className="notification-controls">
                      {/* Category Filters */}
                      <div className="notification-categories">
                        {notificationCategories.map(category => (
                          <button
                            key={category}
                            className={`category-btn ${notifCategory === category ? 'active' : ''}`}
                            onClick={() => setNotifCategory(category)}
                            aria-pressed={notifCategory === category}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </button>
                        ))}
                      </div>
                      
                      {/* Management Buttons */}
                      <div className="notification-management">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={markAllRead}
                          disabled={unreadCount === 0}
                          aria-disabled={unreadCount === 0}
                        >
                          Mark all read
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={clearNotifications}
                          disabled={filteredNotifications.length === 0}
                          aria-disabled={filteredNotifications.length === 0}
                        >
                          Clear all
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => {
                            setShowNotifications(false);
                            navClick("updates");
                          }}
                          title="View all updates"
                        >
                          View All Updates
                        </button>
                      </div>
                    </div>
                    
                    {/* Notification Settings (Admin Only) */}
                    {isAdmin && (
                      <div className="notification-settings">
                        <div className="notification-setting-item">
                          <div>
                            <span className="setting-label">Desktop notifications:</span>
                            <span className={`setting-status ${pushEnabled && pushPermission === 'granted' ? 'enabled' : 'disabled'}`}>
                              {pushEnabled && pushPermission === 'granted' ? 'Enabled' : (pushPermission === 'denied' ? 'Blocked' : 'Disabled')}
                            </span>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={async () => {
                              if (typeof Notification === 'undefined') { setNotifAnnounce('Notifications not supported'); setTimeout(() => setNotifAnnounce(''), 1400); return; }
                              if (Notification.permission === 'granted') {
                                if ('serviceWorker' in navigator && 'PushManager' in window) {
                                  if (pushSubscription) await unsubscribePush();
                                  else await subscribeForPush();
                                } else {
                                  setPushEnabled(s => { const v = !s; setNotifAnnounce(v ? 'Desktop notifications enabled' : 'Desktop notifications disabled'); setTimeout(() => setNotifAnnounce(''), 1200); return v; });
                                }
                              } else {
                                await requestPushPermission();
                              }
                            }}
                          >
                            {pushSubscription ? 'Unsubscribe' : (pushEnabled && pushPermission === 'granted' ? 'Disable' : 'Enable')}
                          </button>
                        </div>
                        
                        {/* Admin Notification Controls */}
                        <div className="admin-notification-controls">
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={testDesktopNotification}
                            title="Send test notification"
                          >
                            Test Notification
                          </button>
                          
                          {/* Create New Notification Button */}
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => {
                              // Simple prompt for demo - in real app, use a modal
                              const message = prompt('Enter notification message:');
                              if (message) {
                                notifyAllDevices(message, {
                                  category: 'system',
                                  priority: 'normal'
                                });
                              }
                            }}
                          >
                            Create Notification
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Notification List */}
                    <div className="notification-list-container">
                      {filteredNotifications.length === 0 ? (
                        <div className="empty-state">
                          <div className="empty-icon">🔔</div>
                          <p>No notifications to display</p>
                        </div>
                      ) : (
                        <ul className="notification-list">
                          {filteredNotifications.map(notification => renderNotificationItem(notification))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Theme toggle button */}
              <button
                type="button"
                className="nav-button"
                onClick={toggleTheme}
                aria-pressed={appliedTheme === 'dark'}
                aria-label={`Toggle theme (preference: ${theme}; applied: ${appliedTheme}). Press T to toggle.`}
                title={`Theme: ${theme === 'auto' ? 'Auto (follows system)' : (theme === 'light' ? 'Light' : 'Dark')} — press T to toggle`}
                style={{ padding: '6px 10px' }}
              >
                {theme === 'auto' ? '🌓 Auto' : (appliedTheme === 'light' ? '🌞 Light' : '🌙 Dark')}
              </button>
              
              <button
                 type="button"
                 className="btn btn-sm btn-outline-light"
                 onClick={() => { authToken ? logout() : setShowLogin(true); }}
                 style={{ marginLeft: 8 }}
                 aria-label={authToken ? 'Logout' : 'Login'}
               >
                 {authToken ? (typeof authUser === 'string' ? `Logout (${authUser})` : `Logout`) : 'Login'}
               </button>
               {/* Login modal (form-backed) */}
               <Modal show={showLogin} onHide={() => setShowLogin(false)} centered fullscreen="sm-down" aria-labelledby="nav-login-title">
                 <form onSubmit={(e) => { e.preventDefault(); login(); }}>
                   <Modal.Header closeButton>
                     <Modal.Title id="nav-login-title">Sign in</Modal.Title>
                   </Modal.Header>
                   <Modal.Body>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                       <label htmlFor="login-email" className="visually-hidden">Email</label>
                       <input id="login-email" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@example.com" className="form-control" required aria-describedby={loginErrors.length ? 'login-errors' : undefined} />
                       <label htmlFor="login-password" className="visually-hidden">Password</label>
                       <div style={{ display: 'flex', gap: 8 }}>
                         <input id="login-password" type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Password" className="form-control" required aria-describedby={loginErrors.length ? 'login-errors' : undefined} />
                         <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(s => !s)} aria-pressed={showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                           {showPassword ? 'Hide' : 'Show'}
                         </button>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                         <input id="remember-me" type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                         <label htmlFor="remember-me" style={{ fontSize: 13 }}>Remember me</label>
                         <button type="button" className="btn btn-link btn-sm" onClick={handleForgot} style={{ marginLeft: 'auto' }}>Forgot password?</button>
                       </div>
                       {loginErrors.length > 0 && (
                         <div id="login-errors" className="text-danger" role="alert" aria-live="assertive" style={{ marginTop: 8 }}>
                           <ul style={{ margin: 0, paddingLeft: 18 }}>{loginErrors.map((e,i) => <li key={i}>{e}</li>)}</ul>
                         </div>
                       )}
                       {loginMsg && !loginErrors.length && <div className="text-danger" role="status" aria-live="polite" style={{ marginTop: 8 }}>{loginMsg}</div>}
                     </div>
                   </Modal.Body>
                   <Modal.Footer>
                     <Button variant="secondary" onClick={() => setShowLogin(false)}>Cancel</Button>
                     <Button type="submit" variant="primary" disabled={loginBusy || !loginValid} aria-disabled={loginBusy || !loginValid}>
                       {loginBusy ? (<><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Signing in…</>) : 'Sign in'}
                     </Button>
                   </Modal.Footer>
                 </form>
               </Modal>
                {/* Enhanced Email subscribers modal */}
                <Modal 
                  show={showEmailModal} 
                  onHide={() => setShowEmailModal(false)} 
                  size="lg" 
                  centered 
                  aria-labelledby="email-subscribers-title"
                >
                  <form onSubmit={(e) => { e.preventDefault(); emailSubscribers(); }}>
                    <Modal.Header closeButton>
                      <Modal.Title id="email-subscribers-title">Email Subscribers</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="row mb-3">
                  <div className="col-md-7">
                    <h6>Compose Email</h6>
                    
                    {/* Template selection */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <select 
                          className="form-select" 
                          value={selectedTemplate || ""}
                          onChange={(e) => {
                            if (e.target.value) {
                              loadEmailTemplate(parseInt(e.target.value, 10));
                            } else {
                              setSelectedTemplate(null);
                            }
                          }}
                        >
                          <option value="">-- Select Template --</option>
                          {emailTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary btn-sm" 
                          onClick={saveEmailTemplate}
                        >
                          Save as Template
                        </button>
                        {selectedTemplate && (
                          <button 
                            type="button" 
                            className="btn btn-outline-danger btn-sm" 
                            onClick={() => deleteEmailTemplate(selectedTemplate)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Email format */}
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="html-email" 
                        checked={useHtmlEmail}
                        onChange={(e) => setUseHtmlEmail(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="html-email">
                        Use HTML formatting
                      </label>
                    </div>
                    
                    {/* Email subject */}
                    <div className="mb-3">
                      <input 
                        className="form-control" 
                        placeholder="Subject" 
                        value={emailSubject} 
                        onChange={e => setEmailSubject(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    {/* Email body */}
                    <div className="mb-3">
                      {useHtmlEmail ? (
                        <div style={{ border: '1px solid #ced4da', borderRadius: '0.25rem' }}>
                          <div style={{ padding: '0.5rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ced4da' }}>
                            <div className="btn-group btn-group-sm">
                              <button type="button" className="btn btn-outline-secondary" onClick={() => setEmailBody(emailBody + '<b>Bold</b>')} title="Bold">B</button>
                              <button type="button" className="btn btn-outline-secondary" onClick={() => setEmailBody(emailBody + '<i>Italic</i>')} title="Italic">I</button>
                              <button type="button" className="btn btn-outline-secondary" onClick={() => setEmailBody(emailBody + '<h2>Heading</h2>')} title="Heading">H</button>
                              <button type="button" className="btn btn-outline-secondary" onClick={() => setEmailBody(emailBody + '<ul><li>List item</li></ul>')} title="List">•</button>
                              <button type="button" className="btn btn-outline-secondary" onClick={() => setEmailBody(emailBody + '<a href="#">Link</a>')} title="Link">🔗</button>
                              <button type="button" className="btn btn-outline-secondary" onClick={() => setEmailBody(emailBody + '<img src="https://example.com/image.jpg" alt="Image" />')} title="Image">🖼️</button>
                            </div>
                          </div>
                          <textarea 
                            className="form-control border-0" 
                            placeholder="Message body (HTML enabled)" 
                            rows={8} 
                            value={emailBody} 
                            onChange={e => setEmailBody(e.target.value)} 
                            required 
                          />
                        </div>
                      ) : (
                        <textarea 
                          className="form-control" 
                          placeholder="Message body (plain text)" 
                          rows={10} 
                          value={emailBody} 
                          onChange={e => setEmailBody(e.target.value)} 
                          required 
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-5">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6>Recipients ({filteredSubscribers.length} of {subscribers.length})</h6>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => setShowAddSubscriberModal(true)}
                      >
                        Add Subscriber
                      </button>
                    </div>
                    
                    {/* Subscriber filters */}
                    <div className="d-flex gap-2 mb-2">
                      <select 
                        className="form-select form-select-sm" 
                        value={subscriberFilter}
                        onChange={(e) => setSubscriberFilter(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        {subscriberCategories.map((cat, i) => (
                          <option key={i} value={cat}>{cat}</option>
                        ))}
                      </select>
                                            <input 
                                              type="text"
                                              className="form-control form-control-sm"
                                              placeholder="Search subscribers..."
                                              value={subscriberSearch}
                                              onChange={(e) => setSubscriberSearch(e.target.value)}
                                            />
                                          </div>
                                          
                                          {/* Subscriber list */}
                                          <div style={{maxHeight: '250px', overflowY: 'auto'}}>
                                            {filteredSubscribers.length === 0 ? (
                                              <div className="text-center p-3 text-muted">
                                                No subscribers found
                                              </div>
                                            ) : (
                                              filteredSubscribers.map((sub, i) => (
                                                <div key={i} className="d-flex align-items-center p-1 border-bottom">
                                                  <div style={{flex: 1}}>
                                                    <div>{sub.name || sub.displayName || 'Unnamed'}</div>
                                                    <div className="small text-muted">{sub.email || sub.address}</div>
                                                    <div className="small text-muted">{sub.category || 'General'}</div>
                                                  </div>
                                                  <div>
                                                    <button 
                                                      type="button" 
                                                      className="btn btn-sm btn-outline-secondary me-1" 
                                                      onClick={() => {
                                                        setNewSubscriber({
                                                          name: sub.name || sub.displayName || '',
                                                          email: sub.email || sub.address || '',
                                                          category: sub.category || 'General'
                                                        });
                                                        setEditSubscriberIndex(i);
                                                        setShowAddSubscriberModal(true);
                                                      }}
                                                    >
                                                      Edit
                                                    </button>
                                                    <button 
                                                      type="button" 
                                                      className="btn btn-sm btn-outline-danger" 
                                                      onClick={() => deleteSubscriber(i)}
                                                    >
                                                      Remove
                                                    </button>
                                                  </div>
                                                </div>
                                              ))
                                            )}
                                          </div>
                                          
                                          <div className="d-flex justify-content-between mt-3">
                                            <button 
                                              type="button" 
                                              className="btn btn-sm btn-outline-secondary" 
                                              onClick={exportSubscribersToCSV}
                                            >
                                              Export to CSV
                                            </button>
                                            <button 
                                              type="button" 
                                              className="btn btn-sm btn-outline-primary" 
                                              onClick={fetchSubscribers}
                                              disabled={subscribersBusy}
                                            >
                                              {subscribersBusy ? 'Refreshing...' : 'Refresh List'}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      {emailMsg && <div className="alert alert-info" role="status">{emailMsg}</div>}
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
                                        Cancel
                                      </Button>
                                      <Button 
                                        type="submit" 
                                        variant="primary"
                                        disabled={!emailSubject.trim() || !emailBody.trim() || filteredSubscribers.length === 0 || subscribersBusy}
                                      >
                                        {subscribersBusy ? 'Processing...' : 'Send Email'}
                                      </Button>
                                    </Modal.Footer>
                                  </form>
                                </Modal>
                                
                                {/* Add/Edit Subscriber Modal */}
                                <Modal
                                  show={showAddSubscriberModal}
                                  onHide={() => {
                                    setShowAddSubscriberModal(false);
                                    setEditSubscriberIndex(-1);
                                    setNewSubscriber({ name: '', email: '', category: 'General' });
                                  }}
                                  centered
                                  aria-labelledby="add-subscriber-title"
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title id="add-subscriber-title">
                                      {editSubscriberIndex >= 0 ? 'Edit Subscriber' : 'Add New Subscriber'}
                                    </Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <div className="mb-3">
                                      <label htmlFor="subscriber-name" className="form-label">Name</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="subscriber-name"
                                        value={newSubscriber.name}
                                        onChange={(e) => setNewSubscriber({...newSubscriber, name: e.target.value})}
                                        placeholder="Enter name"
                                      />
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="subscriber-email" className="form-label">Email</label>
                                      <input
                                        type="email"
                                        className="form-control"
                                        id="subscriber-email"
                                        value={newSubscriber.email}
                                        onChange={(e) => setNewSubscriber({...newSubscriber, email: e.target.value})}
                                        placeholder="Enter email address"
                                        required
                                      />
                                    </div>
                                    <div className="mb-3">
                                      <label htmlFor="subscriber-category" className="form-label">Category</label>
                                      <select
                                        className="form-select"
                                        id="subscriber-category"
                                        value={newSubscriber.category}
                                        onChange={(e) => setNewSubscriber({...newSubscriber, category: e.target.value})}
                                      >
                                        {subscriberCategories.map((cat, i) => (
                                          <option key={i} value={cat}>{cat}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button 
                                      variant="secondary" 
                                      onClick={() => {
                                        setShowAddSubscriberModal(false);
                                        setEditSubscriberIndex(-1);
                                        setNewSubscriber({ name: '', email: '', category: 'General' });
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      variant="primary"
                                      onClick={() => {
                                        if (editSubscriberIndex >= 0) {
                                          updateSubscriber(editSubscriberIndex, newSubscriber).then(() => {
                                            setShowAddSubscriberModal(false);
                                            setEditSubscriberIndex(-1);
                                            setNewSubscriber({ name: '', email: '', category: 'General' });
                                          });
                                        } else {
                                          addSubscriber(newSubscriber).then(() => {
                                            setShowAddSubscriberModal(false);
                                            setNewSubscriber({ name: '', email: '', category: 'General' });
                                          });
                                        }
                                      }}
                                      disabled={!newSubscriber.email || !newSubscriber.email.includes('@')}
                                    >
                                      {editSubscriberIndex >= 0 ? 'Update' : 'Add'}
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
        {/* Accessibility announcements */}
        <div aria-live="polite" className="visually-hidden">{themeAnnounce}</div>
        <div aria-live="polite" className="visually-hidden">{notifAnnounce}</div>
      </Navbar>
    );
}

export default Navigation;
