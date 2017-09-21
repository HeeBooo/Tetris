const Game = function () {
    // dom元素
    let gameDiv;
    let nextDiv;
    let timeDiv;
    let scoreDiv;
    let resultDiv;
    // 分数
    let score = 0;
    // 游戏矩阵
    let gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    // 当前方块、下一个方块
    let cur;
    let next;

    // divs
    let nextDivs = [];
    let gameDivs = [];

    // 初始化div 本质为不断的给大div(#game)中添加小div，形成二维数组
    const initDiv = (container, data, divs) => {
        // 创建一个虚拟的文档节点碎片，将所有小div插入进来，最后一次性将fragment插入大div(#game)
        let fragment = document.createDocumentFragment();
        for(let i = 0; i < data.length; i++) {
            let div = [];
            for(let j = 0; j < data[0].length; j++) {
                let newNode = document.createElement('div');
                newNode.className = 'none';
                newNode.style.top = (i * 20) + 'px';
                newNode.style.left = (j * 20) + 'px';
                div.push(newNode);
                // 先附加在文档碎片中
                fragment.appendChild(newNode);
            }
            divs.push(div);
        }
        // 最后一次性添加进入
        container.appendChild(fragment);
    }

    // 渲染游戏界面div
    const refreshDiv = (data, divs) => {
        for(let i = 0 ; i < data.length; i++) {
            for(let j = 0 ; j < data[0].length; j++) {
                if(data[i][j] == 0) {
                    divs[i][j].className = 'none';
                } else if(data[i][j] == 1) {
                    divs[i][j].className = 'done';                
                } else if(data[i][j] == 2) {
                    divs[i][j].className = 'current';                
                }
            }
        }
    }


    // 检测数据是否合法
    const isValid = (pos, data) => {
        for(let i = 0 ; i < cur.data.length; i++) {
            for(let j = 0; j < cur.data[0].length; j++) {
                // 如果该点不等于0说明有方块存在的
                if(data[i][j] != 0) {
                    if(!check(pos, i, j)) { // 是非法的
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // 检测点是否合法
    const check = (pos, x, y) => {
        if(pos.x + x < 0) {
            return false;
        } else if(pos.x + x >= gameData.length) {
            // 超出了下边界
            return false;
        } else if(pos.y + y < 0) {
            // 超出了左边界
            return false;
        } else if(pos.y + y >= gameData[0].length) {
            // 超出了右边界
            return false;
        } else if(gameData[pos.x + x][pos.y + y] == 1) {
            // 说明这个位置已经有一个落下来的方块了
            return false;
        } else {
            return true;
        }
    }

    // 清除数据
    const clearData = () => {
        for(let i = 0 ; i < cur.data.length; i++) {
            for(let j = 0; j < cur.data[0].length; j++) {
                if(check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 0;
                }
            }
        }
    }

    // 设置数据
    const setData = () => {
        for(let i = 0 ; i < cur.data.length; i++) {
            for(let j = 0; j < cur.data[0].length; j++) {
                if(check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
                }
            }
        }
    }

    // 下移
    const down = () => {
        // 先判断是否可以下移
        if(cur.canDown(isValid)) {
            clearData();
            cur.down();
            setData();
            refreshDiv(gameData, gameDivs);   
            return true; //能坠落
        } else {
            return false;
        }
    }

    // 左移
    const left = () => {
        // 先判断是否可以左移
        if(cur.canLeft(isValid)) {
            clearData();
            cur.left();
            setData();
            refreshDiv(gameData, gameDivs);   
        }  
    }    

    // 右移
    const right = () => {
        // 先判断是否可以右移
        if(cur.canRight(isValid)) {
            clearData();
            cur.right();
            setData();
            refreshDiv(gameData, gameDivs);   
        }  
    }

    // 旋转
    const rotate = () => {
        // 先判断是否可以旋转
        if(cur.canRotate(isValid)) {
            clearData();
            cur.rotate();
            setData();
            refreshDiv(gameData, gameDivs);   
        } 
    }

    // 方块移动到底部固定下来
    const fixed = () => {
        for(let i = 0 ; i < cur.data.length; i++) {
            for(let j = 0; j < cur.data[0].length; j++) {
                if(check(cur.origin, i, j)) {
                    if(gameData[cur.origin.x + i][cur.origin.y + j] == 2) {
                        // 固定方块
                        gameData[cur.origin.x + i][cur.origin.y + j] = 1;
                    }
                }
            }
        }
        refreshDiv(gameData, gameDivs);
    }

    // 使用下一个方块
    const performNext = (type, dir) => {
        cur = next;
        setData();
        next = SquareFactory.prototype.make(type, dir);
        refreshDiv(gameData, gameDivs);
        refreshDiv((next.data), nextDivs);
    }

    // 检查游戏结束
    const checkGameOver = () => {
        let gameOver = false;
        for(let i = 0 ; i < gameData[0].length; i++) {
            // 如果第二行是1了,就可以判断出不能生成下一个数据了
            if(gameData[1][i] == 1) {
                gameOver = true;
            }
        }
        return gameOver;
    }
    
    // 消行
    const checkClear = () => {
        let line = 0;
        // 从底部往上消除，上面的往下移一行，顶部填充一行0
        for(let i = gameData.length - 1 ; i >= 0; i--) {
            let clear = true;
            for(let j = 0; j < gameData[0].length; j ++) {
                // 如果这一行都不等于1就不能被消除
                if(gameData[i][j] != 1) {
                    clear = false;
                    break;
                }
            }
            // 循环完之后如果可以被消除，就消除这一行,上面的所有的都往下移一行
            if(clear) {
                line++;
                for(let m = i; m > 0; m--) {
                    for(let n = 0; n < gameData[0].length; n++) {
                        gameData[m][n] = gameData[m-1][n];
                    }
                }
                // 最顶部第一行全部变为0
                for(let n = 0; n < gameData[0].length; n++) {
                    gameData[0][n] = 0;
                }
                i++;
            }
        }
        return line;
    }

    // 设置时间
    const setTime = (time) => {
        timeDiv.innerHTML = time;
    }
    // 加分
    const addScore = (line) => {
        let s = 0;
        // 判断消的几行，1行10分，2行20分,3行60分，4行100分
        switch (line) {
            case 1:
                s = 10;
                break;
            case 2:
                s = 20;
                break;
            case 3:
                s = 60;
                break;
            case 4:
                s = 100;
                break;
            default:
                break;
        }
        score += s;
        scoreDiv.innerHTML= score;
    }
    // 游戏结束
    const gameOver = (win) => {
        if(win) {
            resultDiv.innerHTML = '你赢了';
        } else {
            resultDiv.innerHTML = '你输了';
        }
    }
    // 底部增加行
    const addTailLines = (lines) => {
        // 所有的方块行都往上移动
        for(let i = 0 ; i < (gameData.length - lines.length); i++) {
            // console.log(gameData[i+ lines.length])
            gameData[i] = gameData[i + 1];
        }
        for(let i = 0 ; i < lines.length; i++) {
            gameData[gameData.length - lines.length + i] = lines[i];
        }
        // 当前方框的位置也要移动
        cur.origin.x = cur.origin.x - lines.length;
        if(cur.origin.x < 0) {
            cur.origin.x = 0;
        }
        refreshDiv(gameData, gameDivs);
    }
    // 初始化
    const init = (doms, type, dir) => {
        gameDiv = doms.gameDiv;
        nextDiv = doms.nextDiv;
        timeDiv = doms.timeDiv;
        scoreDiv = doms.scoreDiv;
        resultDiv = doms.resultDiv;
        next = SquareFactory.prototype.make(type, dir);
        initDiv(gameDiv, gameData, gameDivs);
        initDiv(nextDiv, next.data, nextDivs);
        refreshDiv((next.data), nextDivs);
    }

    // 导出API
    this.init = init;
    this.down = down;
    this.left = left;
    this.right = right;
    this.rotate = rotate;
    this.fall = () => {
        while(down());
    }
    this.fixed = fixed;
    this.performNext = performNext;
    this.checkClear = checkClear;
    this.checkGameOver = checkGameOver;
    this.setTime = setTime;
    this.addScore = addScore;
    this.gameOver = gameOver;
    this.addTailLines = addTailLines;
}