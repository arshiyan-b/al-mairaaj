@extends('teacher.layout.app')

@section('title')
    {{ $grade->board->name }} - {{ $grade->name }}
@endsection
@include('scripts.table')
@section('content')

<div class="container">
    @include('teacher.layout.alerts')

    <div class="card shadow-sm">

        <div class="card-header">
            <h4>{{ $grade->board->name }} - {{ $grade->name }}</h4>
        </div>

        <div class="card-body p-0">

            <div class="table-responsive m-3">

                <table class="table table-hover align-middle mb-0">

                    <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Batch Name</th>
                            <th>Status</th>
                            <th>Subject</th>
                            <th>Date Range</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        @foreach ($batches as $batch)
                            <tr>
                                <td>
                                    {{ $loop->iteration }}
                                </td>
                                <td>
                                    {{ $batch->title }}
                                </td>
                                <td>
                                    {{ $batch->status }}
                                </td>
                                <td>
                                    {{ $batch->curriculumSubject->complete_name }}
                                </td>
                                <td>
                                    {{ $batch->date_range }}
                                </td>
                                <td>
                                </td>
                            </tr>
                        @endforeach

                    </tbody>

                </table>

            </div>

        </div>

    </div>

</div>

@endsection