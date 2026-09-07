@extends('admin.layout.app')
@section('title')
    Voucher - {{ $voucher->code }}
@endsection
@include('scripts.table')
@section('content')

<div class="container">
    @include('admin.layout.alerts')

    <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Voucher - {{ $voucher->code }}</h4>

            <a href="{{ route('admin.vouchers.index') }}" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left me-1"></i> Back to Vouchers
            </a>
        </div>

        <div class="card-body">
            <div class="row">
                <div class="col-md-3 mb-3">
                    <div class="text-muted small">Discount Type</div>
                    <div class="fw-semibold">{{ ucfirst($voucher->discount_type) }}</div>
                </div>

                <div class="col-md-3 mb-3">
                    <div class="text-muted small">Discount Value</div>
                    <div class="fw-semibold">
                        @if ($voucher->discount_type === 'percentage')
                            {{ $voucher->discount_value }}%
                        @else
                            {{ number_format($voucher->discount_value, 2) }}
                        @endif
                    </div>
                </div>

                <div class="col-md-3 mb-3">
                    <div class="text-muted small">Status</div>
                    <div>
                        @if ($voucher->isActive())
                            <span class="badge bg-success">Active</span>
                        @elseif ($voucher->status !== 'active')
                            <span class="badge bg-secondary">{{ ucfirst($voucher->status) }}</span>
                        @else
                            <span class="badge bg-danger">Expired</span>
                        @endif
                    </div>
                </div>

                <div class="col-md-3 mb-3">
                    <div class="text-muted small">Expires At</div>
                    <div class="fw-semibold">
                        {{ $voucher->expires_at ? $voucher->expires_at->format('d M Y, h:i A') : 'No Expiry' }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">Redemptions ({{ $voucher->redemptions->count() }})</h5>
        </div>

        <div class="card-body">
            <table class="table table-bordered datatable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Redeemed At</th>
                    </tr>
                </thead>

                <tbody>
                    @forelse ($voucher->redemptions as $redemption)
                        <tr>
                            <td>{{ $loop->iteration }}</td>

                            <td>
                                <strong>{{ $redemption->student->full_name ?? 'N/A' }}</strong>
                            </td>

                            <td>{{ $redemption->student->email ?? '-' }}</td>

                            <td>{{ $redemption->student->phone_number ?? '-' }}</td>

                            <td>
                                {{ $redemption->redeemed_at ? $redemption->redeemed_at->format('d M Y, h:i A') : '-' }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center text-muted">
                                No one has redeemed this voucher yet.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

@endsection