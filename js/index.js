let imageList = [];
$(function () {
    indexTextLoad();
    let temp = parseInt(10000 * Math.random());
    $('.avatar_img').attr('src', '/avatar.png');
    $('.banner_btn').on('click', function () {
        $('html, body').animate({
            scrollTop: $('#content').offset().top
        }, 500);
    })

})

//获取首页
function indexTextLoad() {
    $.ajax({
        type: 'GET',
        url: baseUrl+ '/fe-blog/FindHomePage',
        data: {},
        dataType: 'json',
        size: 2048,
        success: function (res) {
            console.log(res);
            let data = res.data
            $('#index_title').text(data[0]['title']);
            $('#index_welcome').text(data[0]['welcome']);
            $('#index_description').text(data[0]['description']);
            $('#index_announcement').text(data[0]['announcement']);
            $('.banner').css({
                'background': `url("/${data[0]['banner']}") no-repeat`,
                'background-size': 'cover',
                'background-attachment': 'fixed'
            })

            pageBlogLoad();
            isLogin();


        },
        error: function () {
            console.log('获取失败');
        }
    })
}

//用于显示右侧的用户管理按钮
function isLogin() {
    $.ajax({
        type: 'GET',
        url: baseUrl+'/fe-user/UserLoginController',
        data: {},
        dataType: 'json',
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token",localStorage.token);
        },
        success: function (res) {
            console.log(res);
            //跳转登录界面
            if (res.code === 404) {
                $('.user_img_frame').on('click', function () {
                    window.open('../login.html');
                })

                $('.user_func').empty();
            } else {
                let element;
                if (res.data.status !== "注册用户") {
                    element = `
                <a class="user_func_box" href="./pages/newblog.html">
                <i class="fa fa-pencil"></i>
                <span>新建博客</span>
            </a>
            <a class="user_func_box" href="./pages/manageblog.html">
                <i class="fa fa-bars"></i>
                <span>管理文章</span>
            </a>
            <a class="user_func_box" href="./pages/userinfo.html">
                <i class="fa fa-user"></i>
                <span>我的信息</span>
            </a>
            <a class="user_func_box" href="./pages/userinfo.html">
                <i class="fa fa-tachometer"></i>
                <span>进入后台</span>
            </a>`;
                } else {
                    element = `            
            <a class="user_func_box" href="./pages/userinfo.html">
                <i class="fa fa-user"></i>
                <span>我的信息</span>
            </a>`;
                }
                $('.user_func').empty().append(element);
                userInfoLoad();
            }
        },
        error: function (res) {
            console.log('请求出错');
        }
    })
}

/* function loginPage(){
    $('.user_img_frame')
} */

// 显示所有博客
function pageBlogLoad() {
    $.ajax({
        type: 'GET',
        url: baseUrl+'/fe-blog/AllBlogCountServlet',
        data: {},
        dataType: 'json',
        success: function (res) {
            if (res.code !== 200) {
                console.log("加载失败");
                return;
            }
            console.log(res);
            const allCount = res.data;
            layui.use(['laypage', 'layer'], function () {
                let laypage = layui.laypage;
                let layer = layui.layer;
                let curr = 1;
                laypage.render({
                    elem: 'laypage',
                    count: allCount,
                    limit: 5,
                    jump: function (obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                        console.log(obj.limit); //得到每页显示的条数
                        curr = obj.curr;


                        if (!first) {
                            //do something
                            layer.load(1);
                            $('html, body').animate({
                                scrollTop: $('#content').offset().top - 600
                            }, 0);

                        }
                        $.ajax({
                            type: 'GET',
                            url: baseUrl+'/fe-blog/SelectLimitBlogController',
                            data: {
                                'desk': 'front',
                                'page': (curr - 1) * 5,
                                'size': 5
                            },
                            dataType: 'json',
                            success: function (res) {
                                console.log(res.data);
                                let data = res.data;
                                let blog_list = [];
                                for (let key in data) {
                                    let tags = [];
                                    imageList.push(data[key].blog.mediaName)
                                    for (let i = 0; i < data[key].tag.length; i++) {
                                        let tag_element = `<span>${data[key].tag[i]['name']}</span>`;
                                        tags.push(tag_element);
                                    }
                                    let element = `
                                    <li class="blog_list_item animal-left" id = '${data[key].blog['blogId']}'>
                                    <div class="blog_img_frame">
                                        <img src="/avatar.jpg" alt="封面图片" class="blog_fm">
                                    </div>
                                    <div class="blog_info_frame">
                                        <div class="blog_title">${data[key].blog['title']}</div>
                                        <div class="blog_info">
                                            <p>
                                                发表时间：<span class="time">${data[key].blog['createTime']}</span> |
                                                分类：<span class="field">${data[key].field}</span>
                                            </p>
                                        </div>
                                        <div class="blog_description">
                                            <p>${data[key].blog['description']}</p>
                                        </div>
                                        <div class="blog_tags">
                                            <div><i class="fa fa-tags"></i>${tags.join('')}</div>
                                        </div>
                                    </div>
                                     </li>
                                    `
                                    blog_list.push(element);


                                }
                                console.log("imageList is:" + imageList);
                                $('.content_blog_list').empty().append(blog_list.join(''));
                                parent.layer.closeAll();
                                if (first) {
                                    load();
                                }

                                animate();
                                fm();
                                $('.blog_list_item').each(function () {
                                    $(this).on('click', function () {
                                        window.location.href = 'article.html' + '?' + 'blogId=' + $(this).attr('id');
                                    })
                                })

                            }

                        })
                    }
                })
            })
        }
    })


}

