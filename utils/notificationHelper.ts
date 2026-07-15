import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleTaskNotification(
  title: string,
  dueDate: Date,
): Promise<string | null> {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("No notification permissions!");
      return null;
    }

    const now = new Date();
    const timeDiffMs = dueDate.getTime() - now.getTime();
    const timeDiffMins = timeDiffMs / (1000 * 60);

    if (timeDiffMins <= 0) return null;

    let triggerDate: Date;

    if (timeDiffMins >= 30) {
      triggerDate = new Date(dueDate.getTime() - 30 * 60 * 1000);
    } else if (timeDiffMins >= 10) {
      triggerDate = new Date(dueDate.getTime() - 5 * 60 * 1000);
    } else {
      triggerDate = new Date(now.getTime() + 10 * 1000);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Deadline Approaching! ⏰",
        body: `"${title}" is due very soon!`,
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });

    return notificationId;
  } catch (error) {
    console.error("Failed to schedule notification:", error);
    return null;
  }
}

export async function cancelTaskNotification(notificationId?: string) {
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}
