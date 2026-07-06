import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './useSocket';
import toast from 'react-hot-toast';

/**
 * Hook for listening to real-time notification events. Mount once, globally,
 * for any authenticated user — it pushes new notifications into the
 * `unreadNotificationCount`/`notifications` react-query caches that
 * NotificationBell reads, and shows a toast.
 */
export const useNotificationSocket = () => {
    const socket = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (data: { notification: any; unreadCount: number }) => {
            queryClient.setQueryData(['unreadNotificationCount'], data.unreadCount);
            queryClient.invalidateQueries({ queryKey: ['notifications'] });

            toast.success(
                React.createElement(
                    'div',
                    null,
                    React.createElement('strong', null, data.notification.title),
                    React.createElement(
                        'div',
                        { style: { fontSize: '0.875rem', marginTop: 4 } },
                        data.notification.message
                    )
                ),
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

        return () => {
            socket.off('notification:new', handleNewNotification);
        };
    }, [socket, queryClient]);
};
