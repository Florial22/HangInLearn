import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

export async function ensureNotifChannel() {
  if (Capacitor.getPlatform() === "android") {
    await LocalNotifications.createChannel({
      id: "daily",
      name: "Daily reminder",
      description: "HangInLearn reminders",
      importance: 5, // HIGH
    });
  }
}

export async function enableDailyReminder(hour = 9, minute = 0) {
  await ensureNotifChannel();
  const perm = await LocalNotifications.requestPermissions();
  if (perm.display !== "granted") return false;

  // avoid duplicates, then schedule
  await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
  await LocalNotifications.schedule({
    notifications: [{
      id: 1001,
      title: "HangInLearn",
      body: "Time to play and learn a new word!",
      schedule: { repeats: true, on: { hour, minute } }, // daily local time
      channelId: "daily",
    }],
  });
  return true;
}

export async function disableDailyReminder() {
  await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
}
