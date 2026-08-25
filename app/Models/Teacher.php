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
        'application_id',
        'user_created',
        'user_id',
        'status',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function application()
    {
        return $this->belongsTo(TeacherApplication::class, 'application_id');
    }
    public function allowed_classes()
    {
        return $this->hasMany(AllowedClass::class);
    }
}