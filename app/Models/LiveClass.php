<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LiveClass extends Model
{
    use HasFactory;

    protected $table = 'live_classes';

    protected $fillable = [
        'batch_id',
        'teacher_id',
        'grade_id',
        'curriculum_subject_id',
        'title',
        'description',
        'meeting_provider',
        'meeting_link',
        'meeting_id',
        'meeting_password',
        'class_date',
        'start_time',
        'end_time',
        'duration',
        'status',
    ];
    
    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function curriculum_subject()
    {
        return $this->belongsTo(CurriculumSubject::class, 'curriculum_subject_id');
    }
}