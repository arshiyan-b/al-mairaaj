<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Register | Al Mairaaj</title>

    <link rel="icon" type="image/png" href="{{ asset('build/assets/book_logo.png') }}">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous">

    <!-- Select2 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
        rel="stylesheet" />

    <!-- jQuery -->
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

    /* Required field star */
    .required-star {
        color: red;
        font-weight: bold;
    }

    /* Make Select2 match Bootstrap input */
    .select2-container .select2-selection--single,
    .select2-container .select2-selection--multiple {
        height: calc(2.375rem + 2px);
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        color: #212529;
        background-color: #fff;
        border: 1px solid #ced4da;
        border-radius: 0.375rem;
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
        border: none;
        color: #fff;
        border-radius: 0.2rem;
    }

    /* Select2 validation error */
    .select2-container.is-invalid .select2-selection {
        border-color: #dc3545 !important;
    }

    .select2-container.is-valid .select2-selection {
        border-color: #198754 !important;
    }

    /* Force invalid-feedback to show next to Select2 (its DOM breaks Bootstrap's sibling rule) */
    .select2-container.is-invalid + .invalid-feedback {
        display: block;
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

    @if ($errors->any())
        <div class="alert alert-danger mt-3 mx-3">
            <strong>Please fix the following before submitting:</strong>
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card shadow">

        <div class="card-header bg-dark text-white">
            <h4 class="mb-0">Teacher Registration</h4>
        </div>

        <div class="card-body">

            <form action="{{ route('teacher.register.store') }}"
                method="POST"
                enctype="multipart/form-data"
                id="teacherRegistrationForm">

                @csrf

                <!-- Basic Information -->
                <div class="row mb-4">

                    <div class="col-md-4">
                        <label>
                            Name <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('teacher_name') is-invalid @enderror"
                            name="teacher_name"
                            value="{{ old('teacher_name') }}"
                            required>

                        @error('teacher_name')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="col-md-4">
                        <label>
                            CNIC
                            <span class="text-muted small">(13 digits without dashes)</span>
                            <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('teacher_cnic') is-invalid @enderror"
                            name="teacher_cnic"
                            id="teacher_cnic"
                            value="{{ old('teacher_cnic') }}"
                            maxlength="13"
                            minlength="13"
                            pattern="[0-9]{13}"
                            inputmode="numeric"
                            required>

                        @error('teacher_cnic')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">
                                CNIC must contain exactly 13 digits without dashes.
                            </div>
                        @enderror
                    </div>

                    <div class="col-md-4">
                        <label>
                            Gender <span class="required-star">*</span>
                        </label>

                        <select class="form-control @error('teacher_gender') is-invalid @enderror"
                            name="teacher_gender"
                            required>

                            <option value="" {{ old('teacher_gender') ? '' : 'selected' }} disabled>
                                Select Gender
                            </option>

                            <option value="male" {{ old('teacher_gender') == 'male' ? 'selected' : '' }}>Male</option>
                            <option value="female" {{ old('teacher_gender') == 'female' ? 'selected' : '' }}>Female</option>
                            <option value="other" {{ old('teacher_gender') == 'other' ? 'selected' : '' }}>Other</option>

                        </select>

                        @error('teacher_gender')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                </div>

                <!-- Contact Information -->
                <div class="row mb-3">

                    <div class="col-md-4">
                        <label>
                            Phone Number <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('teacher_phone_no') is-invalid @enderror"
                            name="teacher_phone_no"
                            id="teacher_phone_no"
                            value="{{ old('teacher_phone_no') }}"
                            maxlength="11"
                            minlength="11"
                            pattern="03[0-9]{9}"
                            inputmode="numeric"
                            required>

                        @error('teacher_phone_no')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">
                                Please enter a valid Pakistani phone number, e.g. 03001234567.
                            </div>
                        @enderror
                    </div>

                    <div class="col-md-4">
                        <label>
                            WhatsApp Number <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('teacher_whatsapp_no') is-invalid @enderror"
                            name="teacher_whatsapp_no"
                            id="teacher_whatsapp_no"
                            value="{{ old('teacher_whatsapp_no') }}"
                            maxlength="11"
                            minlength="11"
                            pattern="03[0-9]{9}"
                            inputmode="numeric"
                            required>

                        @error('teacher_whatsapp_no')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">
                                Please enter a valid Pakistani WhatsApp number, e.g. 03001234567.
                            </div>
                        @enderror
                    </div>

                    <div class="col-md-4">
                        <label>
                            Email <span class="required-star">*</span>
                        </label>

                        <input type="email"
                            class="form-control @error('teacher_email') is-invalid @enderror"
                            name="teacher_email"
                            value="{{ old('teacher_email') }}"
                            required>

                        @error('teacher_email')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                </div>

                <!-- Address -->
                <div class="row mb-3">

                    <div class="col-md-4">
                        <label>
                            City <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('teacher_city') is-invalid @enderror"
                            name="teacher_city"
                            value="{{ old('teacher_city') }}"
                            required>

                        @error('teacher_city')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="col-md-8">
                        <label>
                            Address <span class="required-star">*</span>
                        </label>

                        <textarea class="form-control @error('teacher_address') is-invalid @enderror"
                            name="teacher_address"
                            rows="2"
                            required>{{ old('teacher_address') }}</textarea>

                        @error('teacher_address')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                </div>

                <!-- Education -->
                <div class="row mb-3">

                    <div class="col-md-4">
                        <label>
                            Highest Degree <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('highest_degree') is-invalid @enderror"
                            name="highest_degree"
                            value="{{ old('highest_degree') }}"
                            required>

                        @error('highest_degree')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="col-md-4">
                        <label>
                            Field of Study <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('field_of_study') is-invalid @enderror"
                            name="field_of_study"
                            value="{{ old('field_of_study') }}"
                            required>

                        @error('field_of_study')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="col-md-4">
                        <label>
                            University <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('university') is-invalid @enderror"
                            name="university"
                            value="{{ old('university') }}"
                            required>

                        @error('university')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                </div>

                <!-- Experience and Preferences -->
                <div class="row mb-3">

                    <div class="col-md-4">
                        <label>
                            Experience <span class="required-star">*</span>
                        </label>

                        <select class="form-control @error('experience') is-invalid @enderror"
                            name="experience"
                            required>

                            <option value="" {{ old('experience') ? '' : 'selected' }} disabled>
                                Select Experience
                            </option>

                            <option value="Less than 1 year" {{ old('experience') == 'Less than 1 year' ? 'selected' : '' }}>
                                Less than 1 year
                            </option>

                            <option value="1-2 years" {{ old('experience') == '1-2 years' ? 'selected' : '' }}>
                                1-2 years
                            </option>

                            <option value="3-5 years" {{ old('experience') == '3-5 years' ? 'selected' : '' }}>
                                3-5 years
                            </option>

                            <option value="6-10 years" {{ old('experience') == '6-10 years' ? 'selected' : '' }}>
                                6-10 years
                            </option>

                            <option value="More than 10 years" {{ old('experience') == 'More than 10 years' ? 'selected' : '' }}>
                                More than 10 years
                            </option>

                        </select>

                        @error('experience')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="col-md-4">

                        <label>
                            Preferred Grades and Examination Boards
                            <span class="required-star">*</span>
                        </label>

                        <select class="form-control @error('preferred_grades') is-invalid @enderror"
                            name="preferred_grades[]"
                            id="preferred_grades"
                            multiple
                            required>

                            @foreach ($grades as $grade)

                                <option value="{{ $grade->id }}"
                                    {{ in_array($grade->id, old('preferred_grades', [])) ? 'selected' : '' }}>
                                    {{ $grade->name }} - {{ $grade->board->name }}
                                </option>

                            @endforeach

                        </select>

                        @error('preferred_grades')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">
                                Please select at least one preferred grade.
                            </div>
                        @enderror

                    </div>

                    <div class="col-md-4">

                        <label>
                            Preferred Subjects
                            <span class="required-star">*</span>
                        </label>

                        <select class="form-control @error('preferred_subjects') is-invalid @enderror"
                            name="preferred_subjects[]"
                            id="preferred_subjects"
                            multiple
                            required>

                            @foreach ($subjects as $subject)

                                <option value="{{ $subject->id }}"
                                    {{ in_array($subject->id, old('preferred_subjects', [])) ? 'selected' : '' }}>
                                    {{ $subject->name }}
                                </option>

                            @endforeach

                        </select>

                        @error('preferred_subjects')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">
                                Please select at least one preferred subject.
                            </div>
                        @enderror

                    </div>

                </div>

                <!-- Preferred Timings -->
                <div class="row mb-3">

                    <div class="col-md-4">

                        <label>
                            Preferred Timings
                            <span class="required-star">*</span>
                        </label>

                        <select class="form-control @error('preferred_timings') is-invalid @enderror"
                            name="preferred_timings[]"
                            id="preferred_timings"
                            multiple
                            required>

                            <option value="Morning" {{ in_array('Morning', old('preferred_timings', [])) ? 'selected' : '' }}>
                                Morning
                            </option>

                            <option value="Afternoon" {{ in_array('Afternoon', old('preferred_timings', [])) ? 'selected' : '' }}>
                                Afternoon
                            </option>

                            <option value="Evening" {{ in_array('Evening', old('preferred_timings', [])) ? 'selected' : '' }}>
                                Evening
                            </option>

                            <option value="Night" {{ in_array('Night', old('preferred_timings', [])) ? 'selected' : '' }}>
                                Night
                            </option>

                        </select>

                        @error('preferred_timings')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">
                                Please select at least one preferred timing.
                            </div>
                        @enderror

                    </div>

                </div>

                <!-- Documents -->
                <div class="row mb-3">

                    <div class="col-md-4">

                        <label for="resume">
                            Upload Resume
                            <span class="required-star">*</span>
                        </label>

                        <input type="file"
                            class="form-control @error('resume') is-invalid @enderror"
                            name="resume"
                            id="resume"
                            accept=".pdf,.doc,.docx"
                            required>

                        @error('resume')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror

                        <div class="form-text">
                            If the form is sent back due to an error, please re-select your resume.
                        </div>

                    </div>

                    <div class="col-md-4">

                        <label for="picture">
                            Upload Picture
                        </label>

                        <span class="text-muted small">
                            (By uploading this image, you grant permission for it to be used for marketing purposes on social media platforms.)
                        </span>

                        <input type="file"
                            class="form-control @error('picture') is-invalid @enderror"
                            name="picture"
                            id="picture"
                            accept="image/*">

                        @error('picture')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror

                        <div class="form-text">
                            If the form is sent back due to an error, please re-select your picture.
                        </div>

                    </div>

                </div>

                <!-- Intellectual Property -->
                <div class="mb-3">

                    <strong>Intellectual Property:</strong>

                    <p class="mb-1">
                        Teaching materials created by the teacher for use at the academy remain the
                        property of Academy.
                        The teacher agrees not to use or distribute these materials outside the
                        academy without permission.
                    </p>

                    <strong>Acknowledgment:</strong>

                    <p>
                        By accepting this agreement, the teacher acknowledges that they have read,
                        understood, and agreed to the terms and conditions outlined above.
                    </p>

                </div>

                <!-- Agreement -->
                <div class="form-check mb-3">

                    <input type="checkbox"
                        class="form-check-input @error('agree') is-invalid @enderror"
                        name="agree"
                        id="agree"
                        {{ old('agree') ? 'checked' : '' }}
                        required>

                    <label class="form-check-label" for="agree">
                        I agree to the terms
                        <span class="required-star">*</span>
                    </label>

                    @error('agree')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror

                </div>

                <button type="submit"
                    class="btn btn-dark"
                    id="registerBtn">
                    Register
                </button>

            </form>

        </div>
    </div>
</div>


<script>
    $(document).ready(function () {

        /*
        |--------------------------------------------------------------------------
        | Initialize Select2
        |--------------------------------------------------------------------------
        */

        $('#preferred_grades').select2({
            placeholder: "Select Preferred Grades",
            allowClear: true,
            width: '100%'
        });

        $('#preferred_subjects').select2({
            placeholder: "Select Preferred Subjects",
            allowClear: true,
            width: '100%'
        });

        $('#preferred_timings').select2({
            placeholder: "Select Preferred Timings",
            allowClear: true,
            width: '100%'
        });


        /*
        |--------------------------------------------------------------------------
        | Allow only numbers in CNIC, Phone and WhatsApp
        |--------------------------------------------------------------------------
        */

        $('#teacher_cnic, #teacher_phone_no, #teacher_whatsapp_no').on('input', function () {

            this.value = this.value.replace(/[^0-9]/g, '');

        });


        /*
        |--------------------------------------------------------------------------
        | Form Validation
        |--------------------------------------------------------------------------
        */

        $('#teacherRegistrationForm').on('submit', function (event) {

            let isValid = true;


            /*
            |--------------------------------------------------------------------------
            | CNIC Validation
            |--------------------------------------------------------------------------
            */

            const cnic = $('#teacher_cnic').val().trim();

            if (!/^[0-9]{13}$/.test(cnic)) {

                $('#teacher_cnic')
                    .addClass('is-invalid')
                    .removeClass('is-valid');

                isValid = false;

            } else {

                $('#teacher_cnic')
                    .removeClass('is-invalid')
                    .addClass('is-valid');

            }


            /*
            |--------------------------------------------------------------------------
            | Phone Number Validation
            |--------------------------------------------------------------------------
            */

            const phone = $('#teacher_phone_no').val().trim();

            if (!/^03[0-9]{9}$/.test(phone)) {

                $('#teacher_phone_no')
                    .addClass('is-invalid')
                    .removeClass('is-valid');

                isValid = false;

            } else {

                $('#teacher_phone_no')
                    .removeClass('is-invalid')
                    .addClass('is-valid');

            }


            /*
            |--------------------------------------------------------------------------
            | WhatsApp Number Validation
            |--------------------------------------------------------------------------
            */

            const whatsapp = $('#teacher_whatsapp_no').val().trim();

            if (!/^03[0-9]{9}$/.test(whatsapp)) {

                $('#teacher_whatsapp_no')
                    .addClass('is-invalid')
                    .removeClass('is-valid');

                isValid = false;

            } else {

                $('#teacher_whatsapp_no')
                    .removeClass('is-invalid')
                    .addClass('is-valid');

            }


            /*
            |--------------------------------------------------------------------------
            | Preferred Grades Validation
            |--------------------------------------------------------------------------
            */

            if ($('#preferred_grades').val() === null ||
                $('#preferred_grades').val().length === 0) {

                $('#preferred_grades')
                    .next('.select2-container')
                    .addClass('is-invalid');

                isValid = false;

            } else {

                $('#preferred_grades')
                    .next('.select2-container')
                    .removeClass('is-invalid');

            }


            /*
            |--------------------------------------------------------------------------
            | Preferred Subjects Validation
            |--------------------------------------------------------------------------
            */

            if ($('#preferred_subjects').val() === null ||
                $('#preferred_subjects').val().length === 0) {

                $('#preferred_subjects')
                    .next('.select2-container')
                    .addClass('is-invalid');

                isValid = false;

            } else {

                $('#preferred_subjects')
                    .next('.select2-container')
                    .removeClass('is-invalid');

            }


            /*
            |--------------------------------------------------------------------------
            | Preferred Timings Validation
            |--------------------------------------------------------------------------
            */

            if ($('#preferred_timings').val() === null ||
                $('#preferred_timings').val().length === 0) {

                $('#preferred_timings')
                    .next('.select2-container')
                    .addClass('is-invalid');

                isValid = false;

            } else {

                $('#preferred_timings')
                    .next('.select2-container')
                    .removeClass('is-invalid');

            }


            /*
            |--------------------------------------------------------------------------
            | Stop Form Submission If Invalid, Otherwise Disable Button
            |--------------------------------------------------------------------------
            */

            if (!isValid) {

                event.preventDefault();

                // Scroll to first invalid field
                const firstInvalid = $('.is-invalid').first();

                if (firstInvalid.length) {

                    $('html, body').animate({
                        scrollTop: firstInvalid.offset().top - 100
                    }, 500);

                }

            } else {

                // Only disable once the form is genuinely about to submit,
                // so a failed client-side check never leaves the button stuck.
                $('#registerBtn')
                    .prop('disabled', true)
                    .html('Registering... <span class="spinner-border spinner-border-sm ms-1"></span>');

            }

        });


        /*
        |--------------------------------------------------------------------------
        | Remove Validation Error While Typing
        |--------------------------------------------------------------------------
        */

        $('#teacher_cnic, #teacher_phone_no, #teacher_whatsapp_no').on('input', function () {

            $(this).removeClass('is-invalid');

        });


        /*
        |--------------------------------------------------------------------------
        | Remove Select2 Validation Error When Selection Changes
        |--------------------------------------------------------------------------
        */

        $('#preferred_grades, #preferred_subjects, #preferred_timings').on('change', function () {

            if ($(this).val() && $(this).val().length > 0) {

                $(this)
                    .next('.select2-container')
                    .removeClass('is-invalid');

            }

        });

    });
</script>

</body>

</html>