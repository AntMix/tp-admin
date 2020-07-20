<?php

namespace app\admin\controller;

use think\Db;
use app\admin\model\Auth;
use app\admin\model\AdminUser;

class Personal extends Base
{
    public function index()
    {
        return $this->fetch('personal/index');
    }

    public function info()
    {
        $data = AdminUser::dealInfo(AdminUser::getNormalUser($this->uid));
        $this->success($data);
    }

    public function save()
    {
        $data = [
            'nick' => $this->request->post('nick'),
            'phone' => $this->request->post('phone'),
            'email' => $this->request->post('email')
        ];
        if (!Auth::checkNickFormat($data['nick'])) {
            return $this->error('昵称格式错误');
        }
        $res = Db::name('admin_user')->where('id', $this->uid)->update($data);
        if ($res !== false) {
            $this->success();
        } else {
            $this->error();
        }
    }

    public function password()
    {
        return $this->fetch('personal/password');
    }

    public function changePassword()
    {
        $user = Db::name('admin_user')->where('id', $this->uid)->field('password')->find();
        if (!$user) {
            return $this->error('没有查询到此用户');
        }
        $oldPass = $this->request->post('old_pass');
        if (!Auth::password($oldPass, $user['password'])) {
            return $this->error('旧密码错误');
        }
        $password = $this->request->post('password');
        $password = Auth::password($password);
        if (!$password) {
            return $this->error('密码格式错误');
        }
        $res = Db::name('admin_user')->where('id', $this->uid)->update(['password' => $password]);
        if ($res !== false) {
            return $this->success();
        } else {
            return $this->error();
        }
    }
}
