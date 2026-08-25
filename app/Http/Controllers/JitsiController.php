<?php

namespace App\Http\Controllers;

use App\Models\LiveClass;
use App\Models\JitsiMeetingSession;
use App\Services\JitsiTokenService;
use Illuminate\Http\Request;

class JitsiController extends Controller
{
    public function token(
        Request $request,
        JitsiTokenService $jitsiTokenService
    ) {
        $request->validate([
            'live_class_id' => ['required', 'integer', 'exists:live_classes,id'],
        ]);

        $user = $request->user();

        if (!$user || !$user->student) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $liveClass = LiveClass::with('meetingDetail')
            ->findOrFail($request->live_class_id);

        $isEnrolled = $liveClass->enrollments()
            ->where('student_id', $user->student->id)
            ->where('status', 'enrolled')
            ->exists();

        if (!$isEnrolled) {
            return response()->json([
                'message' => 'You are not enrolled in this live class.',
            ], 403);
        }

        if (
            !$liveClass->meetingDetail ||
            $liveClass->meeting_provider !== 'jitsi'
        ) {
            return response()->json([
                'message' => 'Jitsi meeting is not available for this class.',
            ], 404);
        }

        /*
        * Check whether this student already has
        * an active session for this live class.
        */
        $existingSession = JitsiMeetingSession::where(
            'student_id',
            $user->student->id
        )
            ->where('live_class_id', $liveClass->id)
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->where(function ($query) {
                $query->whereNull('last_seen_at')
                    ->orWhere('last_seen_at', '>', now()->subSeconds(60));
            })
            ->first();

        if ($existingSession) {
            return response()->json([
                'message' => 'This meeting is already active on another device.',
            ], 409);
        }

        $tokenData = $jitsiTokenService->generate(
            liveClass: $liveClass,
            studentId: $user->student->id,
            userName: $user->name,
            userEmail: $user->email,
            isModerator: false
        );

        return response()->json([
            'token' => $tokenData['token'],
            'session_id' => $tokenData['session_id'],
            'expires_at' => $tokenData['expires_at'],
            'domain' => config('services.jitsi.domain'),
            'room' => $liveClass->meetingDetail->meeting_id,
        ]);
    }
    public function claimSession(Request $request)
    {
        $request->validate([
            'session_id' => ['required', 'uuid'],
        ]);

        $user = $request->user();

        if (!$user || !$user->student) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $session = JitsiMeetingSession::where('session_id', $request->session_id)
            ->where('student_id', $user->student->id)
            ->where('status', 'issued')
            ->where('expires_at', '>', now())
            ->first();

        if (!$session) {
            return response()->json([
                'message' => 'Invalid or expired meeting session.',
            ], 403);
        }

        $session->update([
            'status' => 'active',
            'last_seen_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'session_id' => $session->session_id,
        ]);
    }
    public function heartbeat(Request $request)
    {
        $request->validate([
            'session_id' => ['required', 'uuid'],
        ]);

        $user = $request->user();

        if (!$user || !$user->student) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $session = JitsiMeetingSession::where('session_id', $request->session_id)
            ->where('student_id', $user->student->id)
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->first();

        if (!$session) {
            return response()->json([
                'message' => 'Meeting session is no longer active.',
            ], 403);
        }

        $session->update([
            'last_seen_at' => now(),
        ]);

        return response()->json([
            'success' => true,
        ]);
    }
    public function endSession(Request $request)
    {
        $request->validate([
            'session_id' => ['required', 'uuid'],
        ]);

        $user = $request->user();

        if (!$user || !$user->student) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $session = JitsiMeetingSession::where('session_id', $request->session_id)
            ->where('student_id', $user->student->id)
            ->whereIn('status', ['issued', 'active'])
            ->first();

        if (!$session) {
            return response()->json([
                'message' => 'Session not found.',
            ], 404);
        }

        $session->update([
            'status' => 'ended',
            'last_seen_at' => now(),
        ]);

        return response()->json([
            'success' => true,
        ]);
    }
}