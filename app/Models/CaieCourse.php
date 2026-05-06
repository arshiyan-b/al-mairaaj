<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaieCourse extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'subject_id',
        'paper',
        'qualification_id',
        'teacher_id',
    ];
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
    public function qualification()
    {
        return $this->belongsTo(Qualification::class);
    }
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
