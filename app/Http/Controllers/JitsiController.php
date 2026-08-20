<?php

namespace App\Http\Controllers;

use App\Services\JitsiTokenService;
use Illuminate\Http\Request;

class JitsiController extends Controller
{
    public function token(Request $request, JitsiTokenService $jitsiTokenService)
    {
        $request->validate([
            'room' => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $token = $jitsiTokenService->generate(
            room: $request->room,
            userName: $user->name,
            userEmail: $user->email,
            isModerator: false
        );

        return response()->json([
            'token' => $token,
            'domain' => config('services.jitsi.domain'),
            'room' => $request->room,
        ]);
    }
}