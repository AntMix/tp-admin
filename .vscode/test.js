let  str = 'fsdfds'

if (!new RegExp("^[a-zA-Z0-9_\s]+$").test(str)) {
    console.log('用户名不能有特殊字符');
}