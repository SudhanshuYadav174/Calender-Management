import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { parse, startOfWeek, getDay, format } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import API from "../api";
import EventForm from "./EventForm";
import Aurora from "./ui/Aurora";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await API.get("/events");
      const formattedEvents = res.data.map((event) => ({
        ...event,
        start: new Date(`${event.date}T${event.startTime}`),
        end: new Date(`${event.date}T${event.endTime}`),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  const handleSelectSlot = ({ start }) => {
    const dateStr = format(start, "yyyy-MM-dd");
    setSelectedEvent({
      date: dateStr,
      startTime: "09:00",
      endTime: "10:00",
    });
    setShowForm(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleSave = async () => {
    await fetchEvents();
    setShowForm(false);
    setSelectedEvent(null);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedEvent(null);
  };

  return (
    <div className="h-full w-full relative">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <style>{`
        .rbc-calendar {
          color: #ffffff;
          background: transparent;
          height: 100%;
        }
        .rbc-month-view {
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }
        .rbc-header {
          color: #ffffff;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 8px 4px;
          border-bottom: 2px solid #4c51bf;
        }
        @media (min-width: 640px) {
          .rbc-header {
            font-size: 1rem;
            padding: 12px 8px;
          }
        }
        .rbc-date-cell {
          color: #ffffff;
          font-weight: 500;
          font-size: 0.75rem;
          padding: 4px;
        }
        @media (min-width: 640px) {
          .rbc-date-cell {
            font-size: 1.1rem;
            padding: 8px;
          }
        }
        .rbc-off-range {
          color: #718096;
        }
        .rbc-off-range-bg {
          background: rgba(0, 0, 0, 0.2);
        }
        .rbc-today {
          background-color: rgba(99, 102, 241, 0.2);
        }
        .rbc-day-bg {
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }
        .rbc-month-row {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .rbc-event {
          background-color: #6366f1;
          border-radius: 6px;
          padding: 2px 4px;
          font-weight: 500;
          font-size: 0.75rem;
        }
        @media (min-width: 640px) {
          .rbc-event {
            padding: 4px 6px;
            font-size: 0.875rem;
          }
        }
        .rbc-toolbar {
          padding: 8px;
          margin-bottom: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          justify-content: space-between;
        }
        @media (min-width: 640px) {
          .rbc-toolbar {
            padding: 16px;
            margin-bottom: 16px;
          }
        }
        .rbc-toolbar button {
          color: #ffffff;
          background: rgba(99, 102, 241, 0.6);
          border: 1px solid #6366f1;
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.75rem;
          transition: all 0.2s;
        }
        @media (min-width: 640px) {
          .rbc-toolbar button {
            padding: 8px 16px;
            font-size: 0.875rem;
          }
        }
        .rbc-toolbar button:hover {
          background: rgba(99, 102, 241, 0.8);
        }
        .rbc-toolbar button.rbc-active {
          background: #6366f1;
        }
        .rbc-toolbar-label {
          color: #ffffff;
          font-size: 1rem;
          font-weight: 700;
        }
        @media (min-width: 640px) {
          .rbc-toolbar-label {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="relative z-10 h-full w-full flex flex-col p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%", minHeight: "500px" }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
      </div>

      {showForm && (
        <EventForm
          event={selectedEvent}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
