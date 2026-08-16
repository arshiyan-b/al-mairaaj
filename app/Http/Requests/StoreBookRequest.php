<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'grade_id' => [
                'required',
                'exists:grades,id',
            ],

            'curriculum_subject_id' => [
                'required',
                'exists:curriculum_subjects,id',
            ],

            'file' => [
                'required',
                'file',
                'mimes:pdf',
                'max:51200',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Book name is required.',
            'board_id.required' => 'Please select a board.',
            'grade_id.required' => 'Please select a grade.',
            'grade_id.exists' => 'The selected grade is invalid.',
            'curriculum_subject_id.required' => 'Please select a curriculum subject.',
            'curriculum_subject_id.exists' => 'The selected curriculum subject is invalid.',
            'file.required' => 'Please upload a book file.',
            'file.mimes' => 'The book must be a PDF file.',
            'file.max' => 'The book file may not be larger than 50 MB.',
        ];
    }
}