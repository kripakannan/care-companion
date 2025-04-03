import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import "./CaregiverCalendar.css";

const CaregiverCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    notes: "",
    date: new Date().toISOString().split('T')[0],
    startTime: "",
    endTime: ""
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const fetchEvents = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("caregiverId", "==", uid));
      const querySnapshot = await getDocs(q);
      
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const validateForm = () => {
      const isValid = newEvent.name && newEvent.date && newEvent.startTime && newEvent.endTime;
      setIsFormValid(isValid);
    };

    validateForm();
  }, [newEvent]);

  const handleAddEvent = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const eventData = {
        ...newEvent,
        caregiverId: uid,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "events"), eventData);
      await fetchEvents(); // Refresh events list after adding new event
      setShowAddEvent(false);
      setNewEvent({
        name: "",
        notes: "",
        date: new Date().toISOString().split('T')[0],
        startTime: "",
        endTime: ""
      });
      setSelectedDate(new Date(eventData.date)); // Select the date of the new event
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const days = getDaysInMonth(currentDate);
  const monthName = getMonthName(currentDate);
  const selectedDateEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getDate() === selectedDate.getDate() &&
           eventDate.getMonth() === selectedDate.getMonth() &&
           eventDate.getFullYear() === selectedDate.getFullYear();
  });

  // Function to check if a day has events
  const hasEvents = (day) => {
    if (!day) return false;
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === checkDate.getDate() &&
             eventDate.getMonth() === checkDate.getMonth() &&
             eventDate.getFullYear() === checkDate.getFullYear();
    });
  };

  return (
    <div className="calendar-page">
      <Navbar />
      <div className="calendar-container">
        <div className="calendar-header">
          <h1>📅 {monthName}</h1>
        </div>

        <div className="calendar-grid">
          <div className="weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="days">
            {days.map((day, index) => (
              <div
                key={index}
                className={`day ${day ? 'has-day' : ''} ${selectedDate && selectedDate.getDate() === day ? 'selected' : ''} ${hasEvents(day) ? 'has-events' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        <button className="add-event-button" onClick={() => setShowAddEvent(true)}>
          [ + ] Add Event
        </button>

        {showAddEvent && (
          <div className="add-event-modal">
            <div className="modal-content">
              <h2>Add New Event</h2>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Event name*"
                  value={newEvent.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <textarea
                  name="notes"
                  placeholder="Type the note here..."
                  value={newEvent.notes}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group time-inputs">
                <input
                  type="time"
                  name="startTime"
                  value={newEvent.startTime}
                  onChange={handleInputChange}
                />
                <input
                  type="time"
                  name="endTime"
                  value={newEvent.endTime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-actions">
                <button
                  className="create-event-button"
                  disabled={!isFormValid}
                  onClick={handleAddEvent}
                >
                  Create Event
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setShowAddEvent(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedDate && (
          <div className="events-section">
            <h2>📅 Events for {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}</h2>
            <div className="events-container">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <div key={event.id} className="event-item">
                    <div className="event-time">
                      🟣 {event.startTime} - {event.endTime}
                    </div>
                    <div className="event-name">{event.name}</div>
                    {event.notes && <div className="event-notes">→ {event.notes}</div>}
                  </div>
                ))
              ) : (
                <p className="no-events">No events scheduled for this day.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaregiverCalendar; 