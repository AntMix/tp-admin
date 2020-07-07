<?php

namespace app\admin\controller;

class Index extends Admin
{
    public function index()
    {
        return $this->fetch('/index');
    }

    public function console()
    {
        echo 11;
    }
}