// sw.js

self.addEventListener('notificationclick', function(event) {
  console.log(event);

  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
