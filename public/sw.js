// Service Worker for Push Notifications
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener("push", (event) => {
  console.log("Push notification received:", event);

  if (!event.data) {
    console.log("Push event but no data");
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: "My Floral Vault",
      body: event.data.text(),
    };
  }

  const options = {
    body: data.body || "You have a new notification",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/care-reminders",
      plantId: data.plantId,
      reminderId: data.reminderId,
    },
    actions: [
      {
        action: "view",
        title: "View",
        icon: "/icon-view.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icon-dismiss.png",
      },
    ],
    tag: data.tag || "care-reminder",
    renotify: true,
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Care Reminder", options)
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  // Open or focus the app
  const urlToOpen = event.notification.data?.url || "/care-reminders";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (let client of windowClients) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }

        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event);
});

// Handle background sync for offline functionality
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-reminders") {
    event.waitUntil(syncReminders());
  }
});

async function syncReminders() {
  console.log("Syncing reminders in background...");
  // This could fetch and cache reminder data when online
}
