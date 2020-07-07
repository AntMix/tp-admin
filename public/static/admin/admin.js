// /^http(s*):\/\//.test(location.href) || alert('请先部署到 localhost 下再访问');

var tabListObj;
layui.use(["element", "layer", "tabList", "message", "contextMenu"], function () {
   var layer = layui.layer;
   var message = layui.message;
   var tabList = layui.tabList({
      // 菜单请求路径
      url: "/static/json/navs.json",
      // 允许同时选项卡的个数
      openTabNum: 30,
      // 如果返回的结果和navs.json中的数据结构一致可省略这个方法
      parseData: function (data) {
         return data;
      }
   });
   tabListObj = tabList;
   /**关闭加载动画*/
   okLoading && okLoading.close();

   /**
    * 左侧导航渲染完成之后的操作
    */
   tabList.render(function () {
      /**tab栏的鼠标右键事件**/
      $("body .tab-list").contextMenu({
         width: 'auto',
         itemHeight: 30,
         menu: [
            {
               text: "刷新当前页",
               icon: "layui-icon layui-icon-refresh",
               callback: function () {
                  tabList.refresh();
               }
            },
            {
               text: "关闭当前页",
               icon: "layui-icon layui-icon-close",
               callback: function () {
                  tabList.tabClose(1);
               }
            },
            {
               text: "关闭其他页",
               icon: "layui-icon layui-icon-close-fill",
               callback: function () {
                  tabList.tabClose(2);
               }
            },
            {
               text: "关闭所有页",
               icon: "layui-icon layui-icon-snowflake",
               callback: function () {
                  tabList.tabClose(3);
               }
            }
         ]
      });
   });

   /**系统设置*/
   $("body").on("click", "#okSetting", function () {
      layer.open({
         type: 2,
         title: "系统设置",
         shadeClose: true,
         closeBtn: 0, //不显示关闭按钮
         skin: "slideInRight",
         area: ['340px', '100%'],
         offset: 'r', //右边
         time: 200000, //2秒后自动关闭
         anim: -1,
         content: "./pages/system/setting.html"
      });
   });

   /**
    * 添加新窗口
    */
   $("body").on("click", "#navBar .layui-nav-item a, #userInfo a", function () {
      // 如果不存在子级
      if ($(this).siblings().length == 0) {
         tabList.tabAdd($(this));
      }
      // 关闭其他展开的二级标签
      $(this).parent("li").siblings().removeClass("layui-nav-itemed");
      if (!$(this).attr("lay-id")) {
         var topLevelEle = $(this).parents("li.layui-nav-item");
         var childs = $("#navBar > li > dl.layui-nav-child").not(topLevelEle.children("dl.layui-nav-child"));
         childs.removeAttr("style");
      }
   });

   /**
    * 左侧菜单展开动画
    */
   $("#navBar").on("click", ".layui-nav-item a", function () {
      if (!$(this).attr("lay-id")) {
         var superEle = $(this).parent();
         var ele = $(this).next('.layui-nav-child');
         var height = ele.height();
         ele.css({"display": "block"});
         // 是否是展开状态
         if (superEle.is(".layui-nav-itemed")) {
            ele.height(0);
            ele.animate({height: height + "px"}, function () {
               ele.css({height: "auto"});
            });
         } else {
            ele.animate({height: 0}, function () {
               ele.removeAttr("style");
            });
         }
      }
   });

   /**
    * 左边菜单显隐功能
    */
   $(".admin-menu").click(function () {
      $(".layui-layout-admin").toggleClass("menu-left-hide");
      $(this).find("i").toggleClass("admin-menu-hide");
      localStorage.setItem("isResize", false);
      setTimeout(function () {
         localStorage.setItem("isResize", true);
      }, 1200);
   });

   /**
    * 移动端的处理事件
    */
   $("body").on("click", ".layui-layout-admin .menu-left a[data-url], .mobile-mask", function () {
      if ($(".layui-layout-admin").hasClass("menu-left-hide")) {
         $(".layui-layout-admin").removeClass("menu-left-hide");
         $(".admin-menu").find('i').removeClass("admin-menu-hide");
      }
   });

   /**
    * tab左右移动
    */
   $("body").on("click", ".okNavMove", function () {
      var moveId = $(this).attr("data-id");
      var that = this;
      tabList.navMove(moveId, that);
   });

   /**
    * 刷新当前tab页
    */
   $("body").on("click", ".admin-refresh", function () {
      tabList.refresh(this, function (tabList) {
         //刷新之后所处理的事件
      });
   });

   /**
    * 关闭tab页
    */
   $("body").on("click", "#tabAction a", function () {
      var num = $(this).attr("data-num");
      tabList.tabClose(num);
   });

   /**
    * 键盘的事件监听
    */
   $("body").on("keydown", function (event) {
      event = event || window.event || arguments.callee.caller.arguments[0];

      // 按 Esc
      if (event && event.keyCode === 27) {
         console.log("Esc");
         $("#fullScreen").children("i").eq(0).removeClass("layui-icon-screen-restore");
      }
      // 按 F11
      if (event && event.keyCode == 122) {
         console.log("F11");
         $("#fullScreen").children("i").eq(0).addClass("layui-icon-screen-restore");
      }
   });

   /**
    * 全屏/退出全屏
    */
   $("body").on("click", "#fullScreen", function () {
      if ($(this).children("i").hasClass("layui-icon-screen-restore")) {
         screenFun(2).then(function () {
            $("#fullScreen").children("i").eq(0).removeClass("layui-icon-screen-restore");
         });
      } else {
         screenFun(1).then(function () {
            $("#fullScreen").children("i").eq(0).addClass("layui-icon-screen-restore");
         });
      }
   });

   /**
    * 全屏和退出全屏的方法
    * @param num 1代表全屏 2代表退出全屏
    * @returns {Promise}
    */
   function screenFun(num) {
      num = num || 1;
      num = num * 1;
      var docElm = document.documentElement;

      switch (num) {
         case 1:
            if (docElm.requestFullscreen) {
               docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
               docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
               docElm.webkitRequestFullScreen();
            } else if (docElm.msRequestFullscreen) {
               docElm.msRequestFullscreen();
            }
            break;
         case 2:
            if (document.exitFullscreen) {
               document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
               document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
               document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
               document.msExitFullscreen();
            }
            break;
      }

      return new Promise(function (res, rej) {
         res("返回值");
      });
   }

   /**
    * 退出操作
    */
   $("#logout").click(function () {
      message.confirm("确定要退出吗？", function (index) {
         tabList.removeTabStorage(function (res) {
            tabList.removeTabStorage();
            window.location = "pages/login.html";
         });
      });
   });

});
