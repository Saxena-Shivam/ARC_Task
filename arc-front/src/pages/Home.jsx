import { Link } from "react-router-dom";
import "../App.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-purple-700 to-pink-500 flex flex-col">
      {/* Top Bar */}
      <header className="flex justify-between items-center px-6 py-5 lg:px-12">
        <span className="text-3xl font-extrabold text-white drop-shadow-lg">
          UniCom
        </span>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 w-full max-w-xs sm:max-w-none sm:w-auto mt-4 sm:mt-0">
          <Link
            to="/login"
            className="px-5 py-2 bg-white text-blue-700 font-semibold rounded-full shadow hover:bg-blue-100 transition text-center"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow hover:bg-yellow-300 transition text-center"
          >
            Get Started
          </Link>
        </div>
      </header>
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Structured Communication
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Made Efficient
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
            Secure role-based platform for timed requests and responses.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 bg-white text-blue-700 font-bold rounded-full shadow-lg hover:bg-blue-100 transition"
            >
              Join Now
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-blue-700 text-white font-bold rounded-full shadow-lg hover:bg-blue-800 transition border border-white"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-white rounded-t-3xl shadow-2xl -mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-blue-700">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 shadow">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                Role-Based Access
              </h3>
              <p className="text-gray-600">
                Choose between Requester or Responder roles with specific
                permissions.
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 shadow">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                Timed Workflow
              </h3>
              <p className="text-gray-600">
                Automated reminders and strict 1-hour response windows.
              </p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 shadow">
              <h3 className="text-xl font-semibold text-yellow-700 mb-2">
                Secure Messaging
              </h3>
              <p className="text-gray-600">
                End-to-end protected communication with auto-deletion.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Highlights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-12">
            Why UniCom Works Better
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Role Control */}
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Clear Roles
              </h3>
              <p className="text-gray-600 text-sm">
                Simple separation between Requesters and Responders
              </p>
            </div>

            {/* Time Management */}
            <div className="p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <h3 className="text-lg font-semibold text-purple-700 mb-2">
                1-Hour Clock
              </h3>
              <p className="text-gray-600 text-sm">
                Responses required within 60 minutes or auto-close
              </p>
            </div>

            {/* Messaging */}
            <div className="p-6 bg-yellow-50 rounded-xl">
              <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="text-lg font-semibold text-yellow-700 mb-2">
                Focused Chat
              </h3>
              <p className="text-gray-600 text-sm">
                Message deletion after completion keeps teams focused
              </p>
            </div>
          </div>

          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition"
          >
            Start Free Trial
          </Link>

          <p className="mt-4 text-sm text-gray-500">
            Includes demo with 2 Requesters & 2 Responders
          </p>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl font-light tracking-wider mb-4">
            Structured · Secure · Efficient
          </p>
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} UniCom. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
