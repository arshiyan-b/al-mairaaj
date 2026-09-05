<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLiveClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'batch_id' => ['required', 'exists:batches,id'],
            'title' => ['required', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],

            'description' => [
                'nullable',
                'string',
            ],

            'meeting_provider' => [
                'required',
                'in:jitsi,zoom',
            ],

            'class_date' => [
                'required',
                'date',
            ],

            'start_time' => [
                'required',
                'date_format:H:i',
            ],

            'end_time' => [
                'required',
                'date_format:H:i',
                'after:start_time',
            ],

            'duration' => ['nullable', 'integer', 'min:1'],
            'status' => ['required', 'in:scheduled,completed,canceled'],
        ];
    }
}