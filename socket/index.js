const io = require('socket.io').listen(1337);

let clients = [];

setInterval(() => console.log('connected ' + clients.length + ' users'), 10000)

function getClient(id) {
  return clients.filter(client => client.socket.id === id)[0];
}
function getClientByUid(id) {
  return clients.filter(client => client.uid === id)[0];
}
function removeSocket(id) {
  clients = clients.filter(client => client.socket.id !== id);
}



io.on('connection', function (socket) {

  socket.on('init', function (user) {
    removeSocket(socket.id);
    clients.push({ uid: user.id, role: user.role, socket });
  });

  socket.on('change_position', function ({ latitude, longitude }) {
    let sender = getClient(socket.id);
    if (sender) {
      clients.map(client => {
        if (sender.role !== client.role) {
          console.log('User ' + sender.uid + ' change position')
          client.socket.emit('change_position', { uid: sender.uid, latitude, longitude })
        }
      })
    }
  })

  socket.on('accept_order', function ({ order_id, client_id }) {
    let sender = getClient(socket.id);
    let order_client = getClientByUid(client_id);
    if (order_client) {
      order_client.emit('accept_order', { uid: sender.uid, order_id })
    }
    clients.map(client => {
      if (sender.uid !== client.uid) {
        client.socket.emit('accept_order', { uid: sender.uid, order_id })
      }
    })

  })


  socket.on('disconnect', function () {
    removeSocket(socket.id);
  });

});
