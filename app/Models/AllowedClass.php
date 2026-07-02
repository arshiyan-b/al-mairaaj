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
        'board',
        'grades',
        'subjects',
    ];
    protected $casts = [
        'grades' => 'array',
        'subjects' => 'array',
    ];
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}