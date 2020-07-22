window.config = {}
window.config.defaultIcon = 'layui-icon-circle'
window.config.defaultTitle = '默认标题'
window.config.tabMenuName = 'admin-TabMenu'
window.config.powerItemName = 'admin-PowerList'
window.config.layIdName = 'admin-LayId'
window.config.uploadImageUrl = '/admin/file/upload'

layui.config({
   base: '/static/layui-plugins/' //假设这是你存放拓展模块的根目录
})


function getUrlParam(name) {
   let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
   let r = window.location.search.substr(1).match(reg)
   if (r != null) return decodeURI(r[2]); return null
}
function getUserInfo(field) {
   let info = JSON.parse(localStorage.getItem('adminUser'))
   return info[field] ? info[field] : ''
}
function initPower() {
   let powerItem = document.querySelectorAll('.power-item')
   let powerList = localStorage.getItem(window.config.powerItemName)
   powerList = powerList ? JSON.parse(powerList) : []
   for (let value of Object.values(powerItem)) {
      if (powerList.includes(value.getAttribute('power'))) {
         value.classList.remove('power-item')
      }
   }
}
window.onload = () => {
   initPower()
}
function editImage(obj) {

}
//图片删除
function deleteImage(Obj) {
   Obj.parentNode.parentNode.removeChild(Obj.parentNode);
}
//描述
function editImageDescribe(obj) {
   layer.prompt({ title: '请填新的描述', formType: 2 }, function (text, index) {
       obj.innerHTML = text;
       layer.close(index);
   });
}
// 图片地址
function editImageSrc(obj) {
   layer.prompt({ title: '请输入图片地址', formType: 2 }, function (text, index) {
      obj.parentNode.querySelector('img').setAttribute('src', text)
      obj.parentNode.parentNode.parentNode.querySelector('input').value = text
      layer.close(index);
  });
}