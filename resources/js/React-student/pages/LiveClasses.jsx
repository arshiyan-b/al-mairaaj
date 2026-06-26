import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Video, Users } from "lucide-react";

const LiveClasses = ({ user }) => {
  const liveClasses = [
    {
      id: 1,
      title: "Physics - Motion & Force",
      teacher: "Dr. Ahmed Khan",
      date: "Today",
      time: "07:00 PM",
      students: 120,
      status: "Live",
    },
    {
      id: 2,
      title: "Mathematics - Calculus",
      teacher: "Sir Ali Raza",
      date: "Tomorrow",
      time: "05:00 PM",
      students: 95,
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Chemistry - Organic Chemistry",
      teacher: "Miss Fatima Noor",
      date: "28 June",
      time: "04:00 PM",
      students: 86,
      status: "Upcoming",
    },
    {
      id: 4,
      title: "Biology - Human Anatomy",
      teacher: "Dr. Sana Malik",
      date: "29 June",
      time: "06:30 PM",
      students: 74,
      status: "Upcoming",
    },
  ];

  const announcements = [
    "📢 Join classes 10 minutes before the scheduled time.",
    "🎥 All live sessions are recorded automatically.",
    "💬 Ask questions using the live chat during class.",
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left */}
        <div className="md:col-span-2 space-y-6">
          {/* Banner */}
          <Card className="bg-gradient-to-r from-blue-900 to-cyan-700 text-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold">
              Welcome, {user?.name || "Student"} 👋
            </h2>

            <p className="mt-2 text-blue-100">
              Stay connected with your teachers and never miss a live class.
            </p>

            <Button className="mt-6 bg-white text-blue-900 hover:bg-gray-100">
              Join Today's Class
            </Button>
          </Card>

          {/* Classes */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Upcoming Live Classes
              </h2>

              <Button variant="outline">
                View Schedule
              </Button>
            </div>

            <div className="grid gap-5">
              {liveClasses.map((cls) => (
                <Card
                  key={cls.id}
                  className="hover:shadow-lg transition"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {cls.title}
                        </h3>

                        <p className="text-gray-500 mt-1">
                          {cls.teacher}
                        </p>

                        <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={16} />
                            {cls.date}
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            {cls.time}
                          </div>

                          <div className="flex items-center gap-2">
                            <Users size={16} />
                            {cls.students} Students
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            cls.status === "Live"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {cls.status}
                        </span>

                        <Button>
                          <Video className="mr-2 h-4 w-4" />
                          {cls.status === "Live"
                            ? "Join Now"
                            : "View Details"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 rounded-xl shadow-sm">
            <CardHeader className="p-0 mb-4">
              <CardTitle>Class Statistics</CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              <div className="flex justify-between">
                <span>Total Classes</span>
                <strong>24</strong>
              </div>

              <div className="flex justify-between">
                <span>Attended</span>
                <strong>19</strong>
              </div>

              <div className="flex justify-between">
                <span>Missed</span>
                <strong>5</strong>
              </div>

              <div className="flex justify-between">
                <span>Attendance</span>
                <strong className="text-green-600">79%</strong>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 rounded-xl shadow-sm">
            <CardHeader className="p-0 mb-4">
              <CardTitle>Announcements</CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-3">
              {announcements.map((item, index) => (
                <p
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-300"
                >
                  {item}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;