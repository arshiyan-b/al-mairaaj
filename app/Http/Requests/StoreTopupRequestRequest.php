<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTopupRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:easypaisa,jazzcash,bank',
            'screenshot' => 'required|image|mimes:jpg,jpeg,png|max:5120',
        ];

        if (in_array($this->payment_method, ['easypaisa', 'jazzcash'])) {
            $rules['mobile_number'] = [
                'required',
                'string',
                'max:20',
            ];

            $rules['account_name'] = [
                'required',
                'string',
                'max:255',
            ];
        }

        if ($this->payment_method === 'bank') {
            $rules['bank_name'] = [
                'required',
                'string',
                'max:255',
            ];

            $rules['bank_account_name'] = [
                'required',
                'string',
                'max:255',
            ];

            $rules['bank_account_number'] = [
                'required',
                'string',
                'max:100',
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Amount is required.',
            'amount.numeric' => 'Amount must be a number.',
            'payment_method.required' => 'Payment method is required.',
            'payment_method.in' => 'Invalid payment method selected.',
            'screenshot.required' => 'Please upload a payment screenshot.',
            'screenshot.image' => 'Screenshot must be an image.',
            'screenshot.mimes' => 'Screenshot must be a JPG, JPEG or PNG image.',
            'screenshot.max' => 'Screenshot may not be larger than 5 MB.',
        ];
    }
}