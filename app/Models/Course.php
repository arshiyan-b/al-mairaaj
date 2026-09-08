<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'grade_id',
        'subject_id',
        'teacher_id',
        'title',
        'paper',
        'description',
        'thumbnail',
        'per_minute_cost',
        'status',
    ];

    protected $casts = [
        'per_minute_cost' => 'decimal:2',
    ];

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function videos()
    {
        return $this->hasMany(CourseVideo::class)->orderBy('sort_order');
    }
}