<?php

namespace App\Http\View\Composers;

use App\Models\Board;
use Illuminate\View\View;

class AdminSidebarComposer
{
    /**
     * Bind data to the view.
     */
    public function compose(View $view): void
    {
        $view->with('boards', Board::with('grades')->get());
    }
}