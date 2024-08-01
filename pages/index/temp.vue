<template>
  <div class="img_box">
    <img src="{{src}}">
  </div>
</template>

<script>
import map from '../../libs/amap-wx.130'
export default {
  data() {
    return {
      src: ''
    };
  },
  onLoad() {
    console.log('onLoad');
    this.getUserAddress()
    this.getStaticMap()
  },
  methods: {
    getUserAddress() {
      uni.getloca

      uni.onLocaleChange(function (a, b, c) {
        // 打印参数1
        console.log("参数1", a)
        // 打印参数2
        console.log("参数2", b)
        // 打印参数3
        console.log("参数3", c)
      })
    },
    getStaticMap() {
      let that = this;
      const mapWX = map
      console.log(map)
      uni.getSystemInfo({
        success: function (data) {
          console.log("系统数据",data)
          let height = data.windowHeight;
          let width = data.windowWidth;
          let size = width + "*" + height;
          mapWX.getStaticmap({
            zoom: 8,
            size: size,
            scale: 2,
            // markers: "mid,0xFF0000,A:116.37359,39.92437;116.47359,39.92437",
            success: function (data) {
              console.log("获取地图成功",data)
              that.setData({
                src: data.url
              })
            },
            fail: function (info) {
              console.error("获取静态地图错误",info)
              uni.showModal({title: info.errMsg})
            }
          })
        }
      })
    },
    setData(data) {
      console.log(data.src)
      this.src = data.src
    }
  }
};
</script>

<style>
.img_box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.img_box image {
  width: 100%;
  height: 100%;
}

</style>
