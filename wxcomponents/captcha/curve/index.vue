<template>
<uni-shadow-root class="captcha-curve-index"><view class="tianai-captcha-curve">
  <view class="tip">
    <view class="move-track-font">拖动滑块完成拼图</view>
  </view>
  <view class="content">
  
    <view class="bg-img-div">
      <image @load="onBgImageLoad" class="bg-img" :src="captchaData.backgroundImage"></image>
      <view class="bg-div">
        <view v-for="(slice,index) in (sliceArr)" :key="slice.a" class="bg-div-slice" :style="slice.b"></view>
      </view>
      <canvas canvas-id="curve-slide-canvas" style="width: 300px; height: 180px;" class="curve-slide-canvas"></canvas>
      <cover-view id="tianai-captcha-curve-ball-div-left" :style="'left:'+(ctrl.left.x-10)+'px;top:'+(ctrl.left.y-10)+'px'" class="curve-ball-div"></cover-view>
      <cover-view id="tianai-captcha-curve-ball-div-right" :style="'left:'+(ctrl.right.x-10)+'px;top:'+(ctrl.right.y-10)+'px'" class="curve-ball-div"></cover-view>
    </view>
    
    <view class="slider-img-div" :style="' transform: translate('+(sliderMove)+'px, 0px)'">
      <image class="slider-move-img" :src="captchaData.templateImage"></image>
    </view>
    <view :class="['tips', tip.showTips&&'tips-on',(tip.type==1)&&'tips-success', (tip.type!=1)&& 'tips-error']" id="tips">
      {{tip.msg}}
    </view>
  </view>
  <view class="slider-move">
    <view class="slider-move-track">
      <view class="slider-move-track-mask" :style="'width: '+(sliderMove)+'px;'"></view>
      <view class="slider-move-btn" :style="' transform: translate('+(sliderMove)+'px, 0px)'" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"></view>
    </view>
  </view>
</view></uni-shadow-root>
</template>

<script>

global['__wxVueOptions'] = {components:{}}

global['__wxRoute'] = 'captcha/curve/index'
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
export default global['__wxComponents']['captcha/curve/index']
</script>
<style platform="mp-weixin">
/* components/captcha/slider/index.css */
.tianai-captcha-curve {
  z-index: 999;
  position: absolute;
  left: 0;
  top: 0;
  user-select: none;
  transform-style: preserve-3d;
  will-change: transform;
  transition-duration: .5s;
  transition-timing-function: cubic-bezier(0.36, 0.3, 0.42, 1.5);
  text-align: left;
  box-sizing: content-box;
  width: 300px;
  height: 260px;
}

.tianai-captcha-curve .curve-slide-canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  z-index: 998;
}

.tianai-captcha-curve .curve-ball-div {
  position: absolute;
  left: 0;
  top: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #49484878;
  display: block;
  z-index: 999;
}

.tianai-captcha-curve .slider-tip {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 15px;
  line-height: normal;
  color: #000;
}

.tianai-captcha-curve .tips {
  height: 25px;
  width: 100%;
  position: absolute;
  bottom: -25px;
  left: 0;
  z-index: 999;
  font-size: 15px;
  line-height: 25px;
  color: #fff;
  text-align: center;
  transition: bottom .3s ease-in-out;
}

.tianai-captcha-curve .tips.tips-error {
  background-color: #FF5D39;
}

.tianai-captcha-curve .tips.tips-success {
  background-color: #39C522;
}

.tianai-captcha-curve .tips.tips-on {
  bottom: 0;
}

.tianai-captcha-curve .move-track-font {
  font-size: 15px;
}

.tianai-captcha-curve .content {
  width: 100%;
  height: 180px;
  position: relative;
  overflow: hidden;
}

.tianai-captcha-curve .content .bg-img-div {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
}

.tianai-captcha-curve .content .bg-img-div .bg-img {
  height: 100%;
  width: 100%;
  border-radius: 5px;
}

.tianai-captcha-curve .content .bg-img-div .bg-div {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.tianai-captcha-curve .content .bg-img-div .bg-div .bg-div-slice {
  position: absolute;
}

.tianai-captcha-curve .content .slider-img-div {
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
  width: 55px;
}

.tianai-captcha-curve .content .slider-img-div .slider-move-img {
  height: 100%;
  width: 100%;
}

.tianai-captcha-curve .slider-move {
  line-height: 38px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  color: #88949d;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  filter: opacity(0.8);
  height: 34px;
  width: 100%;
  margin: 11px 0;
  position: relative;
}

.tianai-captcha-curve .slider-move .slider-move-track {
  position: relative;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #f5f5f5;
  color: #999;
  transition: 0s;
  font-size: 14px;
  box-sizing: content-box;
  border: 1px solid #f5f5f5;
  border-radius: 4px;
}

.tianai-captcha-curve .slider-move .slider-move-track .slider-move-track-mask {
  border-color: rgb(2, 152, 248);
  background-color: rgb(137, 210, 255);
  height: 100%;
}

.tianai-captcha-curve .slider-move .slider-move-track .slider-move-btn {
  background-image: url('data:image/png;base64,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');
  transform: translate(0px, 0px);
  position: absolute;
  top: -6px;
  left: 0;
  width: 63px;
  height: 45px;
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 5px;
}
</style>