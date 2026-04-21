import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, GraduationCap, Clock, CheckCircle, ArrowLeft, Play, Pause, Settings, Activity, Maximize, Volume2, VolumeX, Rewind, FastForward, Loader2 } from "lucide-react";
import ReactPlayer from "react-player";
import Hls from "hls.js";
import { Link, useParams } from "react-router-dom";

const courseDetails = {
    title: "Mastering Advanced Mathematics",
    description: "This comprehensive course covers deep concepts...",
    teacher: "Prof. Sarah Jenkins",
    videos: [
        { id: 1, title: "1. Introduction to Advanced Integration", duration: "45:10", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400", status: "completed", videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
        { id: 2, title: "2. Exploring Differential Equations", duration: "52:30", thumbnail: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=400", status: "completed", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: 3, title: "3. Complex Numbers", duration: "38:15", thumbnail: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=400", status: "current", videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }
    ]
};

const Video = () => {
    const { id } = useParams();
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [levels, setLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(-1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const playerContainerRef = useRef(null);

    const activeVideo =
        courseDetails.videos.find(v => v.id.toString() === (id || "1")) ||
        courseDetails.videos[0];

    const isHLS = activeVideo.videoUrl?.endsWith(".m3u8");

    useEffect(() => {
        const video = videoRef.current;

        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        if (isHLS && video) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hlsRef.current = hls;

                hls.loadSource(activeVideo.videoUrl);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    setLevels(hls.levels);
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = activeVideo.videoUrl;
            }
        }
    }, [activeVideo]);

    const changeQuality = (levelIndex) => {
        if (hlsRef.current) {
            hlsRef.current.currentLevel = levelIndex;
            setCurrentLevel(levelIndex);
        }
    };

    const handleSeek = (e) => {
        const time = Number(e.target.value);
        videoRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolumeChange = (e) => {
        const vol = Number(e.target.value);
        videoRef.current.volume = vol;
        setVolume(vol);
        setIsMuted(vol === 0);
    };

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        videoRef.current.muted = newMuted;
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            playerContainerRef.current?.requestFullscreen().catch(console.error);
        } else {
            document.exitFullscreen();
        }
    };

    const skipTime = (amount) => {
        if (videoRef.current) {
            videoRef.current.currentTime += amount;
        }
    };

    const formatTime = (timeInSeconds) => {
        if (isNaN(timeInSeconds)) return "0:00";
        const m = Math.floor(timeInSeconds / 60);
        const s = Math.floor(timeInSeconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="bg-gray-50 min-h-screen py-6">
            <div className="max-w-[1400px] mx-auto px-4">

                <Link to="/course/1" className="flex items-center gap-2 text-indigo-600 mb-4">
                    <ArrowLeft /> Back
                </Link>

                <div className="grid lg:grid-cols-3 gap-6">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* PLAYER */}
                        <motion.div
                            key={activeVideo.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-black aspect-video rounded-2xl overflow-hidden relative shadow-xl border border-gray-200 dark:border-gray-800 group"
                        >
                            {isHLS ? (
                                <div ref={playerContainerRef} className="relative w-full h-full bg-black group/player">
                                    {isLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
                                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                                        </div>
                                    )}
                                    <video
                                        ref={videoRef}
                                        className="w-full h-full object-contain"
                                        onLoadStart={() => setIsLoading(true)}
                                        onCanPlay={() => setIsLoading(false)}
                                        onWaiting={() => setIsLoading(true)}
                                        onPlaying={() => { setIsPlaying(true); setIsLoading(false); }}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                                        onLoadedMetadata={(e) => setDuration(e.target.duration)}
                                        onClick={() => {
                                            const v = videoRef.current;
                                            v.paused ? v.play() : v.pause();
                                        }}
                                    />

                                    {/* CUSTOM CONTROLS */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 pt-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 flex flex-col gap-3">

                                        {/* SCRUB BAR */}
                                        <div className="flex items-center gap-3 px-2">
                                            <span className="text-white text-xs font-medium w-10 text-right">{formatTime(currentTime)}</span>
                                            <input
                                                type="range" min={0} max={duration || 1} value={currentTime}
                                                onChange={handleSeek}
                                                className="flex-1 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
                                            />
                                            <span className="text-white text-xs font-medium w-10">{formatTime(duration)}</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* PLAY/PAUSE */}
                                            <button
                                                onClick={() => {
                                                    const v = videoRef.current;
                                                    v.paused ? v.play() : v.pause();
                                                }}
                                                className="text-white hover:text-indigo-400 transition-colors bg-white/10 p-2.5 rounded-full backdrop-blur-sm shadow-sm hover:scale-105 transform hover:bg-white/20"
                                            >
                                                {isPlaying ? (
                                                    <Pause className="w-5 h-5 fill-current" />
                                                ) : (
                                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                                )}
                                            </button>

                                            {/* REWIND 5s */}
                                            <div className="relative group/btn hidden sm:block">
                                                <button onClick={() => skipTime(-5)} className="text-white hover:text-indigo-400 transition-colors p-2.5 bg-white/10 rounded-full backdrop-blur-sm shadow-sm hover:scale-105 transform hover:bg-white/20">
                                                    <Rewind className="w-4 h-4 fill-current" />
                                                </button>
                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none border border-white/10 shadow-lg">
                                                    -5 sec
                                                </div>
                                            </div>

                                            {/* FAST FORWARD 5s */}
                                            <div className="relative group/btn hidden sm:block">
                                                <button onClick={() => skipTime(5)} className="text-white hover:text-indigo-400 transition-colors p-2.5 bg-white/10 rounded-full backdrop-blur-sm shadow-sm hover:scale-105 transform hover:bg-white/20">
                                                    <FastForward className="w-4 h-4 fill-current" />
                                                </button>
                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none border border-white/10 shadow-lg">
                                                    +5 sec
                                                </div>
                                            </div>

                                            {/* VOLUME */}
                                            <div className="flex items-center gap-2 group/vol ml-2">
                                                <button onClick={toggleMute} className="text-white hover:text-indigo-400 transition-colors">
                                                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                                </button>
                                                <input
                                                    type="range" min={0} max={1} step={0.05} value={isMuted ? 0 : volume}
                                                    onChange={handleVolumeChange}
                                                    className="w-0 opacity-0 group-hover/vol:w-20 group-hover/vol:opacity-100 transition-all duration-300 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                />
                                            </div>

                                            <div className="flex-1" />

                                            {/* SPEED */}
                                            <div className="relative hidden md:flex items-center group/menu pb-2 -mb-2">
                                                <button className="flex items-center bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 px-2.5 py-1.5 transition-colors hover:bg-white/20 text-white text-xs font-medium">
                                                    <Activity className="w-4 h-4 text-white/80 mr-1.5" />
                                                    {playbackRate}x
                                                </button>

                                                <div className="absolute bottom-full right-0 mb-2 invisible opacity-0 translate-y-2 group-hover/menu:visible group-hover/menu:opacity-100 group-hover/menu:translate-y-0 transition-all duration-200 bg-black/90 backdrop-blur-md rounded-lg p-1 min-w-[80px] border border-white/10 flex flex-col z-20 shadow-2xl">
                                                    <div className="absolute top-full left-0 w-full h-4" />
                                                    {[0.5, 1, 1.25, 1.5, 2].map(r => (
                                                        <button
                                                            key={r}
                                                            onClick={() => {
                                                                setPlaybackRate(r);
                                                                videoRef.current.playbackRate = r;
                                                            }}
                                                            className={`text-left px-3 py-1.5 text-xs rounded transition-colors ${playbackRate === r ? 'bg-indigo-500/50 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                                                        >
                                                            {r}x
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* QUALITY */}
                                            {levels.length > 0 && (
                                                <div className="relative hidden sm:flex items-center group/menu pb-2 -mb-2">
                                                    <button className="flex items-center bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 px-2.5 py-1.5 transition-colors hover:bg-white/20 text-white text-xs font-medium">
                                                        <Settings className="w-4 h-4 text-white/80 mr-1.5" />
                                                        {currentLevel === -1 ? 'Auto' : `${levels[currentLevel]?.height}p`}
                                                    </button>

                                                    <div className="absolute bottom-full right-0 mb-2 invisible opacity-0 translate-y-2 group-hover/menu:visible group-hover/menu:opacity-100 group-hover/menu:translate-y-0 transition-all duration-200 bg-black/90 backdrop-blur-md rounded-lg p-1 min-w-[100px] border border-white/10 flex flex-col z-20 shadow-2xl">
                                                        <div className="absolute top-full left-0 w-full h-4" />
                                                        <button
                                                            onClick={() => changeQuality(-1)}
                                                            className={`text-left px-3 py-1.5 text-xs rounded transition-colors ${currentLevel === -1 ? 'bg-indigo-500/50 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                                                        >
                                                            Auto
                                                        </button>
                                                        {levels.map((l, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => changeQuality(i)}
                                                                className={`text-left px-3 py-1.5 text-xs rounded transition-colors ${currentLevel === i ? 'bg-indigo-500/50 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                                                            >
                                                                {l.height}p
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* FULLSCREEN */}
                                            <button onClick={toggleFullScreen} className="text-white hover:text-indigo-400 transition-colors p-2 bg-white/10 rounded-lg backdrop-blur-sm shadow-sm hover:scale-105 transform hover:bg-white/20 ml-1">
                                                <Maximize className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <ReactPlayer
                                    url={activeVideo.videoUrl}
                                    controls
                                    width="100%"
                                    height="100%"
                                    pip={false}
                                    playbackRate={playbackRate}
                                    light={activeVideo.thumbnail}
                                    playIcon={
                                        <div className="bg-white/90 p-5 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur transition-all transform hover:scale-110">
                                            <Play className="text-gray-900 w-10 h-10 fill-current ml-1" />
                                        </div>
                                    }
                                />
                            )}
                        </motion.div>

                        {/* TITLE */}
                        <div className="bg-white p-4 rounded-xl">
                            <h1 className="text-xl font-bold">{activeVideo.title}</h1>
                            <div className="flex gap-4 text-sm text-gray-500 mt-2">
                                <span><User size={16} /> {courseDetails.teacher}</span>
                                <span><Clock size={16} /> {activeVideo.duration}</span>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT PLAYLIST */}
                    <div className="bg-white rounded-xl overflow-hidden">
                        <div className="p-4 border-b font-bold">
                            <GraduationCap /> Playlist
                        </div>

                        {courseDetails.videos.map(video => {
                            const isActive = video.id === activeVideo.id;

                            return (
                                <Link
                                    key={video.id}
                                    to={`/video/${video.id}`}
                                    className={`flex gap-3 p-3 border-b ${isActive ? "bg-indigo-50" : ""}`}
                                >
                                    <img src={video.thumbnail} className="w-24 h-14 object-cover rounded" />

                                    <div>
                                        <h4 className="text-sm font-semibold">{video.title}</h4>
                                        {video.status === "completed" && (
                                            <p className="text-xs text-green-600 flex items-center gap-1">
                                                <CheckCircle size={12} /> Watched
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Video;