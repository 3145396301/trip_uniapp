<template>

  <view class="main-menu" v-if="userGeocoding.isInit">
    <!-- 地图 -->
    <map :show-location="true" :markers="markers" :latitude="latitude" :longitude="longitude" :polyline="polyline"
         :style="{
      width: SystemInfo.windowWidth + 'px',
      height: funTop + 20 + 'px',
    }" class="map"></map>
    <!-- 头像 -->
    <div class="avatar-container" @click="toPersonalCenter">
      <UserAvatar :src="src"></UserAvatar>
    </div>
    <!-- 卡卷、行程 -->
    <div class="right-top">
      <image src="/static/卡卷.png" class="icon" @click="toPageMyCoupon"></image>
      <image src="/static/行程.png" class="icon" @click="toPageMyIterary"></image>
      <image src="/static/订单.png" class="icon" @click="toPageMyOrder"></image>
    </div>
    <!-- 滑动上层窗口 -->
    <div class="fun" :style="{ top: funTop + 'px' }" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
      <div class="fun-content" :style="{width: SystemInfo.windowWidth + 'px', height: SystemInfo.windowHeight/4*3 + 'px'}">
        <div class="location-info">
          <div>您当前位置：</div>
          <span>{{ userGeocoding.locationStr }}</span>
        </div>
        <div class="search-box">
          <div>目标地点：</div>
          <input class="uni-input" confirm-type="search" @confirm="onSearchLocation"/>
        </div>
        <div class="marker-list">
          <button class="marker-button" v-for="item in markers" @click="onClickMarker(item)">
            {{ item.title }}
          </button>
        </div>
        <div v-if="clickedMarker != null" class="route-button-container">
          <button class="route-button" @click="searchRoute()">
            搜索路线
          </button>
        </div>
        <!-- 路线信息 -->
        <div v-if="polylineNum !== '0'" class="picker-container">
          <picker mode="selector" :range="paths" range-key="info" @change="displayRoute">
            <view class="picker">
              预览路线
            </view>
          </picker>
        </div>
        <!-- 发起行程 -->
        <div v-if="clickedMarker != null" class="route-button-container">
          <button class="route-button" @click="calculateEstimatedPrice()">
            发起行程
          </button>
        </div>
        <!-- 预约行程 -->
        <div v-if="clickedMarker != null" class="route-button-container">
          <label for="appointmentTime">预约时间：</label>
          <picker mode="multiSelector" :range="timeRange" @change="onTimeChange">
            <view class="picker">{{ selectedDate }} {{ selectedTime }}</view>
          </picker>

          <button class="route-button" @click="calculateEstimatedPrice()">
            预约行程
          </button>
        </div>
        <!-- 展示车辆类型并选择 -->
        <div v-if="showSelectVehicleType" class="vehicle-type-container">
          <div class="vehicle-type-list">
            <div class="vehicle-item" v-for="item in vehicleTypeList" @click="onClickVehicleType(item)">
              <img :src="item.photo" alt="加载失败" class="vehicleImg">
              <div class="vehicle-info">
                <div class="vehicle-type">{{ item.type }}</div>
                <div>起步价: {{ item.startingPrice }}元</div>
                <div>每公里价格: {{ item.kilometre }}元</div>
                <div v-if="paths!=null && paths.length != 0">预计价格: {{ item.estimatedPrice }}元</div>
              </div>
            </div>
            <div @click="showSelectVehicleType=false">
              <image src="/static/取消.png" alt="加载失败" class="vehicleImg"></image>
            </div>
          </div>
        </div>
      </div>
    </div>
  </view>
</template>


<script>
import userGeocoding from "../../../data/userGeocoding";
import UserAvatar from "./components/UserAvatar.vue";
import SystemInfo from "../../../data/systemInfo";
import httpReq from "../../../util/httpReq";
import urlObj from "../../../api/urlObj";

