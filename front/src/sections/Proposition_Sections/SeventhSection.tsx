import React, { useState, useRef } from 'react';
import { systemFeatures } from '../propositionData';

const SeventhSection: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const phoneVideoRef = useRef<HTMLVideoElement>(null);
  const laptopVideoRef = useRef<HTMLVideoElement>(null);

  const handleFeatureChange = (index: number) => {
    if (index === currentFeature) return;

    setIsVideoLoading(true);
    setCurrentFeature(index);

    setTimeout(() => {
      if (phoneVideoRef.current) {
        phoneVideoRef.current.load();
        phoneVideoRef.current.play();
      }
      if (laptopVideoRef.current) {
        laptopVideoRef.current.load();
        laptopVideoRef.current.play();
      }
      setIsVideoLoading(false);
    }, 300);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-24 overflow-hidden tracking-tight">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sky-500 text-sm tracking-wide font-semibold uppercase">System Features</span>
          <h2 className="mt-4 text-5xl font-semibold text-gray-600">
            Revolutionary Experience
          </h2>
        </div>

        {/* Feature Cards Grid - Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {systemFeatures.map((feature, index) => (
            <button
              key={feature.title}
              onClick={() => handleFeatureChange(index)}
              className={`relative p-6 rounded-2xl transition-all duration-300 text-left group border-2 ${currentFeature === index
                ? 'bg-white text-gray-600 border-gray-200 hover:border-sky-200'
                : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200 hover:border-sky-200'
                }`}
            >
              {/* Bottom Indicator for Active State */}
              {currentFeature === index && (
                <div className="absolute bottom-0 left-6 right-6 h-1 bg-sky-500 rounded-t-full"></div>
              )}

              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-sky-500" />
                </div>
                <span className="ml-4 font-semibold text-lg text-gray-600">
                  {feature.title}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </button>
          ))}
        </div>

        {/* Device Display Section - Middle with Intersection */}
        <div className="flex justify-center items-center mb-16 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-100 via-transparent to-sky-100 rounded-3xl opacity-30"></div>

          <div className="relative flex items-center justify-center">
            {/* Laptop Display */}
            <div className="relative z-10">
              <div className="w-[40rem] h-[25rem] bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-2xl p-3 shadow-2xl">
                <div className="w-full h-full bg-black rounded-t-xl overflow-hidden relative">
                  {/* Loading Overlay */}
                  {isVideoLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Video Content */}
                  <video
                    ref={laptopVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={systemFeatures[currentFeature].video} type="video/mp4" />
                  </video>

                  {/* Laptop UI Overlay */}
                  <div className="absolute top-3 left-3 right-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                      <div className="flex-1 bg-gray-700 rounded-md px-3 py-1 ml-3">
                        <span className="text-gray-300 text-xs">ohs-one.vercel.app</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Base */}
              <div className="w-[40rem] h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-b-2xl"></div>
              <div className="w-48 h-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mx-auto -mt-1"></div>
            </div>

            {/* Phone Display - Intersecting with Laptop */}
            <div className="relative z-20 -ml-32 mt-8">
              <div className="w-56 h-[28rem] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative">

                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-40"></div>

                  {/* Loading Overlay */}
                  {isVideoLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Video Content */}
                  <video
                    ref={phoneVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={systemFeatures[currentFeature].video} type="video/mp4" />
                  </video>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white bg-opacity-60 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Stats - Bottom Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-8 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl font-bold text-sky-500 mb-3">99.9%</div>
            <div className="text-sm text-gray-600 font-medium">Uptime</div>
            <div className="text-xs text-gray-400 mt-1">System Reliability</div>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl font-bold text-sky-500 mb-3">&lt;50ms</div>
            <div className="text-sm text-gray-600 font-medium">Response Time</div>
            <div className="text-xs text-gray-400 mt-1">Lightning Fast</div>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl font-bold text-sky-500 mb-3">256-bit</div>
            <div className="text-sm text-gray-600 font-medium">Encryption</div>
            <div className="text-xs text-gray-400 mt-1">Bank-Level Security</div>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl font-bold text-sky-500 mb-3">24/7</div>
            <div className="text-sm text-gray-600 font-medium">Monitoring</div>
            <div className="text-xs text-gray-400 mt-1">Always Protected</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeventhSection;