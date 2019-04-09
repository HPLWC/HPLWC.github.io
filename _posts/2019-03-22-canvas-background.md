---
layout: post
title: Canvas 绘制简单网状粒子背景效果
tags:
- canvas
categories: Canvas
description: Canvas 是 HTML5 的标签，用于绘制一些图像、动画等。 Canvas 本身仅作为容器，需要使用脚本（JavaScript）来达到绘制图像的效果。

---

canvas是HTML5的标签，用于绘制一些图像、动画等。canvas本身仅作为容器，需要使用脚本（JavaScript）来达到绘制图像的效果。

更多详细介绍看官方文档或W3C。

## canvas绘制背景效果

### 实现原理
在canvas上绘制出多个无序粒子，设置定时器不断清空画布，让粒子实现运动效果。判断每个粒子间的距离，到小于一定值的时候使其实现相连，并根据距离来实现连线间的粗细效果。

### 代码实现
```html
<canvas id="canvas">您的浏览器不支持canvas</canvas>
```
定义变量
```javascript
let cvs = document.getElementById('canvas'),
	ctx = cvs.getContext('2d'),
	cursor = {x: null, y: null, max: 20000}, //鼠标坐标
	points = [], //粒子集合
	number = 300;  //粒子数
```

根据浏览器页面设置canvas大小、获取鼠标位置
```javascript
window.onresize = function() {
	cvs.width = window.innerWidth;
	cvs.height = window.innerHeight;
}
window.onmousemove = function(e) {
	e = e || window.event;
	cursor.x = e.clientX;
	cursor.y = e.clientY;
}
window.onmouseout = function(e) {
	cursor.x = null;
	cursor.y = null;
}
```
获取粒子集合
```javascript
function pointsFn(num) {
	let points = [];
	for(let i = 0; i < num; i++) {
		let x = Math.random() * this.cvs.width;  //粒子横坐标
        let y = Math.random() * this.cvs.height;  //粒子纵坐标
        let xa = (Math.random() * 2 - 1) * 0.8;  //粒子x轴加速度
        let ya = (Math.random() * 2 - 1) * 0.8;  //粒子y轴加速度
        let max = 5000;
        points.push({
          x, y, xa, ya, max
        });
	}
	return points;
}
points = pointsFn(number);
```
运动函数
```javascript
function animation(points) {
	ctx.clearReat(0, 0, cvs.width, cvs.height);  //清空当前画布
	
	let curPoints = [this.cursor].concat(points)  //curPoints数组包含鼠标和所有粒子，用于判断相对位置
	
	points.forEach(point => {
		point.x += point.xa;
		point.y += point.ya;
		// 粒子运动到屏幕边缘反向运动
		point.xa *= (point.x > this.cvs.width || point.x < 0) ? -1 : 1;
		point.ya *= (point.y > this.cvs.width || point.y < 0) ? -1 : 1;
		
		// 在canvas上绘制粒子
		ctx.fillRect(point.x - 0.5, point.y - 0.5, 1, 1);
		ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';

		curPoints.forEach( curPoint => {
			if( curPoint === point || curPoint.x == null || curPoint.y == null) return;  //如果是同个点则返回
	
			let distance = (curPoint.x - point.x) * (curPoint.x - point.x) + (curPoint.y - point.y) * (curPoint.y - point.y);  // 两点间的距离
			if( distance < curPoint.max ) {
				// 如果是鼠标且粒子距离在一半外则吸引粒子使其在鼠标外汇成圆状
				if( curPoint === cursor && distance > (curPoint.max / 2)) {
					point.x += (curPoint.x - point.x) * 0.03;
					point.y += (curPoint.y - point.y) * 0.03;
				}

				let ratio = (curPoint.max - distance) / curPoint.max;
				// 绘制两粒子间的连线
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'rgba(200, 200, 200,' + ratio + ')';
				ctx.moveTo(point.x, point.y);
				ctx.lineTo(curPoint.x, curPoint.y);
				ctx.stroke();
			}
		})
	})
}
```
按频次刷新画布即可 
```javascript
window.requestAnimationFrame(() => {
	animation(points);
})
```

最终实现效果如下
![canvas粒子效果](D:\node\blog\assets\20190322181947134-1554790028637.gif)