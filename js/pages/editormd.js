$(function () {
    getSession();
})
let selectedImage = null;

//游客登录下移除左边导航栏，添加头部导航栏
function changeBar() {
    let element = `
    <div class="nav_content">
        <div class="nav_content_title">
            <h1><a href="../../index.html">韬韬的博客</a></h1>
        </div>
    </div>
`
    $('.nav').empty().append(element);
}

function media_layer() {
    $('.media_check_frame').on('click', function () {
        //请求图片
        let img_list = [];
        let img_list_string = `  <div class="load_icon" style="margin-top: -20%; margin-left: -5%;">
                <i class="layui-icon layui-icon-loading"></i>
                </div>`
        $.ajax({
            type: 'GET',
            url: '/fe-ornament/FindAllMedia',
            data: {
                type: 'image'
            },
            dataType: 'json',
            success: function (res) {
                console.log(res);
                let data = res.data
                for (let i = 0; i < data.length; i++) {
                    let element = `
                    <label for="${data[i]['image']}" class="layer_content_frame">
                    <input type="radio" class="media_layer_input" id="${data[i]['image']}" name="img_radio" value="${data[i]['image']}">
                    <div class="img_frame">
                        <img src="/${data[i]['image']}" alt="${data[i]['image']}">
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
                    area: ['120rem', '58rem'],
                    content: `<form id="media_layer_form">
                    <div class="media_layer_content">
                        ${img_list_string}
                    </div>
                    <div class="media_layer_btn">
                        <button class="layui-btn img_enter" type="submit">确认选择</button>
                    </div></form>`
                })
                layui.use('form', function () {
                    let form = layui.form;
                    form.render();

                })

                $('#media_layer_form').on('submit', function (e) {
                    e.preventDefault();
                    let data = $('#media_layer_form').serializeArray();
                    console.log(data[0].value);
                    selectedImge=data[0].value;
                    let img = `<img src= "/${data[0].value}" id="img_set" name="${data[0].value}" alt="封面">`;
                    $('.media_check_frame').empty().append(img);
                    parent.layer.closeAll();
                })
            }
        })


    })
}


//添加博客
function blog_add(editormd) {
    $('#blog_add').on('submit', function (e) {
        console.log(selectedImge)
        let layer;
        layui.use(['layer'], function () {
            layer = layui.layer;
            layer.load(1);
        })
        // if (loginUser == null) {
        //     layer.msg("请留下您的大名后在提交哦", {
        //         icon: 6,
        //         time: 1000
        //     });
        //     // 关闭加载
        //     layer.closeAll('loading');
        //     return;
        // }

        e.preventDefault();
        let data = $(this).serializeArray();
        let htmlText = editormd.getHTML();
        let md = editormd.getMarkdown();
        let content = htmlText + '￥' + md;
        /*         console.log(data);
                console.log(content); */
        let tagData = [];
        $("input[name='tag']:checked").each(function (index) {
            tagData.push($(this).val());
        })
        /*         console.log("tag="+tagData);
                console.log($("input[name='type']").val());
                console.log($("option:selected").val()) */
        let test = {
            "title": data[0].value,
            "content": content,
            "description": data[1].value,
            "type": $("input[name='type']").val(),
            "userId": 1,
            "author": "admin",
            "tag": tagData,
            "field": $("option:selected").val(),
            "audited": '待审核',
            "selectedImage":selectedImge,
        }
        console.log(JSON.stringify(test));
        const str = Math.random().toString(36).slice(2);
        // 审核博客
        $.ajax({
            type: 'POST',
            url: 'https://gtf.ai.xingzheai.cn/v2.0/game_chat_ban/detect_text',
            data: {
                'token': 'LUJGYW0SB7KHIOZN',
                'data_id': str,
                'context_type': 'post',
                'context': test.content,
                'suggestion': '',
                'label': ''
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                let sug = data.data.suggestion;
                if (sug === "review") {
                    layui.use('layer', function () {
                        let layer = layui.layer;
                        layer.msg(data.data.msg, {
                            icon: 6,
                            time: 2000
                        })
                        test.audited = "待审核";
                        add(test)
                    })
                } else if (sug === "block") {
                    layui.use('layer', function () {
                        let layer = layui.layer;
                        layer.msg("含有敏感词汇,审核不通过", {
                            icon: 2,
                            time: 1000
                        })
                        test.audited = "未通过";
                    })
                } else {
                    test.audited = "待审核";
                    add(test)
                }
                // 关闭加载图标
                layer.closeAll('loading');
            },
            error: function () {
                layui.use('layer', function () {
                    let layer = layui.layer;
                    layer.msg('自动审核失败，将移交给人工审核!', {
                        icon: 2,
                        time: 1000
                    })
                })
                add(test)
            }
        })
    })
}

//添加博客
function add(test) {
    $.ajax({
        type: 'POST',
        url:baseUrl+ '/fe-blog/AddBlogController',
        data: JSON.stringify(test),
        dataType: 'json',
        success: function (res) {
            console.log(res.msg);
            if (res.code !== 200) {
                layer.msg(res.msg, {
                    icon: 2,
                    time: 1000
                });
                // 关闭加载图标
                layer.closeAll('loading');
                return;
            }
            parent.layer.closeAll();
            layer.msg('投稿成功！等待管理员审核');
            setTimeout(function () {
                parent.layer.closeAll();
                window.location.href = 'newblog.html';
            }, 2000)
        },
        error: function () {
            console.log("错误");
            // 关闭加载图标
            layer.closeAll('loading');
        }
    });
}


//加载标签类型
function findAllTags() {
    $.ajax({
        type: 'GET',
        url:baseUrl+ '/fe-category/SelectAllTagController',
        data: {},
        dataType: "json",
        success: function (res) {
            let data = res.data;
            let tags = [];
            for (let i = 0; i < data.length; i++) {
                let element = `<input type="checkbox" title="${data[i]['name']}" id="${data[i]['tagId']}" name="tag" value="${data[i]['name']}">`;
                tags.push(element);
            }
            console.log(tags);
            $('#tags_show').empty().append(tags.join(''));
            layui.use('form', function () {
                let form = layui.form;
                form.render();

            })
        }
    })
}

function findAllField() {
    $.ajax({
        type: 'GET',
        url:baseUrl+ '/fe-category/FindAllField',
        data: {},
        dataType: 'json',
        success: function (res) {
            let data = res.data;
            let field = [];
            for (let i = 0; i < data.length; i++) {
                let element = `<option value="${data[i]['name']}" class="${data[i]['fieldId']}">${data[i]['name']}</option>`;
                field.push(element);
            }
            console.log(field);
            $('#city').empty().append(`<option value="" id="null">请选择分类</option>`);
            $('#city').append(field.join(''));
            layui.use('form', function () {
                let form = layui.form;
                form.render();

            })
        }
    })
}

function getSession() {
    if (window.sessionStorage.getItem('data') != null) {

        media_layer();
        //md编辑器配置
        let editor = editormd("editormd", {
            width: "100%",
            height: "600px",
            path: "../js/editor.md/lib/",
            saveHTMLToTextarea: true,
            toolbarAutoFixed: false,
            //emoji:true

            theme: "default",
            watch: true,

            // Preview container theme, added v1.5.0
            // You can also custom css class .editormd-preview-theme-xxxx
            previewTheme: "default",
            editorTheme: "default",
            delay: 500,
            codeFold: true,
            toolbarIcons: function () {
                return ['undo', 'redo', '|', 'bold', 'italic', 'quote', 'del', '|', 'list-ul', 'list-ol', 'hr', '|', 'link', 'image', '|', 'code', 'preformatted-text', 'table', 'datetime', 'html-entities', '|', 'watch', 'preview', '|', 'search']
            },
            onload: function () {

            }

            // Added @v1.5.0 & after version this is CodeMirror (editor area) theme
        })

        let session = window.sessionStorage;
        let data = JSON.parse(session.getItem('data'));
        let blog = data.blog;
        let t = data.tags;
        console.log(data);
        let blog_content = blog.content.split('￥');
        //加载全部标签
        $.ajax({
            type: 'GET',
            url: baseUrl+'/fe-category/SelectAllTagController',
            data: {},
            dataType: "json",
            success: function (res) {
                let data = res.data;
                let tags = [];
                for (let i = 0; i < data.length; i++) {
                    let element = `<input type="checkbox" title="${data[i]['name']}" id="${data[i]['tagId']}" name="tag" value="${data[i]['name']}">`;
                    tags.push(element);
                }
                $('#tags_show').empty().append(tags.join(''));
                layui.use('form', function () {
                    let form = layui.form;
                    form.render();

                })

                $('input[name="tag"]').each(function (element) {
                    for (let i = 0; i < t.length; i++) {
                        if (t[i]['name'] == $(this).val()) {
                            $(this).attr('checked', 'checked');
                        }
                    }
                })
            }
        })
        $.ajax({
            type: 'GET',
            url:baseUrl+ '/fe-category/FindAllField',
            data: {},
            dataType: 'json',
            success: function (res) {
                let data = res.data;
                let field = [];
                for (let i = 0; i < data.length; i++) {
                    let element = `<option value="${data[i]['name']}" id="${data[i]['fieldId']}">${data[i]['name']}</option>`;
                    field.push(element);
                }
                console.log(field);
                $('#city').empty().append(`<option value="" id="null">请选择分类</option>`);
                $('#city').append(field.join(''));
                layui.use('form', function () {
                    let form = layui.form;
                    form.render();

                })
                $('#city option').each(function () {
                    if ($(this).attr('id') == blog.fieldId) {
                        $(this).attr('selected', 'selected');
                    }
                })
                $('input[name="type"]').each(function () {
                    if ($(this).val() == blog.type) {
                        $(this).attr('checked', 'checked');
                    }
                })
            }
        })
        $('#title').attr('value', blog.title);
        $('#description').text(blog.description);
        $("layui-anim layui-anim-upbit").each(function () {
            if ($(this).attr('class') == blog.fielId) {
                $(this).attr('selected', 'true');
            }
        })
        $('#content').text(blog_content[1]);
        // $('#save_btn').text('保存更改');
        $('#blog_add').on('submit', function (e) {
            let layer;
            layui.use(['layer'], function () {
                layer = layui.layer;
                layer.load(1);
            })
            e.preventDefault();
            let data = $(this).serializeArray();
            console.log(data);
            let htmlText = editor.getHTML();
            let md = editor.getMarkdown();
            let content = htmlText + '￥' + md;
            /*         console.log(data);
                    console.log(content); */
            let tagData = [];
            $("input[name='tag']:checked").each(function (index) {
                tagData.push($(this).val());
            })
            let test = {
                "title": $('.getTitle').val(),
                "content": content,
                "description": data[1].value,
                "type": $("input[name='type']").val(),
                "userId": 1,
                "author": "admin",
                "tag": tagData,
                "field": $("option:selected").val(),
                "blogId": blog.blogId,
                "selectedImage":selectedImge,
            }
            $.ajax({
                type: 'POST',
                url:baseUrl+ '/fe-blog/ModifyBlogController',
                data: JSON.stringify(test),
                dataType: 'json',
                success: function (res) {
                    console.log(res.msg);
                    session.removeItem('data');

                    parent.layer.closeAll();

                    layer.msg("保存成功！")
                    setTimeout(function () {
                        parent.layer.closeAll();
                        window.location.href = 'newblog.html';
                    }, 2000)
                }


            })
        })


    } else {
        //加载全部标签
        findAllTags();
        //加载全部分类
        findAllField();
        //md编辑器配置
        let editor = editormd("editormd", {
            width: "100%",
            height: "600px",
            path: "../js/editor.md/lib/",
            saveHTMLToTextarea: true,
            toolbarAutoFixed: false,
            //emoji:true

            theme: "default",
            watch: true,

            // Preview container theme, added v1.5.0
            // You can also custom css class .editormd-preview-theme-xxxx
            previewTheme: "default",
            editorTheme: "default",
            delay: 500,
            codeFold: true,
            toolbarIcons: function () {
                return ['undo', 'redo', '|', 'bold', 'italic', 'quote', 'del', '|', 'list-ul', 'list-ol', 'hr', '|', 'link', 'image', '|', 'code', 'preformatted-text', 'table', 'datetime', 'html-entities', '|', 'watch', 'preview', '|', 'search']
            },
            onload: function () {

            }

            // Added @v1.5.0 & after version this is CodeMirror (editor area) theme
        })
        blog_add(editor);

        media_layer();

    }

}

function set_value() {

}

