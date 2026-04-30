<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PearsonIgcseVideo extends Model
{
    use HasFactory;
    protected $table = 'pearson_igcse_videos';
    public $timestamps = true;
    protected $fillable = [
        'order_no',
        'title',
        'subject',
        'description',
        'price',
        'language',
        'duration',
        'link',
        'course_id',
        'mcq_id',
        'minutes',
        'seconds',
    ];
    public function course()
    {
        return $this->belongsTo(PearsonCourse::class, 'video_course_id');
    }
    public function mcq()
    {
        return $this->belongsTo(PearsonMcq::class, 'mcq_id');
    }
}
