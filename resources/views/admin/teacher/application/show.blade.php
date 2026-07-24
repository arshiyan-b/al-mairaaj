@extends('admin.layout.app')
@section('title')
    Teacher
@endsection
@section('content')

<div class="container">
    <div class="card shadow">

        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Teacher Application Details</h4>
            <button type="button" class="btn btn-light btn-sm" data-bs-toggle="modal" data-bs-target="#changeStatusModal">
                Change Status
            </button>
        </div>

        <div class="card-body">
            <dl class="row">
                <dt class="col-sm-3">Name</dt>
                <dd class="col-sm-9">{{ $application->name }}</dd>

                <dt class="col-sm-3">CNIC</dt>
                <dd class="col-sm-9">{{ $application->cnic }}</dd>

                <dt class="col-sm-3">Gender</dt>
                <dd class="col-sm-9">{{ ucfirst($application->gender) }}</dd>

                <dt class="col-sm-3">Phone</dt>
                <dd class="col-sm-9">{{ $application->phone_number }}</dd>

                <dt class="col-sm-3">WhatsApp</dt>
                <dd class="col-sm-9">{{ $application->whatsapp_number }}</dd>

                <dt class="col-sm-3">Email</dt>
                <dd class="col-sm-9">{{ $application->email }}</dd>

                <dt class="col-sm-3">City</dt>
                <dd class="col-sm-9">{{ $application->city }}</dd>

                <dt class="col-sm-3">Address</dt>
                <dd class="col-sm-9">{{ $application->address }}</dd>

                <dt class="col-sm-3">Highest Degree</dt>
                <dd class="col-sm-9">{{ $application->highest_degree }}</dd>

                <dt class="col-sm-3">Field of Study</dt>
                <dd class="col-sm-9">{{ $application->field_of_study }}</dd>

                <dt class="col-sm-3">University</dt>
                <dd class="col-sm-9">{{ $application->university }}</dd>

                <dt class="col-sm-3">Experience</dt>
                <dd class="col-sm-9">{{ $application->experience }}</dd>

                <dt class="col-sm-3">Preferred Grades</dt>
                <dd class="col-sm-9">
                    @forelse($application->preferred_grades_list as $grade)
                        <span class="badge bg-primary">
                            {{ $grade->board->name }} - {{ $grade->name }}
                        </span>
                    @empty
                        <span class="text-muted">No preferred grades selected.</span>
                    @endforelse
                </dd>

                <dt class="col-sm-3">Preferred Subjects</dt>
                <dd class="col-sm-9">
                    @forelse($application->preferred_subjects_list as $subject)
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
                <dd class="col-sm-9">{{ ucfirst($application->agree) }}</dd>

                <dt class="col-sm-3">Status</dt>
                <dd class="col-sm-9">{{ $application->status }}</dd>
            </dl>
        </div>
    </div>
</div>

<div class="modal fade" id="changeStatusModal" tabindex="-1" aria-labelledby="changeStatusModalLabel" aria-hidden="true"> 
    <div class="modal-dialog"> 
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="changeStatusModalLabel">
                    Change Teacher Status
                </h5>

                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <form action="{{ route('admin.teacher.application.status.update', $application->id) }}" method="POST">
                @csrf
                @method('PUT')

                <div class="modal-body">

                    <div class="mb-3">
                        <label for="status" class="form-label">
                            Application Status
                        </label>

                        <select name="status" id="status" class="form-select" required>
                            <option value="pending" {{ $application->status === 'pending' ? 'selected' : '' }}>
                                Pending
                            </option>

                            <option value="approved" {{ $application->status === 'approved' ? 'selected' : '' }}>
                                Approved
                            </option>

                            <option value="rejected" {{ $application->status === 'rejected' ? 'selected' : '' }}>
                                Rejected
                            </option>
                        </select>
                    </div>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Cancel
                    </button>

                    <button type="submit" class="btn btn-dark">
                        Update Status
                    </button>
                </div>
            </form>

        </div>
    </div>
</div>

@endsection