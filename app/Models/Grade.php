<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'board_id',
        'name',
        'slug',
    ];

    public function board()
    {
        return $this->belongsTo(Board::class);
    }
}