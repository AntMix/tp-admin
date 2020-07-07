"use strict";
layui.define(["layer"], function (exprots) {
   var $ = layui.jquery;
   var kit = {
      /**
       * 主要用于对ECharts视图自动适应宽度
       */
      echartsResize: function (element) {
         var element = element || [];
         window.addEventListener("resize", function () {
            for (let i = 0; i < element.length; i++) {
               element[i].resize();
            }
         });
      },
      /**
       * ajax()函数二次封装
       * @param url
       * @param type
       * @param params
       * @param load
       * @returns {*|never|{always, promise, state, then}}
       */
      ajax: function (url, type, params, load) {
         var deferred = $.Deferred();
         var loadIndex;
         $.ajax({
            url : url,
            type: type || "get",
            data: params || {},
            dataType: "json",
            beforeSend: function () {
               if (load) {
                  loadIndex = layer.load(0, {shade: 0.3});
               }
            },
            success: function (data) {
               if (data.code == 0) {
                  // 业务正常
                  deferred.resolve(data)
               } else {
                  // 业务异常
                  layer.msg(data.msg, {icon: 7, time: 2000});
                  deferred.reject("kit.ajax warn: " + data.msg);
               }
            },
            complete: function () {
               if (load) {
                  layer.close(loadIndex);
               }
            },
            error: function () {
               layer.close(loadIndex);
               layer.msg("服务器错误", {icon: 2, time: 2000});
               deferred.reject("kit.ajax error: 服务器错误");
            }
         });
         return deferred.promise();
      },
      /**
       * 主要用于针对表格批量操作操作之前的检查
       * @param table
       * @returns {string}
       */
      tableBatchCheck: function (table) {
         var checkStatus = table.checkStatus("tableId");
         var rows = checkStatus.data.length;
         if (rows > 0) {
            var idsStr = "";
            for (var i = 0; i < checkStatus.data.length; i++) {
               idsStr += checkStatus.data[i].id + ",";
            }
            return idsStr;
         } else {
            layer.msg("未选择有效数据", {offset: "t", anim: 6});
         }
      }
   };
   exprots("kit", kit);
});
