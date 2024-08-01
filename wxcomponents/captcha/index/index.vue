<template>
<uni-shadow-root class="captcha-index-index"><view class="tianai-captcha-parent" style="background-image: url('/static/纹理.png')">
  <view class="tianai-captcha-box" :style="'transform: translateX('+(transformX)+'px);'">
    <slider-captcha v-if="(currentCaptcha.target.captcha.type == 'SLIDER')" :captcha-data="currentCaptcha.target.captcha" :tip="tip" @captchaValid="captchaValid"></slider-captcha>
    <click-captcha v-if="(currentCaptcha.target.captcha.type == 'WORD_IMAGE_CLICK'|currentCaptcha.target.captcha.type == 'IMAGE_CLICK'| currentCaptcha.target.captcha.type == 'HONEYCOMB_IMAGE_CLICK'| currentCaptcha.target.captcha.type == 'WORD_ORDER_IMAGE_CLICK')" :captcha-data="currentCaptcha.target.captcha" :tip="tip" @captchaValid="captchaValid"></click-captcha>
    <rotate-captcha v-if="(currentCaptcha.target.captcha.type == 'ROTATE')" :captcha-data="currentCaptcha.target.captcha" :tip="tip" @captchaValid="captchaValid"></rotate-captcha>
    <concat-captcha v-if="(currentCaptcha.target.captcha.type == 'CONCAT')" :captcha-data="currentCaptcha.target.captcha" :tip="tip" @captchaValid="captchaValid"></concat-captcha>
    <curve-captcha v-if="(currentCaptcha.target.captcha.type == 'CURVE')" :captcha-data="currentCaptcha.target.captcha" :tip="tip" @captchaValid="captchaValid"></curve-captcha>
    <slider2-captcha v-if="(currentCaptcha.target.captcha.type == 'SLIDER2')" :captcha-data="currentCaptcha.target.captcha" :tip="tip" @captchaValid="captchaValid"></slider2-captcha>
    <rotate-degree-captcha v-if="(currentCaptcha.target.captcha.type == 'ROTATE_DEGREE')" :captcha-data="currentCaptcha.target.captcha" :tip="tip" @captchaValid="captchaValid"></rotate-degree-captcha>
  </view>
  <view class="slider-bottom">
    <view class="close-btn" @click="closeFun"></view>
    <view class="refresh-btn" @click="refresh"></view>
  </view>
</view></uni-shadow-root>
</template>

<script>
import SliderCaptcha from '../slider.vue'
import ClickCaptcha from '../click.vue'
import RotateCaptcha from '../rotate.vue'
import ConcatCaptcha from '../concat.vue'
import CurveCaptcha from '../curve.vue'
import Slider2Captcha from '../slider2.vue'
import RotateDegreeCaptcha from '../rotate_degree.vue'
global['__wxVueOptions'] = {components:{'slider-captcha': SliderCaptcha,'click-captcha': ClickCaptcha,'rotate-captcha': RotateCaptcha,'concat-captcha': ConcatCaptcha,'curve-captcha': CurveCaptcha,'slider2-captcha': Slider2Captcha,'rotate-degree-captcha': RotateDegreeCaptcha}}

global['__wxRoute'] = 'captcha/index/index'
const util = require("../util.js")
Component({
  properties: {
    requestUrl: String,
    validUrl: String
  },
  data: {
    tip: {
      msg: "123"
    },
    currentCaptcha: {
      target: {},
    },
    transformX: -300
  },
  /**
   * 组件的方法列表
   */
  methods: {
    captchaValid(requestData) {
      const pages = getCurrentPages();
      const url = pages[pages.length - 1].route;
      wx.request({
        url: this.properties.validUrl,
        method: "post",
        header:{
          "x-referer": url
        },
        data: {
          id: this.data.currentCaptcha.target.id,
          data: util.enc(requestData.detail)
        },
        success: res => {
          let resData = res.data;
          if (resData.code !== 200) {
            // 校验失败
            this.showTips("请再试一次", 0, () => {
              this.refresh();
            })
          } else {
            // 校验成功
            this.showTips("验证成功", 1, () => {
              this.triggerEvent("captchaValidSuccess", resData);
            })
          }
        }
      })
    },
    doLoadCaptcha(data) {
      this.destroyCaptcha(() => {
        setTimeout(() => {
          this.openCaptcha(data);
          
        }, 500)
      })
    },
    openCaptcha(data) {
      this.setData({
        currentCaptcha: {
          target: data,
          transformX: -300
        }
      })
      setTimeout(() => {
        this.setData({
          transformX: 0
        });
      }, 10)
    },
    destroyCaptcha(callback) {
      if (this.data.currentCaptcha.target.id) {
        this.setData({
          transformX: 300
        });
        setTimeout(() => {
          this.setData({
            currentCaptcha: {
              target: {},
            },
            tip: {},
            transformX: -300
          });
          if (callback) {
            callback();
          }
        }, 500)
      } else {
        if (callback) {
          callback();
        }
      }
    },

    refresh() {
      wx.request({
        url: this.properties.requestUrl,
        success: (res) => {
          const data = res.data;
          if (data) {
            this.doLoadCaptcha(data);
          } else {
            wx.showToast({
              title: '获取验证码失败',
              duration: 1000,
              icon: "error",
            });
          }
        },
        fail: (res) => {
          wx.showToast({
            title: '获取验证码失败',
            duration: 1000,
            icon: "error",
          });
        }
      })
    },
    closeFun() {
      this.triggerEvent("closeBtn");
    },

    showTips(msg, type, callback) {
      this.setData({
        tip: {
          msg: msg,
          type: type,
          showTips: true,
        }
      });
      // 延时
      if (callback) {
        setTimeout(callback, 1000);
      }
    }
  },
  lifetimes: {
    attached() {
      this.refresh()
    }
  }
})
export default global['__wxComponents']['captcha/index/index']
</script>
<style platform="mp-weixin">
/* components/captcha/slider/index.css */
.tianai-captcha-parent {
  box-shadow: 0 0 11px 0 #999;
  width: 318px;
  height: 318px;
  overflow: hidden;
  position: relative;
  z-index: 997;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
}
.tianai-captcha-parent  .tianai-captcha-box {
  height: 260px;
  width: 100%;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  transition-duration: .45s;
  transform: translateX(-300px);
}
.tianai-captcha-parent  .tianai-captcha-box .tianai-captcha-slider .slider-move .slider-move-track .slider-move-btn {
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

.tianai-captcha-parent  .slider-bottom {
  height: 19px;
  width: 100%;
}

.tianai-captcha-parent  .slider-bottom .close-btn {
  width: 20px;
  height: 20px;
  background-image: url("data:image/png;base64,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");
  background-repeat: no-repeat;
  background-position: 0 -14px;
  float: right;
  margin-right: 2px;
  cursor: pointer;
}

.tianai-captcha-parent  .slider-bottom .refresh-btn {
  width: 20px;
  height: 20px;
  background-image: url("data:image/png;base64,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");
  background-position: 0 -167px;
  background-repeat: no-repeat;
  float: right;
  margin-right: 10px;
  cursor: pointer;
}
</style>