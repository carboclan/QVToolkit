<template>
  <p>redirecting....</p>
</template>

<script>
import axios from "axios";

export default {
  name: "TwitterLogin",
  computed: {},
  created() {
    const { query } = this.$route;
    const { code } = query;
    const clientID = process.env.VUE_APP_GITHUB_CLIENT_ID;
    console.log(clientID);
    const scope = "read:public_repo,read:user";
    // const oauth_token = 
    // 没有code的话， 要引导用户去GitHub的页面进行登录和授权操作
    if (!code) {
      window.location = `https://api.twitter.com/oauth/authenticate?oauth_token=2ZDewQAAAAAAjSynAAABbWj8Yr8#`;
      // 有code， 证明用户已经做了授权操作， 需要提交后端后端验证这个code的正确性
    } else {
      console.log(code);
      let target = process.env.VUE_APP_BACKEND + `/login/verify?code=${code}`;
      console.log(target);
      axios.get(target).then(response => {
        console.log(response);
        this.$router.push({ name: "about" });
        return;
      });
    }
  }
};
</script>
