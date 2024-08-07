import urlObj from "@/api/urlObj";

let AiChat=(msg,callback,closeCallback)=>{
    const ws=uni.connectSocket({
        url: urlObj.ai.aiChat,
        success: (res) => {
            console.log('ai连接成功')
        },
        fail: (err) => {
            console.log('ai连接失败')
        }
    })
    ws.onMessage((msg)=>{
        callback(msg)
    })
    ws.onOpen(
        () => {
            console.log('ai连接打开成功')
            ws.send({
                data: uni.getStorageSync('satoken')+','+msg,
            })
        }
    )
    ws.onClose(
        (reason) => {
            console.log('ai连接关闭 原因',reason)
            closeCallback(reason)
        }
    )
}
export default AiChat