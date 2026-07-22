<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Voucher extends Model
{
    protected $table = 'vouchers';

    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'expires_at' => 'datetime',
    ];

    /**
     * Get all redemptions for this voucher.
     */
    public function redemptions(): HasMany
    {
        return $this->hasMany(VoucherRedemption::class, 'voucher_id');
    }

    /**
     * Check if voucher is currently active.
     */
    public function isActive(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        return true;
    }
}