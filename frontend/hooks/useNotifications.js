import { useEffect } from 'react';
import { io } from 'socket.io-client';

const useNotifications = (userId) => {
  useEffect(() => {
    const socket = io(process.env.API_URL);

    socket.on('connect', () => {
      console.log('Connected to socket.io server');
    });

    socket.on('notification', (message) => {
      if (message.userId === userId) {
        alert(message.text); // You can use a more sophisticated notification system here
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);
};

export default useNotifications;
