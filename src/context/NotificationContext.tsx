"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Re-exporting the Notification interface to make it available from the context
export interface Notification {
  id: string;
  title: string;
  message: string | string[];
  type: "success" | "error" | "info";
  autoClose?: boolean;
}

// Define the shape of our context
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (notification?: Notification) => void;
  clearNotifications: () => void;
}

// Create the context with a default value
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Props for the provider component
interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps your app and makes the notification system
 * available to any child component.
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotification = {
      autoClose: true,
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const removeNotification = (notification?: Notification) => {
    if (notification) {
      setNotifications((prev) => prev.filter((n) => n !== notification));
    } else {
      setNotifications((prev) => prev.slice(1));
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook to use the notification context in any component
 * @returns The notification context with all its methods
 * @throws Error if used outside of a NotificationProvider
 */
export function useNotifications() {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }

  return context;
}
