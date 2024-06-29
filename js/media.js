$(function(){
    img_load();
    music_load();
    imgDelete();
    $('.del_music').on('submit',function(e){
        e.preventDefault();
        let data = $('.del_music').serializeArray();
        console.log(JSON.stringify(data));
    })
    layui.use(['upload'],function(){
        let upload = layui.upload;
        upload.render({
            elem: "#drag_upload",
            url:baseUrl+ '/fe-ornament/addMedia',
            accept: 'image',
            field: 'image',
            data:{
                "file":function (){
                    return $('#drag_upload').val()
                }
            },
            done: function(res){
                //请求成功回掉函数
                if(res.code !==200){
                    let layer = layui.layer;
                        layer.msg(res.msg,{
                            icon : 2,
                            time : 2000
                        })
                }
                else
                {
                    layui.use('layer',function(){
                        let layer = layui.layer;
                        layer.msg('上传成功！',{
                            icon : 6,
                            time : 1000
                        })
                    })
                }
                
            },
            progress: function(n, elem, res, index){
                var percent = n + '%' //获取进度百分比
                console.log(percent);
                let layer;
                layui.use('layer',function(){
                    layer=layui.layer;
                    layer.load();
                })
                if(percent == '100%'){
                   setTimeout(function(){
                        parent.layer.closeAll()
                        img_load();
                   },1000);

                }
            }
        })

        let upload2 = layui.upload;
        upload2.render({
            elem:'#music_upload',
            url: baseUrl+'/fe-ornament/addMedia',
            data:{
                type: 'music'
            },
            field:'music',
            accept: 'audio',
            done: function(res){
                //请求成功回掉函数
                if(res.code!==200){
                    let layer = layui.layer;
                        layer.msg('上传失败！文件名称不合法！',{
                            icon : 2,
                            time : 2000
                        })
                }
                else
                {
                    layui.use('layer',function(){
                        let layer = layui.layer;
                        layer.msg('上传成功！',{
                            icon : 6,
                            time : 1000
                        })
                    })
                }
                
            },
            progress: function(n, elem, res, index){
                var percent = n + '%' //获取进度百分比
                console.log(percent);
                let layer;
                layui.use('layer',function(){
                    layer=layui.layer;
                    layer.load();
                })
                if(percent === '100%'){
                   setTimeout(function(){
                        parent.layer.closeAll()
                        music_load();
                   },1000);
                    
                }
            }
        })
        
    })
})

function img_load(){
    $.ajax({
        type:'GET',
        url:baseUrl+'/fe-ornament/FindAllMedia',
        data: {
            type: 'image'
        },
        dataType: 'json',
        success: function(res){
            console.log(res);
            let data=res.data;
            let img_list =[];
            for(let i=0;i<data.length;i++){
                let temp = parseInt(10000*Math.random()); 
                let element =`
                <label for="${data[i]['image']}" class="img_show_frame">
                        <input type="checkbox" id="${data[i]['image']}" class="img_show_input" name="image" value="${data[i]['image']}">
                        <div class="img_frame">
                             <img src="/${data[i]['image']}?temp=${temp}" alt="${data[i]['image']}" class="image">
                         </div>
                    <p class="img_name">${data[i]['image']}</p>
                </label>
                `
                img_list.push(element);
            }
            $('.picture_show').empty().append(img_list.join(''));
            layui.use('form',function(){
                let form = layui.form;
                form.render();
                
            })
        }
    })
}

function music_load(){
    $.ajax({
        type:'GET',
        url:baseUrl+'/fe-ornament/FindAllMedia',
        data: {
            type: 'music'
        },
        dataType: 'json',
        success: function(res){
            console.log(res);
            let music_list =[];
            for(let i=0;i<res.length;i++){
                let element =`
                <li class="music_show_list">
                <input type="checkbox" name="music" class="layui-input " value="${res[i]['music']}"
                lay-skin="primary" title="${res[i]['music']}"></li>
                `
                music_list.push(element);
                layui.use('form',function(){
                    let form = layui.form;
                    form.render();
                    
                })
            }
            $(".music_show_item").empty().append(music_list.join(''));
        }
    })
}


function imgDelete() {
    $('#img_delete').on('submit', function (e) {
        e.preventDefault();
        let data = $(this).serializeArray();
        var formData = new FormData();
        for (var i = 0; i < data.length; i++) {
            formData.append(data[i].name, data[i].value);
        }

        console.log(JSON.stringify(data));
        $.ajax({
            type: 'POST',
            url:baseUrl+ '/fe-ornament/deleteMedia?type=image',
            data: formData,
            processData: false,  // 告诉 jQuery 不要处理数据
            contentType: false,  // 告诉 jQuery 不要设置 contentType
            dataType: 'json',
            success: function (res) {
                console.log("data:"+res);
               if (res.code===200){
                   layer.msg(res.msg,{
                       icon : 6,
                       time : 1000
                   })
                   img_load(); // 调用刷新图片的函数
               }else {
                   let layer = layui.layer;
                   layer.msg(res.msg,{
                       icon : 2,
                       time : 1000
                   })
               }
            },

        })
    })
}
