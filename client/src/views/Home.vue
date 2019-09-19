<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <button class="btn-base bg-purple" @click="walletLogin('GitHub')">
      <span>Github 登录</span>
    </button>
    <button class="btn-base bg-purple" @click="walletLogin('Twitter')">
      <span>Twitter 登录</span>
    </button>
    <button class="btn-base bg-purple" @click="walletLogin('Metamask')">
      <span>Metamask 登录</span>
    </button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld
  }
};
</script>
