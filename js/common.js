var user = {};
let token;
const ws = new WebSocket("ws://localhost:8081/chat");
const baseUrl = 'http://192.168.43.68:1868'
const MINIO_BASE_URL = "http://192.168.24.132:9000"

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
