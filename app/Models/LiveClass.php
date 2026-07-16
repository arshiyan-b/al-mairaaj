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
        'meeting_id',
        'meeting_password',
        'class_date',
        'start_time',
        'end_time',
        'duration',
        'status',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    
    protected $appends = [
        'formatted_class_date',
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function getFormattedClassDateAttribute()
    {
        return $this->class_date
            ? Carbon::parse($this->class_date)->format('d M Y')
            : null;
    }
}