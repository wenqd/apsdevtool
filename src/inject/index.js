/* eslint-disable */
// 强制开启vue开发者工具
function openVueTool() {

    var main = (main_main);


    const _global = typeof unsafeWindow === 'object' && unsafeWindow || globalThis;

    const _devtoolHook = _global.__VUE_DEVTOOLS_GLOBAL_HOOK__;

    function main_main() {
        if (!_devtoolHook) {
            console.warn('No Vue Devtools hook found', _global.location);
            return;
        }

        observeVueRoot(function (app, disconnect) {
            emitDevtoolVue2Hooks(app);
        }, function (app, disconnect) {
            emitDevtoolVue3Hooks(app);
        });
    }

    function emitDevtoolVue2Hooks(app) {
        let Vue = app.constructor;
        const store = app.$store;

        while (Vue.super) {
            Vue = Vue.super;
        }

        Vue.config.devtools = true;
        console.info('enabling devtools for Vue instance', app);

        _devtoolHook.emit('init', Vue);

        if (store) {
            console.info('enabling devtools for Vuex instance', store);
            devtoolStorePlugin(store, _devtoolHook);
        }
    }

    function emitDevtoolVue3Hooks(app) {
        if (!Array.isArray(_devtoolHook.apps)) return;
        if (_devtoolHook.apps.includes(app)) return;
        let version = app.version;

        if (!version) {
            console.warn('no Vue version detected, fallback to "3.0.0"');
            version = '3.0.0';
        }

        console.info('enabling devtools for Vue 3 instance', app);

        const types = {
            Fragment: undefined,
            Text: undefined,
            Comment: undefined,
            Static: undefined
        };

        _devtoolHook.emit('app:init', app, version, types);

        const unmount = app.unmount.bind(app);

        app.unmount = function () {
            _devtoolHook.emit('app:unmount', app);
            unmount();
        };
    }

    function checkVue2Instance(target) {
        const vue = target && target.__vue__;
        return !!(vue && typeof vue === 'object' && vue._isVue && typeof vue.constructor === 'function');
    }

    function checkVue3Instance(target) {
        const app = target && target.__vue_app__;
        return !!app;
    }

    function noop() { }

    function observeVueRoot(callbackVue2, callbackVue3) {
        if (typeof callbackVue2 !== 'function') {
            callbackVue2 = noop;
        }

        if (typeof callbackVue3 !== 'function') {
            callbackVue3 = noop;
        }

        const vue2RootSet = new WeakSet();
        const vue3RootSet = new WeakSet();
        const observer = new MutationObserver((mutations, observer) => {
            const disconnect = observer.disconnect.bind(observer);

            for (const {
                target
            } of mutations) {
                if (!target) {
                    return;
                } else if (checkVue2Instance(target)) {
                    const inst = target.__vue__;
                    const root = inst.$parent ? inst.$root : inst;

                    if (vue2RootSet.has(root)) {
                        continue;
                    }

                    vue2RootSet.add(root);
                    callbackVue2(root, disconnect);
                } else if (checkVue3Instance(target)) {
                    const app = target.__vue_app__;

                    if (vue3RootSet.has(app)) {
                        continue;
                    }

                    vue3RootSet.add(app);
                    callbackVue3(app, disconnect);
                }
            }
        });
        observer.observe(document.documentElement, {
            attributes: true,
            subtree: true,
            childList: true
        });
        return observer;
    }

    function devtoolStorePlugin(store, devtoolHook) {
        store._devtoolHook = devtoolHook;
        devtoolHook.emit('vuex:init', store);
        devtoolHook.on('vuex:travel-to-state', targetState => {
            store.replaceState(targetState);
        });
        store.subscribe((mutation, state) => {
            devtoolHook.emit('vuex:mutation', mutation, state);
        });
    }

    try {
        main();
    } catch (e) {
        console.error(e);
    }

}
openVueTool()
let ajax_tools_space = {
    ajaxToolsSwitchOn: false,
    ajaxToolsSwitchOnNot200: true,
    ajaxDataList: [],
    originalXHR: window.XMLHttpRequest,
    // "/^t.*$/" or "^t.*$" => new RegExp
    strToRegExp: (regStr) => {
        let regexp = ''
        const regParts = regStr.match(new RegExp('^/(.*?)/([gims]*)$'))
        if (regParts) {
            regexp = new RegExp(regParts[1], regParts[2])
        } else {
            regexp = new RegExp(regStr)
        }
        return regexp
    },
    getOverrideText: (responseText, args) => {
        let overrideText = responseText
        try {
            const data = JSON.parse(responseText)
            if (typeof data === 'object') {
                overrideText = responseText
            }
        } catch (e) {
            // const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
            // const returnText = await (new AsyncFunction(responseText))();
            const returnText = (new Function(responseText))(args)
            if (returnText) {
                overrideText = typeof returnText === 'object' ? JSON.stringify(returnText) : returnText
            }
        }
        return overrideText
    },
    getRequestParams: (requestUrl) => {
        if (!requestUrl) {
            return null
        }
        const paramStr = requestUrl.split('?').pop()
        const keyValueArr = paramStr.split('&')
        let keyValueObj = {}
        keyValueArr.forEach((item) => {
            // 保证中间不会把=给忽略掉
            const itemArr = item.replace('=', '〓').split('〓')
            const itemObj = { [itemArr[0]]: itemArr[1] }
            keyValueObj = Object.assign(keyValueObj, itemObj)
        })
        return keyValueObj
    },
    myXHR: function () {
        const modifyResponse = () => {
            const interfaceList = []
            ajax_tools_space.ajaxDataList.forEach((item) => {
                interfaceList.push(...(item.interfaceList || []))
            })
            const [method, requestUrl] = this._openArgs
            const queryStringParameters = ajax_tools_space.getRequestParams(requestUrl)
            const [requestPayload] = this._sendArgs
            interfaceList.forEach(({ open = true, matchType = 'normal', matchMethod, request, responseText }) => {
                const matchedMethod = !matchMethod || matchMethod === method.toUpperCase()
                if (open && matchedMethod) {
                    let matched = false
                    if (matchType === 'normal' && request && this.responseURL.includes(request)) {
                        matched = true
                    } else if (matchType === 'regex' && request && this.responseURL.match(ajax_tools_space.strToRegExp(request))) {
                        matched = true
                    }
                    if (matched && responseText) {
                        const funcArgs = {
                            method,
                            payload: {
                                queryStringParameters,
                                requestPayload
                            },
                            originalResponse: JSON.parse(this.responseText)
                        }
                        const overrideText = ajax_tools_space.getOverrideText(responseText, funcArgs)
                        this.responseText = 'aaaaaaaa'//overrideText
                        this.response = 'bbbbb' //overrideText
                        if (ajax_tools_space.ajaxToolsSwitchOnNot200) { // 非200请求如404，改写status
                            this.status = 200
                        }
                        // console.info('ⓢ ►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►► ⓢ');
                        // console.groupCollapsed(`%c XHR匹配路径/规则：${request}`, 'background-color: #108ee9; color: white; padding: 4px')
                        // console.info(`%c接口路径：`, 'background-color: #ff8040; color: white;', this.responseURL)
                        // console.info('%c返回出参：', 'background-color: #ff5500; color: white;', JSON.parse(overrideText))
                        // console.groupEnd()
                        // console.info('ⓔ ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣ ⓔ')
                    }
                }
            })
        }

        const xhr = new ajax_tools_space.originalXHR()
        for (const attr in xhr) {
            if (attr === 'onreadystatechange') {
                xhr.onreadystatechange = (...args) => {
                    // 下载成功
                    if (this.readyState === this.DONE) {
                        // 开启拦截
                        //modifyResponse()
                        // 覆盖响应结果
                        let pp = this.responseURL.includes('jsfile/www/upload')
                        if (pp) {
                            let fullfilename = this.responseURL.replace(/[^\\\/]*[\\\/]+/g, '')
                            var postfix = /\.[^\.]+/.exec(fullfilename);//获取⽂件的后缀
                            const filename = fullfilename.substr(0, postfix['index']);//获取没有后缀的名称
                            this.responseText = this.response + '\n//@ sourceURL=apsdevtools(' + filename + ').js \n\nconsole.info("已启用apsdevtool在线脚本调试工具")'//overrideText;
                            this.response = this.response + '\n//@ sourceURL=apsdevtools(' + filename + ').js \n\nconsole.info("已启用apsdevtool在线脚本调试工具")'  //overrideText;
                        } else {
                            modifyResponse()
                        }

                    }
                    this.onreadystatechange && this.onreadystatechange.apply(this, args)
                }
                continue
            } else if (attr === 'onload') {
                xhr.onload = (...args) => {
                    // 开启拦截
                    modifyResponse();
                    this.onload && this.onload.apply(this, args);
                }
                continue;
            } else if (attr === 'open') {
                this.open = (...args) => {
                    this._openArgs = args
                    xhr.open && xhr.open.apply(xhr, args)
                }
                continue
            } else if (attr === 'send') {
                this.send = (...args) => {
                    this._sendArgs = args
                    xhr.send && xhr.send.apply(xhr, args)
                }
                continue
            }
            if (typeof xhr[attr] === 'function') {
                this[attr] = xhr[attr].bind(xhr)
            } else {
                // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
                if (attr === 'responseText' || attr === 'response' || attr === 'status') {
                    Object.defineProperty(this, attr, {
                        get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
                        set: (val) => this[`_${attr}`] = val,
                        enumerable: true
                    })
                } else {
                    Object.defineProperty(this, attr, {
                        get: () => xhr[attr],
                        set: (val) => xhr[attr] = val,
                        enumerable: true
                    })
                }
            }
        }
    },
    originalFetch: window.fetch.bind(window),
    myFetch: function (...args) {
        const getOriginalResponse = async (stream) => {
            let text = ''
            const decoder = new TextDecoder('utf-8')
            const reader = stream.getReader()
            const processData = (result) => {
                if (result.done) {
                    return JSON.parse(text)
                }
                const value = result.value // Uint8Array
                text += decoder.decode(value, { stream: true })
                // 读取下一个文件片段，重复处理步骤
                return reader.read().then(processData)
            }
            return await reader.read().then(processData)
        }
        return ajax_tools_space.originalFetch(...args).then(async (response) => {
            let overrideText
            const interfaceList = []
            ajax_tools_space.ajaxDataList.forEach((item) => {
                interfaceList.push(...(item.interfaceList || []))
            })
            const { method = 'GET' } = args[1] || {}
            for (let i = 0; i < interfaceList.length; i++) {
                const { open = true, matchType = 'normal', matchMethod, request, responseText } = interfaceList[i]
                const matchedMethod = !matchMethod || matchMethod === method.toUpperCase()
                if (open && matchedMethod) {
                    let matched = false
                    if (matchType === 'normal' && request && response.url.includes(request)) {
                        matched = true
                    } else if (matchType === 'regex' && request && response.url.match(ajax_tools_space.strToRegExp(request))) {
                        matched = true
                    }
                    if (matched && responseText) {
                        const queryStringParameters = ajax_tools_space.getRequestParams(response.url)
                        const [_, data] = args
                        const originalResponse = await getOriginalResponse(response.body)
                        const funcArgs = {
                            method,
                            payload: {
                                queryStringParameters,
                                requestPayload: data.body
                            },
                            originalResponse
                        }
                        overrideText = ajax_tools_space.getOverrideText(responseText, funcArgs)
                        // console.info('ⓢ ►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►►► ⓢ');
                        console.groupCollapsed(`%c Fetch匹配路径/规则：${request}`, 'background-color: #108ee9; color: white; padding: 4px')
                        console.info(`%c接口路径：`, 'background-color: #ff8040; color: white;', response.url)
                        console.info('%c返回出参：', 'background-color: #ff5500; color: white;', JSON.parse(overrideText))
                        console.groupEnd()
                        // console.info('ⓔ ▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣▣ ⓔ')
                    }
                }
            }
            if (overrideText !== undefined) {
                const stream = new ReadableStream({
                    start(controller) {
                        controller.enqueue(new TextEncoder().encode(overrideText))
                        controller.close()
                    }
                })
                const newResponse = new Response(stream, {
                    headers: response.headers,
                    status: response.status,
                    statusText: response.statusText
                })
                const responseProxy = new Proxy(newResponse, {
                    get: function (target, name) {
                        switch (name) {
                            case 'body':
                            case 'bodyUsed':
                            case 'ok':
                            case 'redirected':
                            case 'type':
                            case 'url':
                                return response[name]
                        }
                        return target[name]
                    }
                })
                for (const key in responseProxy) {
                    if (typeof responseProxy[key] === 'function') {
                        responseProxy[key] = responseProxy[key].bind(newResponse)
                    }
                }
                return responseProxy
            }
            return response
        })
    }
}

if (true) {//临时处理
    window.XMLHttpRequest = ajax_tools_space.myXHR
    window.fetch = ajax_tools_space.myFetch
} else {
    window.XMLHttpRequest = ajax_tools_space.originalXHR
    window.fetch = ajax_tools_space.originalFetch
}
