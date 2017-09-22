/**
 * Created by ibm on 2017/9/5.
 */

//  内置模块
const path = require('path');
const fs = require('fs');
const events = require('events');
const url = require('url');
const http = require('http');

// express和中间件
const express = require('express');
const favicon = require('serve-favicon');                // 设置小图标中间件
const logger = require('morgan');                        // 控制台日志记录中间件
const methodOverride = require('method-override');       // 使put,delete等方法生效
const session = require('express-session');              // 处理session中间件
const bodyParser = require('body-parser');               // 对post请求的请求体进行解析
const multer = require('multer');                        // 文件上传中间件
const errorhandler = require('errorhandler');            // 错误处理中间件

const app = express();

const server = http.Server(app);
const io = require('socket.io')(server);

// 路由
const routes = require('./routes');

// use方法用于调用express的中间件
// set方法用于设定内部变量
// 适用开发和生产环境
app.set('port', process.env.PORT || 3000);               // 设置端口号
// app.set('views', "views");                               // 设置模板视图的目录
// app.set('view engine', 'ejs');                           // 设置模板引擎
// app.set("view cache", true);                             // 设置是否启用视图编译缓存，启用将加快服务器执行效率


app.use(favicon(__dirname + '/public/favicon.ico'));     // 设置网页小图标
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));     
app.use(express.static(path.join(__dirname, 'dist'))); // 配置静态文件



// 路由
app.use('/', routes);

// 客户端计数
let clientCount = 0;

// 用于存储客户端socket
let socketMap = {};

// 绑定消息
let bindListener = (socket, event) => {
    socket.on(event, (data) => {
        if (socket.clientNum % 2 == 0) {
            // 给另外一个客户端发送初始化的消息
            socketMap[socket.clientNum - 1].emit(event, data)
        } else {
            socketMap[socket.clientNum + 1].emit(event, data)            
        }
    });
}

io.on('connection', (socket) => {
    clientCount = clientCount + 1;
    socket.clientNum = clientCount;
    socketMap[clientCount] = socket;
    // 判断此时进来的是第一个人还是第二个人
    if (clientCount % 2 == 1) {
        socket.emit('waiting', 'waiting for another person');
    } else {
        socket.emit('start');
        socketMap[(clientCount - 1)].emit('start');
    }

    // 接收初始化消息并向另一个客户端发送初始化消息
    bindListener(socket, 'init');

    // 接收初始化下一个方块消息并传递给另一个客户端
    bindListener(socket, 'next');
    bindListener(socket, 'rotate');
    bindListener(socket, 'right');
    bindListener(socket, 'left');
    bindListener(socket, 'down');
    bindListener(socket, 'fall');
    bindListener(socket, 'fixed');
    bindListener(socket, 'line');
    bindListener(socket, 'time');
    bindListener(socket, 'lose');
    
    socket.on('disconnect', () => {

    })

});


// fs.readFile('input.txt', (err, data) => {
//     if (err) {
//         return console.error(err);
//     } else {
//         console.log(data.toString());
//     }
// });



// 错误处理中间件应当在路由加载之后才能加载
if(process.env.NODE_ENV == 'development') {
    app.use('errorhandler()');
}

server.listen(app.get('port'), () => {
    console.log(`server is running at http://127.0.0.1:${app.get('port')}/`);
});
