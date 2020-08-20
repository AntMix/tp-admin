<?php

namespace app\admin\controller;

use think\Db;
use app\admin\model\Auth;

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
        $queryTime = \Util::queryTime($startTime, $endTime, 'create_time');
        $where = [];
        $name && $where['name'] = ['like', "%$name%"];
        $nick && $where['nick'] = ['like', "%$nick%"];
        $phone && $where['phone'] = ['like', "%$phone%"];
        $email && $where['email'] = ['like', "%$email%"];
        $queryTime && $where['create_time'] = $queryTime;
        $id && $where = ['id' => $id];
        $data = Db::name('admin_user')->where($where)->page($page)->paginate($limit)->toArray();
        foreach ($data['data'] as &$value) {
            $value['role'] = Db::name('admin_role_user')->alias('ru')->join('admin_role r', 'ru.role_id = r.id', 'left')->where('ru.uid', $value['id'])->column('r.name');
            $value['role'] = $value['role'] ? implode(' | ', $value['role']) : '';
        }
        $this->success($data);
    }

    public function edit()
    {
        return $this->fetch('admin_user/edit');
    }

    public function info()
    {
        $id = $this->request->get('id');
        $data = Db::name('admin_user')->where('id', $id)->find();
        $this->success($data);
    }

    public function save()
    {
        $id = $this->request->post('id');
        $data = [
            'name' => $this->request->post('name'),
            'nick' => $this->request->post('nick'),
            'phone' => $this->request->post('phone', ''),
            'email' => $this->request->post('email', ''),
            'status' => $this->request->post('status', 0),
        ];
        $role = $this->request->post('role');
        if (!$role) {
            return $this->error('必须设置用户组');
        }
        $role = explode(',', $role);
        if (!Auth::checkNameFormat($data['name'])) {
            return $this->error('用户名格式错误');
        }
        if (!Auth::checkNickFormat($data['nick'])) {
            return $this->error('昵称格式错误');
        }
        $time = time();
        Db::startTrans();
        $res1 = $res2 = $res3 = false;
        if ($id) {
            $data['update_time'] = $time;
            $res1 = Db::name('admin_user')->where('id', $id)->update($data);
        } else {
            $data['create_time'] = $time;
            $data['password'] = Auth::password($this->request->post('password'));
            if (!$data['password']) {
                return $this->error('密码格式错误');
            }
            $res1 = $id = Db::name('admin_user')->insertGetId($data);
        }
        if ($res1 !== false) {
            if (!$role) {
                $res2 = Db::name('admin_role_user')->where('uid', $id)->delete();
                $res3 = true;
            } else {
                $res2 = Db::name('admin_role_user')->where('uid', $id)->delete();
                $rolePower = [];
                foreach ($role as $value) {
                    $rolePower[] = [
                        'uid' => $id,
                        'role_id' => $value
                    ];
                }
                $res3 = Db::name('admin_role_user')->insertAll($rolePower);
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

    public function delete()
    {
        $id = $this->request->post('id');
        $item = Db::name('admin_user')->where('id', $id)->find();
        if (!$item) {
            return $this->error('没有记录');
        }
        $res = Db::name('admin_user')->where('id', $id)->update(['status' => -1]);
        if ($res !== false) {
            return $this->success();
        } else {
            return $this->error();
        }
    }

    public function role()
    {
        $id = $this->request->get('id');
        $data['list'] = Db::name('admin_role')->where('status', 1)->field('id as value, name')->select();
        $data['checked'] = Db::name('admin_role_user')->where('uid', $id)->column('role_id');
        $this->success($data);
    }

    public function changeStatus()
    {
        $id = $this->request->request('id');
        $res = Db::execute('update admin_user set status=abs(status-1) where id = (:id)', ['id' => $id]);
        if ($res !== false) {
            return $this->success();
        } else {
            return $this->error();
        }
    }

    public function password()
    {
        return $this->fetch('admin_user/password');
    }

    public function changePassword()
    {
        $id = $this->request->post('id');
        $user = Db::name('admin_user')->where('id', $id)->find();
        if (!$user) {
            return $this->error('没有查询到此用户');
        }
        $password = $this->request->post('password');
        $password = Auth::password($password);
        if (!$password) {
            return $this->error('密码格式错误');
        }
        $res = Db::name('admin_user')->where('id', $id)->update(['password' => $password]);
        if ($res !== false) {
            return $this->success();
        } else {
            return $this->error();
        }
    }

    public function batchEnable()
    {
        $ids = $this->request->post('ids');
        $ids && $ids = explode(',', $ids);
        if (!$ids) {
            return $this->error('操作失败 请选择数据');
        }
        unset($ids[array_search(1, $ids)]);
        $res = Db::name('admin_user')->whereIn('id', $ids)->update(['status' => 1]);
        if ($res !== false) {
            return $this->success();
        } else {
            return $this->error();
        }
    }

    public function batchDisabled()
    {
        $ids = $this->request->post('ids');
        $ids && $ids = explode(',', $ids);
        if (!$ids) {
            return $this->error('操作失败 请选择数据');
        }
        unset($ids[array_search(1, $ids)]);
        $res = Db::name('admin_user')->whereIn('id', $ids)->update(['status' => 0]);
        if ($res !== false) {
            return $this->success();
        } else {
            return $this->error();
        }
    }

    public function batchDel()
    {
        $ids = $this->request->post('ids');
        $ids && $ids = explode(',', $ids);
        if (!$ids) {
            return $this->error('操作失败 请选择数据');
        }
        unset($ids[array_search(1, $ids)]);
        $res = Db::name('admin_user')->whereIn('id', $ids)->update(['status' => -1]);
        if ($res !== false) {
            return $this->success();
        } else {
            return $this->error();
        }
    }
}
