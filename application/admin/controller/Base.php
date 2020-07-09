<?php

namespace app\admin\controller;

use app\common\controller\BaseController;

class Base extends BaseController
{
    /**
     * 响应
     *
     * @param integer $code 0:Success 400:Error 401:Unauthorized 403:Forbidden
     * @param array|object $data
     * @param string $msg
     * @return void
     */
    public function response($code = 0, $data = [], $msg = '')
    {
        echo json_encode(['code' => $code, 'data' => $data, 'msg' => $msg]);
    }

    public function success($data = [], $msg = '', $url = '', $wait = 0, $header = [])
    {
        $this->response(0, $data, $msg);
    }

    public function error($data = [], $msg = '', $url = '', $wait = 0, $header = [])
    {
        $this->response(400, $data, $msg);
    }
}