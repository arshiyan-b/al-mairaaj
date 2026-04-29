@extends('admin.layout.app')
@section('title')
    Teacher Details - {{ $teacher->teacher_name }}
@endsection
@section('content')

    <div class="container">
        @if (session('success'))
            <div class="alert alert-success mt-3 mx-3">
                {{ session('success') }}
            </div>
        @endif
        <div class="card shadow">
            <div class="card-header bg-dark text-white">
                <h4 class="mb-0">Teacher Details</h4>
            </div>
            <div class="card-body">
                <dl class="row">
                    <dt class="col-sm-3">Name</dt>
                    <dd class="col-sm-9">{{ $teacher->name }}</dd>

                    <dt class="col-sm-3">CNIC</dt>
                    <dd class="col-sm-9">{{ $teacher->cnic }}</dd>

                    <dt class="col-sm-3">Gender</dt>
                    <dd class="col-sm-9">{{ ucfirst($teacher->gender) }}</dd>

                    <dt class="col-sm-3">Phone</dt>
                    <dd class="col-sm-9">{{ $teacher->phone_number }}</dd>

                    <dt class="col-sm-3">WhatsApp</dt>
                    <dd class="col-sm-9">{{ $teacher->whatsapp_number }}</dd>

                    <dt class="col-sm-3">Email</dt>
                    <dd class="col-sm-9">{{ $teacher->email }}</dd>

                    <dt class="col-sm-3">City</dt>
                    <dd class="col-sm-9">{{ $teacher->city }}</dd>

                    <dt class="col-sm-3">Address</dt>
                    <dd class="col-sm-9">{{ $teacher->address }}</dd>

                    <dt class="col-sm-3">Highest Degree</dt>
                    <dd class="col-sm-9">{{ $teacher->highest_degree }}</dd>

                    <dt class="col-sm-3">Field of Study</dt>
                    <dd class="col-sm-9">{{ $teacher->field_of_study }}</dd>

                    <dt class="col-sm-3">University</dt>
                    <dd class="col-sm-9">{{ $teacher->university }}</dd>

                    <dt class="col-sm-3">Experience</dt>
                    <dd class="col-sm-9">{{ $teacher->experience }}</dd>

                    <dt class="col-sm-3">Preferred Boards</dt>
                    <dd class="col-sm-9">
                        @foreach(explode(',', $teacher->preferred_board) as $board)
                            <span class="badge bg-primary">{{ trim($board) }}</span>
                        @endforeach
                    </dd>

                    <dt class="col-sm-3">Subjects</dt>
                    <dd class="col-sm-9">
                        @forelse($teacher->subjects_list as $subject)
                            <span class="badge bg-success">{{ $subject->subject_name }}</span>
                        @empty
                            <span class="text-muted">No subjects assigned</span>
                        @endforelse
                    </dd>

                    <dt class="col-sm-3">Grades</dt>
                    <dd class="col-sm-9">
                        @foreach(explode(',', $teacher->grades) as $grade)
                            <span class="badge bg-secondary">{{ trim($grade) }}</span>
                        @endforeach
                    </dd>

                    <dt class="col-sm-3">Documents</dt>
                    <dd class="col-sm-9">
                        @forelse($docs as $doc)
                            <span class="badge bg-info">{{ ucfirst($doc->type) }}</span>
                            <a href="{{ asset('storage/' . $doc->file_path) }}" target="_blank"
                                class="btn btn-sm btn-outline-primary">View</a><br>
                        @empty
                            <span class="text-muted">No documents uploaded</span>
                        @endforelse
                    </dd>

                    <dt class="col-sm-3">Agreed to Terms</dt>
                    <dd class="col-sm-9">{{ ucfirst($teacher->agree) }}</dd>
                </dl>
                <hr>

                <h5 class="mt-4">Assigned Classes</h5>

                @if($classes->isEmpty())
                    <p class="text-muted">No classes assigned yet.</p>
                @else
                    @foreach ($classes as $class)
                        <div class="border rounded p-3 mb-3">
                            <p><strong>Board:</strong> {{ $class->board }}</p>

                            <p>
                                <strong>Grades:</strong>
                                @php
                                    $grades = is_string($class->grades) ? json_decode($class->grades, true) : $class->grades;
                                @endphp

                                @if (is_array($grades))
                                    @foreach ($grades as $grade)
                                        <span class="badge bg-primary">{{ $grade }}</span>
                                    @endforeach
                                @else
                                    <span class="text-danger">Invalid grades data</span>
                                @endif
                            </p>

                            <p>
                                <strong>Subjects:</strong>
                                @php
                                    $subjectIds = is_string($class->subjects) ? json_decode($class->subjects, true) : $class->subjects;
                                @endphp

                                @foreach($subjects->whereIn('subject_id', $subjectIds) as $subject)
                                    <span class="badge bg-success">{{ $subject->subject_name }}</span>
                                @endforeach
                            </p>

                            <form action="{{ route('admin.teacher_class_destroy', $class->id) }}" method="POST"
                                onsubmit="return confirm('Are you sure you want to delete this class?');"
                                style="display:inline-block;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                            </form>
                        </div>
                    @endforeach

                @endif
                <button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#createTeacherClass">Assign
                    Classes</button>
            </div>
        </div>

        <div class="modal fade" id="createTeacherClass" tabindex="-1" aria-labelledby="createTeacherClassLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createTeacherClassLabel">Create a new user</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form method="POST" action="{{ route('admin.teacher_assign_subjects', $teacher->id) }}">
                            @csrf
                            <input type="hidden" name="teacher_id" value="{{ $teacher->id }}">
                            <div class="mb-3">
                                <label for="teacherBoards" class="form-label">Boards</label>
                                <select name="teacherBoards" class="form-control" id="teacherBoards">
                                    <option value="" selected disabled>Select a Board</option>
                                    @foreach ($boards as $board)
                                        <option value="{{ $board->key }}">{{ $board->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="mb-2">
                                <label for="teacherGrades" class="form-label w-100">Grades</label>
                                <select name="teacherGrades[]" class="form-control" id="teacherGrades" multiple>
                                    <option value="" selected disabled>Select a Grade</option>
                                    @foreach ($grades as $grade)
                                        <option value="{{ $grade->key }}">{{ $grade->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="teacherSubjects" class="form-label">Subjects</label>
                                <select name="teacherSubjects[]" class="form-control" id="teacherSubjects" multiple>
                                    @foreach ($subjects as $subject)
                                        <option value="{{ $subject->id }}">{{ $subject->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <button type="submit" class="btn btn-dark">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <script>
            $(document).ready(function () {
                $('#createTeacherClass').on('shown.bs.modal', function () {
                    $('#teacherSubjects').select2({
                        dropdownParent: $('#createTeacherClass'),
                        placeholder: "Select Subject(s)",
                        allowClear: true,
                        tags: true
                    });
                    $('#teacherGrades').select2({
                        dropdownParent: $('#createTeacherClass'),
                        placeholder: "Select Grades(s)",
                        allowClear: true,
                        tags: true
                    });
                });
            });
        </script>

@endsection