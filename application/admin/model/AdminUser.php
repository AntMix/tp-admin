<?php

namespace app\admin\model;

use app\common\model\BaseModel;

class AdminUser extends BaseModel
{
    public static $normal = ['status' => 1];

    public static function getNormalUser($id, $field = '*')
    {
        return self::where('id', $id)->where(self::$normal)->field($field)->find();
    }

    public static function dealInfo($user)
    {
        unset($user['password']);
        return $user;
    }
}