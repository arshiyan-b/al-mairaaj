<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Simulator extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_id',
        'title',
        'slug',
        'description',
        'thumbnail',
        'page_path',
        'status',
        'sort_order',
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}