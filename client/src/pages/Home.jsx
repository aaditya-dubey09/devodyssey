import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getAllBlogsThunk } from "../store/slice/blogSlice/blogs.thunk";
import { viewBlogThunk } from "../store/slice/blogSlice/interactionSlice/interact.thunk";
import { Link, useNavigate } from "react-router-dom";
import { BiLike } from "react-icons/bi";
import { FaEye, FaRegComment } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { devOdysseyTour } from "../components/utils/driverTour";
import bgImage from "../assets/background.jpg";
import aboutImage from "../assets/about.png";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  dayjs.extend(relativeTime);
  const { blogList, loading, error } = useSelector((state) => state.blogs);

  const [Paused, setPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(getAllBlogsThunk());
  }, [dispatch]);

  const popularBlogs = useMemo(() => {
    if (!blogList || blogList.length === 0) return [];
    return [...blogList]
      .sort((a, b) => {
        const aScore = (a.likes?.length || 0) + (a.views || 0);
        const bScore = (b.likes?.length || 0) + (b.views || 0);
        return bScore - aScore;
      })
      .slice(0, 5);
  }, [blogList]);

  const blogs = popularBlogs;
  const blog = blogs[currentIndex] || {};
  const defaultAvatar = "https://api.dicebear.com/6.x/avataaars/svg?seed=" + blog.author;

  // get layout setting from localStorage
  const [layout, setLayout] = useState(localStorage.getItem("layout") || "list");
  useEffect(() => {
    const handleStorage = () => setLayout(localStorage.getItem("layout") || "list");
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!Paused && blogs.length > 0) {
      const interval = setInterval(() => {
        const handleNext = () => {
          setCurrentIndex((prev) => (prev + 1) % blogs.length);
        };
        handleNext();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [Paused, currentIndex, blogs]);

  const words = blog?.content?.split(/\s+/).length || 0;
  const minutes = Math.ceil(words / 200);

  useEffect(() => {
    if (window.location.search.includes("tour") && !sessionStorage.getItem("tourRun")) {
      devOdysseyTour();
      sessionStorage.setItem("tourRun", "true");
    }
  }, []);

  function handleBlogClick(blog) {
    dispatch(viewBlogThunk({ id: blog._id }));
    navigate(`/blogs/${encodeURIComponent(blog.title)}`);
  }

  function handleClickAuthor(blog) {
    navigate(`/author/${encodeURIComponent(blog.author?.username || "unknown")}`);
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen bg-center bg-no-repeat bg-cover animate-fadeIn" id="hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="flex flex-col items-center justify-center w-full min-h-screen text-white bg-gradient-to-tr from-black via-black to-gray-950/50">
          <div className="z-10 flex flex-col items-center">
            <h1 className="z-10 flex gap-2 mb-2 text-3xl font-extrabold md:text-4xl">
              Welcome to <span className="text-blue-500">DevOdyssey!</span>
            </h1>
            <p className="mb-4 text-xs md:text-sm text-white/70">Your space to create, discover, and grow as a developer.</p>
            <motion.div className="flex -space-x-2">
              {blogs.map((b, idx) => (
                <motion.div
                  key={b._id || idx}
                  whileHover={{ scale: 1.5 }}
                  transition={{ type: "tween", stiffness: 300 }}
                  className="p-2 mt-1 rounded-full bg-gray-900/50 h-9 w-9">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ opacity: 1, y: -20 }} // Animate opacity and position on hover
                    className="absolute z-20 px-3 py-1 -translate-x-1/2 rounded-md shadow-lg pointer-events-none bottom-full left-1/2 whitespace-nowrap bg-gray-800/90" // pointer-events-none ensures the tooltip doesn't block the click
                  >
                    <span className="text-[10px] text-white">@{b.author?.username || "unknown"}</span>
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-0 h-0 border-t-[6px] border-t-gray-800/90 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent translate-y-[5px]"></div>
                  </motion.div>
                  <img
                    src={b.author?.avatar || defaultAvatar}
                    alt="Author profile"
                    className="w-6 h-6 rounded-full " />
                </motion.div>
              ))}
            </motion.div>
            <span className="text-[8px] md:text-[10px] text-white/70 mt-2">Join the our community! and start your writing journey
              <span className="font-bold"> {[...new Set(blogList.map(b => b.author?.username))].length}&#43;</span>
              <span className="text-[8px] md:text-[10px] text-white/60"> authors.</span>
            </span>
          </div>
          <div className="absolute z-10 bottom-5">
            <button
              className="md:px-6 px-3 py-1 md:py-2 mt-5 text-sm md:text-md font-semibold text-white transition-all bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-[1.04] shadow-lg duration-200"
              onClick={() => navigate('/Signup')}
              >
              Get Started
            </button>
              </div>
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 to-transparent" />
      </div>

      {/* About Section */}
      <div className="p-5 bg-black">
        <h3 className="mt-12 mb-5 text-xl font-extrabold text-transparent bg-gradient-to-b from-blue-400 via-blue-400 to-transparent bg-clip-text md:text-4xl md:text-center">What is DevOdyssey?</h3>
        <p className="max-w-3xl mx-auto text-justify text-white/80">
          DevOdyssey is a vibrant, open source platform where developers and creators share their ideas, stories, and projects. Discover trending blogs, connect with authors, and grow your knowledge in a welcoming community. Whether you're a seasoned developer or just starting out, DevOdyssey provides the tools and audience to amplify your voice. Join us and start your journey today!
        </p>
          <br />
          <br />
        <p className="max-w-3xl mx-auto text-justify text-white/80 indent-96">
          At DevOdyssey, we believe in the power of storytelling to inspire and educate. Our platform is designed to make it easy for you to publish your work, engage with readers, and explore a diverse range of topics in technology and development. From tutorials and personal experiences to industry insights and project showcases, there's something for everyone.
        </p>

        <h3 className="mt-12 mb-2 text-xl font-extrabold text-transparent ml-52 bg-gradient-to-b from-blue-400 via-blue-400 to-transparent bg-clip-text md:text-4xl">About</h3>
        <div className="grid max-w-5xl grid-cols-2 gap-6 p-5 mx-auto mb-12 bg-opacity-50 md:grid-cols-1">
          <p className="text-justify text-white/80 indent-10">
            DevOdyssey is the brainchild of a passionate developer who wanted to create a space where like-minded individuals could come together to share their journeys and learn from one another. Built with modern technologies like the MERN stack, our platform is fast, responsive, and user-friendly. We are committed to fostering a supportive community where everyone can thrive and contribute to the ever-evolving world of technology.
          </p>
          <p className="text-justify text-white/80 indent-48">
            Our team is dedicated to continuously improving the platform and providing the best possible experience for our users. We believe in the power of collaboration and are always open to feedback and suggestions. Together, we can build a platform that truly serves the needs of the developer community.
          </p>
          <img src={aboutImage} alt="About DevOdyssey" className="mx-auto mt-4 rounded-lg shadow-lg" />
        </div>

        {/* --- Tech Stack Used --- */}
        <div className="flex flex-col">
          <h3 className="mt-10 text-lg font-bold text-center md:text-xl">Tech Stack</h3>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-5">
            <Link to="https://mongodb.com">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/512px-MongoDB_Logo.svg.png?20190626143224" alt="MongoDB" className="h-10" />
            </Link>
            <Link to="https://expressjs.com">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" alt="Express" className="h-10" />
            </Link>
            <Link to="https://react.dev">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" className="h-10" />
            </Link>
            <Link to="https://nodejs.org">
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="Node.js" className="h-10" />
            </Link>
          </div>
        </div>

        {/* --- Testimonials --- */}
        <h3 className="mt-16 mb-8 text-lg font-bold text-center text-white md:text-xl">What our users say</h3>
        <div className="grid max-w-5xl grid-cols-1 gap-6 mx-auto mb-12 md:grid-cols-3">
          <div className="p-6 shadow-lg bg-gray-900/50 rounded-xl">
            <p className="mb-2 text-sm text-white/80 md:text-md">“DevOdyssey helped me connect with other devs and share my journey. The UI is clean and the community is awesome!”</p>
            <hr className="mt-2 border-gray-700" />
            <div className="flex items-center gap-2 mt-4">
              <img src="https://api.dicebear.com/6.x/avataaars/svg?seed=alice" className="w-5 h-5 rounded-full" alt="user" />
              <span className="text-[10px] md:text-xs text-white/60">Alice, Full Stack Dev</span>
            </div>
          </div>
          <div className="p-6 shadow-lg bg-gray-900/50 rounded-xl">
            <p className="mb-2 text-sm text-white/80 md:text-md">“I love the featured blogs and the ability to customize my reading experience. Highly recommended!”</p>
            <hr className="mt-2 border-gray-700" />
            <div className="flex items-center gap-2 mt-4 rounded-full">
              <img src="https://api.dicebear.com/6.x/avataaars/svg?seed=bob" className="p-[3px] bg-black rounded-full h-7 w-7" alt="user" />
              <span className="text-[10px] md:text-xs  text-white/60">Bob, Frontend Engineer</span>
            </div>
          </div>
          <div className="p-6 shadow-lg bg-gray-900/50 rounded-xl">
            <p className="mb-2 text-sm text-white/80 md:text-md">“A must-have platform for anyone who wants to learn, share, and grow in tech. The dark mode is a bonus!”</p>
            <hr className="mt-2 border-gray-700" />
            <div className="flex items-center gap-2 mt-4">
              <img src="https://api.dicebear.com/6.x/avataaars/svg?seed=carol" className="p-[3px] bg-black rounded-full h-7 w-7" alt="user" />
              <span className="text-[10px] md:text-xs  text-white/60">Carol, Student</span>
            </div>
          </div>
        </div>

        {/* --- Featured Blogs --- */}
        <h3 className="mt-16 mb-12 text-2xl font-bold text-center">Featured Blogs</h3>
        {loading && <p className="text-center text-white/70">Loading blogs...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {/* Featured Blogs: grid or list based on layout */}
        {blogs.length > 0 && (
          <div
            className={`relative w-full mx-auto drop-shadow-2xl ${layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : ""}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {layout === "grid"
              ? blogs.map((b, idx) => (
                <div key={b._id || idx} className="flex flex-col gap-3 p-6 rounded-xl bg-slate-900/50 hover:shadow-blue-500/30 hover:scale-[1.03] transition-transform cursor-pointer" onClick={() => handleBlogClick(b)}>
                  <div className="flex items-center gap-2 mb-2 text-xs" onClick={e => { e.stopPropagation(); handleClickAuthor(b); }}>
                    <img src={b.author?.avatar || defaultAvatar} alt="Author profile" className="w-6 h-6 border-l-2 rounded-full border-l-blue-600" />
                    <span className="text-xs text-white">@{b.author?.username || "unknown"}</span>

                    <span className="text-[10px] text-gray-400">{dayjs(b.createdAt).fromNow()}</span>
                    <span className="text-[10px] text-gray-400">{minutes} mins read</span>
                  </div>
                  <hr className="mb-2 border-gray-700 " />
                  <h3
                    className="text-lg font-bold hover:text-blue-500">{b.title}</h3>
                  <p className="text-sm text-white/80 line-clamp-4">{b.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-white/70">
                    <span className="flex items-center gap-1"><BiLike /> {b.likes?.length}</span>
                    <span className="flex items-center gap-1"><FaEye /> {b.views}</span>
                    <span className="flex items-center gap-1"><FaRegComment /> {b.comments?.length}</span>
                  </div>
                </div>
              )
              )
              : (
                <div className="flex flex-col gap-3 p-6 rounded-xl bg-slate-900/50">
                  <div className="flex items-center justify-between gap-2" onClick={() => handleClickAuthor(blog)}>
                    <div className="flex items-center gap-2">
                      <img src={blog.author?.avatar || defaultAvatar} alt="Author profile" className="w-4 h-4 border-l-2 rounded-full border-l-blue-600" />
                      <p className="text-xs text-white">@{blog.author?.username || "unknown"}</p>
                      <p className="text-[10px] text-gray-400">{dayjs(blog.createdAt).fromNow()}</p>
                    </div>
                    <p className="text-[10px] text-gray-400">{minutes} mins read</p>
                  </div>
                  <hr className="border-gray-800 " />
                  <div className="flex flex-col gap-2 text-white bg-transparent rounded-xl" onClick={() => handleBlogClick(blog)}>
                    <h3 className="font-bold cursor-pointer text-md md:text-lg hover:text-blue-500">{blog.title}</h3>
                    <p className="text-xs text-white md:text-sm line-clamp-4">{blog.content}</p>
                    <p className="flex items-center gap-2 text-sm text-white/70">
                      <BiLike className="cursor-pointer hover:text-red-500" /> {blog.likes?.length}
                      <FaEye /> {blog.views}
                      <FaRegComment className="cursor-pointer hover:text-blue-500" /> {blog.comments?.length}
                    </p>
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Blog carousel dots (only for list layout) */}
        {layout === "list" && blogs.length > 0 && (
          <div
            className="flex justify-center gap-2 mt-4"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {blogs.map((blog, idx) => (
              <button
                key={blog._id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`focus:outline-none ${currentIndex === idx ? "scale-125" : "opacity-50"} transition-transform duration-300`}
                aria-label={`Go to blog ${idx + 1}`}
              >
                <svg
                  stroke="currentColor"
                  fill={currentIndex === idx ? "blue" : "gray"}
                  strokeWidth="0"
                  viewBox="0 0 256 256"
                  className="w-6 h-6 text-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="128" cy="128" r="28" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
