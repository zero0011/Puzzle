<template>
  <div class="talk">
    <div class="hello">
      <div class="login-wrap" v-if="!isCheckin">
        <div class="login-con">
          <h3>用户登录</h3>
          <input
            type="text"
            placeholder="请输入昵称"
            id="loginName"
            v-model.trim="uname"
            @keyup.13="login"
          />
          <button class="login-btn" @click="login">登录</button>
        </div>
      </div>

      <div class="chat-wrap" v-else>
        <div class="title"><span>游戏聊天室(总人数: {{amount}})</span></div>
        <div class="chat-con clearfix" id="chat_con">
          <div v-for="item in msgList" :key="item">
            <!-- {{item | json}} -->
            <div v-if="item.msgType==0">
              <p>{{item.message}}</p>
              <br />
            </div>

            <div v-else>
              <div class="chat-item item-right clearfix" v-if="uname == item.username">
                
                <span class="message fr">{{item.message}}</span>
              </div>
              <div class="chat-item item-left clearfix rela" v-else>
                <span class="abs uname">{{item.username}} ({{item.msgDate | formatData }})</span>
                <span class="fl message">{{item.message}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom" v-show="isCheckin">
          <input  id="sendtxt" v-model.trim="inputMsg" @keyup.13="sendMessage" placeholder="发送啥呢"/>
          <button class="sendBtn" @click="sendMessage">发送</button>
        </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "talk",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      isCheckin: false,
      uname: "", // 定义用户名
      amount: 0, // 聊天室总人数
      msgList: [], // 服务端返回的信息列表
      socket: null, // 定义 socket 实例
      inputMsg: "" // 发送的数据
    };
  },
  methods: {
    // 登录事件
    login() {
      var vm = this;

      if (vm.uname) {
        // 向服务端发送登录事件
        vm.socket.emit("login", { username: vm.uname });
      } else {
        alert("请输入昵称");
      }
    },
    // 发送消息
    sendMessage() {
      var vm = this;
      if (vm.inputMsg) {
        vm.socket.emit("sendMessage", {
          username: vm.uname,
          message: vm.inputMsg
        });
        vm.inputMsg = "";
      } else {
        alert("请输入...");
      }
    }
  },
  mounted() {
    var vm = this;
    // 建立 socket 连接 , 使用 webSocket 协议 , 端口号是服务器监听的端口号
    vm.socket = io("ws://localhost:8081");

    // 登录成功
    vm.socket.on("loginSuccess", function(data) {
      if (data.username === vm.uname) {
        vm.isCheckin = true;
      } else {
        alert("用户名不匹配,请重试");
      }
    });

    // 登录失败
    vm.socket.on("loginFail", function() {
      alert("昵称重复");
    });

    // 监听人数
    vm.socket.on("amountChange", function(data) {
      vm.amount = data;
    });

    // 接收消息
    vm.socket.on("receiveMessage", function(data) {
      console.log("接收到服务端返回:", data);
      vm.msgList.push(data);

      window.scrollTo(0, document.getElementById("chat_con").scrollHeight);
    });
  },
  // 这是 Vue过滤器
  filters: {
    formatDate: function(data) {
      var date = data ? new Date(data) : new Date();
      var time =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":" +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
      return time;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.talk {
  position: absolute;
  top: 25rem;
  left: 46%;
  transform: translate(-50%);
  width: 45rem;
  height: 300px;
  border: 1px solid whitesmoke;
}
.chat-wrap{
  height: 300px;
}
.title{
  font-weight: 600;
}
</style>
