<?php

namespace App\Services;

use Firebase\JWT\JWT;

class JitsiTokenService
{
    public function generate(
        string $room,
        string $userName,
        string $userEmail,
        bool $isModerator = false
    ): string {
        $now = time();

        $payload = [
            'iss' => env('JITSI_APP_ID'),
            'aud' => 'jitsi',
            'sub' => env('JITSI_DOMAIN'),
            'room' => $room,
            'iat' => $now,
            'exp' => $now + 3600,

            'context' => [
                'user' => [
                    'name' => $userName,
                    'email' => $userEmail,
                ],
                'features' => [
                    'livestreaming' => false,
                    'recording' => false,
                    'moderation' => $isModerator,
                ],
            ],
        ];

        return JWT::encode(
            $payload,
            env('JITSI_APP_SECRET'),
            'HS256'
        );
    }
}