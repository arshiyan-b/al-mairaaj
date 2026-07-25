@extends('teacher.layout.app')

@section('title')
    {{ $grade->name }} - {{ $board->name }}
@endsection
@include('scripts.disable_submit_button')
@section('content')

    <div class="container">
        @include('teacher.layout.alerts')

        <div class="d-flex justify-content-between align-items-center mb-4">

            <div>
                <h4 class="mb-1">
                    {{ $grade->name }}
                </h4>
                <span class="text-muted">
                    {{ $board->name }}
                </span>
            </div>

        </div>

        @if ($batches->isEmpty())

            <div class="alert alert-info">
                No batches found for this qualification yet.
            </div>

        @else

            <div class="card shadow-sm">

                <div class="card-body p-0">

                    <div class="table-responsive">

                        <table class="table table-hover align-middle mb-0">

                            <thead class="table-light">
                                <tr>
                                    <th>Batch Name</th>
                                    <th>Status</th>
                                    <th>Students</th>
                                    <th>Schedule</th>
                                    <th class="text-end">Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                @foreach ($batches as $batch)
                                    <tr>
                                        <td>
                                            {{ $batch->title }}
                                        </td>

                                        <td>
                                            @php
                                                $statusColors = [
                                                    'active' => 'success',
                                                    'upcoming' => 'warning',
                                                    'completed' => 'secondary',
                                                    'cancelled' => 'danger',
                                                ];
                                                $statusColor = $statusColors[$batch->status ?? ''] ?? 'secondary';
                                            @endphp

                                            <span class="badge bg-{{ $statusColor }}">
                                                {{ ucfirst($batch->status ?? 'N/A') }}
                                            </span>
                                        </td>

                                        <td>
                                            {{ $batch->students_count ?? $batch->students->count() ?? 0 }}
                                        </td>

                                        <td>
                                            {{ $batch->schedule ?? '—' }}
                                        </td>

                                        <td class="text-end">

                                            

                                        </td>
                                    </tr>
                                @endforeach

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        @endif

    </div>

@endsection