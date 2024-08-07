<template>
  <div>
    <!--    <LoginPage v-if="!login" @login="login=true"></LoginPage>-->
    <!--    <MainMenu v-if="login"></MainMenu>-->
  </div>
</template>

<script>
import LoginPage from "./login/loginPage.vue";
import MainMenu from "./mainMenu/mainMenu.vue";
import userGeocoding from '../../data/userGeocoding'
import SystemInfo from "../../data/systemInfo";

uni.getSystemInfo({
  success: function (res) {
    SystemInfo.windowWidth = res.windowWidth;
    SystemInfo.windowHeight = res.windowHeight;
    SystemInfo.pixelRatio = res.pixelRatio;
    SystemInfo.language = res.language;
    SystemInfo.version = res.version;
    SystemInfo.platform = res.platform;
    SystemInfo.SDKVersion = res.SDKVersion;
    SystemInfo.benchmarkLevel = res.benchmarkLevel;
    SystemInfo.fontSizeSetting =res.fontSizeSetting;
  }
})
export default {
  components: {MainMenu, LoginPage},
  data() {
    return {

    };
  },
  onLoad() {
    uni.navigateTo({
      url: "login/loginPage"
    })
    // uni.navigateTo({
    //   url: "/pages/index/chatAi/chatAi"
    // })
  },
  methods: {
  }
};
</script>

<style>


</style>
