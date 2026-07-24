<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TeacherDoc extends Model
{
    use HasFactory;
    protected $table = 'teacher_docs';
    protected $fillable = [
        'application_id',
        'type',
        'file_path',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function teacherApplication()
    {
        return $this->belongsTo(TeacherApplication::class, 'application_id');
    }
}