<?php

namespace app\admin\controller;

use think\Db;

class Role extends Base
{
    public function index()
    {
        return $this->fetch('role/index');
    }

    public function list()
    {
        $page = $this->request->get('page');
        $limit = $this->request->get('limit');
        $where = [];
        $id = $this->request->get('id');
        $name = $this->request->get('name');
        $name && $where = ['name' => ['like', "%$name%"]];
        $id && $where = ['id' => $id];
        $data = Db::name('admin_role')->where($where)->page($page)->paginate($limit)->toArray();
        $this->success($data);
    }

    public function edit()
    {
        return $this->fetch('role/edit');
    }

    public function info()
    {
        $id = $this->request->get('id');
        if (!$id) {
            return $this->error();
        }
        $data = Db::name('admin_role')->where('id', $id)->find();
        $this->success($data);
    }

    public function power()
    {
        $id = $this->request->get('id');
        $data = [];
        $data['list'] = Db::name('admin_power')->field('id,name,pid,icon,is_menu')->where('status', 1)->select();
        $data['checked'] = Db::name('admin_role_power')->where('role_id', $id)->column('power_id');
        $this->success($data);
    }

    public function save()
    {
        $id = $this->request->post('id');
        $power = $this->request->post('power');
        $power && $power = explode(',', $power);
        $data = [
            'name' => $this->request->post('name'),
            'status' => $this->request->post('status', 0),
        ];
        if ($id == 1 && $data['status'] == 0) {
            return $this->error('无法变更超级管理员状态');
        }
        Db::startTrans();
        $res1 = $res2 = $res3 = false;
        if ($id) {
            $data['update_time'] = time();
            $res1 = Db::name('admin_role')->where('id', $id)->update($data);
        } else {
            $data['create_time'] = time();
            $res1 = $id = Db::name('admin_role')->insertGetId($data);
        }
        if ($res1 !== false) {
            if (!$power) {
                $res2 = Db::name('admin_role_power')->where('role_id', $id)->delete();
                $res3 = true;
            } else {
                $res2 = Db::name('admin_role_power')->where('role_id', $id)->delete();
                $rolePower = [];
                foreach ($power as $value) {
                    $rolePower[] = [
                        'role_id' => $id,
                        'power_id' => $value
                    ];
                }
                $res3 = Db::name('admin_role_power')->insertAll($rolePower);
            }
        }
        if ($res1 !== false && $res2 !== false && $res3 !== false) {
            Db::commit();
            return $this->success();
        } else {
            Db::rollback();
            return $this->error();
        }
    }

    public function changeStatus()
    {
        $id = $this->request->request('id');
        if ($id == 1) {
            return $this->error('无法变更超级管理员状态');
        }
        $res = Db::execute('update admin_role set status=abs(status-1) where id = (:id)', ['id' => $id]);
        if ($res !== false) {
            return $this->success();
        } else {
            return $this->error();
        }
    }
}
