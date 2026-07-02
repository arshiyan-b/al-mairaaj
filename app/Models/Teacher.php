<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Subject;

class Teacher extends Model
{
    use HasFactory;
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
        'subjects',
        'preferred_grades',
        'preferred_subjects',
        'agree',
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function getPreferredGradesListAttribute()
    {
        $gradeIds = explode(',', $this->preferred_grades);
        return Grade::whereIn('id', $gradeIds)->get();
    }
    public function getPreferredSubjectsListAttribute()
    {
        $subjectIds = explode(',', $this->preferred_subjects);
        return Subject::whereIn('id', $subjectIds)->get();
    }
}
