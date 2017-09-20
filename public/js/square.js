const Square = function () {
    // 下一个方块数据
    this.data = [
        [0, 2, 0, 0],
        [0, 2, 0, 0],
        [0, 2, 0, 0],
        [0, 2, 0, 0]  
    ];
    // 原点
    this.origin = {
        x: 0,
        y: 0
    };
    // 方向
    this.dir = 0;
    // 旋转数组
    this.rotates = [
        [
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [2, 2, 2, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [2, 2, 2, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    ]
}
// 是否能够下移
Square.prototype.canDown = function (isValid) {
    let temp = {};
    temp.x = this.origin.x + 1;
    temp.y = this.origin.y;
    return isValid(temp, this.data);
}
// 下移
Square.prototype.down = function () {
    this.origin.x++;
}
// 是否能够左移
Square.prototype.canLeft = function (isValid) {
    let temp = {};
    temp.x = this.origin.x;
    temp.y = this.origin.y - 1;
    return isValid(temp, this.data);
}
// 左移
Square.prototype.left = function () {
    this.origin.y--;
}
// 是否能够右
Square.prototype.canRight = function (isValid) {
    let temp = {};
    temp.x = this.origin.x;
    temp.y = this.origin.y + 1;
    return isValid(temp, this.data);
}
// 右移
Square.prototype.right = function () {
    this.origin.y++;
}
// 旋转
Square.prototype.canRotate = function (isValid) {
    let d = this.dir + 1;
    console.log(d);
    if(d == 4) {
        d = 0;
    };
    let temp = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    for(let i = 0; i < this.data.length; i++) {
        for(let j = 0; j < this.data[0].length; j++) {
            temp[i][j] = this.rotates[d][i][j];
        }
    }
    return isValid(this.origin, temp);
}
// 旋转
Square.prototype.rotate = function () {
    this.dir = this.dir + 1;
    if(this.dir == 4) {
        this.dir = 0;
    };
    for(let i = 0; i < this.data.length; i++) {
        for(let j = 0; j < this.data[0].length; j++) {
            this.data[i][j] = this.rotates[this.dir][i][j];
        }
    }
}