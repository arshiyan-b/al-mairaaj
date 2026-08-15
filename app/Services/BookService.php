<?php

namespace App\Services;

use App\Models\Book;

class BookService
{
    public function getBook($id)
    {
        return Book::with([
            'curriculumSubject.grade.board',
        ])->findOrFail($id);
    }

    public function getBooks()
    {
        return Book::with([
            'curriculumSubject.grade.board',
        ])->get();
    }
}