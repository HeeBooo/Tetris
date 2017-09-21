const Local = function () {
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
            } else if(e.keyCode == 39) { // right
                game.right();
            } else if(e.keyCode == 40) { // down
                game.down();
            } else if(e.keyCode == 37) { // left
                game.left();
            } else if(e.keyCode == 32) { // space
                game.fall();
            }
        }
    };
    // 移动
    let move = () => {
        timeFunc();
        if (!game.down()) {
            // 当在底部的时候方块固定下来
            game.fixed();
            // 消行并计算得分
            let line = game.checkClear();
            if(line != 0) {
                game.addScore(line);
            }
            // 游戏结束
            let gameOver = game.checkGameOver();
            if(gameOver) {
                game.gameOver(false);
                stop();
            } else {
                // 下个方块的种类和旋转次数
                game.performNext(generateType(), generateDir());
            }
        };
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
            // 每10S生成一行干扰
            if(time % 10 == 0) {
                game.addTailLines(generataBottomLine(1))
            }
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
        game.init(doms, generateType(), generateDir());
        // 绑定键盘方向事件
        bindKeyEvent();
        game.performNext(generateType(), generateDir());
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

    // 导出
    this.start = start;
}