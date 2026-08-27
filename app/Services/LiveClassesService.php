<?php

namespace App\Services;

use App\Models\LiveClass;
use App\Models\MeetingDetail;

use App\Services\Meetings\JitsiMeetingService;
use App\Services\Meetings\ZoomMeetingService;
use App\Services\Meetings\GoogleMeetService;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LiveClassesService
{
    public function __construct(
        private JitsiMeetingService $jitsiMeetingService,
        private ZoomMeetingService $zoomMeetingService,
        private GoogleMeetService $googleMeetService,
    ) {}
    public function getLiveClass($id)
    {
        return LiveClass::findOrFail($id);
    }
    public function getLiveClassTitle($id)
    {
        return LiveClass::findOrFail($id)->title;
    }
    public function getAuthenticatedStudentLiveClassesByBatchId($batchId)
    {
        return LiveClass::where('batch_id', $batchId)
            ->with('meetingDetail')
            ->withExists([
                'enrollments as is_enrolled' => function ($query) {
                    $query->where('student_id', auth()->user()->student->id)
                        ->where('status', 'enrolled');
                }
            ])
            ->orderBy('class_date')
            ->orderBy('start_time')
            ->get();
    }
    public function getLiveClassesByBatchId($batchId)
    {
        return LiveClass::where('batch_id', $batchId)
            ->orderBy('class_date')
            ->orderBy('start_time')
            ->get();
    }
    public function getUpcomingLiveClassesByBatchIds($batchIds)
    {
        return LiveClass::with(['batch', 'meetingDetail'])
            ->whereIn('batch_id', $batchIds)
            ->whereDate('class_date', '>=', now()->toDateString())
            ->orderBy('class_date')
            ->orderBy('start_time')
            ->get();
    }
    public function checkAuthenticatedStudentWalletBalanceForLiveClass($id)
    {
        $liveClass = LiveClass::findOrFail($id);
        return auth()->user()->student->wallet->balance >= $liveClass->price;
    }
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {

            $liveClass = LiveClass::create([
                'batch_id' => $data['batch_id'],
                'title' => $data['title'],
                'description' => $data['description'],
                'meeting_provider' => $data['meeting_provider'],
                'class_date' => $data['class_date'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'duration' => $data['duration'],
                'status' => $data['status'],
                'price' => $data['price'],
            ]);

            $meetingDetail = match ($data['meeting_provider']) {

                'jitsi' => $this->jitsiMeetingService->create($liveClass),
                'zoom' => $this->zoomMeetingService->create($liveClass),
                'google_meet' => $this->googleMeetService->create($liveClass),
                default => null,
            };

            if ($meetingDetail) {
                $liveClass->update([
                    'meeting_detail_id' => $meetingDetail->id,
                ]);
            }

            return $liveClass;
        });
    }
}