<template>
    <div class="main_app">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="font-size: 16px;">Aps Dev Tools 前端开发者工具</span>
                <el-button style="float: right; padding: 3px 0" type="text"
                    >更多配置</el-button
                >
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{ "列表内容 " + o }}
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "app",
};
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
