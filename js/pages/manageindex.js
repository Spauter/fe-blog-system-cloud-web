$(function(){
    layui.use('layer',function(){
        var layer = layui.layer;
    })
    findHomePage();
    updateIndex();
    media_layer();

})

function media_layer(){
    layui.use(['layer'],function(){
        let layer = layui.layer;
    })
    $('.media_check_frame').on('click',function(){
        //请求图片
        let img_list =[];
        let img_list_string =`  <div class="load_icon" style="margin-top: -20%; margin-left: -5%;">
                <i class="layui-icon layui-icon-loading"></i>
                </div>`
        $.ajax({
            type:'GET',
            url:baseUrl+'/fe-ornament/FindAllMedia',
            data: {
                type: 'image'
            },
            dataType: 'json',
            success: function(res){
                let data=res.data
                console.log(data);
                for(let i=0;i<data.length;i++){
                    let temp = parseInt(10000*Math.random()); 
                    let element =`
                    <label for="${data[i]['image']}" class="layer_content_frame">
                    <input type="radio" class="media_layer_input" id="${data[i]['image']}" name="img_radio" value="${data[i]['image']}">
                    <div class="img_frame">
                        <img src="/${data[i]['image']}?temp=${temp}" alt="${data[i]['image']}">
                    </div>
                     </label>
                    `
                    img_list.push(element);
                   
                }
                
                img_list_string = img_list.join('');
                console.log(img_list);
                console.log(img_list_string);
                let layer = layui.layer;
                layer.open({
                    type: 1,
                    title: '从媒体库中选择图片',
                    skin: 'layui-layer-molv',
                    area: ['120rem','58rem'],
                    content: `<form id="media_layer_form">
                    <div class="media_layer_content">
                        ${img_list_string}
                    </div>
                    <div class="media_layer_btn">
                        <button class="layui-btn img_enter" type="submit">确认选择</button>
                    </div></form>`
                })
                layui.use('form',function(){
                    let form = layui.form;
                    form.render();

                })
                
                $('#media_layer_form').on('submit',function(e){
                    e.preventDefault();
                    let data =$('#media_layer_form').serializeArray();
                    console.log(data[0].value);
                    let img = `<img src= "/${data[0].value}" id="img_set" name="${data[0].value}">`;
                    $('.media_check_frame').empty().append(img);
                    parent.layer.closeAll();
                })
            }
        })
       
       
    })
}

function findHomePage(){
    $.ajax({
        type: 'GET',
        url:baseUrl+'/fe-blog/FindHomePage',
        data: {},
        dataType: 'json',
        success: function(res){
            let data=res.data;
            let img = `<img src= "/${data[0]['banner']}" id="img_set" name="${data[0]['banner']}">`;
            $('.media_check_frame').empty().append(img);
            console.log(data);
            $('#set_title').val(data[0]['title']);
            $('#set_welcome').val(data[0]['welcome']);
            $('#set_description').val(data[0]['description']);
            $('#set_announcemnet').val(data[0]['announcement']);
            
        },
        error: function(){
            console.log('获取失败');
        }
    })
}

function updateIndex(){
    $('#updataIndex').on('submit',function(e){
        e.preventDefault();
        let data = $(this).serializeArray();
        $.ajax({
            type: 'POST',
            url: baseUrl+'/fe-blog/HomePageManage',
            data: {
            'title':$('#set_title').val(),
            'welcome':$('#set_welcome').val(),
            'description':$('#set_description').val(),
            'announcement': $('#set_announcemnet').val(),
            'banner':$('#img_set').attr('name')
            },
            dataType: 'json',
            success: function(res){
                console.log(res);
                layui.use('layer',function(){
                    var layer = layui.layer;
                    layer.msg('修改成功！',{
                        icon: 6,
                        time: 1000
                    });
                })
                
            },
            error: function(){
                layui.use('layer',function(){
                    var layer = layui.layer;
                    layer.msg('服务器错误！',{
                        icon: 2,
                        time: 1000
                    });
                })
            }
        })
    })
}