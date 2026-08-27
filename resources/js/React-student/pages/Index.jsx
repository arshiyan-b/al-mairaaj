import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Sparkles,
    BookOpen,
    Users,
    Camera,
    House,
    Settings2,
    Compass,
    FlaskConical,
    GraduationCap,
} from "lucide-react";
import logoImg from "../assets/logo.png";
import logoTextImg from "../assets/logo_text.svg";

// Teacher gifs
import kanwarGif from "../assets/kanwer_noomani.gif";
import ammarGif from "../assets/ammar_sami.gif";
import umerGif from "../assets/umer_hanif.gif";
import munatahaGif from "../assets/muntaha_tariq.gif";

const navLinks = [
    { label: "Why Al-Mairaaj", href: "#why-al-mairaaj" },
    { label: "Learning Model", href: "#learning-model" },
    { label: "Teachers", href: "#teachers" },
    { label: "About", href: "#about" },
];

const features = [
    { icon: BookOpen, title: "Live Lectures", desc: "60-70 structured live sessions covering your whole syllabi. Pay only for the lessons you need." },
    { icon: Users, title: "1:1 Guidance (Coming soon)", desc: "Live 1 on 1 classes with subject experts to focus on your areas of improvement." },
    { icon: Camera, title: "Lecorded Lectures (Coming soon)", desc: "Concise recorded lessons for each subtopic in the syllabus. Pay per minute only for the videos you watch." },
    { icon: House, title: "Home Schooling (Coming soon)", desc: "Supercharge your homeschooling journey through our portal, with level based learning for tailored education." },
    { icon: Settings2, title: "EdTech Tools (Coming soon)", desc: "Use our state of the art simulations to get a (virtual) hands on experience." },
    { icon: FlaskConical, title: "Virtual Practicals (Coming soon)", desc: "Learn how to conduct practicals step by step through virtual classes, with expert demonstrations, guidance, and practical homework." },
];

const steps = [
    { icon: Compass, step: "01", title: "Find Your Weakness", desc: "Start with a diagnostic that pinpoints exactly where you're falling behind, so you spend time on what matters instead of guessing." },
    { icon: Camera, step: "02", title: "Watch & Learn", desc: "Jump straight into a recorded lesson matched to that exact gap — bite-sized, on-demand, and ready whenever you are." },
    { icon: BookOpen, step: "03", title: "Join a Live Class", desc: "Still stuck? Sit in on a live session covering that topic, with real-time explanations and the chance to ask questions as they come up." },
    { icon: Users, step: "04", title: "Book a 1-on-1 Session", desc: "Need more? Request a one-on-one with your preferred tutor for focused, personalized help until it finally clicks." },
];

const teachers = [
    { name: "Kanwar Noomani", gif: kanwarGif },
    { name: "Ammar Sami", gif: ammarGif },
    { name: "Umer Hanif", gif: umerGif },
    { name: "Munataha Tariq", gif: munatahaGif },
];

const footerCols = [
    {
        title: "Contact Us",
        links: [
            {
                name: "Email",
                url: "mailto:info@almairaaj.com",
            },
            {
                name: "WhatsApp",
                url: "https://wa.me/message/6ZTX4BXOGXVZK1",
            },
            {
                name: "Instagram",
                url: "https://www.instagram.com/almairaaj.oes/",
            },
            {
                name: "Facebook",
                url: "https://web.facebook.com/almairaaj.oes/",
            },
            {
                name: "YouTube",
                url: "https://www.youtube.com/@AlMairaaj-oes",
            },
        ],
    },
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
                                <button
                                    type="button"
                                    onClick={() => {
                                        const el = document.querySelector(l.href);
                                        if (el) el.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="text-sm font-medium text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400 transition-colors bg-transparent border-none p-0 cursor-pointer"
                                >
                                    {l.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-3">
                        <a href="/login">
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20">
                                Login in / Sign up
                            </Button>
                        </a>
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
                            Al Mairaaj is an online education system that puts you in the driving seat, 
                            empowering you to learn what you need, when you need it, at an affordable price.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <a href="/register">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto text-base h-12 px-8 bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/25"
                                >
                                    Start learning
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </a>
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
            <section id="why-al-mairaaj" className="py-24 md:py-32 bg-gray-50 dark:bg-gray-950/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className="text-lg font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Why Al Mairaaj</span>
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
                        <span className="text-lg font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Our learning model</span>
                        <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-white">
                            A four-step loop built around how you actually learn.
                        </h2>
                        <p className="mt-4 text-lg text-gray-400">
                            We replaced the "one-size-fits-all" model with an adaptive, mentor-backed system that meets you where you're stuck.
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
            <section id="teachers" className="py-24 md:py-32 bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mb-16 text-center mx-auto">
                        <span className="text-lg font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">Meet the team</span>
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
                                className="group rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-teal-200 dark:hover:border-teal-800 transition-colors overflow-hidden"
                            >
                                <div className="w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={t.gif}
                                        alt={t.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="about" className="py-20 bg-white dark:bg-gray-950">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-teal-900 p-12 md:p-20 text-center shadow-2xl">
                        <div className="absolute top-0 right-0 -m-32 h-64 w-64 rounded-full bg-teal-500 blur-3xl opacity-30" />
                        <div className="absolute bottom-0 left-0 -m-32 h-64 w-64 rounded-full bg-emerald-500 blur-3xl opacity-30" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white max-w-2xl mx-auto leading-tight">
                                Your future starts with a single class.
                            </h2>
                            <p className="mt-6 text-lg text-teal-100 max-w-xl mx-auto">
                                Pay only for the classes you take with no monthly commitment or upfront package required. Start learning today, one class at a time.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register">
                                    <Button size="lg" className="w-full sm:w-auto h-12 bg-white text-teal-900 hover:bg-teal-50 font-semibold px-8 shadow-lg">
                                        Start Now <ArrowRight className="ml-2 h-5 w-5" />
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
                            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900 dark:text-white">
                                {col.title}
                            </h4>

                            <ul className="mt-6 flex flex-nowrap items-center gap-x-6">
                                {col.links.map((link) => (
                                    <li key={link.name} className="whitespace-nowrap">
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>© {new Date().getFullYear()} Noomanis Education Hub. All rights reserved.</span>
                        <span>Crafted with care for curious minds.</span>
                    </div>
                </div>
            </footer>
        </main>
    );
};

export default Index;