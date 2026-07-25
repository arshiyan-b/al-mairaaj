@push('styles')
    <!-- DataTables CSS (Bootstrap 5 + Responsive) -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.8/css/dataTables.bootstrap5.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap5.min.css">

    <style>
        table.dataTable thead th {
            border-bottom-width: 1px;
        }

        /* Force the info/paginate row to space-between, no wrapping */
        div.dataTables_wrapper .row:has(div.dataTables_paginate) {
            display: flex !important;
            flex-wrap: nowrap !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 100% !important;
            margin: 0 !important;
        }

        /* Neutralize Bootstrap's col-md-5 / col-md-7 width/flex-basis entirely */
        div.dataTables_wrapper .row > div.col-sm-12.col-md-5,
        div.dataTables_wrapper .row > div.col-sm-12.col-md-7 {
            width: auto !important;
            max-width: none !important;
            flex: 0 0 auto !important;
            padding: 0.5rem 1rem !important;
        }

        div.dataTables_wrapper div.dataTables_info {
            text-align: left !important;
        }

        div.dataTables_wrapper div.dataTables_paginate {
            text-align: right !important;
        }

        /* Double up the class + add a body-level ancestor for max specificity,
           to beat dataTables.bootstrap5.min.css's own centering rule */
        body div.dataTables_wrapper div.dataTables_paginate ul.pagination.pagination {
            display: flex !important;
            justify-content: flex-end !important;
            margin: 0 !important;
            margin-left: auto !important;
            width: auto !important;
        }

        /* Same treatment for the top row: length + filter */
        div.dataTables_wrapper .row:has(div.dataTables_filter) {
            display: flex !important;
            flex-wrap: nowrap !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 100% !important;
            margin: 0 !important;
        }

        div.dataTables_wrapper .row > div:has(> div.dataTables_length),
        div.dataTables_wrapper .row > div:has(> div.dataTables_filter) {
            width: auto !important;
            max-width: none !important;
            flex: 0 0 auto !important;
            padding: 0.5rem 1rem !important;
        }

        div.dataTables_wrapper div.dataTables_filter {
            text-align: right !important;
        }

        div.dataTables_wrapper div.dataTables_filter input {
            margin-left: 0.5rem;
        }

        /* Small screens: stack and center everything so nothing overflows */
        @media (max-width: 576px) {
            div.dataTables_wrapper .row {
                flex-wrap: wrap !important;
            }

            div.dataTables_wrapper .row > div {
                width: 100% !important;
                text-align: center !important;
            }

            body div.dataTables_wrapper div.dataTables_paginate ul.pagination.pagination {
                justify-content: center !important;
                margin-left: 0 !important;
            }
        }
    </style>
@endpush

@push('scripts')

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