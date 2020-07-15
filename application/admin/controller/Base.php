<?php

namespace app\admin\controller;

use app\admin\model\AdminUser;
use app\admin\model\Auth as AuthModel;
use app\common\controller\BaseController;
use JWT;

class Base extends BaseController
{
    protected $uid = 0;
    protected $user = [];

    public function _initialize()
    {
        $this->_initUser();
    }

    protected function _initUser()
    {
        $loginPage = '/admin/auth/login';
        $token = $this->request->cookie(AuthModel::COOKIE_NAME);
        if(!$token){
            $this->redirect($loginPage);
        }
        $info = JWT::verifyToken($token);
        if (isset($info['uid']) && $info['uid']){
            $user = AdminUser::getNormalUser($info['uid']);
            if (!$user) {
                $this->redirect($loginPage);
            }
            $user = AdminUser::dealInfo($user);
        }
        if ($user) {
            $this->uid = $user['uid'];
            $this->user = $user;
        }
    }
}
