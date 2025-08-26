import React, { useState } from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './CalendarView.css';

const CalendarView = ({ updates, openDetailModal, formatDate, categories }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('month'); // 'month' or 'week'
  
  // Get month and year for the header
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  
  // Navigate to previous/next month
  const goToPrevious = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (viewType === 'month') {
        newDate.setMonth(prevDate.getMonth() - 1);
      } else {
        newDate.setDate(prevDate.getDate() - 7);
      }
      return newDate;
    });
  };
  
  const goToNext = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (viewType === 'month') {
        newDate.setMonth(prevDate.getMonth() + 1);
      } else {
        newDate.setDate(prevDate.getDate() + 7);
      }
      return newDate;
    });
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Calendar building helpers
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Get updates for a specific date
  const getUpdatesForDate = (date) => {
    return updates.filter(update => {
      const updateDate = new Date(update.date);
      return (
        updateDate.getFullYear() === date.getFullYear() &&
        updateDate.getMonth() === date.getMonth() &&
        updateDate.getDate() === date.getDate()
      );
    });
  };
  
  // Build the calendar grid
  const buildCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    // Create an array for all days in the month
    const days = [];
    
    // Add empty slots for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateUpdates = getUpdatesForDate(date);
      
      days.push({
        date,
        dayOfMonth: day,
        updates: dateUpdates,
        isToday: isSameDay(date, new Date())
      });
    }
    
    return days;
  };
  
  // Build week view days
  const buildWeekDays = () => {
    const days = [];
    
    // Get the start of the week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    // Add each day of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateUpdates = getUpdatesForDate(date);
      
      days.push({
        date,
        dayOfMonth: date.getDate(),
        updates: dateUpdates,
        isToday: isSameDay(date, new Date())
      });
    }
    
    return days;
  };
  
  // Helper to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  const days = viewType === 'month' ? buildCalendarDays() : buildWeekDays();
  
  return (
    <div className="calendar-view">
      <div className="calendar-header mb-4">
        <div className="calendar-navigation">
          <Button variant="outline-secondary" onClick={goToPrevious}>
            <i className="bi bi-chevron-left"></i>
          </Button>
          <Button variant="outline-primary" onClick={goToToday} className="today-btn">
            Today
          </Button>
          <Button variant="outline-secondary" onClick={goToNext}>
            <i className="bi bi-chevron-right"></i>
          </Button>
        </div>
        
        <h3 className="calendar-title">
          {viewType === 'month' 
            ? `${currentMonthName} ${currentYear}`
            : `Week of ${formatDate(days[0].date)}`
          }
        </h3>
        
        <div className="view-toggle">
          <Button 
            variant={viewType === 'month' ? 'primary' : 'outline-primary'} 
            onClick={() => setViewType('month')}
            className="me-2"
          >
            Month
          </Button>
          <Button 
            variant={viewType === 'week' ? 'primary' : 'outline-primary'} 
            onClick={() => setViewType('week')}
          >
            Week
          </Button>
        </div>
      </div>
      
      <div className={`calendar-grid ${viewType}`}>
        {/* Weekday headers */}
        <div className="weekday-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div className="weekday-name" key={index}>{day}</div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="calendar-days">
          {days.map((day, index) => (
            <div 
              key={index} 
              className={`calendar-day ${!day ? 'empty-day' : ''} ${day?.isToday ? 'today' : ''}`}
            >
              {day && (
                <>
                  <div className="day-number">{day.dayOfMonth}</div>
                  
                  <div className="day-events">
                    {day.updates.map(update => (
                      <motion.div 
                        key={update.id}
                        className="calendar-event"
                        onClick={() => openDetailModal(update)}
                        whileHover={{ y: -2 }}
                        style={{
                          backgroundColor: categories[update.category]?.color 
                            ? `var(--bs-${categories[update.category].color})` 
                            : 'var(--bs-primary)'
                        }}
                      >
                        <div className="event-title">
                          {update.title.length > 30 
                            ? `${update.title.substring(0, 30)}...` 
                            : update.title
                          }
                        </div>
                        <div className="event-time">
                          {new Date(update.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </motion.div>
                    ))}
                    
                    {day.updates.length > 2 && viewType === 'month' && (
                      <div className="more-events">
                        +{day.updates.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
