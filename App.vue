<script>
import userGeocoding from "./data/userGeocoding";
	export default {
		onLaunch: function() {
      uni.getLocation({
        type: 'gcj02',
        success: function (res) {
          userGeocoding.latitude = res.latitude;
          userGeocoding.longitude = res.longitude;
          console.log('加载地理位置成功')
        }
      });
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
  page {
    font-family: "Microsoft YaHei UI Light";
  }
</style>
