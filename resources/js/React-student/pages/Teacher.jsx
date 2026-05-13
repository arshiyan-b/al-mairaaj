import React from "react";
import { useParams, Link } from "react-router-dom";
import { Star, BookOpen, Mail, ArrowLeft } from "lucide-react";

const teachersData = [
    {
        id: 1,
        name: "Prof. Sarah Jenkins",
        subject: "Mathematics",
        rating: 4.9,
        courses: 12,
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
        bio: "Specialist in Advanced Mathematics with 10+ years of teaching experience. Inspires students to love numbers and problem-solving.",
    },
    {
        id: 2,
        name: "Herman Wong",
        subject: "UI/UX Design",
        rating: 4.8,
        courses: 8,
        img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop",
        bio: "Passionate about creating intuitive and engaging user experiences. Leads our UX fundamentals track.",
    },
    {
        id: 3,
        name: "Dr. Alan Turing",
        subject: "Computer Science",
        rating: 5.0,
        courses: 15,
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
        bio: "Pioneer in the digital sphere, focusing on foundational algorithms and modern coding practices.",
    },
    {
        id: 4,
        name: "Alice Smith",
        subject: "UI/UX Design",
        rating: 4.7,
        courses: 6,
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop",
        bio: "Expert in mobile-first design and accessibility who helps students craft perfect portfolios.",
    },
    {
        id: 5,
        name: "Tim Berners-Lee",
        subject: "Web Development",
        rating: 4.9,
        courses: 20,
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
        bio: "Brings the history and future of the web into the classroom. Focused on HTML, CSS, and modern framework architectures.",
    },
    {
        id: 6,
        name: "Bob Johnson",
        subject: "Physics",
        rating: 4.6,
        courses: 4,
        img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=300&auto=format&fit=crop",
        bio: "A pragmatic instructor emphasizing scientific workflows and professional lab report methodology.",
    }
];

export default function Teacher() {
    const { id } = useParams();

    const teacher = teachersData.find((t) => t.id === parseInt(id));

    if (!teacher) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-lg font-semibold">Teacher not found</p>
                <Link to="/" className="text-indigo-600 mt-2">
                    Go Back
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">

            {/* Back Button */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Teachers
            </Link>

            {/* Profile Card */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">

                {/* Header */}
                <div className="h-40 bg-gradient-to-r from-indigo-50 to-teal-50 relative"></div>

                {/* Avatar */}
                <div className="flex justify-center -mt-16">
                    <img
                        src={teacher.img}
                        alt={teacher.name}
                        className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                    />
                </div>

                {/* Content */}
                <div className="text-center px-6 pb-10">

                    <h1 className="text-2xl font-bold text-gray-900 mt-4">
                        {teacher.name}
                    </h1>

                    <p className="text-sm text-teal-700 font-semibold mt-1">
                        {teacher.subject}
                    </p>

                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        {teacher.bio}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-10 mt-8">

                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-yellow-500 font-bold">
                                <Star className="w-4 h-4 fill-yellow-500" />
                                {teacher.rating}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Rating</p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-indigo-600 font-bold">
                                <BookOpen className="w-4 h-4" />
                                {teacher.courses}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Courses</p>
                        </div>

                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4 mt-10">

                        <button className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-gray-600 border rounded-lg hover:text-indigo-600">
                            <Mail className="w-4 h-4" />
                            Message
                        </button>

                        <button className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                            Enroll Now
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}