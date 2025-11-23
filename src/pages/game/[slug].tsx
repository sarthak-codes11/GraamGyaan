import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import PhaserGame with SSR disabled
const PhaserGame = dynamic(
  () => import('~/components/PhaserGame'), 
  { ssr: false }
);

export default function GamePage() {
  const router = useRouter();
  const { slug } = router.query;
  
  // Handle case where slug might be an array or undefined
  const slugStr = Array.isArray(slug) ? slug[0] : slug;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {slugStr ? `Playing: ${slugStr.replace(/-/g, ' ')}` : 'Loading Game...'}
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {slugStr ? (
            <PhaserGame 
              slug={slugStr} 
              width={800} 
              height={600} 
              studentId={`user_${Date.now()}`} 
            />
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-500">Loading game assets...</p>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => router.push('/games')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            ← Back to Games
          </button>
        </div>
      </div>
    </div>
  );
}
