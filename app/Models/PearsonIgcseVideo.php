<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PearsonIgcseVideo extends Model
{
    use HasFactory;
    protected $fillable = [
        'order',
        'title',
        'subject_id',
        'description',
        'price',
        'language',
        'duration',
        'course_id',
        'mcq_id',
        'minutes',
        'seconds',
    ];
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
    public function course()
    {
        return $this->belongsTo(PearsonCourse::class, 'video_course_id');
    }
    public function mcq()
    {
        return $this->belongsTo(PearsonMcq::class, 'mcq_id');
    }
}
