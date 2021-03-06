const shade = document.createElement('div');
const infoBox = document.getElementsByClassName('info-box')[0];
const close = document.getElementsByClassName('close')[0];

shade.setAttribute('class', 'shade');

// 关闭按钮
close.onclick = () => {
    document.body.removeChild(shade);
    infoBox.style.display = 'none';
}

const map = new BMap.Map('container', {
    // 限制最大最小缩放
    minZoom: 10,
    maxZoom: 20
});
const point = new BMap.Point(104.553, 30.417);
map.centerAndZoom(point, 15);

map.disableScrollWheelZoom(true); // 禁用滚轮放大缩小
map.disableDoubleClickZoom(); // 禁止双击缩放

 // 添加带有定位的导航控件
const navigationControl = new BMap.NavigationControl({
    // 右下角位置
    anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
    // LARGE类型只有缩放
    type: BMAP_NAVIGATION_CONTROL_ZOOM
});

map.addControl(navigationControl);

// 设置点样式
// let myIcon = new BMap.Icon("../images/close.png", new BMap.Size(200,100));



// 点经纬度
let x = [104.612598, 104.361935, 104.412527, 104.557406, 104.555106, 104.619497, 104.401029, 104.791972, 104.449322];
let y = [30.57578, 30.410476, 30.238897, 30.262857, 30.57976, 30.422435, 30.272838, 30.340684, 30.366612];

function addMarker(point) {
    let marker = new BMap.Marker(point);
    map.addOverlay(marker);
    // 给每个点添加点击事件
    addClickHandler(marker);
} 
function addClickHandler(marker){
    marker.addEventListener("click",() => {
        document.body.appendChild(shade);
        shade.style.display = 'block';
        infoBox.style.display = 'block';        
    });
}
for(let i = 0; i < x.length; i++) {
    let point = new BMap.Point(x[i], y[i]);
    addMarker(point)
}

// 设置轮廓
function getBoundary(cityName){   
    var zoomNum = 10;
    if(cityName.split(",").length>1){
        zoomNum = 10;
    }
    for(var i = 0;i<cityName.split(",").length;i++){
        var cn = cityName.split(",")[i];
        var bdary = new BMap.Boundary();
        bdary.get(cn, function(rs){       //获取行政区域
            //map.clearOverlays();        //清除地图覆盖物       
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                alert('未能获取当前输入行政区域');
                return ;
            }
              var pointArray = [];
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 4, strokeColor: "#2088bd",fillColor: ""}); //建立多边形覆盖物
                map.addOverlay(ply);  //添加覆盖物
                pointArray = pointArray.concat(ply.getPath());
            }    
            map.setViewport(pointArray);    //调整视野
            map.setZoom(zoomNum);
        }); 
    }
}
getBoundary('简阳市');




// map.addEventListener("click",function(e){
//     alert(e.point.lng + "," + e.point.lat);
// });










