<?php
namespace app\index\controller;

class Index
{
    public function Index()
    {
        return redirect('/admin/index');
    }

    public function gitWebhook()
    {
        exec("/bin/sh /var/www/tp-admin/git.sh");
    }
}
