<?php

namespace app\admin\controller;

use think\Db;

class Index extends Base
{
    public function index()
    {
        return $this->fetch('/index');
    }

    public function menu()
    {
        $powerIds = Db::name('admin_role_power')->whereIn('role_id', $this->roleIds)->column('power_id');
        if (!$powerIds) {
            return $this->error([], '异常：没有设置角色组菜单');
        }
        $menu = Db::name('admin_power')->where(['status' => 1, 'is_menu' => 1])->whereIn('id', $powerIds)->select();
        $menu = Power::getMenu($menu);
        $power = Db::name('admin_power')->where(['status' => 1, 'is_menu' => 0, 'sign' => ['<>', '']])->whereIn('id', $powerIds)->column('sign');
        return $this->success(['menu' => $menu, 'power' => $power]);
    }
}
