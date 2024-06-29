


$(function () {
    userInfo();
})

function userInfo() {
    $.ajax({
        type: 'GET',
        url: baseUrl+'/fe-blog/SelectUserServlet',
        data: {},
        dataType: 'json',
        success: function (res) {
            let code = res.code;
            console.log(res);
            if (code === 200) {
                loginUser = res.data; // 将值赋给全局变量
                if(loginUser.status==='注册用户'){
                    window.location.href = '../index.html';
                }
            } else {
                setTimeout(function () {
                    window.location.href = '../index.html';
                }, 2000);
            }
        }
    })
}