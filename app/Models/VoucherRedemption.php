<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoucherRedemption extends Model
{
    protected $table = 'voucher_redemptions';

    const UPDATED_AT = null;

    protected $fillable = [
        'voucher_id',
        'user_id',
        'discount_type',
        'discount_value',
        'redeemed_amount',
        'redeemed_at',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'redeemed_amount' => 'decimal:2',
        'redeemed_at' => 'datetime',
    ];

    /**
     * Get the voucher.
     */
    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class, 'voucher_id');
    }

    /**
     * Get the user who redeemed the voucher.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}