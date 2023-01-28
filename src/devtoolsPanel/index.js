console.log("apsdevpanel的消息：")
import Vue from "vue";
import AppComponent from "./App/App.vue";

Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
debugger
// Chrome DevTools Extension中不能使用console.log
const log = (...args) => chrome.devtools.inspectedWindow.eval(`
    console.log(...${JSON.stringify(args)});
`);

// 注册回调，每一个http请求响应后，都触发该回调
chrome.devtools.network.onRequestFinished.addListener(async (...args) => {
    try {
        const [{
            // 请求的类型，查询参数，以及url
            request: { method, queryString, url },

            // 该方法可用于获取响应体
            getContent,
        }] = args;

        log(method, queryString, url);

        // 将callback转为await promise
        // warn: content在getContent回调函数中，而不是getContent的返回值
        const content = await new Promise((res, rej) => getContent(res));
        log(content);
    } catch (err) {
        log(err.stack || err.toString());
    }
});