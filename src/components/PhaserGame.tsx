import React, { useEffect, useRef } from 'react';
import localforage from 'localforage';

type Props = { slug: string; width?: number; height?: number; studentId?: string };
localforage.config({ name: 'graamgyaan' });

async function enqueueEvent(event: any) {
  const qKey = 'eventQueue';
  const existing = (await localforage.getItem<any[]>(qKey)) || [];
  existing.push({ event, ts: Date.now() });
  await localforage.setItem(qKey, existing);
  if (navigator.onLine) {
    try {
      const res = await fetch('/api/sync-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: existing })
      });
      if (res.ok) await localforage.setItem(qKey, []);
    } catch (err) { console.error('sync failed', err); }
  }
}

export default function PhaserGame({ slug, width = 720, height = 480, studentId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const phaserRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      const PhaserModule = await import('phaser');
      const Phaser = (PhaserModule && (PhaserModule as any).default) || PhaserModule;

      class MainScene extends Phaser.Scene {
        constructor() { super({ key: 'MainScene' }); }
        preload() { const lang = document.documentElement.lang || 'en'; this.load.json('locale', `/games/${slug}/locales/${lang}.json`); }
        create() {
          const locale = this.cache.json.get('locale') || {};
          this.add.text(16, 16, locale['welcome'] || 'Welcome', { font: '16px Arial' });
          const text = this.add.text(100, 150, locale['tap_to_complete'] || 'Tap to complete', { font: '20px Arial' }).setInteractive();
          text.on('pointerdown', async () => {
            const ev = { type: 'level_complete', studentId: studentId || 'anonymous', level: 1, score: Math.floor(Math.random() * 100) };
            await enqueueEvent(ev);
            this.add.text(100, 200, locale['level_completed'] || 'Level Completed!', { font: '18px Arial' });
          });
        }
      }

      const config = {
        type: Phaser.AUTO,
        width: Math.min(width, window.innerWidth),
        height: Math.min(height, Math.floor(window.innerHeight * 0.7)),
        parent: containerRef.current!,
        scene: [MainScene],
        physics: { default: 'arcade' },
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
      };

      if (!phaserRef.current) phaserRef.current = new Phaser.Game(config);
    })();

    return () => {
      mounted = false;
      if (phaserRef.current?.destroy) { phaserRef.current.destroy(true); phaserRef.current = null; }
    };
  }, [slug, width, height, studentId]);

  return <div style={{ width: '100%', maxWidth: width }}><div ref={containerRef} id={`phaser-container-${slug}`} style={{ width: '100%', height }} /></div>;
}
