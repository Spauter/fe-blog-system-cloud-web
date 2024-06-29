$(function(){
    logout();
})

function logout(){
    $('.user_cancel').on('click',function(){
        let layer2;
        layui.use('layer',function(){
            layer2 = layui.layer;
            layer2.load(1);
        })
        $.ajax({
            type:'POST',
            url:baseUrl+'/fe-user/UserLogoutController',
            data: {},
            success: function(res){
                console.log(res);
                window.location.href="../../index.html";
                parent.layer.closeAll();
            }
        })
    })
}