import React, { useEffect, useState, useCallback } from 'react';
import apiService from '../utils/apiService';

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await apiService.get(`/notifications/${userId}`);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (id) => {
    try {
      await apiService.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-700 hover:text-blue-600 transition"
        title="Notifications"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="px-4 py-2 border-b font-medium text-gray-700">
            Notifications
          </div>
          <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-500 text-center">
                No notifications
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition text-sm ${
                    !n.is_read ? 'font-semibold text-gray-800' : 'text-gray-600'
                  }`}
                >
                  <div>{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
