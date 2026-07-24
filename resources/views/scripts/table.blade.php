@push('styles')
    <!-- DataTables CSS (Bootstrap 5 + Responsive) -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.8/css/dataTables.bootstrap5.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css">

    <style>
        /* Tidy up DataTables default spacing to sit better inside a card */
        div.dataTables_wrapper div.dataTables_length,
        div.dataTables_wrapper div.dataTables_filter {
            padding: 1rem 1rem 0.5rem;
        }

        div.dataTables_wrapper div.dataTables_info,
        div.dataTables_wrapper div.dataTables_paginate {
            padding: 0.5rem 1rem 1rem;
        }

        table.dataTable thead th {
            border-bottom-width: 1px;
        }
    </style>
@endpush

@push('scripts')
    <!-- jQuery (remove this line if your main layout already loads jQuery globally) -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

    <!-- DataTables + Responsive extension -->
    <script src="https://cdn.datatables.net/1.13.8/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.8/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>
    <script src="https://cdn.datatables.net/responsive/2.5.0/js/responsive.bootstrap5.min.js"></script>

    <script>
        $(document).ready(function () {

            $('.datatable').each(function () {

                $(this).DataTable({
                    responsive: true,
                    pageLength: 10,
                    lengthMenu: [5, 10, 25, 50],
                    order: [],
                    columnDefs: [
                        { orderable: false, targets: -1 }
                    ],
                    language: {
                        search: "",
                        searchPlaceholder: "Search...",
                        paginate: {
                            previous: "Prev",
                            next: "Next"
                        },
                        emptyTable: "No records found."
                    }
                });

            });

        });
    </script>
@endpush