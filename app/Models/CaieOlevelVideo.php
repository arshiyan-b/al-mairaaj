<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaieOlevelVideo extends Model
{
    use HasFactory;
    protected $table = 'caie_olevel_videos';
    public $timestamps = true;
    protected $fillable = [
        'order',
        'title',
        'subject_id',
        'description',
        'price',
        'language',
        'duration',
        'course_id',
        'mcq_id',
        'minutes',
        'seconds',
    ];
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
    public function course()
    {
        return $this->belongsTo(CaieCourse::class, 'course_id');
    }
    public function mcq()
    {
        return $this->belongsTo(CaieMcq::class, 'mcq_id');
    }
}
