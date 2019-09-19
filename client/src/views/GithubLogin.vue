// 引导重定向， 还有拿到code之后返回， 都是到这个页面上去

<template>
  <p>redirecting....</p>
</template>

<script>

import axios from 'axios'

export default {
  name: 'GithubLogin',
  computed: {},
  created() {
    const { path, query } = this.$route
    const { code, from } = query
    const clientID = process.env.VUE_APP_GITHUB_CLIENT_ID
    console.log(clientID)
    const scope = 'read:public_repo,read:user'
    // 没有code的话， 要引导用户去GitHub的页面进行登录和授权操作
    if (!code) {
      window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=${scope}`
    // 有code， 证明用户已经做了授权操作， 需要提交后端后端验证这个code的正确性
    } else {
      console.log(code)
      axios
        .get(process.env.VUE_APP_BACKEND + `/login/verify?code=${code}`)
        .then(response => {
          console.log(response)
        })
    }
  }
}

</script>