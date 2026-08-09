@extends('admin.layout.app')
@section('title')
    Wallets
@endsection
@section('content')

<div class="container">
    @include('admin.layout.alerts')
    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h2 class="mb-0">Vouchers</h2>

            <button type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#createVoucherModal">
                Create Voucher
            </button>
        </div>
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-3">
                    <select id="discountTypeFilter" class="form-select">
                        <option value="">All Types</option>
                        <option value="Percentage">Percentage</option>
                        <option value="Fixed">Fixed</option>
                    </select>
                </div>
            </div>
                <table class="table table-bordered datatable">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Voucher Code</th>
                            <th>Discount Type</th>
                            <th>Discount Value</th>
                            <th>Status</th>
                            <th>Expires At</th>
                            <th>Redemptions</th>
                            <th>View Details</th>
                        </tr>
                    </thead>

                    <tbody>
                        @foreach ($vouchers as $voucher)
                            <tr>
                                <td>{{ $loop->iteration }}</td>

                                <td>
                                    <strong>{{ $voucher->code }}</strong>
                                </td>

                                <td>
                                    {{ ucfirst($voucher->discount_type) }}
                                </td>

                                <td>
                                    @if ($voucher->discount_type === 'percentage')
                                        {{ $voucher->discount_value }}%
                                    @else
                                        {{ number_format($voucher->discount_value, 2) }}
                                    @endif
                                </td>

                                <td>
                                    @if ($voucher->isActive())
                                        <span class="badge bg-success">Active</span>
                                    @elseif ($voucher->status !== 'active')
                                        <span class="badge bg-secondary">
                                            {{ ucfirst($voucher->status) }}
                                        </span>
                                    @else
                                        <span class="badge bg-danger">Expired</span>
                                    @endif
                                </td>

                                <td>
                                    @if ($voucher->expires_at)
                                        {{ $voucher->expires_at->format('d M Y, h:i A') }}
                                    @else
                                        <span class="text-muted">No Expiry</span>
                                    @endif
                                </td>

                                <td>
                                    {{ $voucher->redemptions_count ?? $voucher->redemptions->count() }}
                                </td>

                                <td>
                                    <a href="{{ route('admin.vouchers.show', ['id' => $voucher->id]) }}"
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

<div class="modal fade" id="createVoucherModal" tabindex="-1"
     aria-labelledby="createVoucherModalLabel" aria-hidden="true">

    <div class="modal-dialog modal-lg">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="createVoucherModalLabel">
                    Create Voucher
                </h5>

                <button type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close">
                </button>
            </div>

            <div class="modal-body">

                <form action="{{ route('admin.vouchers.store') }}" method="POST">
                    @csrf

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="code" class="form-label">Code</label>
                            <input type="text"
                                name="code"
                                id="code"
                                class="form-control"
                                required>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="discount_type" class="form-label">Discount Type</label>
                            <select name="discount_type"
                                    id="discount_type"
                                    class="form-select"
                                    required>
                                <option value="">Select Discount Type</option>
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed</option>
                            </select>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="discount_value" class="form-label">Discount Value</label>
                            <input type="number"
                                name="discount_value"
                                id="discount_value"
                                class="form-control"
                                step="0.01"
                                min="0"
                                required>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="expires_at" class="form-label">Expires At</label>
                            <input type="datetime-local"
                                name="expires_at"
                                id="expires_at"
                                class="form-control">
                        </div>
                    </div>

                    <div class="modal-footer px-0 pb-0">
                        <button type="button"
                                class="btn btn-secondary"
                                data-bs-dismiss="modal">
                            Cancel
                        </button>

                        <button type="submit" class="btn btn-primary">
                            Create Voucher
                        </button>
                    </div>
                </form>

            </div>

        </div>
    </div>
</div>

<script>
    $('#discountTypeFilter').on('change', function () {
        table.column(3).search('^' + $(this).val() + '$', true, false).draw();
    });
</script>

@endsection