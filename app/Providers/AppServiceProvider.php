<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use App\Http\View\Composers\AllowedClassesComposer;
class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        View::composer('teacher.layout.app', AllowedClassesComposer::class);
    }
}
