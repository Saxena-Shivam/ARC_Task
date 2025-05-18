// src/pages/Home.jsx

import { Link } from "react-router-dom";
import "../App.css";
export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 z-10">
        <Link
          to="/login"
          className="px-4 py-2 border border-gray-300 bg-green-300 text-blue-600 rounded shadow hover:shadow-lg transition duration-300 hover:bg-opacity-90"
        >
          Sign In
        </Link>
      </div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            Transform Your Learning
            <span className="block mt-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Journey
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Empower your educational experience with cutting-edge tools
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold 
            hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Tagline Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-light text-gray-600">
            Aspire · Reflect · Create
          </p>
        </div>
      </div>

      {/* AI Integration Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Integration of AI in Education
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform learning experiences with cutting-edge artificial
            intelligence technology
          </p>
        </div>
      </section>

      {/* Add additional sections here as needed */}
    </div>
  );
}