export default {
  data() {
    return {
      page: 'mainMenu',
      userGeocoding: userGeocoding,
      latitude: userGeocoding.latitude, // 中心纬度
      longitude: userGeocoding.longitude, // 中心经度
      src: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
      SystemInfo: SystemInfo,
      funTop: SystemInfo.windowHeight / 4,
      startY: 0, // 记录开始触摸点的 Y 坐标
      markers: [], // {id, latitude, longitude, title}
      polyline: [],
      polylineNum: 0,
      paths: [],
      clickedMarker: null,
      savedPolyline: [], // 保存的 polyline 数据
      vehicleTypeList: [],  // demo:{"id":1,"type":"小车","starting_price":5,"kilometre":0.5,"photo":"http://localhost:8080/img/vehicle/type/small.jpg","remark":"小车"}
      showSelectVehicleType: false,
      vehicleType: null,
      timeRange: [[], []],
      selectedDate: '',
      selectedTime: '',
      appointmentTime: null,
    };
  },
  components: {
    UserAvatar
  },
  mounted() {
    this.initTimeRange();
  },
  methods: {
    initTimeRange() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const dates = ['今天', '明天', '后天'];
      let times = [];

      if (minutes < 30) {
        times.push(`${hours}:30`);
        for (let i = hours + 1; i < 24; i++) {
          times.push(`${i}:00`);
          times.push(`${i}:30`);
        }
      } else {
        for (let i = hours + 1; i < 24; i++) {
          times.push(`${i}:00`);
          times.push(`${i}:30`);
        }
      }

      this.timeRange = [dates, times];
      this.selectedDate = dates[0];
      this.selectedTime = times[0];
    },
    updateTimeRange(dateIndex) {
      const now = new Date();
      const times = [];
      if (dateIndex === 0) { // 今天
        const hours = now.getHours();
        const minutes = now.getMinutes();
        if (minutes < 30) {
          times.push(`${hours}:30`);
          for (let i = hours + 1; i < 24; i++) {
            times.push(`${i}:00`);
            times.push(`${i}:30`);
          }
        } else {
          for (let i = hours + 1; i < 24; i++) {
            times.push(`${i}:00`);
            times.push(`${i}:30`);
          }
        }
      } else { // 明天或后天
        for (let i = 0; i < 24; i++) {
          times.push(`${i}:00`);
          times.push(`${i}:30`);
        }
      }
      this.timeRange[1] = times;
      if (!times.includes(this.selectedTime)) {
        this.selectedTime = times[0];
      }
    },
    onTimeChange(e) {
      const [dateIndex, timeIndex] = e.detail.value;
      this.updateTimeRange(dateIndex); // 更新时间范围
      this.selectedDate = this.timeRange[0][dateIndex];
      this.selectedTime = this.timeRange[1][timeIndex];
      const now = new Date();
      const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dateIndex);
      const [hours, minutes] = this.selectedTime.split(':');
      baseDate.setHours(hours, minutes);
      this.appointmentTime = baseDate.toISOString();
    },
    onTouchStart(event) {
      this.startY = event.touches[0].clientY;
      this.savedPolyline = this.polyline; // 保存当前 polyline
      this.polyline = null; // 清空 polyline
    },
    onTouchMove(event) {
      const touchY = event.touches[0].clientY;
      const deltaY = touchY - this.startY;
      this.startY = touchY; // 更新开始触摸点

      let newFunTop = this.funTop + deltaY;

      // 限制 funTop 的范围
      const minTop = this.SystemInfo.windowHeight / 4;
      const maxTop = this.SystemInfo.windowHeight / 4 * 3;

      if (newFunTop < minTop) {
        newFunTop = minTop;
      } else if (newFunTop > maxTop) {
        newFunTop = maxTop;
      }
      this.funTop = newFunTop;
    },
    onTouchEnd() {
      this.polyline = this.savedPolyline; // 恢复 polyline
    },
    onSearchLocation(env) {
      this.markers = [];
      this.clickedMarker = null;
      this.polylineNum = 0;
      this.polyline = [];
      this.paths = [];
      let target = env.target;
      httpReq.post({
        url: urlObj.user.searchLocation,
        data: {
          coordinates: this.userGeocoding.longitude + "," + this.userGeocoding.latitude,
          searchingAddress: target.value
        },
        success: (res) => {
          this.markers = [];
          let pois = res.data.data.pois;
          for (let i = 0; i < pois.length; i++) {
            let first = pois[i].location.split(",")[0];
            let second = pois[i].location.split(",")[1];
            this.markers.push({
              id: i,
              latitude: second,
              longitude: first,
              title: pois[i].name,
              iconPath: "/static/标记.png",
              width: 30,
              height: 30,
            });
          }
        }
      });
    },
    resetCenter(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
    },
    onClickMarker(item) {
      if (this.clickedMarker != null) {
        this.clickedMarker.iconPath = "/static/标记.png";
      }
      this.clickedMarker = item;
      item.iconPath = "/static/标记选中.png";
      this.resetCenter(item.latitude, item.longitude);
    },
    searchRoute() {
      httpReq.post({
        url: urlObj.itinerary.getPlan,
        data: {
          origin: this.userGeocoding.longitude + "," + this.userGeocoding.latitude,
          destination: this.clickedMarker.longitude + "," + this.clickedMarker.latitude,
        },
        success: (res) => {
          this.polylineNum = res.data.data.count;
          this.paths = res.data.data.route.paths;
          for (let i = 0; i < this.paths.length; i++) {
            // 路线信息 = 距离、时间、道路费
            this.paths[i].info = this.distanceConversion(this.paths[i].distance) + "、" + this.timeConversion(this.paths[i].duration) + "、" + this.paths[i].tolls + "元 道路费";
          }
          // 默认显示第一条路线
          this.displayRoute({detail: {value: 0}});
          console.log("路线数量", this.polylineNum);
          console.log("路线", this.paths);
          console.log("路线点", this.polyline);
        }
      });
    },
    pathItemToPoint(pathItem) {
      let points = [];
      for (let i = 0; i < pathItem.steps.length; i++) {
        let step = pathItem.steps[i];
        let polyline = step.polyline.split(";");
        for (let j = 0; j < polyline.length; j++) {
          let point = polyline[j].split(",");
          points.push({
            longitude: point[0],
            latitude: point[1]
          });
        }
      }
      return points;
    },
    displayRoute(env) {
      let pathIndex = Number.parseInt(env.detail.value);
      console.log(env.detail);
      console.log(this.paths);
      console.log(this.paths[pathIndex]);
      let points = this.pathItemToPoint(this.paths[pathIndex]);
      this.polyline = [{
        points: points,
        color: "#0127c0",
        width: 5
      }];
    },
    distanceConversion(m) {
      // 返回格式化的距离 如果小于1000米 返回米 如果大于1000米 返回千米
      if (m < 1000) {
        return m + "米";
      } else {
        return (m / 1000).toFixed(2) + "千米";
      }
    },
    timeConversion(s) {
      // 返回格式化的时间 如果小于60秒 返回秒 如果大于60秒 返回 ?分钟?秒 如果大于3600秒 返回 ?小时?分钟?秒
      if (s < 60) {
        return s + "秒";
      } else if (s < 3600) {
        return Math.floor(s / 60) + "分钟" + (s % 60) + "秒";
      } else {
        return Math.floor(s / 3600) + "小时" + Math.floor((s % 3600) / 60) + "分钟" + (s % 60) + "秒";
      }
    },
    startItinerary(){
      console.log("开始发起行程")

      httpReq.post({
        url: urlObj.itinerary.startItinerary,
        data: {
          origin: this.userGeocoding.longitude + "," + this.userGeocoding.latitude,
          destination: this.clickedMarker.longitude + "," + this.clickedMarker.latitude,
          vehicleTypeId: this.vehicleType.id,
          appointmentTime: this.appointmentTime
        },
        success: (res) => {
          if (res.data.code == 200) {
            uni.showToast({
              title: '操作成功！',
              icon: 'success'
            });
          } else {
            uni.showToast({
              title: '操作失败',
              icon: 'none'
            });
          }
        }
      });
    },
    loadAllVehicleType(){
      httpReq.get({
        url: urlObj.itinerary.getAllVehicleType,
        success: (res)=>{
          this.vehicleTypeList=res.data.data;
        }
      })
    },
    onClickVehicleType(item){
      this.vehicleType=item;
      this.showSelectVehicleType=false;
      this.startItinerary();
    },
    calculateEstimatedPrice(){
      let averageDistanceOfAllRoutes = 0;
      for (let i = 0; i < this.paths.length; i++) {
        averageDistanceOfAllRoutes += Number.parseInt(this.paths[i].distance);
      }
      averageDistanceOfAllRoutes/=this.paths.length;
      //转为km 向上取整
      averageDistanceOfAllRoutes = Math.ceil(averageDistanceOfAllRoutes / 1000);
      // 根据平均距离 车辆起步价 每km价格 计算出所有车辆类型的预估价格 计算方式：若 每km价格*平均距离<=起步价 则取起步价 否则取每km价格*平均距离
      for (let i = 0; i < this.vehicleTypeList.length; i++) {
        let vehicleType = this.vehicleTypeList[i];
        this.vehicleTypeList[i].estimatedPrice = vehicleType.startingPrice>=vehicleType.kilometre*averageDistanceOfAllRoutes?vehicleType.startingPrice:vehicleType.kilometre*averageDistanceOfAllRoutes;
        // 保留小数点后两位
        this.vehicleTypeList[i].estimatedPrice = this.vehicleTypeList[i].estimatedPrice.toFixed(2);
      }
      this.showSelectVehicleType=true;
    },
    toPageMyIterary(){
      uni.navigateTo({
        url: '/pages/index/MyItinerary/MyItinerary'
      })
    },
    toPageMyOrder(){
      uni.navigateTo({
        url: "/pages/index/MyOrder/MyOrder"
      })

    },
    toPageMyCoupon(){
      uni.navigateTo({
        url: "/pages/index/Coupon/Coupon"
      })
    },
    toPersonalCenter(){
      uni.navigateTo({
        url: "/pages/index/PersonalCenter/PersonalCenter"
      })
    },
    receivedChatMessageEventCallback(data){
      uni.showToast({
        title: `行程${data.itineraryId}的聊天记录已更新`,
        icon: 'none',
        duration: 2000
      })
    },
  },
  onLoad() {
    this.loadAllVehicleType();
  },
  onShow(){
    console.log("主菜单 显示")
    uni.$on("receivedChatMessage",this.receivedChatMessageEventCallback)
  },
  onHide() {
    console.log("主菜单 隐藏")
    uni.$off("receivedChatMessage",this.receivedChatMessageEventCallback);
  },
  onUnload() {
    console.log("主菜单 卸载")
    uni.$off("receivedChatMessage",this.receivedChatMessageEventCallback);
  },
}
</script>


