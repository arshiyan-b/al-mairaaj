<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    use HasFactory;

    protected $table = 'batches';

    protected $fillable = [
        'teacher_id',
        'grade_id',
        'curriculum_subject_id',
        'title',
        'description',
        'price',
        'start_date',
        'end_date',
        'total_classes',
        'status',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function curriculumSubject()
    {
        return $this->belongsTo(CurriculumSubject::class, 'curriculum_subject_id');
    }

    public function liveClasses()
    {
        return $this->hasMany(LiveClass::class, 'batch_id');
    }
}