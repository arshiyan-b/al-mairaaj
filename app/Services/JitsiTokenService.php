<?php

namespace App\Services;

use Illuminate\Support\Str;
use App\Models\LiveClass;
use App\Models\JitsiMeetingSession;

use Firebase\JWT\JWT;

class JitsiTokenService
{
    public function generate(
        LiveClass $liveClass,
        int $studentId,
        string $userName,
        string $userEmail,
        bool $isModerator = false
    ): array {
        $uuid = (string) Str::uuid();
        $sessionId = (string) Str::uuid();
        $jti = (string) Str::uuid();

        $expiresAt = now()->addHour();

        JitsiMeetingSession::create([
            'uuid' => $uuid,
            'student_id' => $studentId,
            'live_class_id' => $liveClass->id,
            'session_id' => $sessionId,
            'jti' => $jti,
            'status' => 'issued',
            'expires_at' => $expiresAt,
        ]);

        $room = $liveClass->meetingDetail->meeting_id;

        $payload = [
            'iss' => config('services.jitsi.app_id'),
            'aud' => 'jitsi',
            'sub' => config('services.jitsi.domain'),
            'room' => $room,
            'jti' => $jti,
            'iat' => now()->timestamp,
            'exp' => $expiresAt->timestamp,

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

        $token = JWT::encode(
            $payload,
            config('services.jitsi.app_secret'),
            'HS256'
        );

        $meetingUrl = 'https://' .
            config('services.jitsi.domain') .
            '/' .
            $room .
            '?jwt=' .
            urlencode($token);

        return [
            'token' => $token,
            'session_id' => $sessionId,
            'expires_at' => $expiresAt,
            'meeting_url' => $meetingUrl,
        ];
    }
}