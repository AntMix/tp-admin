<?php

namespace app\admin\model;

use think\Cookie;
use think\Request;
use think\Response;

class Auth
{
    const SALT = 'adminSalt';
    const COOKIE_NAME = 'admin_auth';

    public static function password($password, $vPass = '')
    {
        if (self::checkPassFormat($password)) {
            $password = md5(md5($password . '@' . self::SALT));
            return $vPass ? $vPass === $password ? true : false : $password;
        }
        return false;
    }

    public static function checkNameFormat($name)
    {
        if (preg_match("/^[A-Za-z0-9_\S]{5,20}+$/", $name)) {
            return true;
        }
        return false;
    }

    public static function checkNickFormat($nick)
    {
        if (mb_strlen($nick) <= 20) {
            return true;
        }
        return false;
    }

    public static function checkPassFormat($password)
    {
        if (preg_match("/^[\S]{6,12}$/", $password)) {
            return true;
        }
        return false;
    }

    public static function login($name, $password)
    {
        $password = self::password($password);
        $user = AdminUser::where(['name' => $name, 'password' => $password])->where(AdminUser::$normal)->find();
        if (!$user) {
            return false;
        }
        $token = \JWT::getToken([
            'iss' => 'roopto',  //该JWT的签发者
            'iat' => time(),  //签发时间
            'exp' => time() + 86400 * 3,  //过期时间
            'uid' => $user['id']
        ]);
        Cookie::set(self::COOKIE_NAME, $token);
        return AdminUser::dealInfo($user);;
    }
}
