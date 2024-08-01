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