$(document).ready(function () {
  /*global io*/
  let socket = io();
  socket.on('user',function(data){
    console.log(data)
  })
  // announce new users
  socket.on('user', data => {
    $('#num-users').text(data.currentUsers + ' users online');
    let message =
      data.username +
      (data.connected ? ' has joined the chat.' : ' has left the chat.');
    $('#messages').append($('<li>').html('<b>' + message + '</b>'));
  });
  // chat message
  socket.on('chat message',message=>{
    console.log('socket.on 1')
    $('#messages').append($('<li>').text(`${message.username}: ${message.message}`));
  })
  // Form submittion with new message in field with id 'm'
  $('form').submit(function () {
    var messageToSend = $('#m').val();
    socket.emit('chat message',messageToSend)
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
});
