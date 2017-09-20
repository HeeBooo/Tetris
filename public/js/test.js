/**
 * Created by ibm on 2017/8/31.
 */

$(function() {
    // $('.draggalbe').draggabilly({
    //     containment: '.container'
    // })
    
    // 开始移动
    // $('.draggalbe').on( 'dragStart', function( event, pointer ) {
    //     console.log('dragStart')
    // })
    // // 移动中
    // $('.draggalbe').on( 'dragMove', function( event, pointer, moveVector ) {
    //     console.log('dragMove')
    // })
    // // 移动结束
    // $('.draggalbe').on( 'dragEnd', function( event, pointer ) {
    //     console.log('dragEnd')
    // })
    // $('.draggalbe').on( 'staticClick', function( event, pointer ) {
    //     console.log('staticClick')
    // })

    $('#add').on('click', function() {
        var draggable = '<div class="draggable"><img src="../images/2.png"></div>'
        $('.container').append(draggable);
    })
})  

var draggableElems = document.querySelectorAll('.draggable');

// array of Draggabillies
var draggies = []
// init Draggabillies
for ( var i=0, len = draggableElems.length; i < len; i++ ) {
  var draggableElem = draggableElems[i];
  var draggie = new Draggabilly( draggableElem, {
      containment: '.container'
  });
  draggies.push( draggie);
}

