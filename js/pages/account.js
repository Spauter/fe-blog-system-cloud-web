$(function(){
    //修改密码
    $('.account_show').on('click','#pwd_change_btn',function(){
        let changeForm = `
        <form  class="layui-form pwd_change">
                <div class="layui-form-item">
                    <label for="" class="layui-form-label">你的密码</label>
                    <div class="layui-input-block">
                        <input type="password" class="layui-input" placeholder="输入你原先的密码" name="previousPassword" required lay-verify='required'>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label for="" class="layui-form-label" >更改密码</label>
                    <div class="layui-input-block">
                        <input type="password" class="layui-input" placeholder="输入你更改后的密码" name="password1" required lay-verify='required'>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label for="" class="layui-form-label">确认密码</label>
                    <div class="layui-input-block">
                        <input type="password" class="layui-input" placeholder="此次输入要与上次保持一致" name="password2" required lay-verify='required'>
                    </div>
                </div>
                <div class="layui-form-item">
                    <button class="layui-btn change_btn" type="submit" lay-submit>确认修改</button>
                </div>
            </form>`
        $('.account_show').empty().append(changeForm);

    $('.account_show').on('submit','.pwd_change',function(e){
        e.preventDefault();
        console.log('提交了');
        e.preventDefault();
            let data = $(this).serializeArray();
            if(data[2].value !== data[1].value){
                layui.use(['layer'],function(){
                    let layer = layui.layer;
                    layer.msg('两次输入密码不一致',{
                        icon: 2,
                        time:1000
                    })
                })
            }
            $.ajax({
                type: 'POST',
                url: baseUrl+'/fe-user/updatePassword',
                data: {
                    'previousPassword':data[0].value,
                    'modifiedPassword':data[1].value
                },
                dataType: 'json',
                success: function(res){
                    console.log(res);
                    if(res.code ===200){
                        layui.use('layer',function(){
                            let layer=layui.layer;
                            layer.msg(res.msg,{
                                icon:6,
                                tiem: 2000
                            })
                        })
                        setTimeout(function () {
                            window.location.href = '../../login.html';
                        }, 2000);
                    }else{
                        layui.use('layer',function(){
                            let layer=layui.layer;
                            layer.msg(res.msg,{
                                icon:2,
                                tiem: 1000
                            })
                        })
                    }
                },
                error :function(){
                    layui.use('layer',function(){
                        let layer=layui.layer;
                        layer.msg('服务器错误！',{
                            icon:2,
                            tiem: 1000
                        })
                    })
                }
            })
        })  
       
    })
})