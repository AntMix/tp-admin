layui.config({
   base: '/static/layui-plugins/' //假设这是你存放拓展模块的根目录
})
function getUrlParam(name) {
   let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
   let r = window.location.search.substr(1).match(reg)
   if (r != null) return decodeURI(r[2]); return null
}

function initPower(){
   let powerItem = document.querySelectorAll('.power-item')
   let powerList = localStorage.getItem('powerList')
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