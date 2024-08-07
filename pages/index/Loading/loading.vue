<template>
  <view class="loader-cover">
    <div :class="'loader'">

    </div>
  </view>
</template>

<script>
export default {
  name: "loading",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.loader-cover{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  z-index: 999;
}
/* HTML: <div class="loader"></div> */
.loader {
  width: 120px;
  height: 22px;
  border-radius: 40px;
  color: #514b82;
  border: 2px solid;
  /*  居中 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loader::before {
  content: "";
  position: absolute;
  margin: 2px;
  width: 25%;
  top: 0;
  bottom: 0;
  left: 0;
  border-radius: inherit;
  background: currentColor;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
  50% {left:100%;transform: translateX(calc(-100% - 4px))}
}
</style>