<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'father_name',
        'phone_number',
        'whatsapp_number',
        'email',
        'date_of_birth',
        'address',
        'city',
        'country',
        'otp_sent',
        'otp_verified',
        'user_created',
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
