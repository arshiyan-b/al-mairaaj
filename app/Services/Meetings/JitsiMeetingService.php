<?php

namespace App\Services\Meetings;

use App\Models\LiveClass;
use App\Models\MeetingDetail;
use Illuminate\Support\Str;

class JitsiMeetingService
{
    public function create(LiveClass $liveClass): MeetingDetail
    {
        $meetingId = 'class-' . Str::uuid();

        return MeetingDetail::create([
            'live_class_id' => $liveClass->id,
            'meeting_id' => $meetingId,
            'link' => 'https://' . rtrim(config('services.jitsi.domain'), '/') . '/' . $meetingId,
            'password' => null,
        ]);
    }
}