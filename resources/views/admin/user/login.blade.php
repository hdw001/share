<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>英雄会--后台管理</title>
    @include('admin.public.style')
</head>
<body>

<div class="wrapper-page">
    <div class="panel panel-color panel-inverse">
        <div class="panel-heading">
            <h3 class="text-center m-t-10">KBD-知识分享后台管理系统</h3>
        </div>

        <div class="panel-body">
            @include('admin.public.errors')
            @include('admin.public.success')
            <form class="form-horizontal m-t-10 p-20 p-b-0" id="signOnForm" method="post" action="{{url('login')}}">
                {{csrf_field()}}
                {{--邮箱账号--}}
                <div class="form-group ">
                    <div class="col-xs-12">
                        <input name="email" class="form-control" type="text" placeholder="邮箱...">
                    </div>
                </div>
                {{--密码--}}
                <div class="form-group ">
                    <div class="col-xs-12">
                        <input name="password" class="form-control" type="password" placeholder="密码...">
                    </div>
                </div>
                {{--验证码--}}
                <div class="form-group">
                    <div class="col-xs-7">
                        <input name="captcha" class="form-control" type="text" placeholder="验证码...">
                    </div>
                    <div class="col-xs-5">
                        <img id="captcha" src="{{url('/code/captcha/1')}}" onclick="this.src='code/captcha/'+Math.random()">
                    </div>
                </div>
                {{--Session机制--}}
                <div class="form-group ">
                    <div class="col-xs-12">
                        <label class="cr-styled">
                            <input type="checkbox" checked>
                            <i class="fa"></i>
                            Remember me
                        </label>
                    </div>
                </div>

                <div class="form-group text-right">
                    <div class="col-xs-12">
                        <button class="btn btn-success w-md" type="submit">登录</button>
                    </div>
                </div>
                <div class="form-group m-t-30">
                    <div class="col-sm-7">
                        {{--<a href="pages-recoverpw.html"><i class="fa fa-lock m-r-5"></i> 忘记密码 ?</a>--}}
                    </div>
                    <div class="col-sm-5 text-right">
                        {{--<a href="{{url('/register')}}">注册账号</a>--}}
                    </div>
                </div>
            </form>
        </div>

    </div>
</div>
@include('admin.public.script')
@section('script')
    <!-- 验证机制 Start -->
    <script src="{{asset('admin/js/jquery.validate.min.js')}}"></script>
    <script src="{{asset('admin/js/login-validator.js')}}"></script>
    <!-- 验证机制 End -->
@endsection
</body>
</html>
