<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JitsiMeetingSession extends Model
{
    protected $fillable = [
        'uuid',
        'student_id',
        'live_class_id',
        'session_id',
        'jti',
        'device_hash',
        'status',
        'expires_at',
        'last_seen_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'last_seen_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
    public function liveClass(): BelongsTo
    {
        return $this->belongsTo(LiveClass::class);
    }
}