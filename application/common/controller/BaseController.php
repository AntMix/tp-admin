<?php

namespace app\common\controller;

use think\Controller;

class BaseController extends Controller
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
        if (!isset($data['total'])) {
            echo json_encode(['code' => $code, 'data' => $data, 'msg' => $msg]);
        } else {
            echo json_encode([
                'code' => $code,
                'data' => $data['data'],
                'msg' => $msg,
                'count' => $data['total'],
                'page' => $data['current_page'],
                'limit' => $data['per_page']
            ]);
        }
    }

    /**
     * 成功
     *
     * @param array|string $dataOrMsg
     * @param string $msg
     * @param string $url
     * @param integer $wait
     * @param array $header
     * @return void
     */
    public function success($dataOrMsg = [], $msg = '', $url = '', $wait = 0, $header = [])
    {
        if (is_string($dataOrMsg)) {
            $msg = $dataOrMsg;
            $dataOrMsg = [];
        }
        $this->response(0, $dataOrMsg, $msg);
    }

    /**
     * 失败
     *
     * @param array|string $dataOrMsg
     * @param string $msg
     * @param string $url
     * @param integer $wait
     * @param array $header
     * @return void
     */
    public function error($dataOrMsg = [], $msg = '', $url = '', $wait = 0, $header = [])
    {
        if (is_string($dataOrMsg)) {
            $msg = $dataOrMsg;
            $dataOrMsg = [];
        }
        $this->response(400, $dataOrMsg, $msg);
    }
}
