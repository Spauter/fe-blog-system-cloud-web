$(function(){
    findAllfield();
    findAllTags();
    tagsAdd();
    fieldAdd();
    fieldDelete();
    tagsDelete();
    layui.use(['form'],function(){
        let form = layui.form;
    })
})

function findAllTags(){
    $.ajax({
        type: 'GET',
        url:baseUrl+ '/fe-category/SelectAllTagController',
        data: {},
        dataType: "json",
        success: function(res){
            let data = res.data;
            let tags = [];
            for(let i = 0;i<data.length;i++){
                let element = `<input type="checkbox" title="${data[i]['name']}" id="${data[i]['tagId']}" name="tag" value="${data[i]['name']}">`;
                tags.push(element);
            }
            console.log(tags);
            $('#tags_show').empty().append(tags.join(''));
            layui.use('form',function(){
                let form = layui.form;
                form.render();
                
            })
            
        }
    }) 
}

function tagsAdd(){
    $('#tags_add').on('submit',function(e){
        e.preventDefault();
        let data = $(this).serializeArray();
        console.log(data);
        console.log(JSON.stringify(data));
        let dataTest = {
            'tag':data[0].value
        }
        $.ajax({
            type: 'POST',
            url:baseUrl+ '/fe-category/AddTagController',
            data: JSON.stringify(dataTest),
            dataType: 'json',
            success: function(res){
                layui.use('layer',function(){
                    let layer = layui.layer;
                    layer.msg(res.msg);
                })
                findAllTags();
            }
        })
    })
    
}

function tagsDelete(){

    $('#delete_tags').on('submit',function(e) {
        let layer2;
        layui.use('layer',function(){
            layer2 = layui.layer;
            layer2.load(1);
        })
        e.preventDefault();
        let data = $(this).serializeArray();
        $.ajax({
            type:'POST',
            url: baseUrl+'/fe-category/DeleteTagController',
            data: JSON.stringify(data),
            dataType : 'json',
            success: function(res){
                console.log(res);
                findAllTags();
                parent.layer.closeAll();
            }
        })
    })
}

function findAllfield(){{

    $.ajax({
        type: 'GET',
        url:baseUrl+ '/fe-category/FindAllField',
        data: {},
        dataType: 'json',
        success: function(res){
            let data = res.data;
            let field = [];
            for(let i = 0;i<data.length;i++){
                let element = `<input type="checkbox" title="${data[i]['name']}" id="${data[i]['fieldId']}" name="field" value="${data[i]['name']}">`;
                field.push(element);
            }
            console.log(field);
            $('#field_show').empty().append(field.join(''));
            layui.use('form',function(){
                let form = layui.form;
                form.render();
                
            })
        }
    }) 
}}
function fieldAdd(){
    $('#field_add').on('submit',function(e){
        let layer2;
        layui.use('layer',function(){
            layer2 = layui.layer;
            layer2.load(1);
        })
        e.preventDefault();
        let data = $(this).serializeArray();
        console.log(data);
        $.ajax({
            type: 'POST',
            url: baseUrl+'/fe-category/Addfield',
            data: {'Field': data[0].value},
            dataType: 'json',
            success: function(res){
                layui.use('layer',function(){
                    let layer = layui.layer;
                    layer.msg(res.msg);
                })
                parent.layer.closeAll();
                findAllfield();
            }
        })
    })
}

function fieldDelete() {    
    $('#delete_field').on('submit',function(e) {
        let layer2;
        layui.use('layer',function(){
            layer2 = layui.layer;
            layer2.load(1);
        })
        e.preventDefault();
        let data = $(this).serializeArray();
        console.log(data);
        console.log(JSON.stringify(data));
        var checkID=[];
        $("input[name='field']:checked").each(function(i){
              checkID[i] = $(this).val();
        });
        console.log(checkID);
        $.ajax({
            type:'POST',
            url: baseUrl+'/fe-category/DelField',
            data: JSON.stringify(data),
            dataType : 'json',
            success: function(res){
                console.log(res);
                findAllfield();
                parent.layer.closeAll();
            }
        })
    })
}



