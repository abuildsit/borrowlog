import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationAsRead } from '../services/api';
import { Notification } from '../types';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await getNotifications(user.id);
        
        if (error) {
          console.error('Error fetching notifications:', error);
          toast.error('Failed to load notifications');
        } else if (data) {
          setNotifications(data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { data, error } = await markNotificationAsRead(notificationId);
      
      if (error) {
        console.error('Error marking notification as read:', error);
      } else if (data) {
        // Update the notifications list
        setNotifications(
          notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    
    // Navigate to the relevant loan if available
    if (notification.loan_id) {
      navigate(`/loans/${notification.loan_id}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-20">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      {notifications.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No notifications</p>
          <p className="text-gray-500 mt-1 text-sm">
            You'll see updates about your loans here
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  notification.is_read ? 'bg-white' : 'bg-blue-50'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <span
                      className={`material-icons ${
                        notification.type === 'due_date'
                          ? 'text-yellow-500'
                          : notification.type === 'return_request'
                          ? 'text-blue-500'
                          : 'text-green-500'
                      }`}
                    >
                      {notification.type === 'due_date'
                        ? 'schedule'
                        : notification.type === 'return_request'
                        ? 'assignment_return'
                        : 'check_circle'}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true
                      })}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="ml-2 flex-shrink-0">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications; 