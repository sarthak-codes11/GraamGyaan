import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
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
        <meta name="theme-color" content="#58cc02" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GraamGyaan" />
        
        {/* PWA support */}
        <link rel="manifest" href="/app.webmanifest" />
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
