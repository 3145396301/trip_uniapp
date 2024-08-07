<template>
  <view class="container">
    <view class="order-info">
      <text class="title">订单信息</text>
      <view class="item">
        <text class="label">订单号：</text>
        <text class="value">{{orderNumber}}</text>
      </view>
      <view class="item">
        <text class="label">创建时间：</text>
        <text class="value">{{createTime}}</text>
      </view>
      <view class="item">
        <text class="label">车费：</text>
        <text class="value">￥{{fee}}</text>
      </view>
        <!-- 其他内容 -->
        <view @tap="goToCouponPage">
          <text style="margin-left: 246px">点击选择优惠卷  ></text>
        </view>
      <view class="item" v-if="couponValue!=0">
        <text class="label" >优惠券抵扣：</text>
        <text class="value">-￥{{couponValue}}</text>
      </view>
      <view class="total">实付金额：￥{{total}}</view>
    </view>
    <button class="confirm-btn" @click="confirmOrder">确认订单</button>
  </view>
</template>
<script>
import httpReq from "../../../../util/httpReq";
import urlObj from "../../../../api/urlObj";

export default {
  data() {
    return {
      orderNumber:"",
      createTime: "",
      fee: 0,
      couponValue: 0,
      total:0,
      orderId:null,
      couponId:null
    };
  },
  methods: {
    confirmOrder() {
      httpReq.post({
        url: urlObj.order.paymentOrders,
        data:{
          orderId:this.orderId,
          couponId:this.couponId
        },
        success: (res)=>{
          uni.showToast({
            title: "支付成功",
            icon: "success"
          });
          uni.navigateTo({
            url: "/pages/index/MyOrder/MyOrder"
          })
        }
      })
    },
    goToCouponPage(){
      uni.navigateTo({
        url: `/pages/index/PaymentCoupon/PaymentCoupon?orderNumber=${this.orderNumber}&createTime=${this.createTime}&orderId=${this.orderId}&couponId=${this.couponId}&fee=${this.fee}&couponValue=0` // 替换为你的优惠卷页面路径
      });
    },

  },
  onLoad(option){
    this.orderNumber=option.orderNumber;
    this.createTime=option.createTime;
    this.fee=option.fee;
    this.total=option.total;
    this.orderId=option.orderId;
    this.couponId=option.couponId
    this.couponValue=option.couponValue;
  },

};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.order-info, .payment-info {
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.label {
  font-size: 16px;
}
.value {
  font-size: 16px;
  color: #333;
}
.total {
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  margin-top: 20px;
}
.confirm-btn {
  width: 100%;
  background-color: #409eff;
  color: #fff;
  font-size: 18px;
  border-radius: 5px;
  padding: 10px;
}

</style>
