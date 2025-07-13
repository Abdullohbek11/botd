self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'TelegramWebApp'
      }
    })
  );
}); 