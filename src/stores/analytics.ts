import localforage from 'localforage';

// Configure localforage for offline storage
localforage.config({ name: 'graamgyaan' });

/**
 * Enqueues an event to be synced with the server
 * @param event The event data to be queued
 */
export async function enqueueEvent(event: any): Promise<void> {
  try {
    const qKey = 'eventQueue';
    const existing = (await localforage.getItem<any[]>(qKey)) || [];
    const newEvent = { 
      ...event, 
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null
    };
    
    existing.push(newEvent);
    await localforage.setItem(qKey, existing);
    
    // Try to sync immediately if online
    if (typeof window !== 'undefined' && navigator.onLine) {
      await trySync();
    }
  } catch (error) {
    console.error('Failed to enqueue event:', error);
  }
}

/**
 * Attempts to sync queued events with the server
 */
export async function trySync(): Promise<void> {
  if (typeof window === 'undefined' || !navigator.onLine) return;
  
  try {
    const existing = (await localforage.getItem<any[]>('eventQueue')) || [];
    if (!existing.length) return;
    
    const res = await fetch('/api/sync-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: existing })
    });
    
    if (res.ok) {
      await localforage.setItem('eventQueue', []);
      console.log(`Successfully synced ${existing.length} events`);
    } else {
      console.error('Failed to sync events:', await res.text());
    }
  } catch (err) {
    console.error('Sync failed:', err);
  }
}

// Set up online event listener to sync when connection is restored
if (typeof window !== 'undefined') {
  window.addEventListener('online', trySync);
  
  // Also try to sync when the page becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      trySync().catch(console.error);
    }
  });
}
