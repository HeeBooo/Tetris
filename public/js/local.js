const Local = function (socket) {
    // 游戏对象
    let game;
    // 时间间隔
    const INTERVAL =200;
    // 定时器
    let timer = null;
    // 时间计数器
    let timeCount = 0;
    // 时间
    let time = 0;
    // 绑定键盘事件
    let bindKeyEvent = () => {
        document.onkeydown = (e) => {
            if(e.keyCode == 38) { // up
                game.rotate();
                socket.emit('rotate');
            } else if(e.keyCode == 39) { // right
                game.right();
                socket.emit('right');
            } else if(e.keyCode == 40) { // down
                game.down();
                socket.emit('down');
            } else if(e.keyCode == 37) { // left
                game.left();
                socket.emit('left');
            } else if(e.keyCode == 32) { // space
                game.fall();
                socket.emit('fall');
            }
        }
    };
    // 移动
    let move = () => {
        timeFunc();
        if (!game.down()) {
            // 当在底部的时候方块固定下来
            game.fixed();
            socket.emit('fixed');            
            // 消行并计算得分
            let line = game.checkClear();
            if(line != 0) {
                game.addScore(line);
                socket.emit('line', line);            
            }
            // 游戏结束
            let gameOver = game.checkGameOver();
            if(gameOver) {
                game.gameOver(false);
                document.getElementById('remote_gameover').innerHTML = '你赢了'
                socket.emit('lose');
                stop();
            } else {
                let t = generateType();
                let d =  generateDir();
                // 下个方块的种类和旋转次数
                game.performNext(t, d);
                socket.emit('next', {
                    type: t,
                    dir: d
                });
            }
        } else {
            socket.emit('down');            
        }
    };

    // 随机生成干扰行
    let generataBottomLine = (lineNum) => {
        let lines = [];
        for(let i = 0; i < lineNum; i++) {
            let line = [];
            for(let j = 0 ; j < 10; j++) {
                line.push(Math.ceil(Math.random() * 2 - 1))
            }
            lines.push(line);
        }
        return lines;
    }

    // 计时函数
    let timeFunc = () => {
        timeCount++;
        if(timeCount == 5) {
            timeCount = 0;
            time++;
            game.setTime(time);
            socket.emit('time', time);
        }
    }

    // 随机生成一个方块种类 0-6随机整数
    let generateType = () => Math.ceil(Math.random() * 7) - 1;

    // 随机生成一个旋转次数 0-3随机整数
    let generateDir = () => Math.ceil(Math.random() * 4) - 1; 

    // 开始方法
    let start = () => {
        let doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            timeDiv: document.getElementById('local_time'),
            scoreDiv: document.getElementById('local_score'),
            resultDiv: document.getElementById('local_gameover')
        };
        game = new Game();
        let type = generateType();
        let dir =  generateDir();
        game.init(doms, type, dir);
        socket.emit('init', {
            type: type,
            dir: dir
        });
        // 绑定键盘方向事件
        bindKeyEvent();
        let t = generateType();
        let d =  generateDir();
        game.performNext(t, d);
        socket.emit('next', {
            type: t,
            dir: d
        });

        timer = setInterval(move, INTERVAL)
    };

    // 结束方法
    let stop = () => {
        // 关掉定时器
        if(timer) {
            clearInterval(timer);
            timer = null;
        }
        // 清楚键盘事件
        document.onkeydown = null;
    }

    // 接收到start时游戏开始
    socket.on('start', () => {
        document.getElementById('waiting').innerHTML = '';
        start();
    })

    // 监听输
    socket.on('lose', () => {
        game.gameOver(true);
        stop();
    })

}