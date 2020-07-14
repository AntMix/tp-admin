<?php

namespace app\admin\controller;

class Auth
{
    const SALT = 'adminSalt';

    public static function password($pass, $vPass = '')
    {
        if (self::checkPassFormat($pass)) {
            $pass = md5(md5($pass . '@' . self::SALT));
            return $vPass ? $vPass === $pass ? true : false : $pass;
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

    public static function checkPassFormat($pass)
    {
        if (preg_match("/^[\S]{6,12}$/", $pass)) {
            return true;
        }
        return false;
    }
}
