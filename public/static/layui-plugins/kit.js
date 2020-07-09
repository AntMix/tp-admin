"use strict"
layui.define(['layer'], function (exprots) {
   const $ = layui.jquery
   let kit = {
      successCode: 0,
      // msg弹窗默认消失时间
      msgTime: 800,
      // 红色叉
      error: function (content, callback) {
         layer.msg(content ? content : '操作失败', { icon: 1, time: kit.msgTime }, callback)
      },
      // 绿色勾
      success: function (content, callback) {
         layer.msg(content ? content : '操作成功', { icon: 2, time: kit.msgTime }, callback)
      },
      // 黄色问号
      question: function (content, callback) {
         layer.msg(content ? content : '确认操作', { icon: 3, time: kit.msgTime }, callback)
      },
      // 灰色锁
      lock: function (content, callback) {
         layer.msg(content ? content : '操作锁定', { icon: 4, time: kit.msgTime }, callback)
      },
      // 红色哭脸
      cry: function (content, callback) {
         layer.msg(content ? content : '操作失败', { icon: 5, time: kit.msgTime }, callback)
      },
      // 绿色笑脸
      laugh: function (content, callback) {
         layer.msg(content ? content : '操作成功', { icon: 6, time: kit.msgTime }, callback)
      },
      // 黄色感叹号
      sign: function (content, callback) {
         layer.msg(content ? content : '禁止操作', { icon: 7, time: kit.msgTime }, callback)
      },
      /**
       * ajax()函数二次封装
       * @param {string} url 地址
       * @param {string} type 类型
       * @param {object} params 参数
       * @param {boolean} load 遮罩
       * @param {boolean} showMsg 显示返回信息
       * @returns {*|never|{always, promise, state, then}}
       */
      ajax: function (url, type, params, load = true, showMsg = true) {
         var deferred = $.Deferred()
         var loadIndex
         $.ajax({
            url: url,
            type: type || "get",
            data: params || {},
            dataType: "json",
            beforeSend: function () {
               if (load) {
                  loadIndex = layer.load(0, { shade: 0.3 })
               }
            },
            success: function (data) {
               if (data.code !== kit.code) {
                  showMsg && kit.success(data.msg)
                  deferred.resolve(data)
               } else {
                  showMsg && kit.error(data.msg)
                  deferred.reject(data.msg)
               }
            },
            complete: function () {
               if (load) {
                  layer.close(loadIndex)
               }
            },
            error: function () {
               layer.close(loadIndex)
               kit.sign('服务器错误')
               deferred.reject("kit.ajax error: 服务器错误")
            }
         })
         return deferred.promise()
      },
      get: function (url, params, load = true, showMsg = true) {
         return kit.ajax(url, 'get', params, load, showMsg)
      },
      post: function (url, params, load = true, showMsg = true) {
         return kit.ajax(url, 'post', params, load, showMsg)
      },
      put: function (url, params, load = true, showMsg = true) {
         return kit.ajax(url, 'put', params, load, showMsg)
      },
      delete: function (url, params, load = true, showMsg = true) {
         return kit.ajax(url, 'delete', params, load, showMsg)
      },
      /**
       * confirm()函数二次封装
       * @param content
       * @param yesFunction
      */
      confirm: function (title, url, params, obj = null, callback = false) {
         layer.confirm(title, { icon: 3, title: '提示' }, function (index) {
            kit.post(url, params).done((res) => {
               obj && obj.del()
               layer.close(index)
               if (callback === true) {
                  window.location.reload()
               } else {
                  callback
               }
            }).fail(() => {
               layer.close(index)
            })
         })
      },
      edit: function (title = '', url = '404.html', id, options = {
         btn: [],
         btnCallback: {},
         width: 0.8,
         height: 0.8,
         shadow: false
      }) {
         options.width = options.width > 1 ? options.width : $(window).width() * options.width
         options.height = options.height > 1 ? options.height : $(window).height() * options.height
         options.btn.length === 0 && (options.btn = ['确定', '取消'])
         options.shade === false ? options.shade = false : options.shade = 0.4
         let layerOption = {
            id: id,
            title: title,
            btn: options.btn,
            content: url,
            type: 2,
            maxmin: true,
            shade: options.shadow,
            area: [options.width + 'px', options.height + 'px'],
            // zIndex: layer.zIndex,
            fix: false,
            shadeClose: false,
            yes: (index) => {
               let body = layer.getChildFrame('body', index)
               body.contents().find("#submit").click()
            }, btn2: () => {
               layer.closeAll()
            },
            success: function (layero, index) {
               if (id) {
                  let body = layer.getChildFrame('body', index)
                  body.contents().find("#dataId").val(id)
               }
            }, error: function (layero, index) {
               console.log('open iframe error')
            }
         }
         layerOption = Object.assign(layerOption, options.btnCallback);
         layer.open(layerOption)
      }, show: function (title = '', url = '404.html', id, options = {
         btn: false,
         shadow: 0.4,
         width: 0.8,
         height: 0.8,
      }) {
         kit.edit(title, url, id, options)
      },
      /**
       * 主要用于对ECharts视图自动适应宽度
       * @param {object} EChartsElement
       */
      EChartsResize: function (element) {
         var element = element || []
         window.addEventListener("resize", function () {
            for (let i = 0; i < element.length; i++) {
               element[i].resize()
            }
         })
      },
      /**
       * 主要用于针对表格批量操作操作之前的检查
       * @param table
       * @returns {string}
       */
      tableBatchCheck: function (table) {
         var checkStatus = table.checkStatus("tableId")
         var rows = checkStatus.data.length
         if (rows > 0) {
            var idsStr = ""
            for (var i = 0; i < checkStatus.data.length; i++) {
               idsStr += checkStatus.data[i].id + ","
            }
            return idsStr
         } else {
            layer.msg("未选择有效数据", { offset: "t", anim: 6 })
         }
      },
      getUrlParam: function (name) {
         var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
         var r = window.location.search.substr(1).match(reg)
         if (r != null) return decodeURI(r[2]); return null
      },
      imgUpload: function (upload, url = '/hospital/method-upload', data = null) {
         let load = null
         upload.render({
            elem: '.imgUpload',
            url: url,
            data: data, //上传接口
            before: function (obj) {
               load = layer.load(2)
            },
            done: function (data) {
               if (data.code == 100) {
                  let div = this.item.parents('div').eq(0)
                  $(div).find('input').eq(0).val(data.result)
                  $(div).find('img').eq(0).attr('src', data.result)
                  $(div).find('img').eq(0).attr('height', '200px')
                  if (!$(div).find('.del-photo').length) {
                     $(div).append('<a class="layui-btn layui-btn-danger layui-btn-xs del-photo">删除</a>')
                  }
                  $(div).find('.del-photo').on('click', function () {
                     $(div).find('input').eq(0).val('')
                     $(div).find('img').eq(0).attr('src', '')
                     $(div).find('img').eq(0).removeAttr('height')
                     $(div).find('.del-photo').remove()
                  })
               } else {
                  layer.msg(data.msg, { icon: 5 })
               }
               layer.close(load)
            },
            error: function () {

            }
         })
      },
      showImg: function (cls = 'form-img') {
         cls = cls || 'form-img'
         $('.' + cls).each(function (index, element) {
            let div = element.parentNode
            if ($(div).find('input').eq(0).val()) {
               $(div).find('img').eq(0).attr('height', '200px')
               $(div).find('img').eq(0).attr('src', $(div).find('input').eq(0).val())
               $(div).append('<a class="layui-btn layui-btn-danger layui-btn-xs del-photo">删除</a>')
               $(div).find('.del-photo').on('click', function () {
                  $(div).find('input').eq(0).val('')
                  $(div).find('img').eq(0).attr('src', '')
                  $(div).find('img').eq(0).removeAttr('height')
                  $(div).find('.del-photo').remove()
               })
            }
         })
      }
   }
   exprots("kit", kit)
})
