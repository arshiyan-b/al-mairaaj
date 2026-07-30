<?php

namespace App\Services;

use App\Models\Board;

class BoardService
{
    public function getBoards()
    {
        return Board::all();
    }
    public function getBoard($id)
    {
        return Board::findOrFail($id);
    }
}