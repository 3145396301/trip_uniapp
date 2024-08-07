<template>

  <view class="container">
    <view class="logo">
      <image src="/static/logo.png" mode="aspectFit"></image>
    </view>
    <view class="title">快出行</view>
    <input style="border: 1px black solid;border-radius: 5px" v-if="test" v-model="userId">
    <button class="wechat-login" @click="login">微信登录</button>
    <div v-if="loginValid" class="Verification-code-coverage">
      <tac :requestUrl="requestUrl+type[typeIndex]" :validUrl="validUrl" @closeBtn="closeValid" @captchaValidSuccess="captchaValidSuccess"></tac>
    </div>
    <input style="width: 50%;height: 20px;border: black 1px solid" v-model="userId">
    <button class="phone-login" @click="loginTest">测试登录</button>
  </view>

</template>

<script>
import urlObj from '../../../api/urlObj'
import httpReq from "../../../util/httpReq";
import userInfoData from "../../../data/userInfo";
import userGeocoding from "../../../data/userGeocoding";
import Loading from "../Loading/loading.vue";

export default {
  components: {Loading},
  data() {
    return {
      loginValid: false,
      type: [
        'HONEYCOMB_IMAGE_CLICK',
        // 'SCRAPE',
        // 'WORD_ORDER_IMAGE_CLICK',
        'IMAGE_CLICK',
        'ROTATE_DEGREE',
        'ROTATE',
        'CONCAT',
        'WORD_IMAGE_CLICK',
        'SLIDER',
        'CURVE',
        'SLIDER2'
      ],
      typeIndex: 0,
      requestUrl: "http://127.0.0.1:8083/gen?type=",
      validUrl: "http://127.0.0.1:8083/check",
      userId: 0,
      test: false
    };
  },
  methods: {
    loginValidFun() {
      //随机获取验证码类型
      this.typeIndex = Math.floor(Math.random() * 9);
      console.log(this.typeIndex)
      this.loginValid = true;
    },
    captchaValidSuccess() {
      this.login();
    },
    closeValid() {
      console.log('关闭')
      this.loginValid = false;
    },
    login() {
      if (this.test){
        this.loginTest()
        return
      }
      uni.login({
        provider: 'weixin',
        success: (res) => {
          let code = res.code;
          uni.getUserInfo({
            provider: 'weixin',
            success: (res) => {
              let userInfo = res.userInfo;
              let data = {
                code: code,
                nickname: userInfo.nickName,
                photo: userInfo.avatarUrl,
              }
              httpReq.post({
                url: urlObj.user.login, data: data, success: (res) => {
                  uni.setStorageSync('satoken', res.header.satoken);
                  userInfoData.credentials= res.data.data.credentials;
                  userInfoData.startConnect()
                  if (res.data.data.type==1){
                    uni.navigateTo(
                        {
                          url: '/pages/index/mainMenu/mainMenu',
                        }
                    )
                  }
                  if (res.data.data.type==2){
                    uni.navigateTo(
                        {
                          url: '/pages/index/driverMenu/driverMenu',
                        }
                    )
                  }

                  userGeocoding.startUpdateCoordinates();
                }
              })
            },
            fail: (err) => {
              console.log(3, err)
            }
          })
        },
        fail: (err) => {
          console.log(err)
        }
      })
    },
    loginTest(){
      httpReq.post({
        url: urlObj.user.loginTest, data: {
          code: this.userId,
        }, success: (res) => {
          uni.setStorageSync('satoken', res.header.satoken);
          userInfoData.credentials= res.data.data.credentials;
          userInfoData.startConnect()
          if (res.data.data.type==1){
            uni.navigateTo(
                {
                  url: '/pages/index/mainMenu/mainMenu',
                }
            )
          }
          if (res.data.data.type==2){
            uni.navigateTo(
                {
                  url: '/pages/index/driverMenu/driverMenu',
                }
            )
          }
          userGeocoding.startUpdateCoordinates();
        }
      })

    }
  },
  onLoad() {

  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #fff;
}

.logo {
  margin-bottom: 20px;
}

.logo image {
  width: 100px;
  height: 100px;
}

.title {
  font-size: 18px;
  color: #333;
  margin-bottom: 50px;
}

.wechat-login {
  width: 80%;
  height: 45px;
  background-color: #1AAD19;
  color: #fff;
  border: none;
  border-radius: 5px;
  text-align: center;
  line-height: 45px;
  font-size: 16px;
  margin-bottom: 20px;
}

.phone-login {
  font-size: 14px;
  color: #1AAD19;
  text-decoration: underline;
}

.Verification-code-coverage {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
}
tac {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
