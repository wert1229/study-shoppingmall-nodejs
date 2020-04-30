import { Server } from 'http';
import socket from 'socket.io';

export default (server: Server ) => {
    const io = socket(server);

    io.on('connection', (socket) => {
        socket.on('client_message', (data) => {
            io.emit('server_message', data.message);
        });
    });
};