import React from "react";
import { motion } from "framer-motion";

const Course = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <motion.div
                className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Course Details
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    This is the course details page. You arrived here by clicking a course in the main courses list.
                </p>
            </motion.div>
        </div>
    );
};

export default Course;