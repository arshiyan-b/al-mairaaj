@extends('admin.layout.app')
@section('title')
    Teacher Details {{ $teacher->teacher_name }}
@endsection
@include('scripts.disable_submit_button')
@section('content')

    <div class="container">
        @include('admin.layout.alerts')
        <div class="card shadow">
            <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <h4 class="mb-0">Teacher Details</h4>
                <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editTeacherModal">
                    <i class="fas fa-edit me-1"></i> Edit
                </button>
            </div>
            <div class="card-body">
                <dl class="row">
                    <dt class="col-sm-3">Name</dt>
                    <dd class="col-sm-9">{{ $teacher->name }}</dd>

                    <dt class="col-sm-3">CNIC</dt>
                    <dd class="col-sm-9">{{ $teacher->application->cnic }}</dd>

                    <dt class="col-sm-3">Gender</dt>
                    <dd class="col-sm-9">{{ ucfirst($teacher->application->gender) }}</dd>

                    <dt class="col-sm-3">Phone</dt>
                    <dd class="col-sm-9">{{ $teacher->application->phone_number }}</dd>

                    <dt class="col-sm-3">WhatsApp</dt>
                    <dd class="col-sm-9">{{ $teacher->application->whatsapp_number }}</dd>

                    <dt class="col-sm-3">Email</dt>
                    <dd class="col-sm-9">{{ $teacher->application->email }}</dd>

                    <dt class="col-sm-3">City</dt>
                    <dd class="col-sm-9">{{ $teacher->application->city }}</dd>

                    <dt class="col-sm-3">Address</dt>
                    <dd class="col-sm-9">{{ $teacher->application->address }}</dd>

                    <dt class="col-sm-3">Highest Degree</dt>
                    <dd class="col-sm-9">{{ $teacher->application->highest_degree }}</dd>

                    <dt class="col-sm-3">Field of Study</dt>
                    <dd class="col-sm-9">{{ $teacher->application->field_of_study }}</dd>

                    <dt class="col-sm-3">University</dt>
                    <dd class="col-sm-9">{{ $teacher->application->university }}</dd>

                    <dt class="col-sm-3">Experience</dt>
                    <dd class="col-sm-9">{{ $teacher->application->experience }}</dd>

                    <dt class="col-sm-3">Preferred Grades</dt>
                    <dd class="col-sm-9">
                        @forelse($teacher->application->preferred_grades_list as $grade)
                            <span class="badge bg-primary">
                                {{ $grade->board->name }} - {{ $grade->name }}
                            </span>
                        @empty
                            <span class="text-muted">No preferred grades selected.</span>
                        @endforelse
                    </dd>

                    <dt class="col-sm-3">Preferred Subjects</dt>
                    <dd class="col-sm-9">
                        @forelse($teacher->application->preferred_subjects_list as $subject)
                            <span class="badge bg-success">{{ $subject->name }}</span>
                        @empty
                            <span class="text-muted">No preferred subjects selected.</span>
                        @endforelse
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
                    <dd class="col-sm-9">{{ ucfirst($teacher->application->agree) }}</dd>
                </dl>
                <hr>

                <h5 class="mt-4">Assigned Classes</h5>

                @if($classes->isEmpty())
                    <p class="text-muted">No classes assigned yet.</p>
                @else
                    @foreach ($classes as $class)
                        <div class="border rounded p-3 mb-3">
                            <p><strong>Board:</strong> {{ $class->grade->board->name }}</p>
                            <p><strong>Grade:</strong> <span class="badge bg-primary">{{ $class->grade->name }}</span></p>

                            <p>
                                <p>
                                    <strong>Subjects:</strong>
                                    @forelse ($class->curriculum_subjects as $subject)
                                        <span class="badge bg-success">{{ $subject->name }}</span>
                                    @empty
                                        <span class="text-muted">No subjects assigned</span>
                                    @endforelse
                                </p>
                            </p>

                            <form action="{{ route('admin.teacher.class.destroy', $class->id) }}" method="POST"
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

        <div class="modal fade" id="editTeacherModal" tabindex="-1" aria-labelledby="editTeacherModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">

                    <form method="POST" action="{{ route('admin.teacher.update', $teacher->id) }}" enctype="multipart/form-data">
                        @csrf
                        @method('PUT')

                        <div class="modal-header">
                            <h5 class="modal-title" id="editTeacherModalLabel">Edit Teacher</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="modal-body">

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Name</label>
                                    <input type="text" name="name" class="form-control @error('name') is-invalid @enderror"
                                        value="{{ old('name', $teacher->application->name) }}" required>
                                    @error('name')<div class="invalid-feedback">{{ $message }}</div>@enderror
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">CNIC</label>
                                    <input type="text" name="cnic" class="form-control @error('cnic') is-invalid @enderror"
                                        value="{{ old('cnic', $teacher->application->cnic) }}" maxlength="13" required>
                                    @error('cnic')<div class="invalid-feedback">{{ $message }}</div>@enderror
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-4">
                                    <label class="form-label">Gender</label>
                                    <select name="gender" class="form-control @error('gender') is-invalid @enderror" required>
                                        @foreach (['male' => 'Male', 'female' => 'Female', 'other' => 'Other'] as $value => $label)
                                            <option value="{{ $value }}" {{ old('gender', $teacher->application->gender) === $value ? 'selected' : '' }}>
                                                {{ $label }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('gender')<div class="invalid-feedback">{{ $message }}</div>@enderror
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Phone</label>
                                    <input type="text" name="phone_number" class="form-control @error('phone_number') is-invalid @enderror"
                                        value="{{ old('phone_number', $teacher->application->phone_number) }}" required>
                                    @error('phone_number')<div class="invalid-feedback">{{ $message }}</div>@enderror
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">WhatsApp</label>
                                    <input type="text" name="whatsapp_number" class="form-control @error('whatsapp_number') is-invalid @enderror"
                                        value="{{ old('whatsapp_number', $teacher->application->whatsapp_number) }}" required>
                                    @error('whatsapp_number')<div class="invalid-feedback">{{ $message }}</div>@enderror
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Email</label>
                                    <input type="email" name="email" class="form-control @error('email') is-invalid @enderror"
                                        value="{{ old('email', $teacher->application->email) }}" required>
                                    @error('email')<div class="invalid-feedback">{{ $message }}</div>@enderror
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">City</label>
                                    <input type="text" name="city" class="form-control @error('city') is-invalid @enderror"
                                        value="{{ old('city', $teacher->application->city) }}" required>
                                    @error('city')<div class="invalid-feedback">{{ $message }}</div>@enderror
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Address</label>
                                <textarea name="address" class="form-control @error('address') is-invalid @enderror" rows="2" required>{{ old('address', $teacher->application->address) }}</textarea>
                                @error('address')<div class="invalid-feedback">{{ $message }}</div>@enderror
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-4">
                                    <label class="form-label">Highest Degree</label>
                                    <input type="text" name="highest_degree" class="form-control @error('highest_degree') is-invalid @enderror"
                                        value="{{ old('highest_degree', $teacher->application->highest_degree) }}" required>
                                    @error('highest_degree')<div class="invalid-feedback">{{ $message }}</div>@enderror
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Field of Study</label>
                                    <input type="text" name="field_of_study" class="form-control @error('field_of_study') is-invalid @enderror"
                                        value="{{ old('field_of_study', $teacher->application->field_of_study) }}" required>
                                    @error('field_of_study')<div class="invalid-feedback">{{ $message }}</div>@enderror
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">University</label>
                                    <input type="text" name="university" class="form-control @error('university') is-invalid @enderror"
                                        value="{{ old('university', $teacher->application->university) }}" required>
                                    @error('university')<div class="invalid-feedback">{{ $message }}</div>@enderror
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Experience</label>
                                <input type="text" name="experience" class="form-control @error('experience') is-invalid @enderror"
                                    value="{{ old('experience', $teacher->application->experience) }}" required>
                                @error('experience')<div class="invalid-feedback">{{ $message }}</div>@enderror
                            </div>

                            <hr>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Resume</label>

                                    @php $currentResume = $docs->firstWhere('type', 'resume'); @endphp

                                    @if ($currentResume)
                                        <div class="mb-2">
                                            <a href="{{ asset('storage/' . $currentResume->file_path) }}" target="_blank" class="btn btn-sm btn-outline-secondary">
                                                <i class="fas fa-file-alt me-1"></i> View current resume
                                            </a>
                                        </div>
                                    @endif

                                    <input type="file" name="resume" class="form-control @error('resume') is-invalid @enderror" accept=".pdf,.doc,.docx">
                                    @error('resume')<div class="invalid-feedback">{{ $message }}</div>@enderror
                                    <div class="form-text">Uploading a new file replaces the current resume.</div>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Picture</label>

                                    @php $currentPicture = $docs->firstWhere('type', 'picture'); @endphp

                                    @if ($currentPicture)
                                        <div class="mb-2">
                                            <img src="{{ asset('storage/' . $currentPicture->file_path) }}" alt="Current picture"
                                                class="rounded" style="height: 60px; width: 60px; object-fit: cover;">
                                        </div>
                                    @endif

                                    <input type="file" name="picture" class="form-control @error('picture') is-invalid @enderror" accept="image/*">
                                    @error('picture')<div class="invalid-feedback">{{ $message }}</div>@enderror
                                    <div class="form-text">Uploading a new file replaces the current picture.</div>
                                </div>
                            </div>

                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-warning">Save Changes</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>

        <div class="modal fade" id="createTeacherClass" tabindex="-1" aria-labelledby="createTeacherClassLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createTeacherClassLabel">Allow teacher classes </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    
                    <form method="POST" action="{{ route('admin.teacher.assign.subjects', $teacher->id) }}">
                        @csrf
                        <div class="modal-body">
                            <input type="hidden" name="teacher_id" value="{{ $teacher->id }}">

                            <div class="mb-2"> 
                                <label for="teacherGrades" class="form-label w-100">Grade</label> 
                                <select name="teacherGrades" class="form-control" id="teacherGrades"> 
                                    <option value="">Select Grade</option>
                                    @foreach ($grades as $grade) 
                                        <option value="{{ $grade->id }}">{{ $grade->board->name }} - {{ $grade->name }}</option> 
                                    @endforeach 
                                </select> 
                            </div>
                            <div class="mb-3">
                                <label for="teacherSubjects" class="form-label">Subjects</label>
                                <select name="teacherSubjects[]" class="form-control" id="teacherSubjects" multiple disabled>
                                    @foreach ($curriculumSubjects as $subject)
                                        <option value="{{ $subject->id }}" data-grade-id="{{ $subject->grade_id }}">
                                            {{ $subject->code }} - {{ $subject->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-dark">Submit</button>
                        </div>
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
                });
                $('#teacherGrades').select2({
                    dropdownParent: $('#createTeacherClass'),
                    placeholder: "Select Grade",
                    allowClear: true,
                });
            });

            // Cache the full, unfiltered list of subject options once
            var $allSubjectOptions = $('#teacherSubjects option[data-grade-id]').clone();

            function filterSubjectsByGrade(gradeId) {
                var $subjectSelect = $('#teacherSubjects');

                $subjectSelect.empty();

                if (!gradeId) {
                    $subjectSelect.prop('disabled', true).trigger('change');
                    return;
                }

                var $matching = $allSubjectOptions.filter(function () {
                    return $(this).data('grade-id') == gradeId;
                });

                $subjectSelect
                    .append($matching.clone())
                    .prop('disabled', false)
                    .trigger('change');
            }

            $('#teacherGrades').on('change', function () {
                filterSubjectsByGrade($(this).val());
            });
        });
    </script>

@endsection