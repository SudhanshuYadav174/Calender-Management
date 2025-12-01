import React, { useEffect, useState } from "react";
import moment from "moment";
import API from "../api";
import EventForm from "./EventForm";
import { useAuth } from "../context/AuthContext";

const eventGradients = [
  "from-orange-400 to-orange-600",
  "from-yellow-400 to-orange-500",
  "from-pink-400 to-orange-400",
  "from-purple-400 to-pink-500",
  "from-blue-400 to-purple-500",
  "from-green-400 to-teal-500",
  "from-red-400 to-pink-500",
  "from-indigo-400 to-purple-500",
  "from-teal-400 to-blue-500",
];

// Indian Holidays 2025-2026
const indianHolidays = {
  // 2025
  "2025-01-01": { name: "New Year's Day", color: "from-blue-400 to-cyan-500" },
  "2025-01-26": { name: "Republic Day", color: "from-orange-400 to-green-500" },
  "2025-03-14": { name: "Holi", color: "from-pink-400 to-purple-500" },
  "2025-03-30": { name: "Ram Navami", color: "from-yellow-400 to-orange-500" },
  "2025-04-10": {
    name: "Mahavir Jayanti",
    color: "from-orange-400 to-red-500",
  },
  "2025-04-14": {
    name: "Ambedkar Jayanti",
    color: "from-blue-400 to-indigo-500",
  },
  "2025-04-18": { name: "Good Friday", color: "from-purple-400 to-pink-500" },
  "2025-05-12": {
    name: "Buddha Purnima",
    color: "from-yellow-300 to-orange-400",
  },
  "2025-08-15": {
    name: "Independence Day",
    color: "from-orange-400 to-green-500",
  },
  "2025-08-16": {
    name: "Parsi New Year",
    color: "from-yellow-400 to-amber-500",
  },
  "2025-08-27": { name: "Janmashtami", color: "from-blue-500 to-purple-600" },
  "2025-10-02": {
    name: "Gandhi Jayanti",
    color: "from-orange-400 to-green-500",
  },
  "2025-10-22": { name: "Dussehra", color: "from-red-400 to-orange-500" },
  "2025-11-01": { name: "Diwali", color: "from-yellow-400 to-orange-600" },
  "2025-11-05": {
    name: "Guru Nanak Jayanti",
    color: "from-orange-400 to-yellow-500",
  },
  "2025-12-25": { name: "Christmas", color: "from-red-400 to-green-500" },

  // 2026
  "2026-01-01": { name: "New Year's Day", color: "from-blue-400 to-cyan-500" },
  "2026-01-26": { name: "Republic Day", color: "from-orange-400 to-green-500" },
  "2026-03-03": { name: "Holi", color: "from-pink-400 to-purple-500" },
  "2026-03-19": { name: "Ram Navami", color: "from-yellow-400 to-orange-500" },
  "2026-04-03": { name: "Good Friday", color: "from-purple-400 to-pink-500" },
  "2026-04-06": {
    name: "Mahavir Jayanti",
    color: "from-orange-400 to-red-500",
  },
  "2026-04-14": {
    name: "Ambedkar Jayanti",
    color: "from-blue-400 to-indigo-500",
  },
  "2026-05-01": {
    name: "Buddha Purnima",
    color: "from-yellow-300 to-orange-400",
  },
  "2026-08-15": {
    name: "Independence Day",
    color: "from-orange-400 to-green-500",
  },
  "2026-08-15": { name: "Janmashtami", color: "from-blue-500 to-purple-600" },
  "2026-09-04": {
    name: "Parsi New Year",
    color: "from-yellow-400 to-amber-500",
  },
  "2026-10-02": {
    name: "Gandhi Jayanti",
    color: "from-orange-400 to-green-500",
  },
  "2026-10-11": { name: "Dussehra", color: "from-red-400 to-orange-500" },
  "2026-10-19": { name: "Diwali", color: "from-yellow-400 to-orange-600" },
  "2026-11-24": {
    name: "Guru Nanak Jayanti",
    color: "from-orange-400 to-yellow-500",
  },
  "2026-12-25": { name: "Christmas", color: "from-red-400 to-green-500" },
};

