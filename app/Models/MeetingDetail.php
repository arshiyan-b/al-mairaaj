<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MeetingDetail extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'live_class_id',
        'link',
        'meeting_id',
        'password',
    ];

    public function liveClass()
    {
        return $this->belongsTo(LiveClass::class, 'live_class_id');
    }
}