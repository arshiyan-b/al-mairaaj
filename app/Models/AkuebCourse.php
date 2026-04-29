<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AkuebCourse extends Model
{
    use HasFactory;
    protected $table = 'akueb_courses';
    public $timestamps = true;

    protected $fillable = [
        'title',
        'description',
        'subject',
        'paper',
        'qualification',
        'teacher_id',
    ];
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
