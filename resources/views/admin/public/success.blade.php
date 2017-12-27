@if (session('dataStatus'))
    <div class="alert alert-success">
        {{ session('dataStatus') }}
    </div>
@endif