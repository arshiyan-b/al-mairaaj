<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TopupRequest extends Model
{
    use HasFactory;

    protected $table = 'topup_requests';

    protected $fillable = [
        'wallet_id',
        'amount',
        'payment_method',

        // EasyPaisa / JazzCash
        'mobile_number',
        'account_name',

        // Bank
        'bank_name',
        'bank_account_name',
        'bank_account_number',

        'screenshot',
        'status',
        'admin_note',
        'requested_at',
        'processed_at',
        'processed_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'requested_at' => 'datetime',
        'processed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }
    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}