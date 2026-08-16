@extends('admin.layout.app')

@section('title')
    Books
@endsection

@include('scripts.disable_submit_button')
@include('scripts.table')

@section('content')

<div class="container">

    @include('admin.layout.alerts')

    {{-- Upload Book --}}
    <div class="card mb-4">
        <div class="card-header">
            <h2>Upload Book</h2>
        </div>

        <div class="card-body">

            <form action="{{ route('admin.books.store') }}" method="POST" enctype="multipart/form-data">
                @csrf

                <div class="row">

                    {{-- Book Name --}}
                    <div class="col-md-6 mb-3">
                        <label for="name" class="form-label">
                            Book Name <span class="text-danger">*</span>
                        </label>

                        <input
                            type="text"
                            name="name"
                            id="name"
                            value="{{ old('name') }}"
                            class="form-control"
                            placeholder="Enter book name"
                            required
                        >

                        @error('name')
                            <div class="text-danger small mt-1">
                                {{ $message }}
                            </div>
                        @enderror
                    </div>

                    {{-- Grade --}}
                    <div class="col-md-6 mb-3">
                        <label for="grade_id" class="form-label">
                            Grade <span class="text-danger">*</span>
                        </label>

                        <select
                            name="grade_id"
                            id="grade_id"
                            class="form-select"
                            required
                        >
                            <option value="">Select Grade</option>

                            @foreach ($grades as $grade)
                                <option
                                    value="{{ $grade->id }}"
                                    {{ old('grade_id') == $grade->id ? 'selected' : '' }}
                                >
                                    {{ $grade->board->name }} - {{ $grade->name }}
                                </option>
                            @endforeach
                        </select>

                        @error('grade_id')
                            <div class="text-danger small mt-1">
                                {{ $message }}
                            </div>
                        @enderror
                    </div>

                    {{-- Curriculum Subject --}}
                    <div class="col-md-6 mb-3">
                        <label for="curriculum_subject_id" class="form-label">
                            Curriculum Subject <span class="text-danger">*</span>
                        </label>

                        <select
                            name="curriculum_subject_id"
                            id="curriculum_subject_id"
                            class="form-select"
                            required
                        >
                            <option value="">Select Curriculum Subject</option>

                            @foreach ($curriculum_subjects as $subject)
                                <option
                                    value="{{ $subject->id }}"
                                    data-grade="{{ $subject->grade_id ?? '' }}"
                                    {{ old('curriculum_subject_id') == $subject->id ? 'selected' : '' }}
                                >
                                    {{ $subject->code }} - {{ $subject->name }}
                                </option>
                            @endforeach
                        </select>

                        @error('curriculum_subject_id')
                            <div class="text-danger small mt-1">
                                {{ $message }}
                            </div>
                        @enderror
                    </div>

                    {{-- Book File --}}
                    <div class="col-md-6 mb-3">
                        <label for="file" class="form-label">
                            Book File <span class="text-danger">*</span>
                        </label>

                        <input
                            type="file"
                            name="file"
                            id="file"
                            class="form-control"
                            accept=".pdf"
                            required
                        >

                        <small class="text-muted">
                            PDF files only.
                        </small>

                        @error('file')
                            <div class="text-danger small mt-1">
                                {{ $message }}
                            </div>
                        @enderror
                    </div>

                </div>

                <div class="mt-3">
                    <button type="submit" class="btn btn-primary">
                        Upload Book
                    </button>
                </div>

            </form>

        </div>
    </div>


    {{-- Books List --}}
    <div class="card">

        <div class="card-header">
            <h2>Books</h2>
        </div>

        <div class="card-body">

            {{-- Filters --}}
            <div class="row mb-3">

                <div class="col-md-3">
                    <label for="gradeFilter" class="form-label">
                        Grade
                    </label>

                    <select id="gradeFilter" class="form-select">
                        <option value="">All Grades</option>

                        @foreach ($grades as $grade)
                            <option value="{{ $grade->name }}">
                                {{ $grade->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="col-md-3">
                    <label for="subjectFilter" class="form-label">
                        Subject
                    </label>

                    <select id="subjectFilter" class="form-select">
                        <option value="">All Subjects</option>

                        @foreach ($curriculum_subjects as $subject)
                            <option value="{{ $subject->name }}">
                                {{ $subject->code }} - {{ $subject->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

            </div>

            <div class="table-responsive">

                <table class="table table-bordered datatable">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Book Name</th>
                            <th>Grade</th>
                            <th>Curriculum Subject</th>
                            <th>Book</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        @foreach ($books as $book)

                            <tr>

                                <td>
                                    {{ $loop->iteration }}
                                </td>

                                <td>
                                    {{ $book->name }}
                                </td>

                                <td>
                                    {{ $book->grade->name }}
                                </td>

                                <td>
                                    {{ $book->curriculumSubject->code }} - {{ $book->curriculumSubject->name }}
                                </td>

                                <td>
                                    @if ($book->file)
                                        <a
                                            href="{{ Storage::url($book->file) }}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="btn btn-sm btn-primary"
                                        >
                                            View Book
                                        </a>
                                    @else
                                        <span class="text-muted">
                                            No File
                                        </span>
                                    @endif
                                </td>

                                <td>

                                    <a
                                        href="{{ route('admin.books.edit', ['book' => $book->id]) }}"
                                        class="btn btn-sm btn-warning"
                                    >
                                        Edit
                                    </a>

                                    <form
                                        action="{{ route('admin.books.destroy', ['book' => $book->id]) }}"
                                        method="POST"
                                        class="d-inline"
                                        onsubmit="return confirm('Are you sure you want to delete this book?')"
                                    >
                                        @csrf
                                        @method('DELETE')

                                        <button
                                            type="submit"
                                            class="btn btn-sm btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </form>

                                </td>

                            </tr>

                        @endforeach

                    </tbody>

                </table>

            </div>

        </div>

    </div>

</div>


<script>
    $('#gradeFilter').on('change', function () {
        table.column(2)
            .search('^' + $(this).val() + '$', true, false)
            .draw();
    });

    $('#subjectFilter').on('change', function () {
        table.column(3)
            .search('^' + $(this).val() + '$', true, false)
            .draw();
    });


    // Filter curriculum subjects according to selected grade
    $('#grade_id').on('change', function () {

        const gradeId = $(this).val();
        const subjectSelect = $('#curriculum_subject_id');

        subjectSelect.val('');

        subjectSelect.find('option').each(function () {

            if (!this.value) {
                return;
            }

            const subjectGrade = $(this).data('grade');

            if (!gradeId || subjectGrade == gradeId) {
                $(this).show();
            } else {
                $(this).hide();
            }

        });

    });
</script>

@endsection