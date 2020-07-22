let cropperCss = document.createElement('link');
cropperCss.setAttribute('rel', 'stylesheet');
cropperCss.setAttribute('href', '/static/plugins/cropper/cropper.min.css');
document.body.appendChild(cropperCss);
let cropperJs = document.createElement('script');
cropperJs.setAttribute('src', '/static/plugins/cropper/cropper.min.js');
document.body.appendChild(cropperJs);
layui.define(['upload', 'kit'], function (exports) {
    const upload = layui.upload
    const kit = layui.kit

    const html = `<div class="layui-fluid" id="cropperNode" style="display: none">
    <div class="layui-row">
        <div class="layui-col-sm8" style="min-height: 9rem;">
            <div style="height:400px;background-color: rgb(247, 247, 247);">
                <img src="" id="cropperImage">
            </div>
        </div>
        <div class="layui-col-sm4 layui-hide-xs" style="height:400px;position:relative;padding: 15px;text-align: center;">
            <div class="img-preview" style="width:200px;height:200px;overflow:hidden">
            </div>
            <div style="text-align: center;position:absolute;bottom:0;">
                <div class="layui-row" style="margin-bottom: 10px;">
                    <button title="左移" data-method="setAspectRatio" data-option="16" data-second-option="9" class="layui-btn layui-btn-sm"
                        type="button">
                        16:9
                    </button>
                    <button title="右移" data-method="setAspectRatio" data-option="4"  data-second-option="3" class="layui-btn layui-btn-sm"
                        type="button">
                        4:3
                    </button>
                    <button title="左移" data-method="setAspectRatio" data-option="1"  data-second-option="1" class="layui-btn layui-btn-sm"
                        type="button">
                        1:1
                    </button>
                    <button title="右移" data-method="setAspectRatio" data-option="2"  data-second-option="3"  class="layui-btn layui-btn-sm"
                        type="button">
                        2:3
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="layui-row layui-col-space10" style="text-align: center; margin-top: 10px;">
        <div class="layui-btn-group" style="margin-left: 10px">
            <button title="放大" data-method="zoom" data-option="0.1" class="layui-btn icon-btn" type="button">
                <i class="layui-icon layui-icon-add-1"></i></button>
            <button title="缩小" data-method="zoom" data-option="-0.1" class="layui-btn icon-btn" type="button">
                <span
                    style="display: inline-block;width: 12px;height: 2.5px;background: rgba(255, 255, 255, 0.9);vertical-align: middle;margin: 0 4px;"></span>
            </button>
        </div>
        <div class="layui-btn-group">
            <button title="向左旋转" data-method="rotate" data-option="-45" class="layui-btn icon-btn" type="button">
                <i class="layui-icon layui-icon-refresh-1"
                    style="transform: rotateY(180deg) rotate(40deg);display: inline-block;">
                </i>
            </button>
            <button title="向右旋转" data-method="rotate" data-option="45" class="layui-btn icon-btn" type="button">
                <i class="layui-icon layui-icon-refresh-1" style="transform: rotate(30deg);display: inline-block;">
                </i>
            </button>
            <button title="左右翻转" data-method="scaleX" data-option="-1" class="layui-btn icon-btn" type="button"
                style="position: relative;width: 41px;"><i class="layui-icon layui-icon-triangle-r"
                    style="position: absolute;left: 9px;top: 0;transform: rotateY(180deg);font-size: 16px;"></i>
                <i class="layui-icon layui-icon-triangle-r"
                    style="position: absolute; right: 3px; top: 0;font-size: 16px;"></i>
            </button>
            <button title="上下翻转" data-method="scaleY" data-option="-1" class="layui-btn icon-btn" type="button"
                style="position: relative;width: 41px;">
                <i class="layui-icon layui-icon-triangle-d"
                    style="position: absolute;left: 11px;top: 6px;transform: rotateX(180deg);line-height: normal;font-size: 16px;"></i>
                <i class="layui-icon layui-icon-triangle-d"
                    style="position: absolute; left: 11px; top: 14px;line-height: normal;font-size: 16px;"></i>
            </button>
        </div>
        <div class="layui-btn-group">
            <button title="左移" data-method="move" data-option="-10" data-second-option="0" class="layui-btn icon-btn"
                type="button"><i class="layui-icon layui-icon-left"></i>
            </button>
            <button title="右移" data-method="move" data-option="10" data-second-option="0" class="layui-btn icon-btn"
                type="button"><i class="layui-icon layui-icon-right"></i>
            </button>
            <button title="上移" data-method="move" data-option="0" data-second-option="-10" class="layui-btn icon-btn"
                type="button"><i class="layui-icon layui-icon-up"></i>
            </button>
            <button title="下移" data-method="move" data-option="0" data-second-option="10" class="layui-btn icon-btn"
                type="button"><i class="layui-icon layui-icon-down"></i>
            </button>
        </div>
        <div class="layui-btn-group">
            <button title="重新开始" data-method="reset" class="layui-btn icon-btn" type="button">
                <i class="layui-icon layui-icon-refresh"></i></button>
            <button title="选择图片" id="cropperImageUpload" class="layui-btn icon-btn" type="button"
                style="border-radius: 0 2px 2px 0;">
                <i class="layui-icon layui-icon-upload-drag"></i>
            </button>
        </div>
        <div class="layui-btn-group">
            <button type="button" class="layui-btn layui-bg-red" id="cropperConfirmSave" type="button">
                保存</button>
        </div>
    </div>
</div>`;

    const imageListClass = 'image-list'
    const imageItemClass = 'image-item'
    const uploadBtnElem = '.btn-upload-img'
    const uploadListBtnElem = '.btn-upload-img-list'

    uploadImg = function () {
        this.config = {
            elem: uploadBtnElem,
            name: '',
            url: window.config.uploadImageUrl,
            multiple: false,
            move: false,
            width: 150,
            height: 113,
            desc: false,
            link: true,
            del: true,
            edit: true,
            list: []
        }
    }

    uploadImg.prototype.init = function (options = {}) {
        let that = this
        $.extend(true, that.config, options);
        this.showImg()
        upload.render({
            elem: that.config.elem,
            url: that.config.url,
            multiple: that.config.multiple,
            before: function (obj) {
                kit.load()
            }, done: function (res) {
                layer.closeAll('loading')
                let div = this.item.parents('div').eq(0);
                if (res.code === kit.successCode) {
                    let src = res.data.src
                    if (that.config.multiple) {
                        $(div).find('ul').eq(0).append(that.getImgItem(src));
                        if (that.config.move) {
                            document.querySelectorAll(imageListClass).forEach(element => {
                                that.move(element)
                            })
                        }
                    } else {
                        $(div).find('input').eq(0).val(src);
                        $(div).find('ul').eq(0).html(that.getImgItem(src));
                    }
                    kit.success(res.msg)
                } else {
                    kit.error(res.msg)
                }
            }
        });
        return that;
    }

    uploadImg.prototype.initMulti = function (options = {}) {
        let that = this
        options = Object.assign({ elem: uploadListBtnElem, multiple: true, move: true }, options)
        that.init(options)
    }

    uploadImg.prototype.getImgItem = function (url) {
        let that = this
        if (!url || Object.keys(url).length === 0) {
            return ''
        }
        let html = ''
        if (typeof url === 'array') {
            url.forEach(element => {
                html += that.getImgItem(element)
            })
        } else {
            let clickOpt = url.substring(0, 5) != 'data:' ? `onclick="window.open('${url}')"` : ''
            html += '<li style="position:relative">'
            html += `<img src="${url}" width="${that.config.width}" height="${that.config.height}" ${clickOpt}>`
            that.config.desc && (html += '<div class="title_cover" onclick="uploadImg.prototype.editImageDescribe(this)"></div>')
            that.config.edit && (html += '<div class="img_edit layui-icon layui-icon-edit" onclick="uploadImg.prototype.editImage(this)"></div>')
            that.config.link && (html += '<div class="img-edit-src layui-icon layui-icon-link" onclick="uploadImg.prototype.editImageSrc(this)"></div>')
            that.config.del && (html += '<div class="img_close" onclick="uploadImg.prototype.deleteImage(this)">X</div>')
            that.config.name && (html += `<input type="hidden" name="${that.config.name}[]">`)
            html += '</li>'
        }
        return html
    }

    uploadImg.prototype.showImg = function () {
        let that = this
        let defCls = {
            uploadBtnElem: imageItemClass,
            uploadListBtnElem: imageListClass
        }
        let cls = ''
        if (defCls[that.config.elem]) {
            cls = defCls[that.config.elem]
        } else {
            cls = that.config.multiple ? imageListClass : imageItemClass
        }
        let btn = document.querySelector(that.config.elem)
        let parent = btn.parentNode
        if (!btn) {
            return false
        }
        if (parent.querySelector('ul') == null) {
            parent.insertAdjacentHTML('afterbegin', `<ul class="${cls}" ajaxUrl="${that.config.url}" multi="${that.config.multiple ? 1 : 0}"></ul>`)
        } else {
            parent.querySelector('ul').classList.add(cls)
        }
        if (that.config.multiple) {
            if (that.config.list) {
                parent.querySelector('ul').html = that.getImgItem(that.config.list)
            }
        } else {
            let input = parent.querySelector('input').insertAdjacentHTML
            if (input) {
                parent.querySelector('ul').html = that.getImgItem(input.value)
            } else {
                parent.insertAdjacentHTML('afterbegin', `<input type="hidden" name="${that.config.name}" value="">`)
            }
        }
    }
    // 编辑图片
    uploadImg.prototype.editImage = function (obj) {
        let src = obj.parentNode.querySelector('img').getAttribute('src')
        if (!src) {
            return false
        }
        uploadImg.prototype.edit({
            imgUrl: src,
            ajaxUrl: obj.parentNode.parentNode.getAttribute('ajaxUrl'),
            callback: (url) => {
                obj.parentNode.querySelector('img').setAttribute('src', url)
                let multiple = obj.parentNode.parentNode.getAttribute('multi')
                let input = null
                if (multiple) {
                    input = obj.parentNode.querySelector('input')
                } else {
                    input = obj.parentNode.parentNode.parentNode.querySelector('input')
                }
                if (input && input.getAttribute('type') != 'file') {
                    input.value = url
                }
            }
        })
    }
    //图片删除
    uploadImg.prototype.deleteImage = function (obj) {
        obj.parentNode.parentNode.removeChild(obj.parentNode);
    }
    //描述
    uploadImg.prototype.editImageDescribe = function (obj) {
        layer.prompt({ title: '请填新的描述', formType: 2 }, function (text, index) {
            obj.innerHTML = text;
            layer.close(index);
        });
    }
    // 图片地址
    uploadImg.prototype.editImageSrc = function (obj) {
        layer.prompt({ title: '请输入图片地址', formType: 2 }, function (text, index) {
            obj.parentNode.querySelector('img').setAttribute('src', text)
            obj.parentNode.parentNode.parentNode.querySelector('input').value = text
            layer.close(index);
        });
    }
    uploadImg.prototype.edit = function (options) {
        let imgUrl = options.imgUrl
        let callback = options.callback
        let ajaxUrl = options.ajaxUrl || window.config.uploadImageUrl

        if (document.getElementById('cropperNode') !== null) {
            document.getElementById('cropperNode').remove()
        }
        document.body.insertAdjacentHTML('beforeend', html);
        let cropperImageObj = document.getElementById('cropperImage');
        cropperImageObj.setAttribute('src', imgUrl)

        let content = $('#cropperNode')

        let cropperObj = null

        let windowWidth = $(window).width()
        let windowHeight = $(window).height()
        let width = windowWidth <= 1024 ? windowWidth * 0.9 : 800
        let height = windowHeight <= 768 ? windowHeight * 0.95 : 550

        layer.open({
            title: "图片裁剪",
            type: 1,
            content: content,
            area: [width + 'px', height + 'px'],
            success: function () {
                cropperObj = new Cropper(cropperImageObj, {
                    // aspectRatio: 16:9,
                    preview: '.img-preview',
                    viewMode: 1,
                    ready() {
                        cropperObj.zoom(-1);
                    },
                })
                upload.render({
                    elem: '#cropperImageUpload',
                    auto: false,
                    choose: function (obj) {
                        obj.preview(function (index, file, result) {
                            cropperObj.replace(result)
                        });
                    }
                });
            },
            cancel: function (index) {
                layer.close(index);
                cropperObj.destroy()
            }
        })
        $(".layui-btn").on('click', function () {
            let event = $(this).attr('data-method');
            let option = $(this).attr('data-option');
            let secondOpt = $(this).attr('data-second-option')
            switch (event) {
                case 'zoom':
                    cropperObj.zoom(option);
                    break
                case 'rotate':
                    cropperObj.rotate(option)
                    break
                case 'move':
                    cropperObj.move(option, secondOpt)
                    break
                case 'scaleX':
                    cropperObj.scaleX(option)
                    $(this).attr('data-option', -1 * option)
                    break
                case 'scaleY':
                    cropperObj.scaleY(option)
                    $(this).attr('data-option', -1 * option)
                    break
                case 'reset':
                    cropperObj.reset()
                    break
                case 'setAspectRatio':
                    cropperObj.setAspectRatio(option / secondOpt)
                    break
            }
        })
        document.getElementById('cropperConfirmSave').addEventListener('click', () => {
            cropperObj.getCroppedCanvas().toBlob((blob) => {
                const formData = new FormData();
                let timestamp = Date.parse(new Date());
                formData.append('file', blob, timestamp + '.jpeg');
                $.ajaxSetup({
                    async: false,
                    processData: false,
                    contentType: false,
                });
                kit.post(ajaxUrl, formData).done((res) => {
                    layer.closeAll();
                    return callback(res.data.src);//返回图片src
                })
            }, 'image/jpeg');
        })
    }

    uploadImg.prototype.move = function (element) {
        let oUl = element;
        let aLi = oUl.getElementsByTagName("li");
        let disX = 0;
        let disY = 0;
        let minZindex = 1;
        let aPos = [];
        let leftbz = 0;
        let topbz = 0;
        for (let i = 0; i < aLi.length; i++) {
            if (leftbz == 5) {
                leftbz = 1;
                topbz += 1;
                let fdiv = (topbz + 1) * 130;
                oUl.style.height = fdiv + 'px';
            }
            else {
                leftbz += 1;
            }
            //let l = aLi[i].offsetLeft;
            //let t = aLi[i].offsetTop;
            //此处注意，我是按照控件算出来的。尴尬。。。/(ㄒoㄒ)/~~
            let l = 170 * (leftbz - 1) + 10;
            let t = 130 * topbz;

            aLi[i].style.top = t + "px";
            aLi[i].style.left = l + "px";
            aPos[i] = { left: l, top: t };
            aLi[i].index = i;


        }
        for (let i = 0; i < aLi.length; i++) {
            aLi[i].style.position = "absolute";
            aLi[i].style.margin = 0;
            setDrag(aLi[i]);
        }
        //拖拽
        function setDrag(obj) {
            obj.onmouseover = function () {
                obj.style.cursor = "move";
            }
            obj.onmousedown = function (event) {
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                obj.style.zIndex = minZindex++;
                //当鼠标按下时计算鼠标与拖拽对象的距离
                disX = event.clientX + scrollLeft - obj.offsetLeft;
                disY = event.clientY + scrollTop - obj.offsetTop;
                document.onmousemove = function (event) {
                    //当鼠标拖动时计算div的位置
                    let l = event.clientX - disX + scrollLeft;
                    let t = event.clientY - disY + scrollTop;
                    obj.style.left = l + "px";
                    obj.style.top = t + "px";
                    /*for(let i=0;i<aLi.length;i++){
                        aLi[i].className = "";
                        if(obj==aLi[i])continue;//如果是自己则跳过自己不加红色虚线
                        if(colTest(obj,aLi[i])){
                            aLi[i].className = "active";
                        }
                    }*/
                    for (let i = 0; i < aLi.length; i++) {
                        aLi[i].className = "";
                    }
                    let oNear = findMin(obj);
                    if (oNear) {
                        oNear.className = "active";
                    }
                }
                document.onmouseup = function () {
                    document.onmousemove = null;//当鼠标弹起时移出移动事件
                    document.onmouseup = null;//移出up事件，清空内存
                    //检测是否普碰上，在交换位置
                    let oNear = findMin(obj);
                    if (oNear) {
                        oNear.className = "";
                        oNear.style.zIndex = minZindex++;
                        obj.style.zIndex = minZindex++;
                        startMove(oNear, aPos[obj.index]);
                        startMove(obj, aPos[oNear.index]);
                        //交换index
                        oNear.index += obj.index;
                        obj.index = oNear.index - obj.index;
                        oNear.index = oNear.index - obj.index;
                    } else {
                        startMove(obj, aPos[obj.index]);
                    }
                }
                clearInterval(obj.timer);
                return false;//低版本出现禁止符号
            }
        }
        function startMove(obj, json, callback) {
            clearInterval(obj.timer);
            obj.timer = setInterval(function () {
                let isStop = true;
                for (let attr in json) {
                    let iCur = obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
                    //判断运动的是不是透明度值
                    if (attr == "opacity") {
                        iCur = parseInt(parseFloat(iCur) * 100);
                    } else {
                        iCur = parseInt(iCur);
                    }
                    let speed = (json[attr] - iCur) / 8;
                    //运动速度如果大于0则向下取整，如果小于0想上取整；
                    speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                    //判断所有运动是否全部完成
                    if (iCur != json[attr]) {
                        isStop = false;
                    }
                    //运动开始
                    if (attr == "opacity") {
                        obj.style.filter = "alpha:(opacity:" + (json[attr] + speed) + ")";
                        obj.style.opacity = (json[attr] + speed) / 100;
                    } else {
                        obj.style[attr] = iCur + speed + "px";
                    }
                }
                //判断是否全部完成
                if (isStop) {
                    clearInterval(obj.timer);
                    if (typeof callback == 'function') {
                        callback()
                    }
                }
            }, 30);
        }
        //碰撞检测
        function colTest(obj1, obj2) {
            let t1 = obj1.offsetTop;
            let r1 = obj1.offsetWidth + obj1.offsetLeft;
            let b1 = obj1.offsetHeight + obj1.offsetTop;
            let l1 = obj1.offsetLeft;

            let t2 = obj2.offsetTop;
            let r2 = obj2.offsetWidth + obj2.offsetLeft;
            let b2 = obj2.offsetHeight + obj2.offsetTop;
            let l2 = obj2.offsetLeft;

            if (t1 > b2 || r1 < l2 || b1 < t2 || l1 > r2) {
                return false;
            } else {
                return true;
            }
        }
        //勾股定理求距离
        function getDis(obj1, obj2) {
            let a = obj1.offsetLeft - obj2.offsetLeft;
            let b = obj1.offsetTop - obj2.offsetTop;
            return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        }
        //找到距离最近的
        function findMin(obj) {
            let minDis = 999999999;
            let minIndex = -1;
            for (let i = 0; i < aLi.length; i++) {
                if (obj == aLi[i]) continue;
                if (colTest(obj, aLi[i])) {
                    let dis = getDis(obj, aLi[i]);
                    if (dis < minDis) {
                        minDis = dis;
                        minIndex = i;
                    }
                }
            }
            if (minIndex == -1) {
                return null;
            } else {
                return aLi[minIndex];
            }
        }
    }

    exports('uploadImg', (options = {}) => {
        if (options.multiple) {
            return new uploadImg().initMulti(options);
        } else {
            return new uploadImg().init(options);
        }
    });
});