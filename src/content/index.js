import {
    Notification
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

// 经过Chrome插件的API加载字体文件
(function insertElementIcons() {
    // 注入自定义JS
	injectCustomJs();
    let elementIcons = document.createElement('style')
    elementIcons.type = 'text/css';
    elementIcons.textContent = ` @font-face { font-family: "element-icons"; src: url('${ window.chrome.runtime.getURL("fonts/element-icons.woff")}') format('woff'), url('${ window.chrome.runtime.getURL("fonts/element-icons.ttf ")}') format('truetype'); /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/ } `
    document.head.appendChild(elementIcons);
})();
// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script'); 
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.runtime.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}
