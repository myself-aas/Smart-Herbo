/**
 * Service Worker registration for offline resilience.
 * Caches the TensorFlow model graph (model.json) and the binary shard
 * (group1-shard1of1.bin) so the application can operate without network
 * connectivity. The worker is lightweight and only serves assets from the
 * local origin.
 */

export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service worker registered', registration);
  } catch (err) {
    console.warn('Service worker registration failed', err);
  }
};
