import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/farmers-bg.jpg" // <-- update to your new image filename
          alt="background"
          className="w-full h-full object-cover filter blur-md opacity-1010"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Top-left welcome note */}
      <div className="fixed top-6 left-6 z-20 bg-white/10 backdrop-blur-md rounded-xl shadow-lg px-6 py-4 max-w-xs border border-white/30">
        <h2 className="text-lg font-bold text-primary mb-1">🌾 Welcome!</h2>
        <p className="text-xs text-black">
          GS Crop Advisory System helps small and marginal farmers make smart,
          profitable, and sustainable decisions every season.
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto p-6">
        <div className="bg-transparent border border-white/20 rounded-2xl p-8 shadow-md animate-in slide-in-from-bottom-8 backdrop-blur-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-md">
              <img src="/favicon.ico" alt="Logo" className="w-12 h-12" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🌾 Welcome to GS Crop Advisory System
          </h1>

          <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
            Your intelligent farming companion designed especially for small and
            marginal farmers. Our platform provides smart insights on fertilizer
            usage, profit estimation, and crop yield prediction, helping you make
            data-driven decisions for every season.
            <br />
            <br />
            By analyzing soil, weather, and crop conditions, we guide you toward
            the most profitable and sustainable farming choices — so you can grow
            more, spend less, and earn better. 🌱
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              to="/signin"
              className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition shadow-md"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3 rounded-xl font-semibold bg-transparent border border-white/20 hover:bg-white/10 transition"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="backdrop-blur-md bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="text-2xl mb-2">🌱</div>
              <h3 className="font-semibold mb-2">Smart Recommendations</h3>
              <p className="text-sm">
                Get AI-powered crop suggestions based on your soil, climate, and
                market conditions
              </p>
            </div>
            <div className="backdrop-blur-md bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-2">Data Analytics</h3>
              <p className="text-sm">
                Track your farm's performance with detailed insights and historical
                data
              </p>
            </div>
            <div className="backdrop-blur-md bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="text-2xl mb-2">🌍</div>
              <h3 className="font-semibold mb-2">Expert Support</h3>
              <p className="text-sm">
                Access a community of agricultural experts and get timely advice
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;