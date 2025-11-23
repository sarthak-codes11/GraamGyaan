import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";
import languages from "~/utils/languages";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const setLanguage = useBoundStore((s) => s.setLanguage);

  // Register service worker for offline support (no unregister on cleanup)
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Sync language from query param ?lang=; fallback to localStorage on first mount
  useEffect(() => {
    const { lang } = router.query as { lang?: string };

    if (typeof window === "undefined") return;

    if (typeof lang === "string") {
      const found = languages.find((l) => l.code === lang);
      if (found) {
        setLanguage(found as any);
        try {
          window.localStorage.setItem("appLangCode", found.code);
          window.localStorage.setItem("lang", found.code);
        } catch {}
      }
      return;
    }

    // No query param: hydrate from localStorage if available
    try {
      const stored = window.localStorage.getItem("appLangCode");
      if (stored) {
        const found = languages.find((l) => l.code === stored);
        if (found) setLanguage(found as any);
      }
    } catch {}
  }, [router.query, setLanguage]);
  return (
    <>
      <Head>
        <title>GramGyaan</title>
        <meta
          name="description"
          content="Learn languages with GraamGyaan - Interactive language learning platform"
        />
        <link rel="icon" href="favicon.png" />
        
        {/* Mobile optimization meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#680B24" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GraamGyaan" />
        
        {/* PWA support */}
        <link rel="manifest" href="/app.webmanifest" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        
        {/* Prevent zoom on input focus (iOS) */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* Preload critical fonts for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
