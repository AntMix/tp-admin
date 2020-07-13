<?php

namespace app\admin\controller;

class Auth
{
    const SALT = 'adminSalt';

    public function Password($pass, $vPass)
    {
        $pass = md5(md5($pass . '@' . self::SALT));
        return $vPass ? $vPass === $pass ? true : false : $pass;
    }
}
