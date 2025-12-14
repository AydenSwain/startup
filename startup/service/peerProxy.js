const { WebSocketServer } = require('ws');
const cookie = require('cookie');

function peerProxy(httpServer, DB, authCookieName) {
  const socketServer = new WebSocketServer({ server: httpServer });

  // Map to store authenticated user info for each socket
  const socketUsers = new Map();

  // Separate lists for managers and clients
  const managerSockets = new Set();
  const clientSockets = new Set();

  socketServer.on('connection', async (socket, request) => {
    // Parse cookies from WebSocket handshake
    const cookies = cookie.parse(request.headers.cookie || '');
    const authToken = cookies[authCookieName];

    // Verify auth token
    const user = await DB.getUserByToken(authToken);

    if (!user) {
      socket.close(1008, 'Unauthorized');
      console.log('Unauthorized WebSocket connection attempt');
      return;
    }

    // Store authenticated user info
    socketUsers.set(socket, {
      email: user.email,
      isManager: user.isManager,
      token: user.token
    });

    // Add to appropriate list
    if (user.isManager) {
      managerSockets.add(socket);
      console.log(`Manager connected: ${user.email}`);

    } else {
      clientSockets.add(socket);
      console.log(`Client connected: ${user.email}`);

      // Notify all managers that a new client connected
      notifyManagersOfClientList();
    }

    socket.isAlive = true;

    socket.on('message', async function message(data) {
      try {
        const command = JSON.parse(data.toString());
        const userInfo = socketUsers.get(socket);

        if (!userInfo) {
          socket.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
          return;
        }

        switch (command.type) {
          case 'requestClientList':
            // Manager requesting list of clients
            if (!userInfo.isManager) {
              socket.send(JSON.stringify({
                type: 'error',
                message: 'Manager access required'
              }));
              return;
            }
            sendClientListToManager(socket);
            break;

          case 'sendMessage':
            // Find the target socket
            const targetEmail = command.targetEmail;
            let targetSocket = null;

            console.log(`Looking for target email: "${targetEmail}"`);
            console.log('Available users:', Array.from(socketUsers.values()).map(u => u.email));

            for (const [sock, info] of socketUsers.entries()) {
              if (info.email === targetEmail) {
                targetSocket = sock;
                console.log(`Found socket for ${targetEmail}, readyState: ${sock.readyState}`);
                break;
              }
            }

            if (targetSocket && targetSocket.readyState === 1) { // 1 = OPEN
              // Send message with sender info
              targetSocket.send(JSON.stringify({
                sender: userInfo.email,
                message: command.message
              }));
              
              // Echo the message back to sender for their chat history
              socket.send(JSON.stringify({
                sender: userInfo.email,
                message: command.message
              }));
              
              console.log(`Message sent from ${userInfo.email} to ${targetEmail}`);

            } else {
              console.log(`Target not found or disconnected. Socket exists: ${!!targetSocket}, readyState: ${targetSocket?.readyState}`);
              socket.send(JSON.stringify({
                type: 'error',
                message: 'Other user not found or disconnected'
              }));
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    socket.on('close', () => {
      const userInfo = socketUsers.get(socket);
      if (userInfo) {
        console.log(`WebSocket disconnected: ${userInfo.email}`);

        // Remove from appropriate list
        if (userInfo.isManager) {
          managerSockets.delete(socket);
        } else {
          clientSockets.delete(socket);
          // Notify managers that client list changed
          notifyManagersOfClientList();
        }
      }
      socketUsers.delete(socket);
    });

    socket.on('pong', () => {
      socket.isAlive = true;
    });
  });

  // Helper function to send client list to a specific manager
  function sendClientListToManager(managerSocket) {
    const clientList = [];

    clientSockets.forEach((clientSocket) => {
      const clientInfo = socketUsers.get(clientSocket);
      if (clientInfo && clientSocket.readyState === 1) { // 1 = OPEN
        clientList.push({
          email: clientInfo.email,
        });
      }
    });

    console.log('Sending client list to manager:', clientList);

    managerSocket.send(JSON.stringify({
      type: 'clientList',
      clients: clientList
    }));
  }

  // Helper function to notify all managers of updated client list
  function notifyManagersOfClientList() {
    managerSockets.forEach((managerSocket) => {
      if (managerSocket.readyState === 1) { // 1 = OPEN
        sendClientListToManager(managerSocket);
      }
    });
  }

  // Ping/pong for connection health
  setInterval(() => {
    socketServer.clients.forEach(function each(client) {
      if (client.isAlive === false) {
        const userInfo = socketUsers.get(client);
        if (userInfo) {
          if (userInfo.isManager) {
            managerSockets.delete(client);
          } else {
            clientSockets.delete(client);
            notifyManagersOfClientList();
          }
        }
        socketUsers.delete(client);
        return client.terminate();
      }
      client.isAlive = false;
      client.ping();
    });
  }, 10000);
}


module.exports = { peerProxy };
