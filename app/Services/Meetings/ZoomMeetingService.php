<?php

namespace App\Services\Meetings;

use App\Models\LiveClass;

class ZoomMeetingService
{
    public function create(LiveClass $liveClass)
    {
        return (object) [
            'meeting_id' => $liveClass->meeting_id,
            'meeting_link' => $liveClass->meeting_link,
            'meeting_password' => $liveClass->meeting_password,
        ];
    }
}