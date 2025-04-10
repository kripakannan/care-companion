import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
//import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Navbar from '../components/Navbar';
import 'reactjs-popup/dist/index.css';
import './CaregiverCalendar.css';



export default function CaregiverCalendar() {
  // const localizer = momentLocalizer(moment);

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {'en-US': require('date-fns/locale/en-US')},
  });

  //Set the intitial event empty state
  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  //Set modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [selected, setSelected] = useState();

  const handleSelected = (event) => {
    setSelected(event);
    setIsModalOpen(true);

  };

  //Used to open/close the modal
  const Modal = ({isOpen, onClose, onDelete, children}) => {
    if (!isOpen) return null;

    return (
      <div onClick={onClose} style = {{position: 'fixed', display: 'fixed', alignItems: 'center', justifyConten: 'center', top: 0, left: 0, width: 800, height: 350, zIndex: 1000, margin: 100, backgroundColor: '#4F46E5'}}>
      <div onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style = {{backgroundColor: 'white', margin: 10, padding: 3, cursor: 'pointer', borderRadius: 12}}>Close</button>
        <button onClick={onDelete} style = {{backgroundColor: 'white', margin: 10, padding: 3, cursor: 'pointer', borderRadius: 12}}>Delete</button>
        {children}
      </div>
    </div>
    );
  }


  //Used to handle a new event being created
  const addEvent = () => {
    if (eventTitle && eventStartDate && eventEndDate && eventDescription) { 
      const newEvent = {
        title: eventTitle,
        start: new Date(eventStartDate),
        end: new Date(eventEndDate),
        description: eventDescription,
      }


      //Adds the new event that we just created to our events list
      // alert('Event Added!');
      // setEvents((prev) => [...prev, newEvent]);
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    }
    else {
      alert('Please fill out all event fields.');
    }

    setEventDescription('');
    setEventTitle('');
    setEventStartDate('');
    setEventEndDate('');

  }

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(parsedEvents);
    }
  }, []);



  const [isPopupVisible, popupVisibility] = useState(false);

  const triggerClick = () => {
    popupVisibility(true);
  };

  const closePopup = () => {
    popupVisibility(false);
  };

  const handleNavigate = (date, view) => {
    setCurrentDate(date); 
    setCurrentView(view); 

  };

  const handleView = (view) => {
    setCurrentView(view);
  }

  //deleting an event
  const deleteEvent = (eventID) => {
    const updatedEvents = events.filter(event => eventID != eventID);
    setEvents(updatedEvents);
  }


  
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <Navbar />

      {/* Button to add an event that leads to a popup */}
      <button onClick={triggerClick} style={{backgroundColor: '#4F46E5', color:'white', padding: 10, cursor: 'pointer', marginLeft: 80, marginTop: 20, borderRadius: 12}}>New Event</button>

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
                  style={{margin: 20, border: '#092e12'}}
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
                  onChange={(e) => { 
                    setEventDescription(e.target.value);

                  }}
                />
                </div>
              <button style = {{backgroundColor: '#4F46E5', color:'white', padding: 10, cursor: 'pointer', borderRadius: 12}}
                onClick={addEvent}>Add Event</button>
            </div>
          </div>
        </div>
      )}


      <div className="max-w-3xl mx-auto px-4 pt-6">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Calendar</h1>
      </div>

      {/* Popup view of an event after it's been clicked on */}
      <Modal isOpen={isModalOpen} onClose={closeModal} onDelete={deleteEvent} children = {selected}>
        {selected ? (
        <>
        <h2 style = {{color: 'white', textAlign: 'center'}} > {`${selected.title}`} </h2>
        <p style = {{color: 'white', textAlign: 'center', padding: 10}} > Start: {`${selected.start}`}</p>
        <p style = {{color: 'white', textAlign: 'center', padding: 10}} > End: {`${selected.end}`}</p>
        <p style = {{color: 'white', textAlign: 'center', padding: 10}} > Description: {`${selected.description}`}</p>
        </>
        ):(
          <></>
        )}
      </Modal>

      <div className = "max-w-3xl mx-auto px-4 pt-6 text-center">
        <Calendar
          localizer = {localizer}
          events = {events}
          onSelectEvent = {handleSelected}
          startAccessor = "start"
          endAccessor = "end"
          titleAcessor = "title"
          descriptionAccessor = "description"
          views = {['month', 'week', 'day', 'agenda']}
          view = {currentView}
          date = {currentDate}
          style = {{ height : 500}}
          onNavigate={handleNavigate}
          onView = {handleView}
          />
      </div>

    </div>
  );
}
 
