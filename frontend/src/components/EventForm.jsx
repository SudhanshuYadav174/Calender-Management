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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
      <div className="bg-gray-900 bg-opacity-90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-white">
          {event && event._id ? "Edit Event" : "Create Event"}
        </h3>
        <form onSubmit={submit}>
          <label className="block text-gray-300 mb-1">Title</label>
          <input
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label className="block text-gray-300 mb-1">Date</label>
          <input
            type="date"
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-gray-300 mb-1">Start</label>
              <input
                type="time"
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-300 mb-1">End</label>
              <input
                type="time"
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <label className="block text-gray-300 mb-1">Description</label>
          <textarea
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
          <label className="block text-gray-300 mb-1">Location</label>
          <input
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <label className="block text-gray-300 mb-1">
            Reminder (minutes before)
          </label>
          <input
            type="number"
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
            {event && event._id && (
              <button
                type="button"
                onClick={remove}
                className="text-red-500 hover:text-red-400 font-semibold"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Custom Alert Modal */}
      {showAlert && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl z-10">
          <div className="bg-gray-800 bg-opacity-95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl max-w-sm border border-red-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
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
              <h4 className="text-white font-bold text-lg">Error</h4>
            </div>
            <p className="text-gray-300 mb-6">{alertMessage}</p>
            <button
              onClick={() => setShowAlert(false)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {showConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl z-10">
          <div className="bg-gray-800 bg-opacity-95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl max-w-sm border border-purple-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
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
              <h4 className="text-white font-bold text-lg">Delete Event</h4>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition font-semibold"
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
