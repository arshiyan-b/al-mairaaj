<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class LiveClass extends Model
{
    use HasFactory;

    protected $table = 'live_classes';

    protected $fillable = [
        'batch_id',
        'title',
        'description',
        'meeting_provider',
        'meeting_link',
        'meeting_detail_id',
        'meeting_password',
        'class_date',
        'start_time',
        'end_time',
        'duration',
        'status',
        'price',
    ];

    protected $hidden = [
        'uuid',
        'meeting_provider',
        'meeting_link',
        'meeting_id',
        'meeting_password',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'class_date' => 'date:Y-m-d',
        'start_time' => 'datetime:H:i:s',
        'end_time' => 'datetime:H:i:s',
        'price' => 'decimal:2',
        'is_enrolled' => 'boolean',
    ];
    
    protected $appends = [
        'formatted_class_date',
        'teacher',
        'board',
        'grade',
        'curriculum_subject',
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
    public function meetingDetail()
    {
        return $this->belongsTo(MeetingDetail::class, 'meeting_detail_id');
    }
    public function enrollments()
    {
        return $this->hasMany(LiveClassEnrollment::class);
    }
    public function toArray()
    {
        $array = parent::toArray();

        if ($this->is_enrolled ?? false) {
            $detail = $this->meetingDetail;
            $array['meeting_provider'] = $detail->provider ?? null;
            $array['meeting_link']     = $detail->link ?? null;
            $array['meeting_id']       = $detail->meeting_id ?? null;
            $array['meeting_password'] = $detail->password ?? null;
        }

        return $array;
    }
    public function getFormattedClassDateAttribute()
    {
        return $this->class_date
            ? Carbon::parse($this->class_date)->format('d M Y')
            : null;
    }
    public function getTeacherAttribute()
    {
        return $this->batch->teacher;
    }
    public function getBoardAttribute()
    {
        return $this->batch->grade->board;
    }
    public function getGradeAttribute()
    {
        return $this->batch->curriculumSubject->grade;
    }
    public function getCurriculumSubjectAttribute()
    {
        return $this->batch->curriculumSubject;
    }
}