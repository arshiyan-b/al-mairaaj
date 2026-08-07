<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LiveClassEnrollment extends Model
{
    protected $fillable = [
        'live_class_id',
        'student_id',
        'status',
        'remarks',
    ];

    public function liveClass()
    {
        return $this->belongsTo(LiveClass::class);
    }
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}