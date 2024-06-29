function load_user() {
    $.ajax({
        type: 'GET',
        url: baseUrl + '/fe-user/UserLoginController',
        headers: {"token": localStorage.token},
        dataType: "json",
        success: function (res) {
            if (res.code !== 200) {
                layui.use('layer', function () {
                    let layer = layui.layer;
                    layer.msg("当前您未登录，仅查看", {
                        icon: 1,
                        time: 2000
                    })
                })
                $('.reply_comment').empty();
                return;
            }
            let data = res.data;
            user.avatar = data.avatar;
            user.account = data.account;
            user.userId = data.userId;
            user.nick = data.nick;
        }, error: function (err) {
            layer.msg("请求出错，即将返回首页");
        }
    });
}