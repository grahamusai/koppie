export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Navigation */}
      <nav className="w-full px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
            </div>
          </div>
          <span className="text-xl font-semibold text-gray-900">
            ChronoTask
          </span>
        </div>

        <div className="flex items-center gap-8">
          <a href="#" className="text-gray-700 hover:text-gray-900 transition">
            Features
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 transition">
            Solutions
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 transition">
            Resources
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 transition">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-700 hover:text-gray-900 transition">
            Sign in
          </button>
          <button className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            Get demo
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center px-12 pt-16 pb-12">
        <div className="w-full flex-1 bg-gray-100 rounded-3xl px-16 py-20 flex flex-col items-center justify-center">
          <h1 className="text-center mb-8">
            <div className="text-6xl font-bold text-gray-900 mb-2">
              Think, plan, and track
            </div>
            <div className="text-6xl font-bold text-gray-400">
              all in one place
            </div>
          </h1>

          <p className="text-gray-600 text-lg mb-10 text-center max-w-xl">
            Efficiently manage your tasks and boost productivity.
          </p>

          <button className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition shadow-lg">
            Get started
          </button>
        </div>
      </main>
    </div>
  );
}
