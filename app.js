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

let clientCount = 0;

io.on('connection', (socket) => {
    clientCount++;
    socket.nickname = `user${clientCount}`;

    // emit发送数据
    // on接收数据
    // io.emit代表广播
    io.emit('enter', `${socket.nickname} comes in`);

    socket.on('message', (data) => {
        io.emit('message', `${socket.nickname} says: ${data}`)
    })

    // 客户端断开链接
    socket.on('disconnect', () => {
        io.emit('leave', `${socket.nickname} left`);
    })

});


fs.readFile('input.txt', (err, data) => {
    if (err) {
        return console.error(err);
    } else {
        console.log(data.toString());
    }
});

// 创建eventEmitter对象
const eventEmitter = new events.EventEmitter();

eventEmitter.on('some_event', () => {
    console.log('some_event 事件触发')
})

setTimeout(() => {
    eventEmitter.emit('some_event');
}, 1000)


server.once('connection', function (stream) {
    console.log('Ah, we have our first user!');
});


const parseURL = url.parse('http://www.baidu.com?name=barry');

console.log(parseURL.protocol)
console.log(parseURL.host)
console.log(parseURL.query)


let a = [1, 2, 3];
let b = [...a];

console.log(b)
console.log(b[0])





// 错误处理中间件应当在路由加载之后才能加载
if(process.env.NODE_ENV == 'development') {
    app.use('errorhandler()');
}

server.listen(app.get('port'), () => {
    console.log(`server is running at http://127.0.0.1:${app.get('port')}/`);
});
