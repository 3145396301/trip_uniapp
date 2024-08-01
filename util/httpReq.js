const httpReq = {
    request(config){
        const token = uni.getStorageSync('satoken');
        if (token!=null||token!="") {
            if (config.headers==null){
                config.headers = {
                    "satoken": token
                }
            }else {
                config.headers["satoken"] = token;
            }
        }
        uni.request({
            url: config.url,
            method: config.method,
            data: config.data,
            header: config.headers,
            success: config.success,
            fail: config.fail,
            complete: config.complete
        })
    },
    get(config){
        config.method = "GET";
        this.request(config);
    },
    post(config){
        config.method = "POST";
        this.request(config);
    },
    put(config){
        config.method = "PUT";
        this.request(config);
    },
    delete(config){
        config.method = "DELETE";
        this.request(config);
    },
    patch(config){
        config.method = "PATCH";
        this.request(config);
    }
}
export default httpReq