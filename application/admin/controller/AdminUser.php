<?php

namespace app\admin\controller;

use think\Db;

class AdminUser extends Base
{
    public function index()
    {
        return $this->fetch('admin_user/index');
    }

    public function list()
    {
        $page = $this->request->get('page');
        $limit = $this->request->get('limit');
        $id = $this->request->get('id');
        $name = $this->request->get('name');
        $nick = $this->request->get('nick');
        $phone = $this->request->get('phone');
        $email = $this->request->get('email');
        $startTime = $this->request->get('start_time');
        $endTime = $this->request->get('end_time');
        $qt = $this->queryTime($startTime, $endTime, 'create_time');
        $where = [];
        $name && $where['name'] = ['like' , "%$name%"];
        $nick && $where['nick'] = ['like' , "%$nick%"];
        $phone && $where['phone'] = ['like' , "%$phone%"];
        $email && $where['email'] = ['like' , "%$email%"];
        $qt && $where['create_time'] = $qt;
        $id && $where = ['id' => $id];
        $data = Db::name('admin_user')->where($where)->page($page)->paginate($limit)->toArray();
        $this->success($data);
    }

    public function edit()
    {
        return $this->fetch('admin_user/edit');
    }

    public function delete()
    {
        $id = $this->request->post('id');
        $item = Db::name('admin_user')->where('id', $id)->find();
        if (!$item) {
            return $this->error([], '没有记录');
        }
        $res = Db::name('admin_user')->where('id', $id)->update(['status' => -1]);
        if ($res !== false) {
            return $this->success();
        } else {
            return $this->error();
        }
    }
}