let commentId = window.location.href.split('=')[1].split('_')[2];
let clickCount = 0;
let timeout;
const id=generateRandomStringAndHex(16)
const replyLocation= window.location.href.split('=')[3]

$(function () {
    if (user.account===undefined) {
        load_user();
    }
    NETTY_JSON.location=replyLocation;
    reply_content_load()
    netty_connection();
})

/** add reply **/
function auditResponse() {
    if (!handleClick()) {
        layui.use('layer', function () {
            layer.msg("您说话太快了,请慢点说", {
                icon: 1,
                time: 1000
            })
        });
        return;
    }
    if (user.account === undefined) {
        layui.use('layer', function () {
            layer.msg("请登录后再回复", {
                icon: 6,
                time: 1000
            })
        });
        return;
    }
    const str = Math.random().toString(36).slice(2);
    let content = $('#reply').val()
    if (content === '' || content == null) {
        layui.use('layer', function () {
            layer.msg("请输入内容", {
                icon: 2,
                time: 1000
            })
        })
        return;
    }

    $.ajax({
        type: 'POST',
        url: 'https://gtf.ai.xingzheai.cn/v2.0/game_chat_ban/detect_text',
        data: {
            'token': 'LUJGYW0SB7KHIOZN',
            'data_id': str,
            'context_type': 'post',
            'context': content,
            'suggestion': '',
            'label': ''
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            let sug = data.data.suggestion;
            if (sug !== "pass") {
                layui.use('layer', function () {
                    let layer = layui.layer;
                    layer.msg("含有非法词汇,发布失败", {
                        icon: 2,
                        time: 2000
                    })
                })
            } else {
                add(content);
            }
        }, error: function () {
            layui.use('layer', function () {
                let layer = layui.layer;
                layer.msg("自带审核,请稍后再试", {
                    icon: 2,
                    time: 2000
                })
            })
            // add(content)
            send_message(content);
        }
    })
}

function add(content) {

}


function reply_content_load() {
    load_user();
    layui.use('laypage', function () {
        let laypage = layui.laypage;
        laypage.render({
            elem: 'reply_page',
            count: 100,
            limit: 10,
            jump: function (obj, first) {
                let curr = obj.curr;
                $.ajax({
                    type: 'POST',
                    url: baseUrl + '/fe-chat/getByPage',
                    data: {
                        'location': NETTY_JSON.location,
                        'pageNo': curr,
                        'pageSize': 12
                    },
                    dataType: 'json',
                    success: function (res) {
                        $('.reply_comment').empty();
                        if (res.length === 0) {
                            return;
                        }
                        if (res.msg !== undefined) {
                            layer.msg("加载失败");
                        }
                        for (let i = 0; i < res.length; i++) {
                            showMessage(res[i]);
                        }
                    },
                    error(err) {
                        layer.msg("加载失败")
                    },
                });
            }
        })
    })
    $.ajax({
        type: 'GET',
        url: baseUrl + '/fe-ornament/getCommentedUser',
        data: {
            cid: commentId,
        },
        success: function (res) {
            let user = res.data.user;
            let comment = res.data.comment;
            $('.comment_avatar>img').attr("src", user.avatar)
            $('.nav_title>h2').text(user.account);
            $('.nav_content>h3').text("评论:" + comment.content)
        },
        error: function (res) {
            console.error(res)
        }
    })
}

/** End for reply *(/
 /****** For netty Test ******/

function netty_connection() {
    ws.onopen = function () {
        console.log("连接成功.")
    }
    ws.onmessage = function (ev) {
        const data=JSON.parse(ev.data)
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
        layer.msg("请登录后再回复")
        return;
    }
    const account=user.userId;
    NETTY_JSON.id=id
    NETTY_JSON.account=account
    const content = $('#reply').val();
    if (val === null) {
        NETTY_JSON.content = content;
    } else {
        NETTY_JSON.content=val
    }
    NETTY_JSON.type='reply';
    ws.send(JSON.stringify(NETTY_JSON))
}

function showMessage(ev) {

    if (ev.location !== NETTY_JSON.location) {
        return
    }
    const message=ev.content
    if (isValidURL(message)) {
        const element = `<div class="comment_item" id="${id}"> <span style="color: #00B894;font-weight: bold;">${user.account}：</span>
                                    <img class="comment_reply_img" src="${message}" style='width: 100px;height: 100px;' lay-on="test-tips-photos-one">
                                </div>`;
        $('.reply_comment').append(element);
    } else {
        let element = `<div class="comment_item" id="${id}"> <span style="color: #00B894;font-weight: bold;">${user.account}：</span> ${message}</div>`;
        $('.reply_comment').append(element);
    }
    var modal = document.getElementById("modal");

    var modalImg = document.getElementById("modalImage");

    var images = document.querySelectorAll(".comment_reply_img");
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


/****  Voice ****/

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.lang = 'zh-CN';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.onresult = function (event) {
    var yourComment = event.results[0][0].transcript
    console.log(event.results[0][0].transcript)
    //把结果显示在输入框上
    $('#reply').append(yourComment);
    //存储回复内容
}

function responseByMicrophone() {
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

/** End for voice input **/


//限制发送次数
function handleClick() {
    if (clickCount > 2) {
        clearTimeout(timeout);
        return false
    } else {
        clickCount++;
        return true;
    }
}

//清零
function resetClickCount() {
    clickCount = 0;
}

setInterval(resetClickCount, 7500)
