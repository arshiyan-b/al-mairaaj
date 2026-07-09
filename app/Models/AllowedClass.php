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
    protected $casts = [
        'curriculum_subject_ids' => 'array',
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
        return CurriculumSubject::whereIn(
            'id',
            $this->curriculum_subject_ids ?? []
        )->get();
    }
}