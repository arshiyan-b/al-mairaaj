<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllowedClass extends Model
{
    use HasFactory;

    protected $table = 'allowed_classes';

    protected $fillable = [
        'teacher_id',
        'grade_id',
        'board',
        'grade',
        'curriculum_subject_ids',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'curriculum_subject_ids' => 'array',
    ];

    protected $appends = [
        'curriculum_subjects',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function getCurriculumSubjectsAttribute()
    {
        return CurriculumSubject::with('grade.board')
            ->whereIn('id', $this->curriculum_subject_ids ?? [])
            ->get();
    }
}