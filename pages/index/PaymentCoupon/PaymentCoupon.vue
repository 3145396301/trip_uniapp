<template>
  <div class="coupon-list">
    <div v-for="(coupon, index) in coupons" :key="index" class="coupon">
      <div class="coupon-value" v-if="coupon.type==1">￥{{ coupon.favorable }}</div>
      <div class="coupon-value" v-if="coupon.type==2">{{ coupon.favorable }} 折</div>
      <div class="coupon-details">
        <div v-if="coupon.type==1">满{{ coupon.rule }}减{{ coupon.favorable }}</div>
        <div v-if="coupon.type==2">满{{ coupon.rule }}打{{ coupon.favorable }}折</div>
        <div>到期 2024-12-11 12:00:00</div>
      </div>
      <button class="coupon-button" @click="decreaseCoupon(coupon.couponId)">使用</button>
    </div>
  </div>
</template>

<script>
import httpReq from "../../../util/httpReq";
import urlObj from "../../../api/urlObj";

export default {
  data() {
    return {
      coupons: [],
      fee:null,
      orderNumber:"",
      createTime: "",
      orderId:null,
      couponValue:0,
      total:0
    };
  },
  methods:{
    findUserUsableCoupon(){
      httpReq.post({
        url:urlObj.user.findUserUsableCoupon,
        data:{
          totalAmount:this.fee
        },
        success:(res)=>{
          this.coupons=res.data.data;
        }
      })
    },
    decreaseCoupon(id){
        httpReq.post({
          url:urlObj.order.computeActualCost,
          data:{
            totalAmount:this.fee,
            couponId:id
          },
          success:(res)=>{
            var data = res.data.data;
            this.total=data
            this.couponValue=this.fee-data;
            uni.navigateTo({
              url:`/pages/index/MyOrder/Payment/PaymentOrder?orderNumber=${this.orderNumber}&createTime=${this.createTime}&fee=${this.fee}&orderId=${this.orderId}&couponId=${id}&total=${this.total}&couponValue=${this.couponValue}` // 替换为你的优惠卷页面路径
            });
          }
        })

    },
  },
  onLoad(option){
    this.orderNumber=option.orderNumber;
    this.createTime=option.createTime;
    this.fee=option.fee;
    this.orderId=option.orderId;
    this.findUserUsableCoupon();
  }

};
</script>

<style scoped>
.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.coupon {
  display: flex;
  align-items: center;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  padding: 10px;
  background-color: #fff;
}

.coupon-value {
  font-size: 24px;
  color: #ff4242;
  margin-right: 10px;
}

.coupon-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.coupon-button {
  background-color: #ff4242;
  color: #fff;
  border: none;
  padding: 0px 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: small;
}
</style>
