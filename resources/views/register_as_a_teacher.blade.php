<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Register | Al Mairaaj</title>
    <link rel="icon" type="image/png" href="{{ asset('build/assets/book_logo.png') }}">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <!-- Select2 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

    <!-- jQuery (must come BEFORE Select2 JS) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Select2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <!-- Bootstrap Bundle JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
</head>


<style>
    .form-control:focus,
    .form-control:hover {
        border-color: black !important;
        box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25) !important;
    }

    /* Make Select2 match Bootstrap input */
    .select2-container .select2-selection--single,
    .select2-container .select2-selection--multiple {
        height: calc(2.375rem + 2px);
        /* Bootstrap default input height */
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        color: #212529;
        background-color: #fff;
        border: 1px solid #ced4da;
        border-radius: 0.375rem;
        /* Bootstrap rounded */
    }

    .select2-container .select2-selection--multiple {
        min-height: calc(2.375rem + 2px);
    }

    .select2-container--default .select2-selection--single .select2-selection__rendered {
        color: #212529;
        line-height: 1.5;
    }

    .select2-container--default .select2-selection--single .select2-selection__arrow {
        height: 100%;
    }

    .select2-container--default .select2-selection--multiple .select2-selection__choice {
        background-color: rgb(13, 109, 114);
        /* Bootstrap primary color */
        border: none;
        color: #fff;

        border-radius: 0.2rem;
    }

    .teal-checkbox input[type="checkbox"] {
        accent-color: #5f9ea0;
    }

    .teal-checkbox label {
        color: #0d6d72;
    }
</style>

<body>
    <div class="container mt-5">
        
    @if (session('success'))
        <div class="alert alert-success mt-3 mx-3">
            {{ session('success') }}
        </div>
    @endif

    @if (session('error'))
        <div class="alert alert-danger mt-3 mx-3">
            {{ session('error') }}
        </div>
    @endif
        <div class="card shadow">
            <div class="card-header bg-dark text-white">
                <h4 class="mb-0">Teacher Registration</h4>
            </div>
            <div class="card-body">
                <form action="{{ route('teacher.register.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf

                    <div class="row mb-4">
                        <div class="col-md-4">
                            <label>Name</label>
                            <input type="text" class="form-control" name="teacher_name" required>
                        </div>
                        <div class="col-md-4">
                            <label>CNIC
                                <span class="text-muted small">(13 digits without dashes)</span>
                            </label>
                            <input type="text" class="form-control" name="teacher_cnic" required>
                        </div>
                        <div class="col-md-4">
                            <label>Gender</label>
                            <select class="form-control" name="teacher_gender" required>
                                <option value="" selected disabled>Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label>Phone Number</label>
                            <input type="text" class="form-control" name="teacher_phone_no" required>
                        </div>
                        <div class="col-md-4">
                            <label>WhatsApp Number</label>
                            <input type="text" class="form-control" name="teacher_whatsapp_no" required>
                        </div>
                        <div class="col-md-4">
                            <label>Email</label>
                            <input type="email" class="form-control" name="teacher_email" required>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label>City</label>
                            <input type="text" class="form-control" name="teacher_city" required>
                        </div>
                        <div class="col-md-8">
                            <label>Address</label>
                            <textarea class="form-control" name="teacher_address" rows="2" required></textarea>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label>Highest Degree</label>
                            <input type="text" class="form-control" name="highest_degree" required>
                        </div>
                        <div class="col-md-4">
                            <label>Field of Study</label>
                            <input type="text" class="form-control" name="field_of_study" required>
                        </div>
                        <div class="col-md-4">
                            <label>University</label>
                            <input type="text" class="form-control" name="university" required>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label>Experience</label>
                            <select class="form-control" name="experience" required>
                                <option value="" selected disabled>Select Experience</option>
                                <option value="Less than 1 year">Less than 1 year</option>
                                <option value="1-2 years">1-2 years</option>
                                <option value="3-5 years">3-5 years</option>
                                <option value="6-10 years">6-10 years</option>
                                <option value="More than 10 years">More than 10 years</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label>Preferred Grades and Examination Boards</label>
                            <select class="form-control" name="preferred_grades[]" id="preferred_grades" multiple required>
                                @foreach ($grades as $grade)
                                    <option value="{{ $grade->id }}">{{ $grade->name }} - {{ $grade->board->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label>Preferred Subjects</label>
                            <select class="form-control" name="preferred_subjects[]" id="preferred_subjects" multiple required>
                                @foreach ($subjects as $subject)
                                    <option value="{{ $subject->id }}">{{ $subject->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="row mb-3">

                        <div class="col-md-4">
                            <label for="resume">Upload Resume</label>
                            <input type="file" class="form-control" name="resume" id="resume" accept=".pdf,.doc,.docx"
                                required>
                        </div>

                        <div class="col-md-4">
                            <label for="picture">Upload Picture
                                <span class="text-muted small">(By uploading this image, you grant
                                    permission for it to
                                    be used for marketing purposes on social media
                                    platforms.)</span>
                            </label>
                            <input type="file" class="form-control" name="picture" id="picture" accept="image/*"
                                required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <strong>Intellectual Property:</strong>
                        <p class="mb-1">
                            Teaching materials created by the teacher for use at the academy remain the
                            property of
                            Academy.
                            The teacher agrees not to use or distribute these materials outside the
                            academy without
                            permission.
                        </p>
                        <strong>Acknowledgment:</strong>
                        <p>
                            By accepting this agreement, the teacher acknowledges that they have read,
                            understood, and
                            agreed to the terms and conditions outlined above.
                        </p>
                    </div>
                    <div class="form-check mb-3">
                        <input type="checkbox" class="form-check-input" name="agree" required>
                        <label class="form-check-label">I agree to the terms</label>
                    </div>

                    <button type="submit" class="btn btn-dark">Register</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function () {
            $('#preferred_grades').select2({
                placeholder: "Select Preferred Grades",
                allowClear: true,
                tags: true
            });

            $('#preferred_subjects').select2({
                placeholder: "Select Preferred Subjects",
                allowClear: true,
                tags: true
            });
        });
    </script>

</body>

</html>