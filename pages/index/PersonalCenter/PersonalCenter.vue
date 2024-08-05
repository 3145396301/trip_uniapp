<template>
  <div class="personal-center">
    <div class="header">
      <img src="https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132" alt="User Avatar" class="avatar">
      <div class="user-info">
        <h2>十初</h2>
        <p>走一走， 看一看</p>
      </div>
    </div>
    <div class="menu">
      <div class="menu-item" v-for="item in menuItems" :key="item.text">
        <image :src="item.src" style="width: 30px;height: 30px"></image>
        <i :class="item.iconClass"></i>
        <span>{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { text: '我的订单', iconClass: 'icon-order' ,src:"/static/订单.png"},
        { text: '我的优惠券', iconClass: 'icon-coupon' ,src:"/static/卡卷.png"},
        { text: '我的评价', iconClass: 'icon-review' ,src:"/static/.png"},
        { text: '我的历史', iconClass: 'icon-partner' ,src:"/static/.png"},
      ],
    };
  },
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
</style>
