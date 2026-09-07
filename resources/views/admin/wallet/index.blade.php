@extends('admin.layout.app')
@section('title')
    Wallets
@endsection
@include('scripts.table')
@section('content')

<div class="container">
    @include('admin.layout.alerts')

    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h2 class="mb-0">Student Wallets</h2>
        </div>

        <div class="card-body">

            <table class="table table-bordered datatable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Balance</th>
                        <th>Currency</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    @forelse ($wallets as $wallet)
                        <tr>
                            <td>{{ $loop->iteration }}</td>

                            <td>
                                <strong>{{ $wallet->student->full_name ?? 'N/A' }}</strong>
                            </td>

                            <td>{{ $wallet->student->email ?? '-' }}</td>

                            <td>{{ $wallet->student->phone_number ?? '-' }}</td>

                            <td>
                                <strong>{{ number_format($wallet->balance, 2) }}</strong>
                            </td>

                            <td>{{ $wallet->currency }}</td>

                            <td>
                                @if (strtolower($wallet->status) === 'active')
                                    <span class="badge bg-success">Active</span>
                                @elseif (strtolower($wallet->status) === 'suspended')
                                    <span class="badge bg-danger">Suspended</span>
                                @else
                                    <span class="badge bg-secondary">{{ ucfirst($wallet->status) }}</span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center text-muted">No wallets found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>

        </div>
    </div>
</div>

@endsection