<style scoped>
.avatar-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 10px;
  background: white;
}

.right-top {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  background-color: rgba(103, 99, 99, 0.3);
  padding: 10px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 10px;
}

.icon {
  width: 10vw;
  height: 10vw;
  margin: 5px 0;
}

.fun {
  position: fixed;
  z-index: 999;
  left: 0;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
  background: white;
}

.fun-content {
  background-image: linear-gradient(to right, #EDFCF6, #F6F9E3);
  padding: 15px;
  box-sizing: border-box;
}

.location-info {
  font-size: 16px;
  margin-bottom: 10px;
}

.search-box {
  margin-bottom: 10px;
}

.marker-list {
  max-height: 130px;
  overflow: auto;
  margin-bottom: 10px;
}

.marker-button {
  display: block;
  width: 100%;
  margin-bottom: 5px;
  border: none;
  background: #f0f0f0;
  border-radius: 5px;
  text-align: left;
  transition: background 0.3s;
  height: 40px;
  padding-left: 20px;
}

.marker-button:hover {
  background: #e0e0e0;
}

.route-button-container {
  text-align: center;
  margin-bottom: 10px;
}

.route-button {
  padding: 0px 20px;
  border: none;
  background: #4CAF50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  width: 31%;
  height: 6vh;
}

.route-button:hover {
  background: #45a049;
}

.picker-container {
  margin-bottom: 10px;
}

.picker {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}

.uni-input {
  border: 1px solid #6c5743;
  padding: 8px;
  width: 100%;;
  box-sizing: border-box;
  border-radius: 5px;
  margin-bottom: 10px;
}

.vehicle-type-container {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 999;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vehicle-type-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90vw;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
}

.vehicle-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.vehicle-item:hover {
  background-color: #f1f1f1;
}

.vehicleImg {
  width: 80px;
  height: 45px;
  margin-right: 15px;
  border-radius: 5px;
}

.vehicle-info {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}
.picker{
  width: 25%;
  height: 3vh;
  margin: auto;
}
.vehicle-type {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}
.my-itinerary-view{

}
</style>
