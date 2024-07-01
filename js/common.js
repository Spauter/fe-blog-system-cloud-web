
//****************** 主配置 **************//
const ws = new WebSocket('ws://127.0.0.1:8081/chat');
const baseUrl = 'http://127.0.0.1:1868'
const MINIO_BASE_URL = 'http://192.168.24.132:9000'
//****************** END ***************//


//登录用户
var user = {};
//token
let token;
//向服务器发送的数据
const NETTY_JSON={
    blogId: 0,
    id: 0,
    contentId: 0,
    account: '',
    type: '',
    location: 'index.html',
    content : '',
}

$(function () {
    /* 引入layui */
    layui.use(['element', 'laydate', 'upload', 'form'], function () {
        let element = layui.element;
        let form = layui.form;
    })
    if (!isValidURL(baseUrl)) {
        throw Error("非法地址:" + baseUrl);
    }
    if (!isValidURL(MINIO_BASE_URL)) {
        throw Error("非法地址:" + MINIO_BASE_URL)
    }
})


function isValidURL(url) {
    const pattern = new RegExp(
        //协议
        '^(https?:\\/\\/)?' +
        // 域名
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        // 或者 IP 地址
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        // 端口和路径
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        // 查询字符串
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        // 锚点
        '(\\#[-a-z\\d_]*)?$', 'i');
    return pattern.test(url)
}

//生成指定长度的随机字符串
function generateRandomStringAndHex(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const hexCharacters = '0123456789abcdef';
    const charactersLength = characters.length;
    const hexCharactersLength = hexCharacters.length;
    for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        } else {
            result += hexCharacters.charAt(Math.floor(Math.random() * hexCharactersLength));
        }
    }
    return result;
}
