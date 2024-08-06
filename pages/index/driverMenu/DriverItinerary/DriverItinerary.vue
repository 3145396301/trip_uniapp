<template>
  <div class="container">
    <div class="header">
      <span class="title">我的行程</span>
    </div>
    <div class="itinerary-list">
      <div v-for="itinerary in itinerarys" :key="itinerary.id" class="itinerary-card">
        <div class="itinerary-header">
          <span></span>
          <span v-if=" itinerary.status==2 " class="status-text-in-progress">已派发</span>
          <span v-if=" itinerary.status==3 " class="status-text-completed">已完成</span>
          <span v-if="itinerary.status==5" class="status-text-canceled">进行中</span>
        </div>
        <div class="itinerary-body">
          <div class="itinerary-time">{{ itinerary.createTime }}</div>
<!--          <div class="itinerary-cost" v-if="itinerary.status==3">¥{{ itinerary.actualCost.toFixed(2) }}</div>-->
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
          <button class="delete-button" v-if="itinerary.status==3" @click="delTheTrip(itinerary.id)">删除行程</button>
          <button class="button" v-if="itinerary.status==2||itinerary.status==5" @click="toChatPage(itinerary.id)">联系乘客</button>
          <button class="button" v-if="itinerary.status==2" @click="clickTailNumber(itinerary.id)">开始行程</button>
          <button class="button" v-if="itinerary.status==5" @click="endTheTrip(itinerary.id)">结束行程</button>
          <button class="button" v-if="itinerary.status==3&&itinerary.ratingLevel" @click="clickRepresentations(itinerary.id)">申述</button>
        </div>
      </div>
      <!-- itinerarys==null||itinerarys.length==0 提示暂无行程 -->
      <div v-if="itinerarys==null||itinerarys.length==0" class="no-itinerary">
        <div class="no-itinerary-text">暂无行程</div>
      </div>
    </div>
    <!-- 普通弹窗 -->
    <uni-popup ref="popup" background-color="#fff">
      <view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
        <div style="margin-bottom: 1vh">
          请输入用户手机号尾号
        </div>
        <textarea v-model="tailNumber"></textarea>
        <div style="margin-bottom: 2vh"></div>
        <button class="button" style="width: 15vw;height: 5vh" @click="startTheTrip">提交</button>
      </view>
    </uni-popup>
  <!--  申述弹窗   -->
    <uni-popup ref="popover" background-color="#fff">
      <view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
        <div style="margin-bottom: 1vh">
                    行程申述
        </div>
        <div style="margin-bottom: 2vh">
          申述原因:<textarea type="text" v-model="representations.content"></textarea>
          <button class="button" style="width: 15vw;height: 5vh" @tap="uploading">上传</button>
        </div>
        <button class="button" style="width: 15vw;height: 5vh" @click="Representations">提交</button>
      </view>
    </uni-popup>
  </div>
</template>

<script>


import urlObj from "../../../../api/urlObj";
import httpReq from "../../../../util/httpReq";

export default {
  name: "MyItinerary",
  data() {
    return {
      itinerarys: [],
      tailNumber:"",
      itineraryId:null,
      representations:{}
    }
  },
  methods:{
    delTheTrip(id){
      httpReq.delete({
        url: urlObj.itinerary.delItinerary+id,
        success: (res)=>{
          uni.showToast({
            title: "删除成功",
            icon: 'none',
            duration: 2000,
          })
          this.loadMyItinerary();
        },
          }
      )
      },
    clickRepresentations(id){
      httpReq.get({
        url: urlObj.representations.findByItineraryId+id,
        success: (res)=>{
          if (res.data.data===1){
            uni.showToast({
              title: "申述已被处理,请查看消息",
              icon: 'none',
              duration: 2000,
            })
            return;
          }else if (res.data.data===2){
            uni.showToast({
              title: "申述正在处理,请耐心等待",
              icon: 'none',
              duration: 2000,
            })
            return;
          }
          this.representations.itineraryId=id;
          this.$refs.popover.open('center')
        }

      })

    },
    uploading(){
      uni.chooseMedia({
        count:1,
        mediaType:['image'],
        sourceType:['camera'],
        success: (res) => {
          console.log(res)
          uni.uploadFile({
            url:urlObj.upload.uploadImage,
            filePath: res.tempFiles[0].tempFilePath,
            name: 'file',
            success: (uploadFileRes) => {
              this.representations.file=JSON.parse(uploadFileRes.data).data;
            }
          })
        }
      })
    },
    Representations(){
        httpReq.post({
          url:urlObj.representations.saveRepresentations,
          data:this.representations,
          success: (res)=>{
            uni.showToast({
              title: "申述成功",
              icon: 'none',
              duration: 2000,
            })
            this.loadMyItinerary();
          },
        })
      this.$refs.popover.close();
      this.representations={}
    },
    clickTailNumber(id){
      this.itineraryId =id;
      this.$refs.popup.open('center')
    },
    startTheTrip(){
      httpReq.post({
        url: urlObj.itinerary.takeOrder,
        data:{itineraryId:this.itineraryId,
          tailNumber:this.tailNumber
        },
        success: (res)=>{
          if (res.data==true){
            uni.showToast({
              title: "行程开始",
              icon: 'none',
              duration: 2000,
            })
          }else {
            uni.showToast({
              title: "请输入乘客手机尾号",
              icon: 'none',
              duration: 2000,
            })
          }
          this.loadMyItinerary();
        },
      })
      this.$refs.popup.close();
      this.tailNumber=""
    },
    endTheTrip(id){
      httpReq.get({
        url: urlObj.itinerary.endItinerary+id,
        success: (res)=>{
          uni.showToast({
            title: "行程结束",
            icon: 'none',
            duration: 2000,
          })
          this.loadMyItinerary();
        },
      })
    },
    loadMyItinerary(){
      httpReq.get({
        url: urlObj.itinerary.getAllItinerary,
        success: (res)=>{
          console.log(res.data)
          this.itinerarys=res.data.data;
        }
      })
    },
    toChatPage(iteraryId){
      uni.navigateTo({
        url: "/pages/index/chat/Chat?iteraryId="+iteraryId
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
    console.log('MyItinerary created')
    this.loadMyItinerary();
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



.itinerary-body {
  margin-bottom: 16px;
}

.itinerary-time {
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

.popup-content {
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 63vw;
  height: 30vh;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: #fff;
}
textarea {
  border: 3px #c3ac8b solid;
  border-radius: 10px;
  width: 100%;
  height: 120px;
  box-sizing: border-box;
}
</style>
