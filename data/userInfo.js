import urlObj from "../api/urlObj";

const userInfo = {
    isLogin: false,
    id: null,
    nickname: null,
    avatar: null,
    credentials: null,
    sendData:{
        data: null,
    },
    wsConnect: null,
    startConnect:()=>{
        console.log('开始连接')
        // 建立webSocket连接
        const ws=uni.connectSocket({
            url: urlObj.onLine.onlineVerification,
            success: (res) => {
                console.log('连接成功')
            },
            fail: (err) => {
                console.log('连接失败')
            }
        })
        ws.onMessage((msg)=>{
            console.log('收到消息',msg)
            let data = JSON.parse(msg.data)
            if(data.type==1){   //通知消息
                uni.showToast({
                    title: data.msg,
                    icon: 'none',
                    duration: 2000
                })
                uni.vibrateLong({
                    success: function () {
                        console.log('震动成功');
                    },
                    fail: function () {
                        console.log('震动失败');
                    }
                })
            }else if (data.type==2){ //聊天消息
                uni.$emit("receivedChatMessage",data)
            }

        })
        ws.onOpen(
            () => {
                console.log('连接打开成功')
                ws.send({
                    data: userInfo.credentials
                })
            }
        )
        ws.onClose(
            (reason) => {
                console.log('连接关闭 原因',reason)
                // 路由到登录页
                uni.navigateTo({
                    url: "/pages/index/login/loginPage"
                })
            }
        )
        userInfo.wsConnect = ws;
    },
    sendMsg: (type,msg) => {
        let data = {
            type: type,
            msg: JSON.stringify(msg)
        };
        let dataJSON = JSON.stringify(data);
        userInfo.wsConnect.send({
            data:dataJSON
        })
    },



}
export default userInfo