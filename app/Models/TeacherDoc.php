<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TeacherDoc extends Model
{
    use HasFactory;
    protected $table = 'teacher_docs';
    protected $fillable = [
        'teacher_id',
        'type',
        'file_path',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}