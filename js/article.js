let blogId = window.location.href.split('=')[1];


$(function () {
    if (user.account === undefined) {
        load_user();
    }
    content_load();
    netty_connection()
    NETTY_JSON.location= window.location.href.split('/')[3];
})



function load() {
    setTimeout(function () {
        $('.load_cover').animate({
            'top': '-100%'
        }, 100, function () {
            $(document.body).css({
                'overflow': 'auto'
            })
        })
    }, 200)
}

function content_load() {
    $.ajax({
        type: 'GET',
        url: baseUrl + '/fe-blog/DetailBlogServlet',
        data: {'blogId': blogId},
        dataType: 'json',
        success: function (res) {
            let msg = res.data;
            console.log(msg);
            let blog = msg.blog;
            $('#set_title').text(blog.title);
            $('.time').text(blog.createTime);
            $('.update').text(blog.updateTime);
            let element = `${blog.content.split('￥')[0]}`
            $('.article_content').empty().append(element);
            $('.author').text(blog.author);
            $('.field').text(res.data.field);
            $('.clicks').text(blog.clicks)
            let tags = [];
            for (let i = 0; i < msg.tags.length; i++) {
                tags.push(msg.tags[i]['name']);
            }
            $('.tags').append(tags.join(' | '));
            load();
            commentAdd(blog.blogId);
            findAllComment(blog.blogId);
        },
        error: function () {
            console.log('请求出错');
        }
    })
}


function commentAdd(blogId) {
    $('.comment_btn').on('click', function () {
        let data = {
            'blog_id': blogId,
            'content': $('#comment').val(),
        }
        if (data.content === '' || data.content == null) {
            layer.msg("请输入评论", {
                icon: 2,
                time: 1000
            })
            return;
        }
        const str = Math.random().toString(36).slice(2);
        $.ajax({
            type: 'POST',
            url: 'https://gtf.ai.xingzheai.cn/v2.0/game_chat_ban/detect_text',
            data: {
                'token': 'LUJGYW0SB7KHIOZN',
                'data_id': str,
                'context_type': 'post',
                'context': data.content,
                'suggestion': '',
                'label': ''
            },
            dataType: 'json',
            success: function (res) {
                console.log(res);
                let sug = res.data.suggestion;
                if (sug !== "pass") {
                    layui.use('layer', function () {
                        let layer = layui.layer;
                        layer.msg("含有非法词汇,发布失败", {
                            icon: 2,
                            time: 2000
                        })
                    });
                } else {
                    console.log(" send_message(null)")
                }
            }, error: function () {
                layer.msg("提交失败，请稍后再试", {
                    icon: 2,
                    time: 1000,
                })
            }
        })
        //todo 待审核能工作后，将其放在 97行
        send_message(null)
    })
}


/****** For netty Test ******/

function netty_connection() {
    ws.onopen = function () {
        console.log("连接成功.")
    }
    ws.onmessage = function (ev) {
        const data =JSON.parse(ev.data)
        showMessage(data);
    }
    ws.onclose = function () {
        console.log("连接关闭")
    }
    ws.onerror = function () {
        console.log("连接异常")
    }
}

function send_message(val) {
    if (user.account === undefined) {
        layer.msg("请登录后再评论")
        return;
    }
    const account=user.userId;
    const location= window.location.href.split('/')[3];
    NETTY_JSON.id=generateRandomStringAndHex(16)
    NETTY_JSON.account=account
    let content = $('#comment').val();
    if (val === null) {
        NETTY_JSON.content = content;
    } else {
        NETTY_JSON.content=val
    }
    NETTY_JSON.type='comment';
    NETTY_JSON.location=location
    ws.send(JSON.stringify(NETTY_JSON))
}

