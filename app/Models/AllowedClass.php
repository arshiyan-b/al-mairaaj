<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllowedClass extends Model
{
    use HasFactory;

    protected $table = 'allowed_classes';
    public $timestamps = true;

    protected $fillable = [
        'teacher_id',
        'board',
        'grades',
        'subjects',
    ];

    protected $casts = [
        'grades' => 'array',
        'subjects' => 'array',
    ];
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function getGradesArrayAttribute()
    {
        $grades = is_string($this->grades) ? json_decode($this->grades, true) : $this->grades;
        return is_array($grades) ? $grades : [];
    }

    public function getSubjectsArrayAttribute()
    {
        $subjects = is_string($this->subjects) ? json_decode($this->subjects, true) : $this->subjects;
        return is_array($subjects) ? $subjects : [];
    }
}
