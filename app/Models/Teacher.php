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
        'preferred_board',
        'subjects',
        'grades',
        'agree',
        'allowed_boards',
        'allowed_grades',
        'allowed_subjects',
        'user_created',
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function allowed_classes()
    {
        return $this->hasMany(AllowedClass::class);
    }
    public function getSubjectsListAttribute()
    {
        $subjectKeys = explode(',', $this->subjects);
        return Subject::whereIn('subject_key', $subjectKeys)->get();
    }
}
