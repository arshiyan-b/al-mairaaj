<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TeacherDoc extends Model
{
    public $timestamps = true;
    protected $table = 'teacher_docs';
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'type',
        'file_path',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'teacher_id');
    }

}
