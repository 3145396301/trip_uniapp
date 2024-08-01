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
    rorateDeg: 0,
    requestData: {},
    sliceArr: [],
    endX: 237
  },
  lifetimes: {
    ready() {

    }
  },
  methods: {
    onBgImageLoad(e) {
      this.setData({
        sliceArr: []
      })
      util.drawBgImage(this.properties.captchaData, 180, 180, el => {
        const arr = this.data.sliceArr;
        arr.push(el);
        this.setData({
          sliceArr: arr
        })
      })
    },
    touchstart(e) {
      let requestData = {
        startTime: new Date(),
        startX: Math.round(e.touches[0].pageX),
        startY: Math.round(e.touches[0].pageY),
        trackList: [],
        bgImageWidth: 300,
        bgImageHeight: 180,
        templateImageWidth: 180,
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
          sliderMove: track.x - requestData.startX,
          rorateDeg: moveX / (this.data.endX / 360)
        })
      }
    },
    touchend(e) {
      let requestData = this.data.requestData;
      requestData.trackList.push(util.getTrackByEvent(e, requestData));
      requestData.stopTime = new Date();
      this.valid()
    },
    valid() {
      this.data.requestData.bgImageWidth = this.data.endX;
      this.triggerEvent("captchaValid", this.data.requestData);
    }
  },
})