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

    protected $appends = [ 'complete_name', ];

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }
    public function getCompleteNameAttribute() 
    { 
        return $this->code . ' - ' . $this->name; 
    } 
}