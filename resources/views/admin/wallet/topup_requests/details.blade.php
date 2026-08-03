@extends('admin.layout.app')

@section('title')
    Top-up Request
@endsection

@include('scripts.table')
@include('scripts.disable_submit_button')

@section('content')

<div class="container">
    @include('admin.layout.alerts')

    <div class="card">
        <div class="card-header">
            <h2>Top-up Request Details</h2>
        </div>

        <div class="card-body">
            <table class="table table-bordered">
                <tbody>

                    <tr>
                        <th>Student</th>
                        <td>{{ $topup_request->wallet->student->user->name ?? 'N/A' }}</td>
                    </tr>

                    <tr>
                        <th>Email</th>
                        <td>{{ $topup_request->wallet->student->user->email ?? 'N/A' }}</td>
                    </tr>

                    <tr>
                        <th>Amount</th>
                        <td>{{ number_format($topup_request->amount, 2) }}</td>
                    </tr>

                    <tr>
                        <th>Status</th>
                        <td>{{ ucfirst($topup_request->status) }}</td>
                    </tr>

                    <tr>
                        <th>Screenshot</th>
                        <td>
                            @if($topup_request->screenshot)
                                <a href="{{ route('admin.top-up.request.screenshot', $topup_request->id) }}" target="_blank">
                                    <img src="{{ route('admin.top-up.request.screenshot', $topup_request->id) }}"
                                        alt="Screenshot"
                                        class="img-fluid rounded"
                                        style="max-width:250px;">
                                </a>
                            @else
                                N/A
                            @endif
                        </td>
                    </tr>

                    <tr>
                        <th>Requested At</th>
                        <td>{{ $topup_request->created_at->format('d M Y h:i A') }}</td>
                    </tr>

                </tbody>
            </table>

            @if ($topup_request->status === 'pending')
                <hr>

                <form action="{{ route('admin.top-up.request.update-status', $topup_request->id) }}" method="POST">
                    @csrf
                    @method('PATCH')

                    <div class="row">
                        <div class="col-md-6">
                            <label for="status" class="form-label">Change Status</label>
                            <select name="status" id="status" class="form-select" required>
                                <option value="">Select Status</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <button type="submit" class="btn btn-primary">
                                Update Status
                            </button>
                        </div>
                    </div>
                </form>

                <hr>
            @endif

            <a href="{{ url()->previous() }}" class="btn btn-secondary">
                Back
            </a>
        </div>
    </div>
</div>

@endsection