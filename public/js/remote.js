// 控制对方的操作
const Remote = function (socket) {
    // 游戏对象
    let game;
    // 绑定按钮事件
    let bindEvents = () => {
        // 初始化对方游戏界面和下一个方块
        socket.on('init', (data) => {
            start(data.type, data.dir);
        });
        socket.on('next', (data) => {
            game.performNext(data.type, data.dir);
        });
        socket.on('rotate', (data) => {
            game.rotate();
        });
        socket.on('right', (data) => {
            game.right();
        });
        socket.on('left', (data) => {
            game.left();
        });
        socket.on('down', (data) => {
            game.down();
        });
        socket.on('fall', (data) => {
            game.fall();
        });
        socket.on('fixed', (data) => {
            game.fixed();
        });
        // 消行
        socket.on('line', (data) => {
            game.checkClear();
            game.addScore(data);
        });
        // 同步时间
        socket.on('time', (data) => {
            game.setTime(data);
        });
        socket.on('lose', (data) => {
            game.gameOver(false);
        });
    }

        // 开始方法
    let start = (type, dir) => {
        let doms = {
            gameDiv: document.getElementById('remote_game'),
            nextDiv: document.getElementById('remote_next'),
            timeDiv: document.getElementById('remote_time'),
            scoreDiv: document.getElementById('remote_score'),
            resultDiv: document.getElementById('remote_gameover')
        };
        game = new Game();
        game.init(doms, type, dir);
    };
    bindEvents();
}