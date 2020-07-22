<?php

namespace app\admin\controller;

class File extends Base
{
    public function upload()
    {
        $this->success(['src' => '/upload/image/1.jpg']);
    }
}