//加载标题和欢迎语
function load() {

    setTimeout(function () {
        $('.load_cover').animate({
            'top': '-100%'
        }, 100, function () {
            $(document.body).css({
                'overflow': 'auto'
            })
            $('.welcome').fadeIn('slow');
            $('.other_text').fadeIn('slow');
            $('.banner_btn').fadeIn('slow');
        })
    }, 200)


}

//博客的封面，就是从image选取的
function fm() {
    let index=0;
    $('.blog_fm').each(function () {
        $(this).attr('src', '' + imageList[index]);
        index++;
    })
}

function userInfoLoad() {
    $.ajax({
        type: 'GET',
        url: baseUrl+'/fe-user/UserLoginController',
        headers:{token:localStorage.token},
        data: {},
        dataType: 'json',
        // 在 jQuery 中，.val() 通常用于表单元素，而对于非表单元素（如 div），使用 .text() 来设置文本内容
        success: function (res) {
            let data = res.data;
            if (data != null) {
                $('.avatar_img').attr("src", data.avatar)
                $('.setNickname').text(data.nick);  // 使用 .text() 设置文本内容
                $('.setProfile').text(data.profile); // 使用 .text() 设置文本内容
            }

        }
    })
}

//主页面的动画效果,包括主页面加载和图片旋转
function animate() {
    ScrollReveal().reveal('.animal-left', {
        //delay延迟
        delay: 200,
        //移动距离
        distance: '100px',
        //持续时间
        duration: 600,
        //动画效果
        easing: 'ease-out',
        //动画间隔
        interval: 200,
        //透明度
        opicaty: 0,
        //起始位置
        origin: 'left',
        //旋转角度
        rotate: {
            x: 0,
            Y: 0,
            z: 0
        },
        //reset
        reset: false
    })
    ScrollReveal().reveal('.animal-top', {
        //delay延迟
        delay: 100,
        //移动距离
        distance: '200px',
        //持续时间
        duration: 500,
        //动画效果
        easing: 'ease-out',
        //动画间隔
        interval: 100,
        //透明度
        opicaty: 0,
        //起始位置
        origin: 'top',
        //旋转角度
        rotate: {
            x: 0,
            Y: 0,
            z: 0
        },
        //reset
        reset: false
    })
    ScrollReveal().reveal('.animal-bottom', {
        //delay延迟
        delay: 200,
        //移动距离
        distance: '100px',
        //持续时间
        duration: 600,
        //动画效果
        easing: 'ease-out',
        //动画间隔
        interval: 100,
        //透明度
        opicaty: 0,
        //起始位置
        origin: 'bottom',
        //旋转角度
        rotate: {
            x: 0,
            Y: 0,
            z: 0
        },
        //reset
        reset: false
    })
}