<template>
  <div class="transaction-list">
    <div class="transaction-item" v-for="(item, index) in transactions" :key="index">
      <div class="transaction-header" @click="toggleDetails(index)">
        <div class="transaction-info">
          <span class="date-time">创建时间：{{ item.createTime }}</span>
          <span class="reason">原因： {{ item.reason }}</span>
          <span class="status-noPay" v-if="item.status == 0">状态： 未支付</span>
          <span class="status-pay" v-if="item.status == 1">状态： 已支付</span>
          <span class="status-refund" v-if="item.status == 2">状态： 已退款</span>
          <span class="status-cancel" v-if="item.status == 3">状态： 已取消</span>
          <span class="order-number">订单号: {{ item.orderNumber }}</span>
        </div>
        <div class="arrow-icon" :class="{ expanded: item.expanded }">
          <image style="width: 32px;height: 25px;" src="/static/向下箭头.png" alt="arrow-icon"/>
        </div>
      </div>
      <transition name="fade">
        <div class="transaction-details" v-if="item.expanded">
          <div class="detail-item">
            <span>原始金额</span><span>{{ item.initialCost }} 元</span>
          </div>
          <div class="detail-item" v-if="item.status == 1||item.status == 2">
            <span>优惠金额</span><span>{{ item.discountAmount }} 元</span>
          </div>
          <div class="detail-item" v-if="item.status == 1||item.status == 2">
            <span>实付金额</span><span>{{ item.actualCost }} 元</span>
          </div>
          <div class="detail-item" v-if="item.status == 1||item.status == 2">
            <span>支付时间</span><span>{{ item.paymentTime }}</span>
          </div>
          <div class="detail-item" v-if="item.status == 2">
            <span>退款时间</span><span>{{ item.refundTime }}</span>
          </div>
          <div>
            <button class="pay-button" v-if="item.status == 0">支付</button>
            <button class="pay-button" v-if="item.status == 0 && item.reason != '行程'">取消</button>
            <button class="pay-button" v-if="item.status == 0 && item.reason == '行程'" disabled>取消</button>
            <button class="refund-button" v-if="item.status == 1">退款</button>
          </div>

        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import httpReq from "../../../util/httpReq";
import urlObj from "../../../api/urlObj";

export default {
  data() {
    return {
      transactions: [
        // {
        //   orderNumber: "1430273106164103",
        //   initialCost: 5000.00,
        //   actualCost: 5000.00,
        //   discountAmount: 0.00,
        //   status: 0, // 订单状态 0:未支付 1:已支付 2:已退款 3:已取消
        //   createTime: "2018-04-29",
        //   paymentTime: "2018-04-29 10:06:02",
        //   refundTime: "2018-04-29 10:06:02",
        //   reason: "行程",
        //   expanded: false
        // },
        // {
        //   orderNumber: "1430273106164103",
        //   initialCost: 5000.00,
        //   actualCost: 5000.00,
        //   discountAmount: 0.00,
        //   status: 0, // 订单状态 0:未支付 1:已支付 2:已退款 3:已取消
        //   createTime: "2018-04-29",
        //   paymentTime: "2018-04-29 10:06:02",
        //   refundTime: "",
        //   reason: "购买优惠券",
        //   expanded: false
        // },
        // {
        //   orderNumber: "1430273106164103",
        //   initialCost: 5000.00,
        //   actualCost: 5000.00,
        //   discountAmount: 0.00,
        //   status: 1, // 订单状态 0:未支付 1:已支付 2:已退款 3:已取消
        //   createTime: "2018-04-29",
        //   paymentTime: "2018-04-29 10:06:02",
        //   refundTime: "",
        //   reason: "行程",
        //   expanded: false
        // },
        // {
        //   orderNumber: "1430273106164103",
        //   initialCost: 5000.00,
        //   actualCost: 5000.00,
        //   discountAmount: 0.00,
        //   status: 2, // 订单状态 0:未支付 1:已支付 2:已退款 3:已取消
        //   createTime: "2018-04-29",
        //   paymentTime: "2018-04-29 10:06:02",
        //   refundTime: "",
        //   reason: "行程",
        //   expanded: false
        // },
        // {
        //   orderNumber: "1430273106164103",
        //   initialCost: 5000.00,
        //   actualCost: 5000.00,
        //   discountAmount: 0.00,
        //   status: 3, // 订单状态 0:未支付 1:已支付 2:已退款 3:已取消
        //   createTime: "2018-04-29",
        //   paymentTime: "2018-04-29 10:06:02",
        //   refundTime: "",
        //   reason: "行程",
        //   expanded: false
        // },
        // 可以添加更多的交易记录
      ]
    };
  },
  methods: {
    toggleDetails(index) {
      this.transactions[index].expanded = !this.transactions[index].expanded;
    },
    loadMyOrder(){
      httpReq.post({
        url: urlObj.order.loadMyOrder,
        data:{
        },
        success: (res)=>{
          console.log(res.data)
          let data=res.data.data;
          for(let i=0;i<data.length;i++){
            data[i].expanded=false;
          }
          this.transactions=data;
        }
      })
    },
  },
  created() {
    console.log('MyItinerary created')
    this.loadMyOrder();
  },
};
</script>

<style scoped>
.transaction-list {
  width: 100%;
  background-color: #f0f2f5; /* 列表背景色 */
  padding: 10px;
}

.transaction-item {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  position: relative;
  outline: none; /* 移除聚焦时的默认外边框 */
  user-select: none; /* 禁止用户选择文本 */
  -webkit-tap-highlight-color: transparent; /* 移除点击时的蓝色高亮效果 */
}


.transaction-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background-color: #409eff; /* 左侧颜色条 */
  border-radius: 8px 0 0 8px;
}

.transaction-item:hover {
  //box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction-info {
  display: flex;
  flex-direction: column;
}

.date-time, .status, .order-number {
  margin-bottom: 4px;
  color: #333;
  font-size: 14px;
}

.status-noPay {
  color: #f56c6c;
  font-weight: bold;
}
.status-pay {
  color: #67c23a;
  font-weight: bold;
}
.status-refund {
  color: #e6a23c;
  font-weight: bold;
}
.status-cancel {
  color: #909399;
  font-weight: bold;
}

.reason {
  color: #402ce4;
  font-weight: bold; /* 状态文本加粗 */
}

.order-number {
  color: #909399;
}

.arrow-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.arrow-icon.expanded {
  transform: rotate(180deg);
}

.transaction-details {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
  color: #606266;
}

.detail-item span:last-child {
  color: #409eff; /* 右侧金额文本颜色 */
}

.pay-button, .refund-button {
  padding: 10px 20px;
  border: none;
  background-color: #409eff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  width: 20%;
  height: 6vh;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  line-height: 3vh;
  display: inline-block;
  margin: 10px;
}
</style>
