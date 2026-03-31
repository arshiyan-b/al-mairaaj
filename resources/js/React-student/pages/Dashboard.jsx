// Dashboard.jsx
import studentHeroImage from "../assests/banner1.png";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { ArrowRight } from "lucide-react";
import CourseCard from "../components/CourseCard";

const Dashboard = ({ user }) => {
  const [date, setDate] = React.useState(new Date());

  const courses = [
    {
      id: 1,
      title: "How to become Pro-interaction designer",
      completion: 90,
      lessons: 10,
      totalLessons: 11,
      image:
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "User Interface beginner training class",
      completion: 65,
      lessons: 8,
      totalLessons: 12,
      image:
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "How to become productive master class",
      completion: 80,
      lessons: 9,
      totalLessons: 12,
      image:
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "How to become productive master class",
      completion: 80,
      lessons: 9,
      totalLessons: 12,
      image:
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
    },
  ];

  const announcements = [
    { id: 1, message: "🎉 New course on UI Animation just dropped!" },
    { id: 2, message: "📢 Live Q&A session this Friday at 7 PM." },
    { id: 3, message: "📝 Don't forget to complete your weekly quiz." },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Prototyping Section",
      date: "21 Oct 2020",
      iconBg: "bg-green-100 text-green-600",
    },
    {
      id: 2,
      title: "Wireframing Section",
      date: "21 Oct 2020",
      iconBg: "bg-purple-100 text-purple-600",
    },
    {
      id: 3,
      title: "Blog Writing Section",
      date: "21 Oct 2020",
      iconBg: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 4,
      title: "Video Editing Section",
      date: "22 Oct 2020",
      iconBg: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-0">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Banner */}
          <Card className="relative flex items-center justify-between bg-gradient-to-r from-teal-950 to-teal-800 text-white rounded-xl shadow-md  px-2 py-8 h-50">
          {/* Left: Text Section */}
          <div className="flex flex-col mr-8">
            <h2 className="text-xl font-semibold">Welcome back, {user?.name || "Student"}!</h2>
            <p className="text-sm opacity-90">Here's your learning progress today.</p>

            {/* Progress Bar */}
            <div className="mt-3 bg-white/20 rounded-full h-3 w-56 relative">
              <div
                className="absolute top-0 left-0 h-3 bg-white rounded-full"
                style={{ width: "68%" }}
              ></div>
            </div>
            <p className="text-xs mt-1 opacity-90">2.7 hours of 4 hours completed</p>
          </div>
        </Card>

          {/* Ongoing Courses */}
          <section className="p-4 bg-white rounded-xl shadow-sm dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Ongoing Courses</h2>
              <a
                href="/courses"
                className="text-blue-600 hover:underline text-sm"
              >
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <CourseCard key={i} {...course} />
              ))}
            </div>
          </section>

          {/* Upcoming Tasks */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Upcoming Tasks
            </h3>
            <Card className="p-6 rounded-xl shadow-sm">
              <CardContent className="p-0 space-y-4">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${task.iconBg}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                          <path d="M15 2h4"></path>
                          <path d="M9 2h4"></path>
                          <path d="M8 2v2"></path>
                          <path d="M16 2v2"></path>
                          <path d="M12 16h4"></path>
                          <path d="M12 12h4"></path>
                          <path d="M12 8h4"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.date}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          {/* Progress Calendar */}
          
        {/* <Card className="p-6 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
            <CardTitle className="text-lg font-semibold">My Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border p-2 w-[220px] text-sm" // 👈 Adjust width & font size
            />
          </CardContent>
        </Card> */}


          {/* Announcements */}
          <Card className="p-6 rounded-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
              <CardTitle className="text-lg font-semibold">
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-2">
              {announcements.map((a) => (
                <p
                  key={a.id}
                  className="text-gray-700 dark:text-gray-300 text-sm"
                >
                  {a.message}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
