<?php

namespace app\admin\controller;

use think\Db;
use think\Request;

class Power extends Base
{
    public function index()
    {
        return $this->fetch('power/index');
    }

    public function list()
    {
        $isMenu = $this->request->request('is_menu', 0);
        $where = ['status' => ['<>', -1]];
        $isMenu && $where['is_menu'] = 1;
        $data = Db::name('admin_power')->where($where)->select();
        return $this->success($data);
    }

    public function edit()
    {
        return $this->fetch('power/edit');
    }

    public function info()
    {
        $id = $this->request->request('id');
        $data = Db::name('admin_power')->where('id', $id)->find();
        return $this->success($data);
    }

    public function changeStatus()
    {
        $id = $this->request->request('id');
        $res = Db::execute('update admin_power set status=abs(status-1) where id = (:id)', ['id' => $id]);
        if ($res !== false) {
            return $this->success();
        } else {
            return $this->error();
        }
    }

    public function changeIsMenu()
    {
        $id = $this->request->request('id');
        $res = Db::execute('update admin_power set is_menu=abs(is_menu-1) where id = (:id)', ['id' => $id]);
        if ($res !== false) {
            return $this->success();
        } else {
            return $this->error();
        }
    }

    public function save()
    {
        $id = $this->request->post('id');
        $data = [
            'name' => $this->request->post('name'),
            'con' => $this->request->post('con'),
            'func' => $this->request->post('func'),
            'pid' => $this->request->post('pid'),
            'sign' => $this->request->post('sign'),
            'is_menu' => $this->request->post('is_menu', 0),
            'status' => $this->request->post('status', 0)
        ];
        if ($id) {
            $data['update_time'] = time();
            $res = Db::name('admin_power')->where('id', $id)->update($data);
        } else {
            $data['create_time'] = time();
            $res = Db::name('admin_power')->insertGetId($data);
        }
        if ($res !== false) {
            return $this->success();
        } else {
            return $this->error();
        }
    }

    public function delete()
    {
        $id = $this->request->post('id');
        $item = Db::name('admin_power')->where(['id' => $id])->find();
        $updateTime = time();
        $update = ['status' => -1, 'update_time' => $updateTime];
        if (!$item) {
            return $this->error('没有此记录');
        }
        Db::startTrans();
        $res = Db::name('admin_power')->where(['id' => $id])->update($update);
        if ($res !== false) {
            $children = [];
            $pid = [$id];
            while (true) {
                $children = Db::name('admin_power')->whereIn('pid', $pid)->column('id');
                if (!$children) {
                    Db::commit();
                    return $this->success();
                } else {
                    $pid = $children;
                    Db::name('admin_power')->whereIn('id', $children)->update($update);
                }
            }
        } else {
            Db::rollback();
            return $this->error();
        }
    }
}
