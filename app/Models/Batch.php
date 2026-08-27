<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Batch extends Model
{
    use HasFactory;

    protected $table = 'batches';

    protected $fillable = [
        'teacher_id',
        'grade_id',
        'curriculum_subject_id',
        'title',
        'description',
        'price',
        'start_date',
        'end_date',
        'total_classes',
        'status',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $appends = [
        'formatted_start_date',
        'formatted_end_date',
        'duration',
        'date_range',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }
    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }
    public function curriculumSubject()
    {
        return $this->belongsTo(CurriculumSubject::class, 'curriculum_subject_id');
    }
    public function liveClasses()
    {
        return $this->hasMany(LiveClass::class, 'batch_id');
    }
    public function enrollments()
    {
        return $this->hasMany(BatchEnrollment::class, 'batch_id');
    }
    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments', 'batch_id', 'student_id');
    }
        public function getFormattedStartDateAttribute()
    {
        return $this->start_date
            ? Carbon::parse($this->start_date)->format('d M Y')
            : null;
    }
    public function getFormattedEndDateAttribute()
    {
        return $this->end_date
            ? Carbon::parse($this->end_date)->format('d M Y')
            : null;
    }
    public function getDateRangeAttribute()
    {
        if (!$this->start_date || !$this->end_date) {
            return null;
        }
        return Carbon::parse($this->start_date)->format('d M Y') . ' - ' . Carbon::parse($this->end_date)->format('d M Y');
    }
    public function getDurationAttribute()
    {
        if (!$this->start_date || !$this->end_date) {
            return null;
        }

        return Carbon::parse($this->start_date)
            ->diffInDays(Carbon::parse($this->end_date)) . ' days';
    }
}