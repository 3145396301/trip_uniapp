<template>
  <div class="chat-container">
    <div v-if="chats.length === 0" class="new-chat">
      <img src="logo.png" alt="Chat Logo" class="chat-logo"/>
      <div class="options">
        <button style="font-size: small"
                @click="directSendMessage('农历7月初7是七夕节，帮我规划和女朋友一天的游玩计划呗')">
          农历7月初7是七夕节，帮我规划和女朋友一天的游玩计划呗
        </button>
        <button @click="directSendMessage('帮单身狗规划七夕节出门游玩怎么避免被喂 ‘狗粮’')">单身狗七夕节出门怎么避免被喂 ‘狗粮’</button>
        <button >更多推荐...</button>
      </div>
    </div>
    <div v-else class="chat-history">
      <div v-for="(chat, index) in chats" :key="index" class="chat-item">
        <div class="user-message">{{ chat.user }}</div>
        <!--        <div class="gpt-response">{{ chat.gpt }}</div>-->
        <view class="gpt-message">
          <view class="gpt-left">
            <image src="/static/智能助理.png" class="assistantImg"></image>
          </view>
          <view class="gpt-right">
            <zero-markdown-view :markdown="chat.gpt" :themeColor=" '#545869' "></zero-markdown-view>
          </view>
        </view>


      </div>
    </div>
    <div class="input-bar">
      <input
          type="text"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="给“出行助手”发送消息"
      />
      <image src="/static/发送.png" @click="sendMessage" style="height: 44px;width: 44px"></image>
    </div>
  </div>
</template>

<script>
import httpReq from "@/util/httpReq";
import AiChat from "@/util/AiChat";
import HttpReq from "../../../util/httpReq";
import urlObj from "../../../api/urlObj";

export default {
  data() {
    return {
      chats: [], // 聊天记录
      newMessage: '', // 新消息的内容
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {

        let record = {
          user: this.newMessage,
          gpt: '', // 假定的回复，可以通过API替换
        }
        this.chats.push(record);
        AiChat(this.newMessage, (data) => {
          record.gpt = data.data;
        })
        this.newMessage = '';
      }
    },
    getHistoricalMessages(){
      HttpReq.get({
        url: urlObj.chat.getHistoricalMessages,
        success: (res) => {
          console.log(res.data)
          this.chats = res.data.data;
        }
      })
    },
    directSendMessage(text) {
      this.newMessage = text;
      this.sendMessage();
    },
  },
  created() {
    this.getHistoricalMessages();
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 100%;
  margin: 0 auto;
  background-color: #f1f1f1;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
}

.new-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  justify-content: center;
  background-color: #ffffff;
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
}

.chat-logo {
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
}

.options {
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  width: 100%;
  max-width: 250px;
  margin: 10px 0;
  padding: 12px;
  border: none;
  background-color: #e0e0e0;
  color: #333;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  background-color: #d5d5d5;
  transform: translateY(-1px);
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 0;
}

.chat-item {
  margin: 5px 0;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.user-message {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.gpt-response {
  margin-top: 5px;
  color: #555;
  font-size: 13px;
}

.input-bar {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #eaeaea;
  background-color: #ffffff;
}

input[type="text"] {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 10px;
  background-color: #fafafa;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus {
  border-color: #bbb;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

button {
  padding: 3px 5px;
  border: none;
  background-color: #e0e0e0;
  color: #333;
  cursor: pointer;
  border-radius: 30px;
  font-size: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s, transform 0.3s;

}

button:hover {
  background-color: #d5d5d5;
  transform: translateY(-1px);
}

.assistantImg {
  width: 30px;
  height: 30px;
  margin-right: 20px;
  border-radius: 5px;
  display: block;
  margin-top: 10px;
}
.gpt-message {
  width: 100%;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
  color: #555;
  font-size: 13px;
  font-weight: bold;
  background-color: #ebe5e5;
  border-radius: 10px;
}
.gpt-left {
  width: 10%;
  display: inline-block;
  box-sizing: border-box;
  /* 上对齐 */
  vertical-align: top;
}
.gpt-right {
  width: 90%;
  display: inline-block;
  box-sizing: border-box;
  /* 上对齐 */
  vertical-align: top;
}
</style>
