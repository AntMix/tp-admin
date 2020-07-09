<?php

namespace app\admin\controller;

class User extends Base
{
    public function index()
    {
        return $this->fetch('user/index');
    }

    public function delete()
    {
        return $this->error([], 'hao');
    }
}