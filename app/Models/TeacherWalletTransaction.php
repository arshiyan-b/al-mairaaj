<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherWalletTransaction extends Model
{
    use HasFactory;

    protected $table = 'teacher_wallet_transactions';

    protected $fillable = [
        'wallet_id',
        'reference_id',
        'type',
        'transaction_type',
        'amount',
        'balance_after',
        'description',
        'status',
        'created_by',
    ];

    protected $hidden = [
        'updated_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'balance_after' => 'decimal:2',
    ];

    public function wallet()
    {
        return $this->belongsTo(TeacherWallet::class, 'wallet_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}