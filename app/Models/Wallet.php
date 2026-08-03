<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Wallet extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'student_id',
        'balance',
        'currency',
        'status',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    public function transactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }
}