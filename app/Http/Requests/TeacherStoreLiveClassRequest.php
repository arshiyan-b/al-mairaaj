<?php

namespace App\Http\Requests;

use App\Models\Batch;
use Illuminate\Foundation\Http\FormRequest;

class TeacherStoreLiveClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        $batch = Batch::find($this->input('batch_id'));
        $teacher = auth()->user()?->teacher;

        return $batch && $teacher && $batch->teacher_id === $teacher->id;
    }

    protected function prepareForValidation(): void
    {
        // The price always comes from the batch, never from the submitted
        // form - a teacher shouldn't be able to set their own class price.
        $batch = Batch::find($this->input('batch_id'));

        if ($batch) {
            $this->merge(['price' => $batch->price]);
        }
    }

    public function rules(): array
    {
        return [
            'batch_id' => ['required', 'exists:batches,id'],
            'title' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],

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