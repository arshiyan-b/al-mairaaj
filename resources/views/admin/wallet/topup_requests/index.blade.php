@extends('admin.layout.app')
@section('title')
    Top-up Requests
@endsection
@include('scripts.table')
@section('content')

<div class="container">
    @include('admin.layout.alerts')
    <div class="card">
        <div class="card-header">
            <h2>Top-up Requests</h2>
        </div>
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-3">
                    <select id="statusFilter" class="form-select">
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>
            <table class="table table-bordered datatable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>View Details</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($topup_requests as $topup_request)
                        <tr>
                            <td>{{ $loop->iteration }}</td>
                            <td>{{ $topup_request->wallet->student->full_name }}</td>
                            <td>{{ $topup_request->amount }}</td>
                            <td>{{ ucfirst($topup_request->status) }}</td>
                            <td>
                                <a href="{{ route('admin.top-up.request.details', ['id' => $topup_request->id]) }}"
                                    class="btn btn-primary"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    View Details
                                </a>                                
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    $('#statusFilter').on('change', function () {
        table.column(3).search('^' + $(this).val() + '$', true, false).draw();
    });
</script>
@endsection