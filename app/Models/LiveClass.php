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
        'title',
        'description',
        'meeting_provider',
        'meeting_link',
        'meeting_id',
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
        'batch_id',
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
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
    public function enrollments()
    {
        return $this->hasMany(LiveClassEnrollment::class);
    }
    public function toArray()
    {
        $array = parent::toArray();

        if ($this->is_enrolled ?? false) {
            $array['meeting_provider'] = $this->meeting_provider;
            $array['meeting_link'] = $this->meeting_link;
            $array['meeting_id'] = $this->meeting_id;
            $array['meeting_password'] = $this->meeting_password;
        }

        return $array;
    }
    public function getFormattedClassDateAttribute()
    {
        return $this->class_date
            ? Carbon::parse($this->class_date)->format('d M Y')
            : null;
    }
}