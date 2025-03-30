import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Views from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Navbar from '../components/Navbar';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './CalendarPage.css';



export default function CalendarPage() {
  const localizer = momentLocalizer(moment);

  //Set the intitial event empty state
  const [events, setEvents] = useState({
    title: '',
    start: '',
    end: '',
    description: '',
    type: '',
  });
  const [eventTitle, setEventTitle] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');


  //Used to handle a new event being created
  const addEvent = () => {
    if (eventTitle && eventStartDate && eventEndDate ) { //&& eventDescription && eventType) {
      const newEvent = {
        title: eventTitle,
        start: new Date(eventStartDate),
        end: new Date(eventEndDate),
        description: eventDescription,
        type: eventType,
      }


      //Adds the new event that we just created to our events list
      alert('Event Added!');
      setEvents((prev) => [...prev, newEvent]);
    }
    else {
      alert('Please fill out all event fields.');
    }
  }

  const [isPopupVisible, popupVisibility] = useState(false);

  const triggerClick = () => {
    popupVisibility(true);
  };

  const closePopup = () => {
    popupVisibility(false);
  };

  
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <Navbar />

      {/* Button to add an event that leads to a popup */}
      <button onClick={triggerClick} style={{backgroundColor: '#4F46E5', color:'white', padding: 10, cursor: 'pointer', margin: 20, borderRadius: 12}}>Add Event</button>

      {isPopupVisible && (
        <div style = {{border: 'black'}}>
          <div style = {{backgroundColor:'#BFD7B5', padding: 10, margin: 20, height: 400}}>
            <span className="close" onClick={closePopup}>
              &times;
            </span>
              <div style = {{color: '#4F46E5'}}>
              <h3 className="ae1"
                >Add a New Event</h3>
              <div style = {{textAlign: 'center'}}>
                <input
                  type="text"
                  placeholder="Event Title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>
              <div style = {{textAlign: 'center'}}>
                <input
                  type="datetime-local"
                  style={{margin: 20, backgroundColor: '#BFD7B5', border: '#092e12'}}
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                />
              </div>
              <div style = {{textAlign: 'center'}}>
                <input
                  type="datetime-local"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                />
              </div>
              <div style = {{textAlign: 'center'}}>
                <input
                  type="text"
                  style={{margin: 20, border: '#092e12'}}
                  value={eventDescription}
                  placeholder="Event Description"
                  onChange={(e) => setEventType(e.target.value)}
                />
                </div>
                <div style = {{textAlign: 'center'}}>
                <input
                  type="text"
                  style={{margin: 20, border: '#092e12'}}
                  value={eventType}
                  placeholder="Event Type"
                  onChange={(e) => setEventDescription(e.target.value)}
                />
                </div>
              <button onClick={addEvent}>Add Event</button>
            </div>
          </div>
        </div>
      )}


      <div className="max-w-3xl mx-auto px-4 pt-6">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Calendar</h1>
      </div>


      <div className = "max-w-3xl mx-auto px-4 pt-6 text-center">
        <Calendar
          localizer = {localizer}
          //events = {events}
          startAccessor = "start"
          endAccessor = "end"
          style = {{ height : 500}}
          />
      </div>

    </div>
  );
}
