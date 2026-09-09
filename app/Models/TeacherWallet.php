<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TeacherWallet extends Model
{
    use HasFactory;

    protected $table = 'teacher_wallets';

    protected $fillable = [
        'teacher_id',
        'balance',
        'currency',
        'status',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function transactions()
    {
        return $this->hasMany(TeacherWalletTransaction::class, 'wallet_id');
    }
}