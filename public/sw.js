self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      if (event.request.destination === 'document') {
        return caches.match('/offline.html').then(
          (r) => r || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
        );
      }
      return new Response('Network error', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    })
  );
});

