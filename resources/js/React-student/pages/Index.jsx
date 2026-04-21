import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Play,
    Sparkles,
    BookOpen,
    Users,
    Trophy,
    Zap,
    Globe2,
    ShieldCheck,
    Compass,
    Hammer,
    MessagesSquare,
    Rocket,
    Linkedin,
    Twitter,
    GraduationCap,
} from "lucide-react";
import heroImg from "../assets/sideimage.png";
import logoImg from "../assets/logo.png";
import logoTextImg from "../assets/logo_text.svg";

const navLinks = [
    { label: "Courses", href: "#courses" },
    { label: "Learning Model", href: "#learning-model" },
    { label: "Teachers", href: "#mentors" },
    { label: "About", href: "#about" },
];

const features = [
    { icon: BookOpen, title: "Curated learning paths", desc: "Structured journeys from beginner to mastery, refined by industry experts." },
    { icon: Users, title: "Live mentor sessions", desc: "Weekly office hours and 1:1 reviews with practitioners from top companies." },
    { icon: Trophy, title: "Recognized certificates", desc: "Earn credentials trusted by 500+ hiring partners across the globe." },
    { icon: Zap, title: "Project-based learning", desc: "Ship real projects, not just watch videos. Build a portfolio that stands out." },
    { icon: Globe2, title: "Global community", desc: "Join 12k+ learners across 80 countries collaborating in real time." },
    { icon: ShieldCheck, title: "Lifetime access", desc: "Course updates, new modules, and resources — yours forever, on any device." },
];

const steps = [
    { icon: Compass, step: "01", title: "Diagnose", desc: "Start with a skills assessment that maps your current level to a personalized learning path." },
    { icon: MessagesSquare, step: "02", title: "Learn live", desc: "Weekly cohort sessions with mentors — small groups, real conversations, zero passive watching." },
    { icon: Hammer, step: "03", title: "Build in public", desc: "Ship one production-grade project per module. Your portfolio grows as you learn." },
    { icon: Rocket, step: "04", title: "Launch your career", desc: "Mock interviews, resume reviews, and direct intros to our 500+ hiring partners." },
];

const teachers = [
    { name: "Kanwar Noomani", role: "Lead Instructor · AI & ML", bio: "Ex-Google Research. 12+ years building production ML systems and teaching at scale.", initials: "IS" },
    { name: "Ammar Sami", role: "Head of Web Engineering", bio: "Former Staff Engineer at Shopify. Specializes in React, performance, and developer experience.", initials: "SA" },
    { name: "Umer Hanif", role: "Design Mentor", bio: "Product designer for Linear & Notion. Teaches design systems and modern product craft.", initials: "YR" },
    { name: "Arshiyan Bashir", role: "Career Coach", bio: "Helped 800+ learners land roles at FAANG and high-growth startups across 4 continents.", initials: "LH" },
];

