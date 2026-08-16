<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Http\Requests\StoreBookRequest;
use App\Services\BoardService;
use App\Services\BookService;
use App\Services\CurriculumSubjectService;
use App\Services\GradeService;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function __construct(
        protected BoardService $boardService,
        protected BookService $bookService,
        protected CurriculumSubjectService $curriculumSubjectService,
        protected GradeService $gradeService,
    ) {}

    public function index()
    {
        $books = $this->bookService->getBooks();
        $boards = $this->boardService->getBoards();
        $curriculum_subjects = $this->curriculumSubjectService->getCurriculumSubjects();
        $grades = $this->gradeService->getGrades();

        return view('admin.books.index', compact(
            'books',
            'boards',
            'curriculum_subjects',
            'grades'
        ));
    }

    public function store(StoreBookRequest $request)
    {
        $this->bookService->createBook($request->validated());

        return redirect()
            ->route('admin.books.index')
            ->with('success', 'Book uploaded successfully.');
    }

    public function show(Book $book)
    {
        $book = $this->bookService->getBook($book);

        return view('admin.books.show', compact('book'));
    }

    public function edit(Book $book)
    {
        $boards = $this->boardService->getBoards();
        $curriculum_subjects = $this->curriculumSubjectService->getCurriculumSubjects();
        $grades = $this->gradeService->getGrades();

        return view('admin.books.edit', compact(
            'book',
            'boards',
            'curriculum_subjects',
            'grades'
        ));
    }

    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'board_id' => ['required', 'exists:boards,id'],
            'grade_id' => ['required', 'exists:grades,id'],
            'curriculum_subject_id' => [
                'required',
                'exists:curriculum_subjects,id',
            ],
            'file' => [
                'nullable',
                'file',
                'mimes:pdf',
                'max:51200',
            ],
        ]);

        $this->bookService->updateBook($book, $validated);

        return redirect()
            ->route('admin.books.index')
            ->with('success', 'Book updated successfully.');
    }

    public function destroy(Book $book)
    {
        $this->bookService->deleteBook($book);

        return redirect()
            ->route('admin.books.index')
            ->with('success', 'Book deleted successfully.');
    }

    public function download(Book $book)
    {
        return $this->bookService->downloadBook($book);
    }
}