export default function CalendarView() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment());
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState("MONTH");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment());
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchEvents();
    fetchWeather();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  async function fetchWeather() {
    try {
      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // Using Open-Meteo API (no API key required)
            const weatherRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const weatherData = await weatherRes.json();

            // Get location name using reverse geocoding
            const geoRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const geoData = await geoRes.json();

            setWeather(weatherData.current_weather);
            setLocation(geoData.city || geoData.locality || "Your Location");
          },
          (error) => {
            console.error("Location error:", error);
          }
        );
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
    }
  }

  async function fetchEvents() {
    const res = await API.get("/events");
    setEvents(res.data);
  }

  const getCurrentMonthEvents = () => {
    return events.filter(
      (event) =>
        moment(event.date).format("YYYY-MM") === currentDate.format("YYYY-MM")
    );
  };

  const getEventGradient = (index) => {
    return eventGradients[index % eventGradients.length];
  };

  const getDaysInMonth = () => {
    const startOfMonth = currentDate.clone().startOf("month");
    const endOfMonth = currentDate.clone().endOf("month");
    const startDay = startOfMonth.day();
    const daysInMonth = endOfMonth.date();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = currentDate.clone().date(day).format("YYYY-MM-DD");
    return events.filter((event) => event.date === dateStr);
  };

  const getHolidayForDay = (day) => {
    if (!day) return null;
    const dateStr = currentDate.clone().date(day).format("YYYY-MM-DD");
    return indianHolidays[dateStr] || null;
  };

  const prevMonth = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(currentDate.clone().subtract(1, "month"));
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  const nextMonth = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(currentDate.clone().add(1, "month"));
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const dateStr = currentDate.clone().date(day).format("YYYY-MM-DD");
    setSelected({ date: dateStr, startTime: "09:00", endTime: "10:00" });
    setShowForm(true);
  };

  const handleEventClick = (event) => {
    setSelected(event);
    setShowForm(true);
  };

  async function onSave() {
    await fetchEvents();
    setShowForm(false);
  }

  const currentMonthEvents = getCurrentMonthEvents();

  return (
    <div className="min-h-screen overflow-auto relative z-10">
      {/* Events Sidebar - Fixed on Right */}
      <div className="hidden lg:block fixed right-6 top-20 bottom-6 w-80 xl:w-96 z-10">
        <div
          className={`bg-gray-900 bg-opacity-40 backdrop-blur-sm rounded-3xl p-5 shadow-2xl h-full flex flex-col border-l-4 border-indigo-500 transition-all duration-300 ${
            isAnimating
              ? "opacity-0 translate-x-4"
              : "opacity-100 translate-x-0"
          }`}
        >
          <h2 className="text-white font-bold text-xl mb-3">Events</h2>
          <div className="h-px bg-gradient-to-r from-indigo-500 to-transparent mb-4"></div>

          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {currentMonthEvents.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-center text-sm">
                  No events this month
                </p>
              </div>
            ) : (
              currentMonthEvents.map((event, index) => {
                const eventDate = moment(event.date);
                const gradientClass = getEventGradient(index);

                return (
                  <div key={event._id} className="flex gap-3 items-start">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/50 flex-shrink-0">
                      {eventDate.format("D")}
                    </div>
                    <div
                      onClick={() => handleEventClick(event)}
                      className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl px-4 py-3 text-white cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-purple-500/30 flex-1"
                    >
                      <div className="font-semibold text-sm mb-1">
                        {event.title}
                      </div>
                      <div className="text-xs opacity-90">
                        {event.startTime} - {event.endTime}
                      </div>
                      {event.description && (
                        <div className="text-xs opacity-80 mt-1 line-clamp-2">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Clock, Weather & Profile Widget - Fixed on Left */}
      <div className="hidden lg:block fixed left-6 top-20 z-10">
        <div className="bg-gray-900 bg-opacity-40 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-l-4 border-indigo-500">
          <div className="text-center">
            <div className="text-white text-4xl font-bold mb-2 font-mono">
              {currentTime.format("HH:mm:ss")}
            </div>
            <div className="text-gray-400 text-sm">
              {currentTime.format("dddd")}
            </div>
            <div className="text-gray-400 text-xs mt-1">
              {currentTime.format("MMMM DD, YYYY")}
            </div>

            {weather && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent my-4"></div>
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-8 h-8 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                  </svg>
                  <div className="text-white text-3xl font-bold">
                    {Math.round(weather.temperature)}°C
                  </div>
                </div>
                <div className="text-gray-400 text-xs mt-2">{location}</div>
              </>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent my-4"></div>

            {/* Profile Section */}
            <div className="flex items-center justify-center gap-3">
              <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2 shadow-lg border border-indigo-500/30">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-white text-sm font-medium">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="mt-3 w-full bg-gray-900 bg-opacity-60 backdrop-blur-sm text-white py-2 rounded-full hover:bg-opacity-80 transition shadow-lg flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 gap-6">
        {/* Mobile Clock & Weather - Top */}
        <div className="lg:hidden w-full max-w-xl">
          <div className="bg-gray-900 bg-opacity-40 backdrop-blur-sm rounded-3xl p-4 sm:p-5 shadow-2xl border-t-4 border-indigo-500">
            <div className="flex items-center justify-between gap-4">
              {/* Clock Section */}
              <div className="flex-1">
                <div className="text-white text-2xl sm:text-3xl font-bold font-mono">
                  {currentTime.format("HH:mm:ss")}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm mt-1">
                  {currentTime.format("dddd, MMMM DD")}
                </div>
              </div>

              {/* Weather Section */}
              {weather && (
                <div className="flex items-center gap-2 border-l border-indigo-500/30 pl-4">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                  </svg>
                  <div>
                    <div className="text-white text-2xl sm:text-3xl font-bold">
                      {Math.round(weather.temperature)}°C
                    </div>
                    <div className="text-gray-400 text-xs">{location}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Profile & Logout */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-indigo-500/30">
              <div className="bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2 shadow-lg border border-indigo-500/30">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-white text-sm font-medium">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
              </div>
              <button
                onClick={logout}
                className="bg-gray-900 bg-opacity-60 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition shadow-lg flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="w-full max-w-xl lg:max-w-2xl">
          <div
            className={`bg-gray-900 bg-opacity-30 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl transition-all duration-300 ${
              isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {/* Date Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentDate(currentDate.clone().subtract(1, "year"))
                  }
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition"
                  title="Previous Year"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                </button>
                <select
                  value={currentDate.year()}
                  onChange={(e) =>
                    setCurrentDate(
                      currentDate.clone().year(parseInt(e.target.value))
                    )
                  }
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {Array.from({ length: 11 }, (_, i) => 2020 + i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
                <button
                  onClick={() =>
                    setCurrentDate(currentDate.clone().add(1, "year"))
                  }
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition"
                  title="Next Year"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-xs sm:text-sm mb-1">
                  {currentDate.format("DD, YYYY")}
                </div>
                <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
                  {currentDate.format("MMMM")}
                </h1>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="grid grid-cols-7 gap-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-white text-center text-sm sm:text-base font-semibold"
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3 lg:gap-4">
              {getDaysInMonth().map((day, index) => {
                const dayEvents = getEventsForDay(day);
                const holiday = getHolidayForDay(day);
                const isToday =
                  day && currentDate.clone().date(day).isSame(moment(), "day");
                const hasEvents = dayEvents.length > 0;

                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl sm:rounded-2xl text-white text-base sm:text-lg lg:text-xl font-medium cursor-pointer transition-all relative ${
                      day ? "hover:scale-105" : ""
                    } ${
                      isToday
                        ? "border-2 border-cyan-400 shadow-lg shadow-cyan-500/50 bg-cyan-500/20"
                        : holiday
                        ? `border-2 bg-gradient-to-br ${holiday.color} shadow-lg`
                        : hasEvents
                        ? "border-2 border-emerald-400 shadow-lg shadow-emerald-500/50 bg-emerald-500/20"
                        : ""
                    }`}
                    title={holiday ? holiday.name : ""}
                  >
                    <div>{day || ""}</div>
                    {holiday && (
                      <div className="text-[8px] sm:text-[9px] font-semibold mt-0.5 text-white/90 text-center line-clamp-1 px-1">
                        {holiday.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={prevMonth}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 sm:p-3 rounded-full transition"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextMonth}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 sm:p-3 rounded-full transition"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Events Section */}
        <div className="lg:hidden w-full max-w-xl">
          <div
            className={`bg-gray-900 bg-opacity-40 backdrop-blur-sm rounded-3xl p-4 sm:p-5 shadow-2xl border-t-4 border-indigo-500 transition-all duration-300 ${
              isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <h2 className="text-white font-bold text-lg sm:text-xl mb-3">
              Events
            </h2>
            <div className="h-px bg-gradient-to-r from-indigo-500 to-transparent mb-4"></div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {currentMonthEvents.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-400 text-center text-sm">
                    No events this month
                  </p>
                </div>
              ) : (
                currentMonthEvents.map((event, index) => {
                  const eventDate = moment(event.date);

                  return (
                    <div key={event._id} className="flex gap-3 items-start">
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg shadow-indigo-500/50 flex-shrink-0">
                        {eventDate.format("D")}
                      </div>
                      <div
                        onClick={() => handleEventClick(event)}
                        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-purple-500/30 flex-1"
                      >
                        <div className="font-semibold text-sm sm:text-base mb-1">
                          {event.title}
                        </div>
                        <div className="text-xs opacity-90">
                          {event.startTime} - {event.endTime}
                        </div>
                        {event.description && (
                          <div className="text-xs opacity-80 mt-1 line-clamp-2">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <EventForm
          event={selected}
          onClose={() => setShowForm(false)}
          onSave={onSave}
        />
      )}
    </div>
  );
}
