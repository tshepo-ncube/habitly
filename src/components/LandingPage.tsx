import React from "react";
import { Target, Zap, TrendingUp, Star, Check } from "lucide-react";

interface LandingPageProps {
  onGoogleLogin: () => void;
  onMicrosoftLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onGoogleLogin,
  onMicrosoftLogin,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">Habitly</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#pricing"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#features"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Features
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Build Better
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Habits
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your daily routine with beautiful habit tracking. Stay
            motivated with streaks, reflect on your progress, and build the life
            you want.
          </p>

          {/* Auth Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onGoogleLogin}
              className="flex items-center space-x-3 bg-white border border-gray-300 px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                Continue with Google
              </span>
            </button>

            <button
              onClick={onMicrosoftLogin}
              className="flex items-center space-x-3 bg-white border border-gray-300 px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z" />
                <path fill="#00A4EF" d="M13 1h10v10H13z" />
                <path fill="#7FBA00" d="M1 13h10v10H1z" />
                <path fill="#FFB900" d="M13 13h10v10H13z" />
              </svg>
              <span className="text-gray-700 font-medium">
                Continue with Microsoft
              </span>
            </button>
          </div>

          {/* Hero Image/Demo */}
          <div className="relative max-w-sm mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-2xl mb-4">
                <h3 className="font-bold text-center">Today's Habits</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-white/20 p-1 rounded-lg">☕</div>
                    <span className="text-white font-medium">
                      Morning Coffee
                    </span>
                  </div>
                  <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-white/20 p-1 rounded-lg">📚</div>
                    <span className="text-white font-medium">
                      Read 10 pages
                    </span>
                  </div>
                  <div className="w-6 h-6 border-2 border-white/40 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start for free and unlock powerful features by upgrading to Pro.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Free</h3>
              <p className="text-gray-600 mb-6">For getting started</p>
              <p className="text-4xl font-bold text-gray-800 mb-6">
                $0<span className="text-lg font-medium text-gray-500">/mo</span>
              </p>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  Up to 3 habits
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  Up to 30s voice notes
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  Basic streak tracking
                </li>

                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  Premium icons & themes
                </li>
              </ul>
            </div>
            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg p-8 transform scale-105">
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="opacity-80 mb-6">For building mastery</p>
              <p className="text-4xl font-bold mb-6">
                $7<span className="text-lg font-medium opacity-80">/mo</span>
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  12 habits max
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />5 minutes reflection
                  recording length
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Advanced AI Coach
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Advanced analytics
                </li>

                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  SMS & email reminders
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Export data
                </li>
                {/* <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  Accountability partners
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you build lasting habits and
              track your progress.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Streak Tracking
              </h3>
              <p className="text-gray-600">
                Stay motivated with visual streak counters that celebrate your
                consistency.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Progress Insights
              </h3>
              <p className="text-gray-600">
                Reflect on your daily progress with built-in journaling
                features.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Beautiful Design
              </h3>
              <p className="text-gray-600">
                Enjoy a clean, intuitive interface that makes habit tracking
                delightful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Habitly</span>
          </div>
          <p className="text-gray-600">
            Build better habits, one day at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
