<template>
<uni-shadow-root class="captcha-click-index"><view class="tianai-captcha-word-click">
    <view class="click-tip">
        <view class="move-track-font">请依次点击:{{tip.val}}</view>
        <image class="tip-img" :src="captchaData.templateImage"></image>
    </view>
    <view class="content">
        <view class="bg-img-div">
            <image @load="onBgImageLoad" class="bg-img" :src="captchaData.backgroundImage"></image>
            <view class="bg-div">
                <view v-for="(slice,index) in (sliceArr)" :key="slice.a" class="bg-div-slice" :style="slice.b"></view>
            </view>
            <view class="bg-img-click-mask" id="bg-img-click-mask" @click="click">
                <view v-for="(item,index) in (spans)" :key="item.index" class="click-span" :style="'left: '+(item.left)+'px; top: '+(item.top)+'px;display: block;'">{{item.val}}</view>
            </view>
        </view>
        <view :class="['tips', tip.showTips&&'tips-on',(tip.type==1)&&'tips-success', (tip.type!=1)&& 'tips-error']" id="tips">
            {{tip.msg}}
        </view>
    </view>
</view></uni-shadow-root>
</template>

<script>

global['__wxVueOptions'] = {components:{}}

global['__wxRoute'] = 'captcha/click/index'
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
export default global['__wxComponents']['captcha/click/index']
</script>
<style platform="mp-weixin">
/* components/captcha/click.css */
.tianai-captcha-word-click{
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

.tianai-captcha-word-click .content .bg-img-div .bg-div {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.tianai-captcha-word-click .content .bg-img-div .bg-div .bg-div-slice {
  position: absolute;
}
.tianai-captcha-word-click .tips {
  height: 25px;
  width: 100%;
  position: absolute;
  bottom: -25px;
  left: 0;
  z-index: 999;
  font-size: 15px;
  line-height: 25px;
  /*background-color: #FF5D39;*/
  color: #fff;
  text-align: center;
  /* transform: translateY(0px); */
  /* display: none; */
  /* transition: max-height 0.5s; */
  transition: bottom .3s ease-in-out;
}
.tianai-captcha-word-click .tips.tips-error {
  background-color: #FF5D39;
}
.tianai-captcha-word-click .tips.tips-success {
  background-color: #39C522;
}
.tianai-captcha-word-click .tips.tips-on {
  bottom: 0;
}

.content {
	width: 100%;
  height: 180px;
  position: relative;
  overflow: hidden;
}
.content .bg-img-div{
	width: 100%;
	height: 100%;
}
.content .bg-img-click-mask{
	width: 300px;
	height: 180px;
	width: 100%;
	position: absolute;
	left: 0;
	top: 0;
}
.bg-img-click-mask .click-span {
	position: absolute;
	left: 0;
	top: 0;
	border-radius: 50px;
	background-color: #409eff;
	width: 20px;
	height: 20px;
	text-align: center;
	line-height: 20px;
	color: #fff;
	border: 2px solid #fff;
	box-sizing: content-box;
}
.tianai-captcha-word-click .click-tip{
	position: relative;
	height: 40px;
	width: 100%;
}
.tianai-captcha-word-click .click-tip .move-track-font {
	display: inline-block;
}
.tianai-captcha-word-click .click-tip  .tip-img {
	width: 150px;
	height: 37.5px;
	position: absolute;
	right: 15px;
}

.tianai-captcha-word-click .bg-img {
	height: 100%;
  width: 100%;
  border-radius: 5px;
}
</style>