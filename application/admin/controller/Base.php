<?php

namespace app\admin\controller;

use app\admin\model\AdminUser;
use app\admin\model\Auth as AuthModel;
use app\common\controller\BaseController;
use JWT;
use think\Db;

class Base extends BaseController
{
    protected $uid = 0;
    protected $user = [];
    protected $roleIds = [];
    protected $loginPage = '/admin/auth/login';

    public function _initialize()
    {
        $this->_initUser();
        $this->_verifyPower();
    }

    protected function _initUser()
    {
        $token = $this->request->cookie(AuthModel::COOKIE_NAME);
        if(!$token){
            $this->redirect($this->loginPage);
        }
        $info = JWT::verifyToken($token);
        if (isset($info['uid']) && $info['uid']){
            $user = AdminUser::getNormalUser($info['uid']);
            if (!$user) {
                $this->redirect($this->loginPage);
            }
            $user = AdminUser::dealInfo($user);
        }
        if (!$user) {
            $this->redirect($this->loginPage);
        }
        $this->uid = $user['id'];
        $this->user = $user;
    }

    public function _verifyPower()
    {
        $this->roleIds = Db::name('admin_role_user')->where('uid', $this->uid)->where('status', 1)->column('role_id');
        if (!$this->roleIds) {
            $this->redirect($this->loginPage);
        }
        $powerWhere = [
            'con' => $this->request->dispatch()['module'][1],
            'func' => $this->request->dispatch()['module'][2],
            'status' => 1
        ];
        $powerId = Db::name('admin_power')->where($powerWhere)->field('id')->find();
        if ($powerId) {
            $access = Db::name('admin_role_power')->whereIn('role_id', $this->roleIds)->where('power_id', $powerId['id'])->find();
            if (!$access) {
                abort(403);
            }
        }
    }
}
