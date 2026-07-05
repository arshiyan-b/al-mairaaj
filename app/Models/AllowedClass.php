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
        'subjects',
    ];
    protected $casts = [
        'subjects' => 'array',
    ];
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }
}