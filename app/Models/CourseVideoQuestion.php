<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourseVideoQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_video_id',
        'trigger_at_seconds',
        'question_type',
        'question_text',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_option',
        'explanation',
        'sort_order',
    ];

    public function video()
    {
        return $this->belongsTo(CourseVideo::class, 'course_video_id');
    }

    public function getOptionsAttribute(): array
    {
        return array_filter([
            'a' => $this->option_a,
            'b' => $this->option_b,
            'c' => $this->option_c,
            'd' => $this->option_d,
        ]);
    }
}