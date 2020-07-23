<?php

namespace app\admin\controller;

class File extends Base
{
    public $imageMaxSize = 1024 * 1024 * 2;

    public function upload($file, $path, $validate)
    {
        $path = DS . 'uploads' . DS .  $path . DS . date('Y') . DS . date('m') . DS;
        $info = $file->validate($validate)->rule('uniqid')->move(ROOT_PATH . 'public' . $path);
        if ($info) {
            return $this->success(['url' => $path . $info->getSaveName()]);
        } else {
            return $this->error($file->getError());
        }
    }

    public function image()
    {
        $file = $this->request->file('file');
        if ($file) {
            return $this->upload($file, 'image', ['size' => $this->imageMaxSize, 'ext' => 'jpeg,jpg,png,gif']);
        }
        $this->error('文件为空');
    }
}
