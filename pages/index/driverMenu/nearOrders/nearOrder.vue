<template>
  <div class="container">
    <div class="header">
      <span class="title">附近行程</span>
    </div>
    <div class="itinerary-list">
      <div v-for="itinerary in itinerarys" :key="itinerary.id" class="itinerary-card">
        <div class="itinerary-body">
          <div class="itinerary-route">
            <div class="route-point start">
              <div class="route-dot"></div>
              <div class="route-address">{{ itinerary.startAddress }}</div>
            </div>
            <div class="route-point end">
              <div class="route-dot"></div>
              <div class="route-address">{{ itinerary.endAddress }}</div>
            </div>
          </div>
        </div>
        <div class="itinerary-footer">
          <button class="again-button" @click="initiateOrderGrabbing(itinerary.id)">抢单</button>
        </div>
      </div>
      <div v-if="itinerarys==null||itinerarys.length==0" class="no-itinerary">
        <div class="no-itinerary-text">附近暂无订单</div>
      </div>
    </div>
  </div>
</template>

<script>


import httpReq from "../../../../util/httpReq";
import urlObj from "../../../../api/urlObj";
import userGeocoding from "../../../../data/userGeocoding";

export default {
  data() {
    return {
      itinerarys: []
    }
  },
  methods: {
    loadNearbyOrders(){
      httpReq.get({
        url: urlObj.itinerary.getNearbyOrders+userGeocoding.longitude+","+userGeocoding.latitude,
        success: (res)=>{
          this.itinerarys = res.data.data
        }
      })
    },
    initiateOrderGrabbing(iteraryId){
      httpReq.get({
        url: urlObj.itinerary.getOrder+iteraryId,
        success: (res)=>{
          if (res.data.code == 200) {
            wx.showToast({
              title: '抢单成功',
              icon: 'success',
              duration: 2000
            })
          }else {
            wx.showToast({
              title: '抢单失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        complete: ()=>{
          this.loadNearbyOrders()
        }
      })
    },
    receivedChatMessageEventCallback(data){
      uni.showToast({
        title: `行程${data.itineraryId}的聊天记录已更新`,
        icon: 'none',
        duration: 2000
      })
    }
  },
  created() {
    this.loadNearbyOrders()
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
.container {
  padding: 16px;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.button {
  background-color: #00aaff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 20vw;
  font-size: 12px;
  height: 5vh;
}

.itinerary-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.itinerary-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.itinerary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.vehicle-type {
  font-weight: bold;
}


.itinerary-body {
  margin-bottom: 16px;
}

.itinerary-time {
  font-size: 14px;
  color: #555;
}

.itinerary-cost {
  font-size: 14px;
  color: #555;
}

.itinerary-route {
  margin-top: 8px;
}

.route-point {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.route-dot {
  width: 8px;
  height: 8px;
  background-color: #00aaff;
  border-radius: 50%;
  margin-right: 8px;
}

.route-address {
  font-size: 14px;
  color: #333;
}

.itinerary-footer {
  display: flex;
  justify-content: space-between;
}

.delete-button, .again-button {
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 20vw;
  font-size: 12px;
  height: 5vh;
}

.again-button {
  background-color: #00aaff;
  color: white;
}

.status-text-distributed {
  color: #00aaff;
}

.status-text-in-progress {
  color: #ffa500;
}

.status-text-completed {
  color: #008000;
}

.status-text-canceled {
  color: #ff0000;
  float: right;
}
.no-itinerary {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #999;
  text-align: center;
  margin-top: 20vh;
}
</style>
