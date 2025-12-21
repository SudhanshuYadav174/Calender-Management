import React, { useState, useEffect } from "react";
import API from "../api";

export default function EventForm({ event, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [reminder, setReminder] = useState(10);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!event) return;
    setTitle(event.title || "");
    setDescription(event.description || "");
    setDate(event.date || "");
    setStartTime(event.startTime || "09:00");
    setEndTime(event.endTime || "10:00");
    setLocation(event.location || "");
    setColor(event.color || "#3b82f6");
  }, [event]);

  async function submit(e) {
    e.preventDefault();
    const payload = {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      color,
      reminders: [{ minutesBefore: Number(reminder) }],
    };
    try {
      if (event && event._id) {
        await API.put("/events/" + event._id, payload);
      } else {
        await API.post("/events", payload);
      }
      onSave && onSave();
    } catch (e) {
      console.error(e);
      setAlertMessage("Error saving event. Please try again.");
      setShowAlert(true);
    }
  }

  async function remove() {
    if (!event || !event._id) return onClose();
    setShowConfirm(true);
  }

  async function confirmDelete() {
    setShowConfirm(false);
    await API.delete("/events/" + event._id);
    onSave && onSave();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[100] p-3 sm:p-6 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 sm:p-7 rounded-2xl shadow-2xl w-full max-w-lg border border-purple-500/20 my-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {event && event._id ? "Edit Event" : "Create Event"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={submit} className="space-y-4">
          {/* Title Field */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Title</label>
            <input
              className="w-full px-3 py-2.5 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2.5 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Time Fields */}
          {/* Time Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Start Time</label>
              <input
                type="time"
                className="w-full px-3 py-2.5 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">End Time</label>
              <input
                type="time"
                className="w-full px-3 py-2.5 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Description</label>
            <textarea
              className="w-full px-3 py-2.5 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add event description (optional)"
              rows="3"
            />
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Location</label>
            <input
              className="w-full px-3 py-2.5 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Event location (optional)"
            />
          </div>

          {/* Reminder Field */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              Reminder (minutes before)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2.5 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              min="0"
              placeholder="10"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-lg transition-all font-medium shadow-lg shadow-purple-500/30"
              >
                Save Event
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition-all font-medium"
              >
                Cancel
              </button>
            </div>
            {event && event._id && (
              <button
                type="button"
                onClick={remove}
                className="text-red-400 hover:text-red-300 font-semibold transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Custom Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[60] p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-red-500/30 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h4 className="text-white font-bold text-xl">Error</h4>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">{alertMessage}</p>
            <button
              onClick={() => setShowAlert(false)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg transition-all font-semibold shadow-lg shadow-purple-500/30"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[60] p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-purple-500/30 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h4 className="text-white font-bold text-xl">Delete Event</h4>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-3 rounded-lg transition-all font-semibold shadow-lg shadow-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
