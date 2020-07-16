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
        $remember = $this->request->post('remember');
        if (!$name || !$password) {
            return $this->error('参数错误');
        }
        $expire = $remember ? 86400 * 7 : 86400 * 1;
        $user = \app\admin\model\Auth::login($name, $password, $expire);
        if ($user) {
            return $this->success(['link' => '/admin/index', 'user' => $user], '登录成功');
        }
        return $this->error('登录失败，用户名和密码不正确');
    }
}
