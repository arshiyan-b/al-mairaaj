<?php

namespace App\Http\Requests;

use App\Models\LiveClass;
use Illuminate\Foundation\Http\FormRequest;

class TeacherUpdateLiveClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        $liveClass = LiveClass::find($this->route('live_class'));
        $teacher = auth()->user()?->teacher;

        return $liveClass
            && $liveClass->batch
            && $teacher
            && $liveClass->batch->teacher_id === $teacher->id;
    }

    protected function prepareForValidation(): void
    {
        // The price always tracks the batch's price - a teacher can't set
        // a different price for one of their own live classes.
        $liveClass = LiveClass::find($this->route('live_class'));

        if ($liveClass && $liveClass->batch) {
            $this->merge(['price' => $liveClass->batch->price]);
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],

            'description' => [
                'nullable',
                'string',
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