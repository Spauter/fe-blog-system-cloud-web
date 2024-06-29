
//************* Copy right https://blog.csdn.net/weixin_47142014/article/details/121162914 *//
let aCode = "1234";
//页面首次加载
$.ajax({
    url: baseUrl + '/fe-user/VerificationCodeController?r' + Math.random(),
    async:false,
    success:function(k){
        aCode=k;
    }
})

//点击图片刷新
$(function(){
    const show_num = [];
    draw(show_num);
    $("#canvas").on('click',function(){
        var _this=$(this)
        $.ajax({
            url: baseUrl + '/fe-user/VerificationCodeController?r' + Math.random(),
            async:false,
            success:function(k){
                aCode=k;
            }
        })
        draw(show_num);
    })
})


function draw(show_num) {
    let x;
    let y;
    let i;
    const canvas_width = $('#canvas').width();
    const canvas_height = $('#canvas').height();
    const canvas = document.getElementById("canvas");//获取到canvas的对象，演员
    const context = canvas.getContext("2d");//获取到canvas画图的环境，演员表演的舞台
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    const aLength = aCode.length;//获取到数组的长度
    for (i = 0; i <= 3; i++) {
        const j = Math.floor(Math.random() * aLength);//获取到随机的索引值
        const deg = Math.random() * 30 * Math.PI / 180;//产生0~30之间的随机弧度
        const txt = aCode[i];//得到随机的一个内容
        show_num[i] = txt.toLowerCase();
        x = 10 + i * 20;//文字在canvas上的x坐标
        y = 20 + Math.random() * 8;//文字在canvas上的y坐标
        context.font = "bold 23px 微软雅黑";

        context.translate(x, y);
        context.rotate(deg);

        context.fillStyle = randomColor();
        context.fillText(txt, 0, 0);

        context.rotate(-deg);
        context.translate(-x, -y);
    }
    for (i = 0; i <= 5; i++) { //验证码上显示线条
        context.strokeStyle = randomColor();
        context.beginPath();
        context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.stroke();
    }
    for (i = 0; i <= 30; i++) { //验证码上显示小点
        context.strokeStyle = randomColor();
        context.beginPath();
        x = Math.random() * canvas_width;
        y = Math.random() * canvas_height;
        context.moveTo(x, y);
        context.lineTo(x + 1, y + 1);
        context.stroke();
    }
}

function randomColor() {//得到随机的颜色值
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
}
//**************** over ***************************************//



layui.use(['form'], function () {
    let form = layui.form;
})

$(function () {
    login();
})

function login() {
    $('#load_form').on('submit', function (e) {
        e.preventDefault();
        let data = $(this).serializeArray();
        console.log(data);
        if (aCode !== data[2].value) {
            layer.msg('验证码错误！', {
                icon: 2,
                time: 1500
            })
            return false;
        }
        $.ajax({
            withCredentials: true,
            type: 'POST',
            url: baseUrl+'/fe-user/UserLoginController',
            data: {
                'username': data[0].value,
                'password': data[1].value
            },
            dataType: 'json',
            success: function (res) {
                if (res.code!==200) {
                    layui.use(['layer'], function () {
                        let layer = layui.layer;
                        layer.msg(res.msg, {
                            icon: 2,
                            time: 1000
                        })

                    })
                } else {
                    layui.use(['layer'], function () {
                        let layer = layui.layer;
                        layer.msg('登陆成功！', {
                            icon: 6,
                            time: 1000
                        })
                    })
                    //存储token
                    localStorage.token = res.token;
                    setTimeout(function () {
                        window.location.href = 'index.html';
                    }, 1000);
                }
            }
        });
    })
}