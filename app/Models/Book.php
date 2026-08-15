<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'grade_id',
        'curriculum_subject_id',
        'name',
        'drive_link',
    ];

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }
    public function curriculumSubject()
    {
        return $this->belongsTo(CurriculumSubject::class);
    }
}