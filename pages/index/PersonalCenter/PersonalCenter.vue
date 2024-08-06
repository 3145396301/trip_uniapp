<template>
  <div class="personal-center">
    <div class="header">
      <img src="https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132" alt="User Avatar" class="avatar">
      <div class="user-info">
        {{isName?"已实名":"未实名"}}
        <h2>十初</h2>
        <p>走一走， 看一看</p>
      </div>
    </div>
    <div class="menu">
      <div class="menu-item" v-for="item in menuItems" :key="item.text" @click="invoke(item.click)">
        <image :src="item.src" style="width: 30px;height: 30px"></image>
        <i :class="item.iconClass"></i>
        <span >{{ item.text }}</span>
      </div>
    </div>
    <uni-popup ref="popup" background-color="#fff">
      <view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
        <div style="margin-bottom: 1vh">
          申请成为司机
        </div>
        <div style="margin-bottom: 2vh">
          颜色:<input type="text" v-model="vehicle.color">
          车辆品牌:<input type="text" v-model="vehicle.brand">
          车牌号:<input type="text" v-model="vehicle.plate">
          <button class="button" style="width: 15vw;height: 5vh" @tap="uploading">上传</button>

<!--          <select v-model="vehicle.vehicleTypeId" >-->
<!--            <option value="">请选择车辆类型</option>-->
<!--            <option v-for="item in vehicleTypeList" :key="item.id" :value="item.id">{{item.type}}</option>-->
<!--          </select>-->
        </div>
        <button class="button" style="width: 15vw;height: 5vh" @click="applyDriver">提交</button>
      </view>
    </uni-popup>
  </div>
</template>

<script>
import httpReq from "../../../util/httpReq";
import urlObj from "../../../api/urlObj";

export default {
  data() {
    return {
      menuItems: [
        { text: '我的订单', iconClass: 'icon-order' ,src:"/static/订单.png"},
        { text: '我的优惠券', iconClass: 'icon-coupon' ,src:"/static/卡卷.png"},
        { text: '我的评价', iconClass: 'icon-review' ,src:"/static/.png"},
        { text: '我的历史', iconClass: 'icon-partner' ,src:"/static/.png"},
        { text: '申请成为司机', iconClass: 'icon-favorite' ,src:"/static/.png",click:"clickApplyDriver"},
      ],
      vehicle:{},
      vehicleTypeList:[],
      isName:false
    };
  },
  methods:{
    invoke(name){
      this[name]()
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
             this.vehicle.photo=JSON.parse(uploadFileRes.data).data;
            }
          })
        }
      })
    },
    clickApplyDriver(){
      if (!this.isName){
        uni.showToast({
          title: "请先进行实名认证",
          icon: 'none',
          duration: 2000,
        })
        return;
      }
      httpReq.get({
        url: urlObj.itinerary.getAllVehicleType,
        success: (res)=>{
          this.vehicleTypeList=res.data.data;
        }
      })
      console.log(this.vehicleTypeList)
      this.$refs.popup.open('center')
    },
    isRealName(){
      httpReq.get({
        url: urlObj.realnameInfo.isRealName,
        success: (res)=>{
          if (res.data.data!=null){
           this.isName=true;
          }
        }
      })
    },
    applyDriver(){
      httpReq.post({
        url:urlObj.user.applyForDriver,
        data:this.vehicle,
        success:(res)=>{
          if (res.data.data==false){
            uni.showToast({
              title: "您已提交申请,请耐心等待",
              icon: 'none',
              duration: 2000,
            })
          }
        }
      })
      this.$refs.popup.close();
      this.vehicle={}
    }
  },
  created() {
    this.isRealName();
  }
};
</script>

<style scoped>
.personal-center {
  background-color: #f0f0f0;
  padding-top: 20px;
}

.header {
  display: flex;
  align-items: center;
  background-color: #62d4b2;
  padding: 20px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.user-info {
  margin-left: 10px;
  color: white;
}

.user-info h2 {
  margin: 0;
}

.user-info p {
  margin: 0;
  font-size: 14px;
}

.menu {
  margin-top: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.menu-item i {
  font-size: 20px;
  margin-right: 10px;
}

.menu-item span {
  font-size: 16px;
}


.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

.popup-content {
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 80vw;
  height: 40vh;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: #fff;
}
input{
  border: 1px #c3ac8b solid;
  border-radius: 10px;
  width: 100%;
  height: 39px;
  box-sizing: border-box;
}
</style>
