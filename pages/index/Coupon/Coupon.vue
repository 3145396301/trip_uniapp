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
      <button class="coupon-button">剩余：{{coupon.num}}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      types: [
        {
          "id": 1,          // 优惠券id
          "type": 1,        // 1表示满减券，2表示折扣券
          "name": "优惠卷1", // 优惠券名称
          "rule": 15,       // 优惠券门槛
          "favorable": 3    // 优惠券优惠 type=1时，favorable表示优惠金额；type=2时，favorable表示折扣率 3折
        },
        {
          "id": 2,
          "type": 1,
          "name": "优惠卷2",
          "rule": 25,
          "favorable": 5
        },
        {
          "id": 3,
          "type": 2,
          "name": "优惠卷3",
          "rule": 30,
          "favorable": 9
        },
        {
          "id": 4,
          "type": 2,
          "name": "优惠卷4",
          "rule": 50,
          "favorable": 8
        },
        {
          "id": 5,
          "type": 1,
          "name": "优惠卷5",
          "rule": 100,
          "favorable": 80
        },
        {
          "id": 6,
          "type": 1,
          "name": "优惠卷4",
          "rule": 40,
          "favorable": 12
        }
      ],
      nums:[
        {
          type:1,
          num:5
        },
        {
          type: 2,
          num: 5
        }
      ],
      coupons: [    //由types和nums计算得出
        {
          id: 1,
          type: 1,
          name: "优惠卷1",
          rule: 15,
          favorable: 3,
          num: 1
        },
        {
          id: 2,
          type: 1,
          name: "优惠卷2",
          rule: 25,
          favorable: 5,
          num: 5
        },
        {
          id: 3,
          type: 2,
          name: "优惠卷3",
          rule: 30,
          favorable: 9,
          num: 2
        },
        {
          id: 4,
          type: 2,
          name: "优惠卷4",
          rule: 50,
          favorable: 8,
          num: 3
        },
      ],
    };
  },
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
