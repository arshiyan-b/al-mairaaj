<?php

namespace App\Services;

use App\Models\Voucher;
use App\Models\VoucherRedemption;

class VoucherService
{
    public function getVouchers()
    {
        return Voucher::withCount('redemptions')
            ->latest()
            ->get();
    }
    public function getVoucher($id)
    {
        return Voucher::find($id);
    }
    public function create(array $data)
    {
        return Voucher::create($data);
    }
    public function createRedemption(array $data) 
    { 
        $voucher = Voucher::where('code', $data['code'])->firstOrFail(); 

        return VoucherRedemption::create([ 
            'student_id' => auth()->user()->student->id, 
            'voucher_id' => $voucher->id,
            'redeemed_at' => now(),
        ]); 
    }
}