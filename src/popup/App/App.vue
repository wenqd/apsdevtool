<template>
    <div class="main_app">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="font-size: 16px"
                    >Aps Dev Tools 前端开发者工具</span
                >
                <el-button style="float: right; padding: 3px 0" type="text"
                    >更多配置</el-button
                >
            </div>
            <div v-if="false">
                <el-form
                    :inline="true"
                    :model="toolConf"
                    class="demo-form-inline"
                >
                    <el-form-item label="强制打开vue开发者面板">
                        <el-switch v-model="toolConf.openvuedevtool"></el-switch>
                    </el-form-item>
                    <el-form-item label="调试APS平台在线脚本">
                        <el-switch v-model="toolConf.apsonlinejs"></el-switch>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "App",
    data(){
        return {
            toolConf:{//工具配置信息
                openvuedevtool:false,//强制打开vue开发者面板
                apsonlinejs:true//调试APS平台在线脚本
            }
        }
    },
    watch:{
        toolConf:{
            handler(newval){
                chrome.storage.local.set({apsdevtool_conf: JSON.stringify(this.toolConf)}, function() {
                    console.log('Value is set to ' + newval);
                });
                chrome.storage.local.get(['apsdevtool_conf'], function(result) {
                    console.log('Value currently is 12' + result.apsdevtool_conf);
                });
            },
            deep:true
        }
    },
    mounted(){
        let v_this = this
        chrome.storage.local.get(['apsdevtool_conf'], function(result) {
            if(result.apsdevtool_conf){
                v_this.toolConf = JSON.parse(result.apsdevtool_conf)
                console.log('已从storage里取到历史配置数据：' + result.apsdevtool_conf);
            }
        });

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
    clear: both;
}

.box-card {
    width: 480px;
}
</style>
