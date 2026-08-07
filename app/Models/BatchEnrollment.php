<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BatchEnrollment extends Model
{
    use HasFactory;

    protected $table = 'batch_enrollments';

    protected $fillable = [
        'batch_id',
        'student_id',
        'payment_status',
        'status'
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}