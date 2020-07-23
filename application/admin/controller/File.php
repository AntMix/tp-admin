<?php

namespace app\admin\controller;

class File extends Base
{
    public $imageMaxSize = 1024 * 1024 * 2;

    public function upload()
    {

    }

    public function image()
    {
        $file = $this->request->file('file');
        if ($file) {
            $file = $file->validate(['size' => $this->imageMaxSize, 'ext' => 'jpeg,jpg,png,gif']);
            $path =  DS . 'uploads' . DS . 'image' . DS . date('Y') . DS . date('m') . DS;
            $info = $file->rule('uniqid')->move(ROOT_PATH . 'public' . $path);
            if ($info) {
                $this->success(['url' => $path . $info->getSaveName()]);
            } else {
                $this->error($file->getError());
            }
        }
    }
}
