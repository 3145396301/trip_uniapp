// components/captcha/click.js
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
  ready() {

  },
  /**
   * 组件的初始数据
   */
  data: {
    spans: [],
    requestData: {},
    sliceArr: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    },
    valid() {
      let requestData = this.data.requestData;
      requestData.bgImageWidth = 300;
      requestData.bgImageHeight = 180;
      requestData.templateImageWidth= 0;
      requestData.templateImageHeight= 0;
      requestData.left= 0;
      requestData.top= 0;
      requestData.stopTime = new Date();
      this.triggerEvent("captchaValid", requestData);
    },
    click(e) {
      wx.createSelectorQuery()
        .in(this)
        .select('.bg-img-click-mask')
        .boundingClientRect(res => {
          const maskLeft = res.left;
          const maskTop = res.top;

          let spans = this.data.spans;
          let requestData = this.data.requestData;
          if (spans.length == 0) {
            requestData.startTime = new Date();
          }
          let trackList = requestData.trackList || [];
          let offsetX = e.detail.x - maskLeft;
          let offsetY = e.detail.y - maskTop;
          const pos = {
            val: spans.length + 1,
            left: offsetX - 12,
            top: offsetY - 12
          };
          spans.push(pos);
          trackList.push({
            x: Math.round(pos.left + 12),
            y: Math.round(pos.top + 12),
            type: "click",
            t: (new Date().getTime() - requestData.startTime.getTime())
          })
          requestData.trackList = trackList;

          this.setData({
            spans: spans,
            requestData: requestData
          });
          if (spans.length >= 4) {
            this.valid();
          }
        })
        .exec();

    }
  }
})