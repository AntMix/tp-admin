<?php

namespace app\admin\controller;

use app\common\controller\BaseController;

class Auth extends BaseController
{

    public function login()
    {
        return $this->fetch('auth/login');
    }

    public function doLogin()
    {
        $name = $this->request->post('name');
        $password = $this->request->post('password');
        if (!$name || !$password) {
            return $this->error('参数错误');
        }
        $user = \app\admin\model\Auth::login($name, $password);
        if ($user) {
            return $this->success($user, '登录成功');
        }
        return $this->error('登录失败，用户名和密码不正确');
    }
}
