let clicked = false;
let register = false;
$(function () {
    sendEmail();
    toRegister();
})


function toRegister() {
    // 绑定表单提交事件
    $('#toRegister').on('click', function (e) {
        e.preventDefault();
        //设置不可提交导致的多次表单提交
        if (register) {
            layui.use(['layer'], function () {
                let layer = layui.layer;
                layer.msg("请勿重复点击", {
                    icon: 2,
                    time: 1000
                })
            });
            return;
        }
        let data = $('#load_register').serializeArray();
        for (let i=0;i<data.length-1;i++){
            if(data[i].value==="" || data[i].value==null) {
                let layer = layui.layer;
                layer.msg("请填写字段", {
                    icon: 2,
                    time: 1000
                })
                return;
            }
        }
        register = true;
        $('#myButton').prop('disabled', true);
        console.log(data);
        $.ajax({
            type: 'POST',
            url:baseUrl+ 'fe-user/register',
            data: {
                'username': data[0].value,
                'password': data[1].value,
                'confirmPassword': data[2].value,
                'email': data[3].value,
                'vericode': data[4].value
            },
            dataType: 'json',
            success: function (res) {
                // 处理注册成功或失败逻辑
                if (res.code === 500) {
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
                        layer.msg('注册成功！', {
                            icon: 6,
                            time: 5000
                        })

                    })
                    setTimeout(function () {
                        window.location.href = 'index.html';
                    }, 1000);
                }
                register = false;
                $('#toRegister').prop('disabled', false);
            },
            error: function () {
                register = false;
                $('#toRegister').prop('disabled', false);
                let layer = layui.layer;
                layer.msg('请求发送失败！', {
                    icon: 6,
                    time: 1000
                })
            }
        });
    });
}

function sendEmail() {
    $('#sendEmail').on('click', function (e) {
        e.preventDefault();
        const layer = layui.layer;
        let data = $('#load_register').serializeArray();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let email = data[3].value;
        if (emailRegex.test(email)) {
            // 使用 event 参数获取事件对象
            $('#sendEmail').on('click', function (event) {
                event.preventDefault()
                if (clicked) {
                    layer.msg('60秒后才能再次点击', {
                        icon: 2,
                        time: 1000
                    });
                    return;
                }

                $.ajax({
                    type: 'GET',
                    url:baseUrl+ 'fe-user/sendEmail',
                    data: {
                        email,
                    },
                    success: function (res) {
                        if (res.data !== 200) {
                        }
                        layer.msg(res.msg, {
                            icon: 6,
                            time: 1000
                        });
                    }
                });

                // 模拟处理耗时操作
                layer.msg('验证码发送成功，请耐心等待', {
                    icon: 6,
                    time: 1000
                });
                clicked = true;
                setTimeout(function () {
                    clicked = false;
                    layer.msg('60秒已过，可以再次点击', {
                        icon: 6,
                        time: 1000
                    });
                }, 60000);
            });
        } else {
            layer.msg('邮箱格式不正确', {
                icon: 2,
                time: 1000
            });
        }
    });
}