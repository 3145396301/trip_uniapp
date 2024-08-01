// components/captcha/slider/index.js
const util = require("../util.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    captchaData: {
      type: Object
    },
    tip: {
      type: Object
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    sliderMove: 0,
    requestData: {},
    sliceArr: [],
    endX: 237,
    ctrl: {},
    showBall: false,
  },
  lifetimes: {
    ready() {

    }
  },
  methods: {
    drawBezier(x) {
      const context = wx.createCanvasContext('curve-slide-canvas', this)
      console.log(context)
      context.clearRect(0, 0, 300, 180);
      context.strokeStyle = "rgba(255,255,255,0.75)";
      context.setLineWidth(5);
      context.shadowColor = "rgb(0,0,0)";
      context.shadowBlur = 2;
      context.moveTo(this.data.ctrl.left.x, this.data.ctrl.left.y);
      context.bezierCurveTo(x, this.data.ctrl.y, x, this.data.ctrl.y, this.data.ctrl.right.x,
        this.data.ctrl.right.y);
      context.stroke();
      context.draw();
    },
    onBgImageLoad(e) {
      this.setData({
        sliceArr: []
      })
      util.drawBgImage(this.properties.captchaData, 300, 180, el => {
        const arr = this.data.sliceArr;
        arr.push(el);
        this.setData({
          sliceArr: arr
        })
      })

      const imageWidth = 300;
      const imageHeight = 180
      let captchaData = this.properties.captchaData;
      let p = captchaData.data.p;
      let posOrder = [];
      for (let i = 0; i < 5; i++) {
        let index = Math.pow(2, i);
        posOrder.unshift(p.charAt(index));
        p = p.substring(0, index) + p.substring(index + 1);
      }
      let posArr = [];
      let index = -1;
      while ((index = p.lastIndexOf(".")) > 0) {
        let pos = p.substring(index - 1);
        posArr.unshift(pos);
        p = p.substring(0, index - 1);
      }
      let sortPosArr = [];
      for (let i = 0; i < 5; i++) {
        posOrder.forEach((item, index) => {
          if (parseInt(item) === i) {
            sortPosArr.push(posArr[index]);
          }
        });
      }
      this.setData({
        ctrl: {
          left: {
            x: sortPosArr[0] * imageWidth,
            y: sortPosArr[1] * imageHeight
          },
          right: {
            x: sortPosArr[2] * imageWidth,
            y: sortPosArr[3] * imageHeight
          },
          y: sortPosArr[4] * imageHeight
        }
      })
      this.drawBezier(0)

    },
    touchstart(e) {
      let requestData = {
        startTime: new Date(),
        startX: Math.round(e.touches[0].pageX),
        startY: Math.round(e.touches[0].pageY),
        trackList: [],
        bgImageWidth: 300,
        bgImageHeight: 180,
        templateImageWidth: 100,
        templateImageHeight: 180,
      };
      requestData.trackList.push(util.getTrackByEvent(e, requestData));
      this.data.requestData = requestData;
      util.getLeftTop(".slider-move-btn", this, (res) => {
        this.data.requestData.left = res[0];
        this.data.requestData.top = res[1];
      });
    },
    touchmove(e) {
      let requestData = this.data.requestData;
      const track = util.getTrackByEvent(e, requestData);
      requestData.trackList.push(track);
      let moveX = track.x - requestData.startX;
      if (moveX > 0 && moveX < this.data.endX) {
        this.setData({
          sliderMove: track.x - requestData.startX
        })
        this.drawBezier(track.x - requestData.startX)
      }
    },
    touchend(e) {
      let requestData = this.data.requestData;
      requestData.trackList.push(util.getTrackByEvent(e, requestData));
      requestData.stopTime = new Date();
      this.valid()
    },
    valid() {
      this.triggerEvent("captchaValid", this.data.requestData);
    }
  },
})