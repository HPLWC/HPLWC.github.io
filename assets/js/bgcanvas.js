let cvs = document.getElementById('canvas')

class bgCvs {
  constructor (cvs) {
    this.cvs = cvs
    this.ctx = this.cvs.getContext('2d')
    // 鼠标坐标
    this.cursor = {x: null, y: null, max: 20000}
    // 点集合
    this.points = []
    this._init()
  }

  _init () {
    this.resize()

    // 点集合时间
    this.points = this.pointsFn(300);

    this.animation( this.points );
    window.onresize = () => {
      this.resize()
    }
    window.onmousemove = (e) => {
      this.cursor.x = e.clientX
      this.cursor.y = e.clientY
    }
    window.onmouseout = (e) => {
      this.cursor.x = null
      this.cursor.y = null
    }
  }

  resize () {
    this.cvs.width = window.innerWidth;
    this.cvs.height = window.innerHeight;
  }

  animation (points) {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
    // 包括鼠标坐标的数组
    let curPoints = [this.cursor].concat(points)
    points.forEach(point => {
      point.x += point.xa
      point.y += point.ya
      point.xa *= (point.x > this.cvs.width || point.x < 0) ? -1 : 1
      point.ya *= (point.y > this.cvs.width || point.y < 0) ? -1 : 1

      this.ctx.fillRect(point.x - 0.5, point.y - 0.5, 1, 1)
      this.ctx.fillStyle = 'rgba(200, 200, 200, 0.8)'

      curPoints.forEach( curPoint => {
        if( curPoint === point || curPoint.x == null || curPoint.y == null) return
        // 两点间的距离
        let distance = (curPoint.x - point.x) * (curPoint.x - point.x) + (curPoint.y - point.y) * (curPoint.y - point.y)
        if( distance < curPoint.max ) {
          if( curPoint === this.cursor && distance > (curPoint.max / 2)) {
            point.x += (curPoint.x - point.x) * 0.03
            point.y += (curPoint.y - point.y) * 0.03
          }
          let ratio = (curPoint.max - distance) / curPoint.max

          this.ctx.beginPath()
          this.ctx.lineWidth = 1
          this.ctx.strokeStyle = 'rgba(200, 200, 200,' + ratio + ')'
          this.ctx.moveTo(point.x, point.y)
          this.ctx.lineTo(curPoint.x, curPoint.y)
          this.ctx.stroke()
        }
      })
    })

    window.requestAnimationFrame( () => {
      this.animation(this.points)
    })
  }

  // 点集合
  pointsFn (num) {
    // 有四个属性：x、y轴坐标、加速度以及连线最大距离
    let points = []
    for(let i = 0; i < num; i++) {
      let x = Math.random() * this.cvs.width
      let y = Math.random() * this.cvs.height
      let xa = (Math.random() * 2 - 1) * 0.8
      let ya = (Math.random() * 2 - 1) * 0.8
      let max = 5000
      points.push({
        x, y, xa, ya, max
      })
    }
    return points
  }

}

let background = new bgCvs(cvs);