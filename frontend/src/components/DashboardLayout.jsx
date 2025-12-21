import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import moment from "moment";
import gsap from "gsap";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "./blocks/sidebar";
import { Sheet, SheetContent } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Aurora from "./ui/Aurora";
import {
  CircleUserRound,
  ChevronsUpDown,
  Calendar,
  Home,
  ListTodo,
  Loader2,
} from "lucide-react";
import CalendarView from "./CalendarView";
import Hero from "./ui/animated-shader-hero";
import { RainbowButton } from "./ui/rainbow-button";

function UserMenu() {
  const { user, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between gap-3 h-12 px-3 text-gray-300 hover:text-white hover:bg-gray-900"
        >
          <div className="flex items-center gap-2">
            <CircleUserRound className="h-5 w-5 rounded-md" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {user?.username || "User"}
              </span>
              <span className="text-xs text-gray-400">
                {user?.email || "user@example.com"}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 bg-black border-gray-700">
        <DropdownMenuLabel className="text-gray-300">Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="text-gray-300 hover:bg-gray-800 hover:text-white">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="text-gray-300 hover:bg-gray-800 hover:text-white">
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem
          onClick={logout}
          className="text-red-400 hover:bg-gray-800 hover:text-red-300"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const sidebarData = [
  {
    title: "Home",
    icon: Home,
    view: "home",
  },
  {
    title: "Calendar",
    icon: Calendar,
    view: "calendar",
  },
  {
    title: "My Events",
    icon: ListTodo,
    view: "events",
  },
];

function DashboardContent() {
  const [activeView, setActiveView] = useState("home");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (activeView === "events") {
      fetchEvents();
    }
  }, [activeView]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [activeView, isLoading]);

  const handleViewChange = (view) => {
    if (view === activeView) return;

    // Close mobile menu when navigating
    setMobileMenuOpen(false);

    // Fade out
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setIsLoading(true);
          setActiveView(view);

          // Show loader for 1 second
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        },
      });
    }
  };

  async function fetchEvents() {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await API.delete(`/events/${eventId}`);
      await fetchEvents();
      setShowEventDetails(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-[280px] bg-gradient-to-b from-gray-950 via-gray-900 to-black p-0 border-r border-gray-800"
        >
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="p-4 border-b border-gray-800/50 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  My Dashboard
                </h2>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="p-2">
                  {sidebarData.map((item) => (
                    <button
                      key={item.view}
                      onClick={() => handleViewChange(item.view)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-300 mb-1 ${
                        activeView === item.view
                          ? "text-white bg-gradient-to-r from-purple-600/40 to-blue-600/40 shadow-lg shadow-purple-500/20"
                          : "text-gray-300 hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-blue-900/20 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2 border-t border-gray-800/50">
                <UserMenu />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <Sidebar
        side="left"
        collapsible="none"
        variant="sidebar"
        className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-black border-r border-gray-800 overflow-hidden hidden md:flex"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>

        <SidebarContent className="relative z-10">
          <div className="p-4 border-b border-gray-800/50 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              My Dashboard
            </h2>
          </div>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarData.map((item) => (
                  <SidebarMenuItem key={item.view}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={activeView === item.view}
                      onClick={() => handleViewChange(item.view)}
                    >
                      <button
                        className={`flex items-center gap-3 transition-all duration-300 ${
                          activeView === item.view
                            ? "text-white bg-gradient-to-r from-purple-600/40 to-blue-600/40 shadow-lg shadow-purple-500/20"
                            : "text-gray-300 hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-blue-900/20 hover:text-white"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="relative z-10">
          <UserMenu />
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 relative bg-gray-950 h-full overflow-hidden">
        {/* Mobile header with trigger button */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="h-8 w-8 text-gray-300 hover:text-white"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              My Dashboard
            </h1>
          </div>
        </div>

        <div
          className={activeView === "home" ? "h-full" : "h-full pt-16 md:pt-0"}
        >
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[500px]">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">Loading...</p>
              </div>
            </div>
          ) : (
            <div
              ref={contentRef}
              className={activeView === "home" ? "h-full" : ""}
            >
              {activeView === "home" && (
                <div className="h-full w-full relative">
                  {/* Mobile header overlay for home view */}
                  <div className="md:hidden absolute top-0 left-0 right-0 z-50 px-4 py-3 bg-gradient-to-b from-gray-950/95 to-transparent backdrop-blur-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(true)}
                      className="h-8 w-8 text-white/90 hover:text-white"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </Button>
                  </div>
                  <Hero
                    trustBadge={{
                      text: "Your personal event management system",
                      icons: ["📅"],
                    }}
                    headline={{
                      line1: "Organize Your",
                      line2: "Life With Ease",
                    }}
                    subtitle="Stay on top of your schedule with our intuitive calendar interface. Create, manage, and track all your important events in one beautiful place."
                    buttons={{
                      primary: {
                        text: "View Calendar",
                        onClick: () => handleViewChange("calendar"),
                      },
                      secondary: {
                        text: "My Events",
                        onClick: () => handleViewChange("events"),
                      },
                    }}
                  />
                </div>
              )}

              {activeView === "calendar" && (
                <div className="fixed inset-0 md:inset-auto md:absolute md:top-0 md:left-0 md:right-0 md:bottom-0 w-full h-full pt-14 md:pt-0">
                  <CalendarView />
                </div>
              )}

              {activeView === "events" && (
                <div className="p-4 md:p-6 overflow-auto h-full relative">
                  {/* Aurora Background */}
                  <div className="absolute inset-0 z-0">
                    <Aurora
                      colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                      blend={0.5}
                      amplitude={1.0}
                      speed={0.5}
                    />
                  </div>

                  <div className="max-w-6xl mx-auto relative z-10">
                    <div className="mb-6">
                      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                        My Events
                      </h1>
                      <p className="text-gray-400">
                        All your saved events in one place
                      </p>
                    </div>

                    {events.length === 0 ? (
                      <div className="text-center py-20">
                        <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No events yet</p>
                        <p className="text-gray-500 text-sm mt-2">
                          Create your first event from the calendar
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {events
                          .sort((a, b) => moment(a.date).diff(moment(b.date)))
                          .map((event) => {
                            const eventDate = moment(event.date);
                            const isPast = eventDate.isBefore(moment(), "day");
                            const isToday = eventDate.isSame(moment(), "day");

                            return (
                              <div
                                key={event._id}
                                className={`bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all cursor-pointer ${
                                  isPast ? "opacity-60" : ""
                                }`}
                                onClick={() => handleEventClick(event)}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl w-14 h-14 flex flex-col items-center justify-center text-white shadow-lg">
                                      <div className="text-xs font-medium">
                                        {eventDate.format("MMM")}
                                      </div>
                                      <div className="text-2xl font-bold">
                                        {eventDate.format("DD")}
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="text-white font-semibold text-lg">
                                        {event.title}
                                      </h3>
                                      {isToday && (
                                        <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                                          Today
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2 text-gray-400">
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
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span>
                                      {event.startTime} - {event.endTime}
                                    </span>
                                  </div>

                                  {event.description && (
                                    <p className="text-gray-400 text-sm line-clamp-2">
                                      {event.description}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                                  <span className="text-xs text-gray-500">
                                    {eventDate.format("dddd, MMMM DD, YYYY")}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        window.confirm(
                                          "Are you sure you want to delete this event?"
                                        )
                                      ) {
                                        handleDeleteEvent(event._id);
                                      }
                                    }}
                                    className="text-red-400 hover:text-red-300 transition p-2"
                                    title="Delete event"
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg shadow-xl max-w-md w-full mx-4 border border-zinc-800">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-white">
                  Event Details
                </h2>
                <button
                  onClick={() => {
                    setShowEventDetails(false);
                    setSelectedEvent(null);
                  }}
                  className="text-zinc-400 hover:text-white transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-400 block mb-1">
                    Title
                  </label>
                  <p className="text-white text-lg">{selectedEvent.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-400 block mb-1">
                    Date
                  </label>
                  <p className="text-white">
                    {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {selectedEvent.time && (
                  <div>
                    <label className="text-sm font-medium text-zinc-400 block mb-1">
                      Time
                    </label>
                    <p className="text-white">{selectedEvent.time}</p>
                  </div>
                )}

                {selectedEvent.description && (
                  <div>
                    <label className="text-sm font-medium text-zinc-400 block mb-1">
                      Description
                    </label>
                    <p className="text-white whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this event?"
                      )
                    ) {
                      handleDeleteEvent(selectedEvent._id);
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Clear any sidebar cookie and keep it open on desktop
  React.useEffect(() => {
    document.cookie = "sidebar_state=true; path=/; max-age=31536000";
  }, []);

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      className="flex h-screen w-full"
    >
      <DashboardContent />
    </SidebarProvider>
  );
}
