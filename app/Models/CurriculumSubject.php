<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CurriculumSubject extends Model
{
    protected $table = 'curriculum_subjects';

    protected $fillable = [
        'grade_id',
        'code',
        'name',
    ];

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }
}