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
        $menu = Db::name('admin_power')->where(['status' => 1, 'is_menu' => 1])->select();
        $menu = $this->getMenu($menu);
        $power = Db::name('admin_power')->where(['status' => 1, 'is_menu' => 0, 'sign' => ['<>', '']])->column('sign');
        return $this->success(['menu' => $menu, 'power' => $power]);
    }

    protected function getMenu($data)
    {
        $menu = [];
        foreach ($data as $key => $value) {
            $item = $value;
            if ($value['pid'] === 0) {
                unset($data[$key]);
                $children = $this->getMenuChildren($item, $data);
                if ($children) {
                    $item['children'] = $children;
                } else {
                    $this->setMenuValue($item, 'href', $item['con'] . '/' . $item['func']);
                }
                $menu[] = $item;
            }
        }
        return $menu;
    }

    protected function getMenuChildren($parent, &$data)
    {
        $menu = [];
        foreach ($data as $key => $value) {
            $item = $value;
            if ($value['pid'] === $parent['id']) {
                unset($data[$key]);
                $children = $this->getMenuChildren($item, $data);
                if ($children) {
                    $item['children'] = $children;
                }
                $this->setMenuValue($item, 'href', $item['con'] . '/' . $item['func']);
                $menu[] = $item;
            }
        }
        return $menu;
    }

    protected function setMenuValue(&$item, $key, $value)
    {
        $item[$key] = $value;
    }
}
