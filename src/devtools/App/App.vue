<template>
    <div class="main_app">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="font-size: 16px;">Aps Dev Tools 前端开发者工具</span>
                <el-button style="float: right; padding: 3px 0" type="text"
                    >配置</el-button
                >
            </div>
            <el-form  label-width="80px" :model="formData">
                <el-form-item label="强制开启vue插件">
                    <el-switch v-model="formData.openVueDevTool"></el-switch>
                </el-form-item>
                <el-form-item label="在线脚本调试增强">
                    <el-switch v-model="formData.jsDebug"></el-switch>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "app",
    data() {
        return {
            formData: {
                openVueDevTool: true,
                jsDebug: true
            }
        };
    }
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
  }

  .box-card {
    width: 280px;
  }
</style>
