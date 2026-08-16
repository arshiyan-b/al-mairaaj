<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Support\Facades\Storage;

class BookService
{
    public function getBooks()
    {
        return Book::with([
            'grade',
            'curriculumSubject',
        ])
            ->latest()
            ->get();
    }

    public function getBook(Book $book)
    {
        return $book->load([
            'grade',
            'curriculumSubject',
        ]);
    }

    public function createBook(array $data)
    {
        $data['file_path'] = $data['file']->store('books', 'private');

        unset($data['file']);

        return Book::create($data);
    }

    public function updateBook(Book $book, array $data)
    {
        if (isset($data['file'])) {
            if ($book->file) {
                Storage::disk('public')->delete($book->file);
            }

            $data['file'] = $data['file']->store('books', 'public');
        }

        $book->update($data);

        return $book->fresh();
    }

    public function deleteBook(Book $book)
    {
        if ($book->file) {
            Storage::disk('public')->delete($book->file);
        }

        return $book->delete();
    }

    public function downloadBook(Book $book)
    {
        abort_unless(
            $book->file &&
            Storage::disk('public')->exists($book->file),
            404
        );

        return Storage::disk('public')->download(
            $book->file,
            $book->name . '.pdf'
        );
    }
}