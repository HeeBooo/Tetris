const socket = io.connect('ws://192.168.2.116:3000/');
const local = new Local(socket);
const remote = new Remote(socket);

socket.on('waiting', (str) => {
    document.getElementById('waiting').innerHTML = str;
})