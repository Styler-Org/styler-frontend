import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './useSocket';
import toast from 'react-hot-toast';

/**
 * Hook for listening to real-time notification events
 */
export const useNotificationSocket = () => {
    const socket = useSocket();
    const queryClient = useQueryClient();

    useEffect() => {
    if (!socket) return;

    // Listen for new notifications
    const handleNewNotification = (data: { notification: any; unreadCount: number }) => {
        console.log('🔔 New notification received:', data);

        // Update unread count in cache
        queryClient.setQueryData(['unreadNotificationCount'], data.unreadCount);

        // Invalidate notifications list to refetch
        queryClient.invalidateQueries({ queryKey: ['notifications'] });

        // Show toast notification with icon
        toast.success(
            <div>
            <strong>{ data.notification.title } </strong>
            < div style = {{ fontSize: '0.875rem', marginTop: '4px' }}>
                { data.notification.message }
                </div>
                </div>,
    {
        duration: 5000,
            icon: '🔔',
                style: {
            borderRadius: '12px',
                background: '#fff',
                    color: '#1e293b',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
    }
      );
};

socket.on('notification:new', handleNewNotification);

// Cleanup listener on unmount
return () => {
    socket.off('notification:new', handleNewNotification);
};
  }, [socket, queryClient]);
};
