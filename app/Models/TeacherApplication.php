<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherApplication extends Model
{
    protected $table = 'teacher_applications';

    protected $fillable = [
        'name',
        'cnic',
        'gender',
        'city',
        'phone_number',
        'whatsapp_number',
        'email',
        'address',
        'highest_degree',
        'field_of_study',
        'university',
        'experience',
        'preferred_grades',
        'preferred_subjects',
        'preferred_timings',
        'agree',
        'status',
    ];

    protected $casts = [
        'preferred_grades' => 'array',
        'preferred_subjects' => 'array',
        'preferred_timings' => 'array',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function getPreferredGradesListAttribute()
    {
        return Grade::whereIn('id', $this->preferred_grades ?? [])->get();
    }

    public function getPreferredSubjectsListAttribute()
    {
        return Subject::whereIn('id', $this->preferred_subjects ?? [])->get();
    }

    public function getPreferredTimingListAttribute()
    {
        return $this->preferred_timings ?? [];
    }
    public function teacherDocs()
    {
        return $this->hasMany(TeacherDoc::class, 'application_id');
    }
    public function teacher()
    {
        return $this->hasOne(Teacher::class, 'application_id');
    }
}