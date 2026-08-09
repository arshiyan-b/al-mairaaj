<?php

namespace App\Http\Requests;

use App\Models\Voucher;
use App\Models\VoucherRedemption;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentRedeemVoucherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'string',
                'exists:vouchers,code',

                function ($attribute, $value, $fail) {
                    $voucher = Voucher::where('code', $value)->first();

                    if (!$voucher){
                        $fail('Invalid voucher code.');
                        return;
                    }

                    $alreadyRedeemed = VoucherRedemption::where('student_id', auth()->user()->student->id)
                        ->where('voucher_id', $voucher->id)
                        ->exists();

                    if ($alreadyRedeemed) {
                        $fail('You have already redeemed this voucher.');
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Please enter a voucher code.',
            'code.exists' => 'Invalid voucher code.',
        ];
    }
}
