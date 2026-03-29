export const edexcelCourses = [
  {
    id: "edx-math-001",
    title: "Advanced Mathematics",
    duration: "24 weeks",
    students: 1247,
    level: "A-Level",
    description: "Comprehensive mathematics covering calculus, algebra, statistics, and mechanics for A-Level students."
  },
  {
    id: "edx-phys-001",
    title: "Physics",
    duration: "20 weeks",
    students: 892,
    level: "A-Level",
    description: "Complete physics curriculum covering mechanics, waves, electricity, and modern physics."
  },
  {
    id: "edx-chem-001",
    title: "Chemistry",
    duration: "22 weeks",
    students: 756,
    level: "A-Level",
    description: "Organic, inorganic, and physical chemistry with practical laboratory components."
  },
  {
    id: "edx-bio-001",
    title: "Biology",
    duration: "26 weeks",
    students: 634,
    level: "A-Level",
    description: "Cell biology, genetics, ecology, and human physiology with detailed study materials."
  },
  {
    id: "edx-eng-001",
    title: "English Literature",
    duration: "18 weeks",
    students: 1156,
    level: "A-Level",
    description: "Analysis of classic and contemporary literature with critical writing skills development."
  }
];

export const akuCourses = [
  {
    id: "aku-med-001",
    title: "Foundation of Medicine",
    duration: "32 weeks",
    students: 234,
    level: "Undergraduate",
    description: "Introduction to medical sciences including anatomy, physiology, and basic clinical skills."
  },
  {
    id: "aku-eng-001",
    title: "Engineering Mathematics",
    duration: "16 weeks",
    students: 187,
    level: "Undergraduate",
    description: "Mathematical foundations for engineering including differential equations and linear algebra."
  },
  {
    id: "aku-cs-001",
    title: "Computer Science Fundamentals",
    duration: "20 weeks",
    students: 312,
    level: "Undergraduate",
    description: "Programming, algorithms, data structures, and computer systems architecture."
  },
  {
    id: "aku-bus-001",
    title: "Business Administration",
    duration: "24 weeks",
    students: 198,
    level: "Undergraduate",
    description: "Management principles, marketing, finance, and organizational behavior fundamentals."
  }
];

export const cambridgeCourses = [
  {
    id: "cam-math-001",
    title: "Pure Mathematics",
    duration: "28 weeks",
    students: 987,
    level: "A-Level",
    description: "Advanced pure mathematics including complex numbers, calculus, and mathematical proof."
  },
  {
    id: "cam-econ-001",
    title: "Economics",
    duration: "26 weeks",
    students: 743,
    level: "A-Level",
    description: "Microeconomics, macroeconomics, and contemporary economic issues analysis."
  },
  {
    id: "cam-hist-001",
    title: "Modern History",
    duration: "24 weeks",
    students: 456,
    level: "A-Level",
    description: "20th century world history with focus on major political and social movements."
  },
  {
    id: "cam-geo-001",
    title: "Geography",
    duration: "22 weeks",
    students: 567,
    level: "A-Level",
    description: "Physical and human geography with fieldwork and data analysis components."
  }
];

export const ibCourses = [
  {
    id: "ib-tok-001",
    title: "Theory of Knowledge",
    duration: "18 weeks",
    students: 345,
    level: "IB Diploma",
    description: "Critical thinking and knowledge systems across different areas of knowledge."
  },
  {
    id: "ib-ee-001",
    title: "Extended Essay",
    duration: "36 weeks",
    students: 298,
    level: "IB Diploma", 
    description: "Independent research project of 4,000 words on a topic of student's choice."
  },
  {
    id: "ib-cas-001",
    title: "Creativity, Activity, Service",
    duration: "104 weeks",
    students: 423,
    level: "IB Diploma",
    description: "Experiential learning through creative pursuits, physical activities, and service projects."
  },
  {
    id: "ib-lang-001",
    title: "Language & Literature",
    duration: "32 weeks",
    students: 512,
    level: "IB Diploma",
    description: "Critical analysis of literary and non-literary texts in global contexts."
  },
  {
    id: "ib-sci-001",
    title: "Environmental Science",
    duration: "30 weeks",
    students: 267,
    level: "IB Diploma",
    description: "Interdisciplinary approach to environmental systems and societies."
  }
];

export const boardsData = {
  edexcel: {
    title: "Edexcel",
    description: "International A-Level curriculum with globally recognized qualifications",
    courses: edexcelCourses,
    color: "edexcel"
  },
  aku: {
    title: "Aga Khan University",
    description: "University-level courses preparing students for higher education",
    courses: akuCourses,
    color: "aku"
  },
  cambridge: {
    title: "Cambridge",
    description: "Rigorous A-Level programs with emphasis on critical thinking",
    courses: cambridgeCourses,
    color: "cambridge"
  },
  ib: {
    title: "International Baccalaureate",
    description: "Holistic education program developing global-minded students",
    courses: ibCourses,
    color: "ib"
  }
};