<template>
    <div class="main_app">
        <h1>dev面板：{{ msg }}</h1>
        <h2>测试前提：已同时安装Vue.js devtools扩展和apsdevtools扩展 </h2>
        <h2>访问vue2开发的网站，示例网站例如：http://yxy.aisino.com</h2>
        <h2>当apsdevtools不启用时，f12控制台面板不显示vue页签，当启用apsdevtools扩展后重新打开控制台面板就会发现vue页签已经可以使用</h2>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            msg: 'apsdevtools扩展为vue.js devtools扩展的辅助版本，测试使用前请先安装Vue.js devtools扩展'
        }
    },
    mounted() {
        debugger
        console.log('面板mounted')
    }
}
</script>

<style>
.main_app {
}
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
