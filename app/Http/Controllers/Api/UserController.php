<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    //登录视图
    protected function userLogin()
    {
        return view('admin.user.login');
    }

    //注册视图
    protected function userRegister()
    {
        return view('admin.user.register');
    }
}
