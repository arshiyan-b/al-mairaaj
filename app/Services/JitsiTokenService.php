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
            'iss' => config('services.jitsi.app_id'),
            'aud' => 'jitsi',
            'sub' => config('services.jitsi.domain'),
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
            config('services.jitsi.app_secret'),
            'HS256'
        );
    }
}