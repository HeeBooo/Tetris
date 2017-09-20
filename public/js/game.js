const Game = function () {
    // dom元素
    let gameDiv;
    let nextDiv;
    
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
    // 初始化
    const init = (doms) => {
        gameDiv = doms.gameDiv;
        nextDiv = doms.nextDiv;
        cur = new Square();
        next = new Square();
        initDiv(gameDiv, gameData, gameDivs);
        initDiv(nextDiv, next.data, nextDivs);
        cur.origin.x = 10;
        cur.origin.y = 5;
        setData();
        refreshDiv(gameData, gameDivs);
        refreshDiv((next.data), nextDivs);
    }

    // 导出API
    this.init = init;
    this.down = down;
    this.left = left;
    this.right = right;
    this.rotate = rotate;
}