const footerCols = [
    { title: "Platform", links: ["Courses", "Mentors", "Certificates", "Pricing"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
];

const Index = () => {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-50">
            {/* Navbar */}
            <header className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex min-h-[5rem] py-2 items-center justify-between">
                    <a href="#" className="flex items-center gap-3 group">
                        <img
                            src={logoTextImg}
                            alt="Al Mairaaj Logo"
                            className="w-40 md:w-48 h-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </a>

                    <ul className="hidden md:flex items-center gap-8">
                        {navLinks.map((l) => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    className="text-sm font-medium text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400 transition-colors"
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" className="hidden sm:inline-flex text-teal-700 hover:text-teal-900 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950">
                                Sign in
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20">
                                Get started
                            </Button>
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden bg-white dark:bg-gray-950 pt-24 pb-16 md:pt-32 md:pb-24">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-100/50 dark:bg-teal-900/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-100/50 dark:bg-emerald-900/20 blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid lg:grid-cols-2 gap-12 items-center">
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-900/30 dark:text-teal-300 text-xs font-semibold uppercase tracking-wider">
                            <Sparkles className="h-3.5 w-3.5" />
                            New cohorts opening
                        </span>

                        <h1 className="mt-6 text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                            Elevate learning.
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500 mt-2">
                                Empower futures.
                            </span>
                        </h1>

                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-xl">
                            Al Mairaaj is the modern EdTech platform where live mentors, immersive paths,
                            and globally recognized certificates meet — designed for the next generation of curious minds.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <Link to="/register">
                                <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/25">
                                    Start learning free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900">
                                <Play className="mr-2 h-5 w-5 text-teal-600" />
                                Watch demo
                            </Button>
                        </div>

                        <div className="mt-12 grid grid-cols-3 gap-6 max-w-md border-t border-gray-200 dark:border-gray-800 pt-8">
                            {[
                                { k: "12k+", v: "Active learners" },
                                { k: "50+", v: "Expert mentors" },
                                { k: "97%", v: "Completion rate" },
                            ].map((s) => (
                                <div key={s.v}>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{s.k}</div>
                                    <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">{s.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-lg lg:max-w-none animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 fill-mode-both">
                        <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-emerald-300 blur-3xl opacity-20 dark:opacity-10 rounded-full" />
                        <img
                            src={logoImg}
                            alt="Learning platform"
                            className="relative w-full rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 object-contain p-8 bg-white dark:bg-gray-900"
                            style={{ aspectRatio: "4/3" }}
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="courses" className="py-24 md:py-32 bg-gray-50 dark:bg-gray-950/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Why Al Mairaaj</span>
                        <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                            A platform built around how you actually learn.
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                            Six pillars that make Al Mairaaj different from the recorded-video crowd.
                        </p>
                    </div>

                    <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <article
                                key={f.title}
                                className="group relative p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-800 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="h-12 w-12 rounded-xl bg-teal-50 dark:bg-gray-800 text-teal-600 dark:text-teal-400 grid place-items-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                                    <f.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{f.title}</h3>
                                <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Learning Model */}
            <section id="learning-model" className="py-24 md:py-32 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Our learning model</span>
                        <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-white">
                            A four-step loop designed for real outcomes.
                        </h2>
                        <p className="mt-4 text-lg text-gray-400">
                            We replaced the "watch videos and hope" model with a structured, mentor-led system.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((s) => (
                            <article
                                key={s.step}
                                className="relative p-8 rounded-2xl bg-gray-800/50 border border-gray-700/50 hover:border-teal-500/50 hover:bg-gray-800 transition-all duration-300"
                            >
                                <span className="text-5xl font-extrabold text-gray-700/50 select-none block mb-4">{s.step}</span>
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white grid place-items-center shadow-lg shadow-teal-500/20">
                                    <s.icon className="h-6 w-6" />
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-white">{s.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-gray-400">{s.desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Teachers */}
            <section id="mentors" className="py-24 md:py-32 bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mb-16 text-center mx-auto">
                        <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Meet the team</span>
                        <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
                            Learn from active practitioners.
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                            Every Al Mairaaj instructor is an active professional — bringing real-world experience to you.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teachers.map((t) => (
                            <article
                                key={t.name}
                                className="group p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-teal-200 dark:hover:border-teal-800 transition-colors"
                            >
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900 dark:to-emerald-900 text-teal-700 dark:text-teal-300 grid place-items-center text-xl font-bold shadow-inner">
                                    {t.initials}
                                </div>
                                <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">{t.name}</h3>
                                <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-3">{t.role}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t.bio}</p>
                                <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-800 flex items-center gap-4">
                                    <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-teal-600 transition-colors">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                    <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-teal-600 transition-colors">
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="pricing" className="py-20 bg-white dark:bg-gray-950">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-teal-900 p-12 md:p-20 text-center shadow-2xl">
                        <div className="absolute top-0 right-0 -m-32 h-64 w-64 rounded-full bg-teal-500 blur-3xl opacity-30" />
                        <div className="absolute bottom-0 left-0 -m-32 h-64 w-64 rounded-full bg-emerald-500 blur-3xl opacity-30" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white max-w-2xl mx-auto leading-tight">
                                Your future starts with a single class.
                            </h2>
                            <p className="mt-6 text-lg text-teal-100 max-w-xl mx-auto">
                                Join our community today and start building skills that matter. Your first week is on us.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register">
                                    <Button size="lg" className="w-full sm:w-auto h-12 bg-white text-teal-900 hover:bg-teal-50 font-semibold px-8 shadow-lg">
                                        Start free trial <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-8 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2">
                            <span className="grid place-items-center h-8 w-8 rounded-lg bg-teal-600 text-white">
                                <GraduationCap className="h-4 w-4" />
                            </span>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Al Mairaaj</span>
                        </div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
                            A modern EdTech platform helping learners climb to the next level — one project, one mentor, one breakthrough at a time.
                        </p>
                    </div>

                    {footerCols.map((col) => (
                        <div key={col.title}>
                            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900 dark:text-white">{col.title}</h4>
                            <ul className="mt-6 space-y-3">
                                {col.links.map((l) => (
                                    <li key={l}>
                                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{l}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>© {new Date().getFullYear()} Al Mairaaj. All rights reserved.</span>
                        <span>Crafted with care for curious minds.</span>
                    </div>
                </div>
            </footer>
        </main>
    );
};

export default Index;