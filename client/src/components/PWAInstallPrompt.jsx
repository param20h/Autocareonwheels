import React, { useEffect, useState } from 'react';
import { X, Download, Share2, MoreVertical } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState('chrome'); // 'chrome' or 'safari'
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isSafari: false,
    isChrome: false,
    isAndroid: false,
    isMobile: false,
  });

  useEffect(() => {
    // Check if the app is already installed/running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    if (isStandalone) {
      return; // Already running as a PWA, do not show prompts
    }

    // Check if the user previously dismissed the prompt
    const isDismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (isDismissed) {
      return;
    }

    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|iphone|ipad|ipod|android|iemobile|blackberry/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua) && !window.MSStream;
    const isAndroid = /android/i.test(ua);
    
    // Chrome on iOS is 'crios', Chrome on Android is 'chrome'
    const isChrome = /chrome|crios|crmo/i.test(ua) && !/edge|edg/i.test(ua);
    // Safari has 'safari' but not 'chrome' / 'crios'
    const isSafari = isIOS && /safari/i.test(ua) && !isChrome;

    setDeviceInfo({
      isIOS,
      isSafari,
      isChrome,
      isAndroid,
      isMobile,
    });

    // Auto-select tab based on detection
    if (isSafari) {
      setActiveTab('safari');
    } else {
      setActiveTab('chrome');
    }

    // We only show the prompt automatically for mobile devices
    if (isMobile) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2500); // 2.5s delay for a smoother intro
      return () => clearTimeout(timer);
    }

    // Android/Chrome Detection (Intercept beforeinstallprompt)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      // Store the event so it can be triggered later.
      setDeferredPrompt(e);
      setActiveTab('chrome');
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAndroidInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the native browser install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to PWA install: ${outcome}`);

    // We no longer need the prompt, clear it
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#0f172a]/95 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-white shadow-2xl flex flex-col gap-3 relative overflow-hidden">
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />

        <button 
          onClick={handleDismiss} 
          className="absolute right-3 top-3 p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          aria-label="Dismiss prompt"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-11 h-11 bg-accent/20 rounded-xl border border-accent/30 flex-shrink-0 flex items-center justify-center">
            <img src="/logo.png" alt="AutoCare Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm tracking-tight text-white">Install AutoCare Web App</h4>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Access mobile tyre fitting & mechanics directly from your home screen.</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setActiveTab('safari')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'safari' 
                ? 'bg-accent text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Safari (iOS)
          </button>
          <button
            onClick={() => setActiveTab('chrome')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'chrome' 
                ? 'bg-accent text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Chrome (Android / iOS)
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs leading-relaxed text-gray-300">
          {activeTab === 'safari' ? (
            <div className="space-y-1.5">
              <p className="font-semibold text-white text-xs mb-1 flex items-center gap-1.5">
                <span>Installation steps:</span>
              </p>
              <div className="flex items-start gap-2">
                <span className="font-bold text-accent">1.</span>
                <p>
                  Open the website in Safari, tap the <span className="inline-flex items-center px-1 py-0.5 bg-white/10 rounded font-semibold text-white align-middle">
                    {/* Native-looking Safari Share Icon (box with arrow pointing up) */}
                    <svg className="w-3.5 h-3.5 text-accent mr-1 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    Share
                  </span> button (box with an arrow pointing up).
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-accent">2.</span>
                <p>
                  Scroll down and select <span className="font-bold text-white">Add to Home Screen</span>.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {deferredPrompt && (
                <button
                  onClick={handleAndroidInstallClick}
                  className="w-full bg-accent hover:bg-red-700 text-white py-2 rounded-lg font-bold text-xs shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Download size={14} /> Install Web App Automatically
                </button>
              )}
              
              <div className="space-y-1.5">
                <p className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <span>{deferredPrompt ? 'Or install manually:' : 'Installation steps:'}</span>
                </p>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-accent">1.</span>
                  <p>
                    Open the website in Chrome, tap the <span className="inline-flex items-center px-1 py-0.5 bg-white/10 rounded font-semibold text-white align-middle">
                      {/* Vertical three dots icon */}
                      <svg className="w-3 h-3 text-accent mr-1 fill-current inline-block" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="2.5" />
                        <circle cx="12" cy="12" r="2.5" />
                        <circle cx="12" cy="19" r="2.5" />
                      </svg>
                      three dots
                    </span> in the top right (or bottom right on iOS Chrome).
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-accent">2.</span>
                  <p>
                    Select <span className="font-bold text-white">Install App</span> or <span className="font-bold text-white">Add to Home Screen</span>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
