<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    use HasFactory;

    protected $table = 'wallet_transactions';

    protected $fillable = [
        'wallet_id',
        'enrollment_id',
        'reference_id',
        'type',
        'amount',
        'balance_after',
        'payment_method',
        'description',
        'status',
        'created_by',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'balance_after' => 'decimal:2',
    ];

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }
    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}