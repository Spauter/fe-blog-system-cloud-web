let loginUser


$(function () {
    userInfoLoadAtOpen();
})

function userInfoLoadAtOpen() {
    $.ajax({
        type: 'GET',
        url: baseUrl+'/fe-user/UserLoginController',
        headers:{"token":localStorage.token},
        dataType: 'json',
        success: function (res) {
            let code = res.code;
            console.log(res);
            if (code === 200) {
                loginUser = res.data; // 将值赋给全局变量
                if (loginUser.status === '注册用户') {
                    let element = `
         <div class="aside_menu ">
            <ul class="layui-nav layui-nav-tree">
                <li class="layui-nav-item layui-nav-itemed">
                    <a href="javascript:;">用户管理</a>
                    <dl class="layui-nav-child">
                        <dd ><a href="userinfo.html">个人信息</a></dd>
                        <dd ><a href="account.html">账户管理</a></dd>
                    </dl>
                </li>
            </ul>
        </div>
        `
                    $('.aside').empty().append(element);
                }
                $('#user_avatar').attr("src", loginUser.avatar);
                $('.user_avatar>img').attr("src", loginUser.avatar);
            } else {
                let layer = layui.layer;
                layer.msg(res.msg, {
                    icon: 2,
                    time: 1000
                })
                setTimeout(function () {
                    window.location.href = '../index.html';
                }, 2000);
            }
        }
    })
}



