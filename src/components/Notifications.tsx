import { useInterval } from "usehooks-ts";
import { IconX } from "@tabler/icons-react";

import { useNotifications } from "../context/NotificationContext";

export default function Notifications() {
  const { notifications, removeNotification } = useNotifications();

  useInterval(
    () => {
      if (notifications.length > 0) {
        notifications
          .filter(
            (notification) =>
              notification.autoClose &&
              new Date(notification.id) < new Date(Date.now() - 5000)
          )
          .forEach((notification) => {
            removeNotification(notification);
          });
      }
    },
    notifications.length > 0 ? 4500 : null
  );

  return (
    <div className="fixed bottom-0 right-0 z-50 p-5">
      <ol className="relative flex flex-col items-start justify-start">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className="relative mt-2 p-4 rounded-sm bg-neutral-700 border-neutral-50 border"
          >
            <button
              className="absolute top-2 right-2 p-1 rounded-sm bg-neutral-500 appearance-none cursor-pointer"
              onClick={() => removeNotification(notification)}
              title="Dismiss"
            >
              <IconX className="text-neutral-50" size={16} />
            </button>
            <h3 className="flex flex-row items-center justify-start text-neutral-50 text-md font-mono">
              {notification.title}
            </h3>
            {Array.isArray(notification.message) ? (
              notification.message.map((m) => (
                <p key={m} className="text-neutral-50 text-xs font-mono">
                  {m}
                </p>
              ))
            ) : (
              <p className="text-neutral-50 text-xs font-mono">
                {notification.message}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
