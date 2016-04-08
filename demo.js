/**
 * Created by zhipu.liao on 2016/3/8.
 */
"use strict";
(function (window) {
    var testBtn = document.querySelector("#testBtn");
/*    var node = document.querySelector("div#test");
    var testBtn = document.querySelector("#testBtn");
    testBtn.addEventListener("click", function (event) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/server/api/etc", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("token","123456");
        var data={
            api:123,
            thy:321
        };
        xhr.send(JSON.stringify(data));
    });

    try {
        if (document.body.webkitMatchesSelector("div#test")) {
            console.log("yes");
        } else {
            console.log(document.body.webkitMatchesSelector("div#test"));
        }
    } catch (err) {
        console.error(err);
    }
    if (node.addEventListener) {
        node.addEventListener("click", function () {
            console.log(node.childNodes);
        });
    } else {
        node.attachEvent("onclick", function (event) {
            console.log(event);
        });
    }
    var table = document.createElement("table");
    table.border = 1;
    table.width = "100%";
    table.style.borderCollapse = "collapse";
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    tbody.insertRow(0);
    tbody.rows[0].insertCell(0);
    tbody.rows[0].cells[0].appendChild(document.createTextNode("first cell"));
    tbody.rows[0].insertCell(1);
    tbody.rows[0].cells[1].appendChild(document.createTextNode("second cell"));*/
    //document.body.appendChild(table);
    var selectE=document.querySelector("#selectDemo");
    testBtn.addEventListener("click",function(event){
        console.log("testBtn has been clicked");
    },false);
    console.log(document.compatMode);
    var testInput=document.querySelector("#testInput");
    testInput.addEventListener("contextmenu",function(event){
        event.preventDefault();
    },false);
    testBtn.previousElementSibling.addEventListener("click",function(){
        console.log(selectE.selectedIndex);
    },false);

    function caLocation(r,x,h,s){
        /*
        * @r 半径
        * @x 间隔
        * @h 当前所在
        * @s 偏移
        * */
        r=r-s;
        var xP,yP;
        xP=r*Math.sin(Math.PI-Math.PI*(1/h)*x)+r+s;
        yP=r*Math.cos(Math.PI-Math.PI*(1/h)*x)+r+s;
        var point={
            x:xP,
            y:yP
        };
        return point;
    }
    var cDemo=document.querySelector("#canvasDemo");
    var ctx=cDemo.getContext("2d");
    console.log(cDemo.height);
    function step(){
        var d=new Date();
        d.setTime(Date.now());
        var h=d.getHours(),
            m=d.getMinutes(),
            s=d.getSeconds();
        if(h>12){
            h=h-12;
        }
        ctx.beginPath();
        ctx.clearRect(0,0,120,120);
        ctx.fillStyle="rgba(0,0,0,0.6)";
        ctx.strokeStyle="rgba(0,0,0,0.5)";
        ctx.arc(60,60,59,0,2*Math.PI,false);
        ctx.moveTo(114,60);
        ctx.arc(60,60,54,0,2*Math.PI,false);
        var hPoint=caLocation(60,h,6,30);
        ctx.moveTo(60,60);
        ctx.lineTo(hPoint.x,hPoint.y);
        var mPoint=caLocation(60,m,30,25);
        ctx.moveTo(60,60);
        ctx.lineTo(mPoint.x,mPoint.y);
        var sPoint=caLocation(60,s,30,20);
        ctx.moveTo(60,60);
        ctx.lineTo(sPoint.x,sPoint.y);
        ctx.textBaseline="middle";
        ctx.textAlign="center";
        for(var i=1;i<=12;i++){
            var point= caLocation(60,i,6,13);
            ctx.fillText(i,point.x,point.y);
        }
        ctx.stroke();
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    var glDemo=document.querySelector("#glDemo");
    var gl=glDemo.getContext("experimental-webgl");
    if(gl){
        console.log("support gl");
    }else{
        console.log("not support");
    }
})(window);
