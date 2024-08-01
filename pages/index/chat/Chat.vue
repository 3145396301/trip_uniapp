<template>
  <div class="chat-wrapper">
    <view class="chat-container" id="chatContainer">
      <div class="message" v-for="(message, index) in messages" :key="index" :class="{ 'mine': message.role == myRole }">
        <img width="40px" height="40px" :src="systemAvatar" alt="avatar" class="avatar" v-if="message.role == 0"/>
        <img width="40px" height="40px" :src="myRole!=1? UserAvatar : driverAvatar" alt="avatar" class="avatar"
             v-if="message.role != myRole && message.role!=0"/>
        <div class="content">{{ message.content }}</div>
        <img width="40px" height="40px" :src="myRole==1? UserAvatar : driverAvatar" alt="avatar" class="avatar"
             v-if="message.role == myRole"/>
      </div>
    </view>
    <div class="input-container">
      <input v-model="newMessage" type="content" class="input-box" placeholder="输入消息..." @keyup.enter="sendMessage"/>
<!--      <button class="send-button" @click="sendMessage">发送</button>-->
      <image src="../../../static/发送.png" class="send-button" style="width: 44px;height: 44px" @click="sendMessage"></image>
    </div>
  </div>
</template>

<script>
import urlObj from "../../../api/urlObj";
import httpReq from "../../../util/httpReq";
import userInfo from "../../../data/userInfo";
export default {
  data() {
    return {
      messages: [
        // { role: 1, content: "兄弟，有件事我跟你说了你肯定不会相信的", timestamp: "2023-05-01 12:34:56" },
        // { role: 2, content: "啥子事说嘛？看能不能刺激一下哥哥879546456", timestamp: "2023-05-01 12:34:56" },
        // {role: 1, content: "兄弟，有件事我跟你说了你肯定不会相信的", timestamp: "2023-05-01 12:34:56"},
        // {role: 2, content: "啥子事说嘛？看能不能刺激一下哥哥879546456", timestamp: "2023-05-01 12:34:56"},
        // {role: 0, content: "我德玛拿了五杀", timestamp: "2023-05-01 12:34:56"},
        // {role: 1, content: "我信你个锤子，你这水平能拿三杀就了不起了", timestamp: "2023-05-01 12:34:56"},
        // {role: 2, content: "我骗你是龟孙，不信你问炮眼", timestamp: "2023-05-01 12:34:56"},
        // {role: 1, content: "卧槽，你跟炮眼一起开黑都不叫我？晚上吉祥网吧集合OK？", timestamp: "2023-05-01 12:34:56"},
        // {role: 0, content: "我德玛拿了五杀", timestamp: "2023-05-01 12:34:56"},
        // {role: 2, content: "啥子事说嘛？看能不能刺激一下哥哥879546456", timestamp: "2023-05-01 12:34:56"},
        // {role: 1, content: "我信你个锤子，你这水平能拿三杀就了不起了", timestamp: "2023-05-01 12:34:56"},
        // {role: 2, content: "我骗你是龟孙，不信你问炮眼", timestamp: "2023-05-01 12:34:56"},
        // {role: 1, content: "卧槽，你跟炮眼一起开黑都不叫我？晚上吉祥网吧集合OK？", timestamp: "2023-05-01 12:34:56"},
        // {role: 0, content: "我德玛拿了五杀", timestamp: "2023-05-01 12:34:56"},
        // {role: 2, content: "啥子事说嘛？看能不能刺激一下哥哥879546456", timestamp: "2023-05-01 12:34:56"},
        // {role: 1, content: "1111111", timestamp: "2023-05-01 12:34:56"},
        // {role: 1, content: "1111111", timestamp: "2023-05-01 12:34:56"},
      ],
      UserAvatar: "https://img2.baidu.com/it/u=2030229325,1755148256&fm=253&fmt=auto&app=138&f=JPEG?w=48&h=48",
      driverAvatar: "https://p3-pc.douyinpic.com/img/313b80007c969f2c42466~c5_300x300.jpeg?from=2956013662",
      systemAvatar: "https://img0.baidu.com/it/u=1585687486,1989825426&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
      myRole: 1,
      newMessage: '', // 新消息内容
      iteraryId: null,
    };
  },
  onLoad(data){
    console.log("Chat onLoad",data)
    this.iteraryId = data.iteraryId;
    this.loadTravelChatRecords();
    uni.$on("receivedChatMessage",this.receivedChatMessageEventCallback)
  },
  onHide(){
    console.log("chat 隐藏")
  },
  onUnload() {
    console.log("chat 卸载")
    uni.$off("receivedChatMessage",this.receivedChatMessageEventCallback);
  },
  mounted() {
    console.log("Chat mounted")
  },
  methods: {
    scrollToBottom() {
    },
    sendMessage() {
      if (this.newMessage.trim() === '') return;
      userInfo.sendMsg(1,{
        itineraryId: this.iteraryId,
        content: this.newMessage,
      })
      // 添加新消息到 messages 数组
      this.messages.push({
        role: this.myRole,
        content: this.newMessage,
        timestamp: new Date().toLocaleString(),
      });
      // 清空输入框
      this.newMessage = '';
      // 滚动到底部
      this.$nextTick(this.scrollToBottom);
    },
    loadTravelChatRecords(){
      httpReq.get({
        url: urlObj.itinerary.tripHistory+this.iteraryId,
        success: (res)=>{
          console.log(res.data)
          this.messages=res.data.data.records
          this.myRole=res.data.data.myRole
        }
      })
    },
    receivedChatMessageEventCallback(data){
        if (data.itineraryId!=this.iteraryId){
          uni.showToast({
            title: `行程${data.itineraryId}的聊天记录已更新`,
            icon: 'none',
            duration: 2000
          })
        }else {
          this.messages.push({
                role: data.role,
                content: data.msg,
                timestamp: new Date().toLocaleString(),
              }
          );
        }
    }
  },
};
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 400px;
  margin: 0 auto;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.input-container {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #fff;
}

.input-box {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 14px;
}

.send-button {
  padding: 0 6px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.send-button:hover {
  background-color: #0056b3;
}

.message {
  display: flex;
  align-items: flex-start;
  margin: 10px 0;
}

.message.mine {
  justify-content: flex-end;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.message.mine .avatar {
  margin-left: 10px;
  margin-right: 0;
}

.content {
  max-width: 70%;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message.mine .content {
  background-color: #007bff;
  color: #ffffff;
}
</style>

