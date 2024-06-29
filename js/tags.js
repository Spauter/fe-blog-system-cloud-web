$(function () {
    //加载全部标签
    allTagsLoad();
})

function load() {
    setTimeout(function () {
        $('.load_cover').animate({
            'top': '-100%'
        }, 100, function () {
            animate();
            $(document.body).css({
                'overflow': 'auto'
            })


        })
    }, 200)
}

function allTagsLoad() {
    $.ajax({
        type: 'GET',
        url:baseUrl+ '/fe-category/SelectAllTagController',
        data: {},
        dataType: "json",
        success: function (res) {
            let data = res.data;
            let tags = [];
            for (let i = 0; i < data.length; i++) {
                let element = `
                <li class="tags_item animal-top" id="${data[i]['name']}">
                <div class="tags_name">
                    <span>${data[i]['name']}</span>
                </div>
                <div class="tags_count">
                    <span>展开</span>
                </div>
                <div class="tags_icon">
                    <i class="fa fa fa-chevron-down"></i>
                </div>
                <div class="tags_article">
                    <ul class="tags_article_list">
                    </ul>
                </div>
                </li>
                `;
                tags.push(element);

            }
            $('.tags_list').empty().append(tags.join(''));
            getTitle();
            load();

            let i = 0;
            let colorList = ['#2ed573', '#1e90ff', '#eccc68', '#ff7f50', '#ff6b81', '#2f3542', '#e056fd', '#7ed6df'];
            $('.tags_item').each(function (index) {
                if (i < colorList.length) {
                    $(this).css({
                        'background': colorList[i]
                    })
                    i++;
                } else {
                    i = 0;
                    $(this).css({
                        'background': colorList[i]
                    })
                    i++;
                }
            })
        }
    })
}

function getTitle() {
    $('.tags_item').each(function (element) {
        let name = $(this).attr('id');
        console.log($(this).attr('id'));
        let this_element = $(this).find('.tags_article').find('.tags_article_list');
        console.log(this_element);
        let list = [];
        $.ajax({
            type: 'GET',
            url:baseUrl+ '/fe-blog/TagFindblog',
            data: {
                'tagname': name,
            },
            dataType: 'json',
            success: function (res2) {
                console.log(res2.data);
                console.log(res2.data.length);
                for (let j = 0; j < res2.data.length; j++) {
                    let element2 = `
                        <li class="tags_article_item" id="${res2.data[j]['blogid']}">
                            <a href="article.html?blogId=${res2.data[j]['blogid']}"><span>${res2.data[j]['title']}</span></a>
                        </li>
                        `
                    list.push(element2);
                }
                this_element.empty().append(list.join(''));


            }
        })
    })


}

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
        distance: '80px',
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