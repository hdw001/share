<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>KBD-知识分享后台注册</title>
    @include('admin.public.style')
</head>
<body>

<div class="wrapper-page">
    <div class="panel panel-color panel-inverse">
        <div class="panel-heading">
            <h3 class="text-center m-t-10"> 欢迎，加入 KBD-知识分享小组</h3>
        </div>

        <div class="panel-body">
            @include('admin.public.errors')
            <form id="signUpForm" class="form-horizontal m-t-10 p-20 p-b-0" action="{{url('/register')}}" method="post">

                {{csrf_field()}}

                <div class="form-group">
                    <div class="col-xs-12">
                        <input name="email" class="form-control" type="email" required="" placeholder="Email">
                    </div>
                </div>

                <div class="form-group ">
                    <div class="col-xs-12">
                        <input name="username" class="form-control " type="text" required="" placeholder="Username">
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-xs-12">
                        <input name="password" class="form-control " type="password" required="" placeholder="Password">
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-xs-12">
                        <input name="confirm_password" class="form-control " type="password" required="" placeholder="Confirm Password">
                    </div>
                </div>



                <div class="form-group text-right">
                    <div class="col-xs-12">
                        <button class="btn btn-success w-md" type="submit">Register</button>
                    </div>
                </div>

                <div class="form-group m-t-30">
                    <div class="col-sm-12 text-center">
                        <a href="{{url('login')}}">已经有帐户了吗？</a>
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
    <script src="{{asset('admin/js/register-validator.js')}}"></script>
    <!-- 验证机制 End -->
@endsection
</body>
</html>
