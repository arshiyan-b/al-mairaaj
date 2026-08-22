<?php

namespace App\Http\Controllers;

use App\Models\LiveClass;
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

        $token = $jitsiTokenService->generate(
            room: $liveClass->meetingDetail->meeting_id,
            userName: $user->name,
            userEmail: $user->email,
            isModerator: false
        );

        return response()->json([
            'token' => $token,
            'domain' => config('services.jitsi.domain'),
            'room' => $liveClass->meetingDetail->meeting_id,
        ]);
    }
}