function showMessage(ev) {
    if (ev.location !== NETTY_JSON.location) {
        return
    }
    const id=ev.id
    const message=ev.content
    if (isValidURL(message)) {
      let element=  `<div class="comment_item" id="${id}"> <span style="color: #00B894;font-weight: bold;">${user.account}：</span>
                                    <img class="comment_reply_img" src="${message}" style='width: 100px;height: 100px;' lay-on="test-tips-photos-one">
                                    <button type="button" class="layui-btn layui-btn-primary " id='reply_btn_${ev.id}' lay-on="test-offset-r" onclick="reply()">回复</button>
                                </div>`;
        $('.comment_list').append(element);
    } else {
        const element = `<li class="comment_item" id='comment_${id}'> <span>${user.account}：</span> ${message}
                                        <button type="button" class="layui-btn layui-btn-primary " id='reply_btn_${ev.id}' lay-on="test-offset-r" onclick="reply()">回复</button>`;
        $('.comment_list').append(element);
    }
    const modal = document.getElementById("modal");

    const modalImg = document.getElementById("modalImage");

    const images = document.querySelectorAll(".comment_reply_img");
    images.forEach(function (image) {
        image.addEventListener("click", function () {
            modal.style.display = "block";
            modalImg.src = this.src;
        });
    });

    var span = document.querySelector(".close");

    span.addEventListener("click", function () {
        modal.style.display = "none";
    });

    modal.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}


/******* End *****************/

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.lang = 'zh-CN';
recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.onresult = function (event) {
    var yourComment = event.results[0][0].transcript
    console.log(event.results[0][0].transcript)
    //把结果显示在输入框上
    app.message += yourComment;
    console.log("输入的内容为：" + app.message);
    //window.location.reload("#comment");
}

function commentByMicrophone() {
    console.log("开始输入")
    layui.use('layer', function () {
        layer.msg("开始语音输入", {
            icon: 6,
            time: 1000
        })
        recognition.start();
    })
}

function stopinputByMicrophone() {
    console.log("停止输入")
    layui.use('layer', function () {
        layer.msg("停止语音输入", {
            icon: 6,
            time: 1000
        })
        recognition.stop();
    })
}

function findAllComment(blogId) {
    layui.use('laypage', function () {
        let laypage = layui.laypage;
        laypage.render({
            elem: 'commentPage',
            count: 100,
            limit: 20,
            jump: function (obj, first) {
                let curr = obj.curr;
                $.ajax({
                    type: 'POST',
                    url: baseUrl + '/fe-chat/getByPage',
                    data: {
                        'location': NETTY_JSON.location,
                        'pageNo': curr,
                        'pageSize': 20
                    },
                    dataType: 'json',
                    success: function (res) {
                        $('.comment_list').empty();
                        for (let i = 0; i < res.length; i++) {
                            showMessage(res[i])
                        }
                    }
                })
            }
        })
    })
}


function reply() {
    layui.use(function () {
        var layer = layui.layer;
        var util = layui.util;
        var $ = layui.$;
        // 事件
        util.on('lay-on', {
            'test-offset-r': function () {
                layer.open({
                    title: false,
                    type: 2,
                    offset: 'r',
                    anim: 'slideLeft',
                    area: ['560px', '100%'],
                    shade: 0.1,
                    shadeClose: false,
                    scrollbar: true,
                    id: 'ID-demo-layer-direction-r',
                    content: 'reply.html?rid=' + $(this).attr('id'),
                    success: function (layero) {//成功 后回调方法
                        layero.find('.layui-layer-close2').remove(); //去掉关闭按钮
                    },
                });
            }
        })
        $(document).on("click", ".layui-layer-shade", function () {
            layer.confirm('你的编辑不会保存，是否离开？', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                layer.closeAll()
            }, function () {

            });
        })
    })
}

function theResultOfAudit(audited) {
    let blogId = window.location.href.split('=')[1];
    $.ajax({
        type: 'POST',
        url: baseUrl + '/fe-blog/resultOfAudit',
        data: {
            "blog_id": blogId,
            "audited": audited,
        },
        dataType: 'json',
        success: function (res) {
            if (res.code !== 200) {
                layer.msg("res.msg");
                return;
            }
            parent.layer.closeAll();
            layer.msg(res.msg);
            setTimeout(function () {
                parent.layer.closeAll();
                window.location.href = '../pages/auditBlog.html';
            }, 2000)
        },
        error: function () {
            console.log("错误");
            // 关闭加载图标
            layer.closeAll('loading');
        }
    });
}

function passTheAudit() {
    let audited = true;
    theResultOfAudit(audited);
}

function failTheAudit() {
    let audited = false;
    theResultOfAudit(audited);
}
