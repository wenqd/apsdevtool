window.ApsDevTools = { // 开发者工具全局配置
    onlineJs: {
        debug: true// 是否开启在线脚本调试
    }
}
// 强制开启vue开发者工具
function openVueTool() {
    // 在方法中执行，避免污染全局变量
    // 开启vue2 production调试的方法
    // 1.找vue实例，可以说99%的应用是用的app.__vue__
    // 如果实在找不到,那么就到找到任意组件，用组件元素.__vue__.$root来获取
    var vue = app.__vue__

    // 2.vue构造函数
    var constructor = vue.__proto__.constructor

    // 3.Vue有多级，要找到最顶级的
    var Vue = constructor
    while (Vue.super) {
        Vue = Vue.super
    }
    console.log(Vue)

    // 4.找到config，并且把devtools设置成true
    Vue.config.devtools = true

    // 5.注册到Vue DevTool上
    var hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__
    hook.emit('init', Vue)

    // 6.如果有vuex store，也注册//这部分代码参考了https://blog.csdn.net/weixin_34352449/article/details/91466542
    if (vue.$store) {
        var store = vue.$store
        store._devtoolHook = hook
        hook.emit('vuex:init', store)
        hook.on('vuex:travel-to-state', function(targetState) {
            store.replaceState(targetState)
        })
        store.subscribe(function(mutation, state) {
            hook.emit('vuex:mutation', mutation, state)
        })
    }
}
openVueTool()
