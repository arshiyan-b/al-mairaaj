<?php

namespace App\Services;

use App\Models\JitsiMeetingSession;
use App\Models\LiveClass;
use Firebase\JWT\JWT;
use Illuminate\Support\Str;

class JitsiTokenService
{
    /**
     * Generate a Jitsi JWT and create a tracked meeting session.
     *
     * @param LiveClass $liveClass
     * @param int $userId
     * @param string $userName
     * @param string $userEmail
     * @param bool $isModerator
     * @return array
     */
    public function generate(
        LiveClass $liveClass,
        int $userId,
        string $userName,
        string $userEmail,
        bool $isModerator = false
    ): array {
        /*
         * Make sure the class has Jitsi meeting details.
         */
        if (
            $liveClass->meeting_provider !== 'jitsi' ||
            !$liveClass->meetingDetail
        ) {
            throw new \RuntimeException(
                'Jitsi meeting is not available for this live class.'
            );
        }

        /*
         * Generate unique identifiers.
         */
        $uuid = (string) Str::uuid();
        $sessionId = (string) Str::uuid();
        $jti = (string) Str::uuid();

        /*
         * JWT/session expiration.
         */
        $expiresAt = now()->addHour();

        /*
         * Create the Laravel-side meeting session.
         *
         * This is used for one-device/session tracking.
         */
        JitsiMeetingSession::create([
            'uuid' => $uuid,
            'user_id' => $userId,
            'live_class_id' => $liveClass->id,
            'session_id' => $sessionId,
            'jti' => $jti,
            'status' => 'issued',
            'expires_at' => $expiresAt,
        ]);

        /*
         * Get the actual Jitsi room.
         */
        $room = $liveClass->meetingDetail->meeting_id;

        /*
         * Build JWT payload.
         */
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
                    /*
                     * Students and teachers cannot start livestreaming.
                     */
                    'livestreaming' => false,

                    /*
                     * Only the teacher/moderator receives recording
                     * capability.
                     */
                    'recording' => $isModerator,

                    /*
                     * Only the teacher receives moderator privileges.
                     */
                    'moderation' => $isModerator,
                ],
            ],
        ];

        /*
         * Sign the JWT.
         */
        $token = JWT::encode(
            $payload,
            config('services.jitsi.app_secret'),
            'HS256'
        );

        /*
         * Build the direct Jitsi URL.
         */
        $meetingUrl =
            'https://' .
            config('services.jitsi.domain') .
            '/' .
            $room .
            '?jwt=' .
            urlencode($token);

        /*
         * Return everything required by the frontend.
         */
        return [
            'token' => $token,

            'session_id' => $sessionId,

            'expires_at' => $expiresAt,

            'meeting_url' => $meetingUrl,

            'domain' => config('services.jitsi.domain'),

            'room' => $room,

            'is_moderator' => $isModerator,
        ];
    }

    /**
     * Create a Jitsi token for a student.
     *
     * Students:
     * - Are not moderators
     * - Cannot record
     * - Cannot livestream
     */
    public function createTokenForStudent(
        LiveClass $liveClass,
        int $userId,
        string $userName,
        string $userEmail
    ): array {
        return $this->generate(
            liveClass: $liveClass,
            userId: $userId,
            userName: $userName,
            userEmail: $userEmail,
            isModerator: false
        );
    }

    /**
     * Create a Jitsi token for a teacher.
     *
     * Teachers:
     * - Are moderators
     * - Can record
     * - Cannot livestream
     */
    public function createTokenForTeacher(
        LiveClass $liveClass,
        int $userId,
        string $userName,
        string $userEmail
    ): array {
        return $this->generate(
            liveClass: $liveClass,
            userId: $userId,
            userName: $userName,
            userEmail: $userEmail,
            isModerator: true
        );
    }

    /**
     * Create a Jitsi token for an admin.
     *
     * Admins:
     * - Are moderators
     * - Can record
     * - Cannot livestream
     */
    public function createTokenForAdmin(
        LiveClass $liveClass,
        int $userId,
        string $userName,
        string $userEmail
    ): array {
        return $this->generate(
            liveClass: $liveClass,
            userId: $userId,
            userName: $userName,
            userEmail: $userEmail,
            isModerator: true
        );
    }
}