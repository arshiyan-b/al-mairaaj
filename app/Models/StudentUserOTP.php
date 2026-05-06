<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentUserOtp extends Model
{
    use HasFactory;
    protected $table = 'student_user_otps';
    protected $fillable = [
        'student_id',
        'email',
        'password',
        'otp',
        'status',
        'type',
        'expires_at',
    ];

    protected $hidden = [
        'password',
        'otp',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    public function isExpired()
    {
        return $this->expires_at && now()->greaterThan($this->expires_at);
    }
}
