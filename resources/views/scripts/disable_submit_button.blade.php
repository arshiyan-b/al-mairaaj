@push('scripts')
    <script>
        document.addEventListener("DOMContentLoaded", function () {

            document.querySelectorAll('form').forEach(function (form) {

                form.addEventListener('submit', function (event) {

                    // Skip if the form failed native HTML5 validation —
                    // otherwise the button stays disabled with no way to retry
                    if (form.checkValidity && !form.checkValidity()) {
                        return;
                    }

                    var submitBtns = form.querySelectorAll('button[type="submit"]');

                    submitBtns.forEach(function (btn) {

                        // Prevent double-submit if the form somehow fires submit twice
                        if (btn.disabled) {
                            return;
                        }

                        // Store original content in case you ever need to restore it
                        btn.dataset.originalText = btn.innerHTML;

                        btn.disabled = true;
                        btn.innerHTML = `
                            <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Submitting...
                        `;
                    });

                });

            });

        });
    </script>
@endpush