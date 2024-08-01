import httpReq from "../util/httpReq";
import urlObj from "../api/urlObj";

const userGeocoding = {
    isInit: false,
    latitude: 0, // 纬度
    longitude: 0, // 经度
    speed: 0,
    locationStr: "",
    startUpdateCoordinates() {
        uni.getLocation({     // 初始化位置信息
            type: "gcj02",
            isHighAccuracy: true,
            highAccuracyExpireTime: 10000,
            success(res) {
                userGeocoding.latitude = res.latitude;
                userGeocoding.longitude = res.longitude;
                userGeocoding.speed = res.speed;
                userGeocoding.isInit = true;
                updateCorrd(userGeocoding.longitude, userGeocoding.latitude);
                uni.startLocationUpdate({           // 开启位置更新
                    type: "gcj02", success: () => {
                        uni.onLocationChange(       // 监听位置变化
                            (res) => {
                                if (userGeocoding.latitude !== res.latitude || userGeocoding.longitude !== res.longitude) {
                                    console.log("经纬度发生变化");
                                    console.log(`原始经纬度：${userGeocoding.latitude},${userGeocoding.longitude}--当前经纬度：${res.latitude},${res.longitude}`)
                                    userGeocoding.latitude = res.latitude;
                                    userGeocoding.longitude = res.longitude;
                                    userGeocoding.speed = res.speed;
                                    updateCorrd(userGeocoding.longitude, userGeocoding.latitude);
                                }
                            }
                        )
                    }
                })

            }
        })

    }
}
let updateCorrd = (longitude,latitude)=>{
    httpReq.get({
        url: urlObj.user.updateCoordinates + '?coordinates=' +longitude + ',' + latitude,
        success: (res) => {
            console.log(res)
            userGeocoding.locationStr = res.data.data;
        },
    })
}
export default userGeocoding;
