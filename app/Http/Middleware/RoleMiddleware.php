<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role): Response
    {
        $user = auth()->user();

        if (!$user) {
            abort(401, 'Unauthenticated.');
        }

        $userRole = $user->role;

        if (!$userRole) {
            abort(403, 'User role not found.');
        }

        if ($userRole->slug  !== $role) {
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}