<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Teach With Us | Al Mairaaj</title>

    <link rel="icon" type="image/png" href="{{ asset('build/assets/book_logo.png') }}">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- Select2 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
        rel="stylesheet" />

    <!-- Warm, friendly display font for headings -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

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
    :root {
        --teal: #0d6d72;
        --teal-dark: #094f53;
        --teal-tint: #e7f3f3;
        --gold: #cf9a3f;
        --gold-tint: #faf3e4;
        --ink: #22333b;
        --paper: #faf7f2;
    }

    body {
        background: var(--paper);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: var(--ink);
    }

    h1, h2, h3, h4, .brand-heading {
        font-family: 'Poppins', 'Inter', sans-serif;
    }

    .teach-hero {
        background: linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%);
        border-radius: 1.25rem 1.25rem 0 0;
        color: #fff;
        padding: 2.25rem 2rem;
        position: relative;
        overflow: hidden;
    }

    .teach-hero::after {
        content: "";
        position: absolute;
        right: -60px;
        top: -60px;
        width: 220px;
        height: 220px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 50%;
    }

    .teach-hero .hero-icon {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.15);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        margin-bottom: 0.9rem;
    }

    .teach-hero p {
        color: rgba(255, 255, 255, 0.85);
        max-width: 640px;
        margin-bottom: 0;
    }

    .teach-hero .hero-meta {
        margin-top: 1.1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1.25rem;
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.85);
    }

    .teach-hero .hero-meta span {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
    }

    .teach-card {
        border: none;
        border-radius: 1.25rem;
        overflow: hidden;
    }

    .teach-card .card-body {
        padding: 2.25rem;
    }

    .section-heading {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        margin-bottom: 1.1rem;
        padding-bottom: 0.6rem;
        border-bottom: 1px solid #eee1cd;
    }

    .section-heading .icon-badge {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: var(--gold-tint);
        color: var(--gold);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        flex-shrink: 0;
    }

    .section-heading h5 {
        margin: 0;
        font-size: 1.05rem;
        color: var(--ink);
    }

    label {
        font-weight: 500;
        font-size: 0.92rem;
        margin-bottom: 0.3rem;
    }

    .form-control,
    .form-select {
        border-radius: 0.6rem;
        border-color: #dcd6ca;
    }

    .form-control:focus,
    .form-control:hover {
        border-color: var(--teal) !important;
        box-shadow: 0 0 0 0.2rem rgba(13, 109, 114, 0.15) !important;
    }

    /* Required field star */
    .required-star {
        color: var(--gold);
        font-weight: bold;
    }

    .form-text {
        font-size: 0.8rem;
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
        border: 1px solid #dcd6ca;
        border-radius: 0.6rem;
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
        background-color: var(--teal);
        border: none;
        color: #fff;
        border-radius: 0.35rem;
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

    .teal-checkbox {
        background: var(--teal-tint);
        border-radius: 0.75rem;
        padding: 1rem 1.1rem;
    }

    .teal-checkbox input[type="checkbox"] {
        accent-color: var(--teal);
    }

    .teal-checkbox label {
        color: var(--teal-dark);
        font-weight: 500;
    }

    .agreement-box {
        background: #fbfaf7;
        border: 1px solid #eee1cd;
        border-radius: 0.85rem;
        padding: 1.1rem 1.25rem;
        font-size: 0.9rem;
        color: #4a5a60;
    }

    .agreement-box strong {
        color: var(--ink);
    }

    .btn-submit {
        background: var(--teal);
        border: none;
        color: #fff;
        border-radius: 50px;
        padding: 0.7rem 2rem;
        font-weight: 600;
        transition: background 0.2s ease, transform 0.15s ease;
    }

    .btn-submit:hover:not(:disabled) {
        background: var(--teal-dark);
        color: #fff;
        transform: translateY(-1px);
    }

    .btn-submit:disabled {
        opacity: 0.8;
    }

    .alert-feelgood {
        border: none;
        border-radius: 0.85rem;
    }

    .alert-feelgood.alert-success {
        background: var(--teal-tint);
        color: var(--teal-dark);
    }

    .alert-feelgood.alert-danger {
        background: #fbeceb;
        color: #8a2f2a;
    }
</style>

<body>

<div class="container my-5" style="max-width: 960px;">

    @if (session('success'))
        <div class="alert alert-feelgood alert-success d-flex align-items-start gap-2 mb-3" role="alert">
            <i class="bi bi-check-circle-fill fs-5 mt-1"></i>
            <div>{{ session('success') }}</div>
        </div>
    @endif

    @if (session('error'))
        <div class="alert alert-feelgood alert-danger d-flex align-items-start gap-2 mb-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill fs-5 mt-1"></i>
            <div>{{ session('error') }}</div>
        </div>
    @endif

    @if ($errors->any())
        <div class="alert alert-feelgood alert-danger mb-3" role="alert">
            <div class="d-flex align-items-start gap-2">
                <i class="bi bi-exclamation-triangle-fill fs-5 mt-1"></i>
                <div>
                    <strong>A few things need a second look:</strong>
                    <ul class="mb-0 mt-1">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
    @endif

    <div class="card teach-card shadow-sm">

        <div class="teach-hero">
            <div class="hero-icon"><i class="bi bi-mortarboard-fill"></i></div>
            <h1 class="h3 mb-2">Bring your teaching to Al Mairaaj</h1>
            <p>
                Tell us a little about yourself and the subjects you love to teach. Our academic
                team reviews every application personally and will reach out about next steps.
            </p>
            <div class="hero-meta">
                <span><i class="bi bi-clock"></i> About 5 minutes to complete</span>
                <span><i class="bi bi-shield-check"></i> Your details stay private</span>
            </div>
        </div>

        <div class="card-body">

            <form action="{{ route('teacher.register.store') }}"
                method="POST"
                enctype="multipart/form-data"
                id="teacherRegistrationForm"
                novalidate>

                @csrf

                <!-- Basic Information -->
                <div class="section-heading">
                    <span class="icon-badge"><i class="bi bi-person-fill"></i></span>
                    <h5>Personal details</h5>
                </div>

                <div class="row mb-4">

                    <div class="col-md-4">
                        <label>
                            Name <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('teacher_name') is-invalid @enderror"
                            name="teacher_name"
                            id="teacher_name"
                            value="{{ old('teacher_name') }}"
                            required>

                        @error('teacher_name')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">Please tell us your full name.</div>
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
                            id="teacher_gender"
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
                        @else
                            <div class="invalid-feedback">Please select a gender.</div>
                        @enderror
                    </div>

                </div>

                <!-- Contact Information -->
                <div class="section-heading">
                    <span class="icon-badge"><i class="bi bi-telephone-fill"></i></span>
                    <h5>How can we reach you?</h5>
                </div>

                <div class="row mb-4">

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
                            id="teacher_email"
                            value="{{ old('teacher_email') }}"
                            required>

                        @error('teacher_email')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">Please enter a valid email address.</div>
                        @enderror
                    </div>

                </div>

                <!-- Address -->
                <div class="row mb-4">

                    <div class="col-md-4">
                        <label>
                            City <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('teacher_city') is-invalid @enderror"
                            name="teacher_city"
                            id="teacher_city"
                            value="{{ old('teacher_city') }}"
                            required>

                        @error('teacher_city')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">Please tell us your city.</div>
                        @enderror
                    </div>

                    <div class="col-md-8">
                        <label>
                            Address <span class="required-star">*</span>
                        </label>

                        <textarea class="form-control @error('teacher_address') is-invalid @enderror"
                            name="teacher_address"
                            id="teacher_address"
                            rows="2"
                            required>{{ old('teacher_address') }}</textarea>

                        @error('teacher_address')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">Please enter your address.</div>
                        @enderror
                    </div>

                </div>

                <!-- Education -->
                <div class="section-heading">
                    <span class="icon-badge"><i class="bi bi-mortarboard"></i></span>
                    <h5>Education &amp; experience</h5>
                </div>

                <div class="row mb-4">

                    <div class="col-md-4">
                        <label>
                            Highest Degree <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('highest_degree') is-invalid @enderror"
                            name="highest_degree"
                            id="highest_degree"
                            value="{{ old('highest_degree') }}"
                            required>

                        @error('highest_degree')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">Please enter your highest degree.</div>
                        @enderror
                    </div>

                    <div class="col-md-4">
                        <label>
                            Field of Study <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('field_of_study') is-invalid @enderror"
                            name="field_of_study"
                            id="field_of_study"
                            value="{{ old('field_of_study') }}"
                            required>

                        @error('field_of_study')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">Please enter your field of study.</div>
                        @enderror
                    </div>

                    <div class="col-md-4">
                        <label>
                            University <span class="required-star">*</span>
                        </label>

                        <input type="text"
                            class="form-control @error('university') is-invalid @enderror"
                            name="university"
                            id="university"
                            value="{{ old('university') }}"
                            required>

                        @error('university')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @else
                            <div class="invalid-feedback">Please enter your university.</div>
                        @enderror
                    </div>

                </div>

                <!-- Experience and Preferences -->
                <div class="section-heading">
                    <span class="icon-badge"><i class="bi bi-easel2"></i></span>
                    <h5>What and when you'd like to teach</h5>
                </div>

                <div class="row mb-4">

                    <div class="col-md-4">
                        <label>
                            Experience <span class="required-star">*</span>
                        </label>

                        <select class="form-control @error('experience') is-invalid @enderror"
                            name="experience"
                            id="experience"
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
                        @else
                            <div class="invalid-feedback">Please select your experience level.</div>
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
                <div class="row mb-4">

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
                <div class="section-heading">
                    <span class="icon-badge"><i class="bi bi-paperclip"></i></span>
                    <h5>Resume &amp; photo</h5>
                </div>

                <div class="row mb-4">

                    <div class="col-md-6">

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
                        @else
                            <div class="invalid-feedback">Please attach your resume (PDF, DOC or DOCX).</div>
                        @enderror

                        <div class="form-text">
                            PDF, DOC or DOCX, up to 5MB. If the form is sent back due to an error,
                            please re-select your resume.
                        </div>

                    </div>

                    <div class="col-md-6">

                        <label for="picture">
                            Upload Picture <span class="text-muted small">(optional)</span>
                        </label>

                        <input type="file"
                            class="form-control @error('picture') is-invalid @enderror"
                            name="picture"
                            id="picture"
                            accept="image/*">

                        @error('picture')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror

                        <div class="form-text">
                            By uploading a photo, you allow us to use it for marketing on our social
                            platforms. If the form is sent back due to an error, please re-select your picture.
                        </div>

                    </div>

                </div>

                <!-- Intellectual Property -->
                <div class="agreement-box mb-3">

                    <p class="mb-2"><strong>Intellectual property.</strong> Teaching materials you
                        create for use at the academy remain the property of Al Mairaaj. Please
                        don't use or share them outside the academy without permission.</p>

                    <p class="mb-0"><strong>Acknowledgment.</strong> By accepting below, you confirm
                        you've read, understood, and agree to the terms above.</p>

                </div>

                <!-- Agreement -->
                <div class="form-check teal-checkbox mb-4">

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
                    @else
                        <div class="invalid-feedback">Please accept the terms to continue.</div>
                    @enderror

                </div>

                <button type="submit"
                    class="btn btn-submit"
                    id="registerBtn">
                    <i class="bi bi-send-fill me-1"></i> Submit My Application
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
        | Small helpers to toggle validation state consistently, including
        | Select2 fields (whose real <select> is hidden behind a rendered
        | .select2-container, so the error class has to go on that instead).
        |--------------------------------------------------------------------------
        */

        function setFieldState(el, valid) {

            const $el = $(el);
            const $target = $el.hasClass('select2-hidden-accessible')
                ? $el.next('.select2-container')
                : $el;

            $target.toggleClass('is-invalid', !valid);
            $target.toggleClass('is-valid', valid);
        }

        function isFilled(value) {
            return value !== null && value !== undefined && String(value).trim().length > 0;
        }


        /*
        |--------------------------------------------------------------------------
        | Form Validation
        |
        | Runs on submit for every required field, so nothing is ever left to
        | the browser's own (inconsistent, unstyled) validation messages -
        | every failure shows the same inline, friendly feedback text.
        |--------------------------------------------------------------------------
        */

        $('#teacherRegistrationForm').on('submit', function (event) {

            let isValid = true;

            function check(selector, valid) {
                setFieldState($(selector), valid);
                if (!valid) isValid = false;
            }


            // Simple required text/textarea fields
            [
                '#teacher_name',
                '#teacher_city',
                '#teacher_address',
                '#highest_degree',
                '#field_of_study',
                '#university'
            ].forEach(function (selector) {
                check(selector, isFilled($(selector).val()));
            });


            // Required selects
            ['#teacher_gender', '#experience'].forEach(function (selector) {
                check(selector, isFilled($(selector).val()));
            });


            // Email
            const email = $('#teacher_email').val().trim();
            check('#teacher_email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));


            // CNIC
            const cnic = $('#teacher_cnic').val().trim();
            check('#teacher_cnic', /^[0-9]{13}$/.test(cnic));


            // Phone Number
            const phone = $('#teacher_phone_no').val().trim();
            check('#teacher_phone_no', /^03[0-9]{9}$/.test(phone));


            // WhatsApp Number
            const whatsapp = $('#teacher_whatsapp_no').val().trim();
            check('#teacher_whatsapp_no', /^03[0-9]{9}$/.test(whatsapp));


            // Preferred Grades / Subjects / Timings (Select2 multi-selects)
            ['#preferred_grades', '#preferred_subjects', '#preferred_timings'].forEach(function (selector) {
                const val = $(selector).val();
                check(selector, val !== null && val.length > 0);
            });


            // Resume (required file)
            const resumeFiles = $('#resume')[0].files;
            check('#resume', resumeFiles && resumeFiles.length > 0);


            // Agreement checkbox
            check('#agree', $('#agree').is(':checked'));


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
                    .html('Submitting... <span class="spinner-border spinner-border-sm ms-1"></span>');

            }

        });


        /*
        |--------------------------------------------------------------------------
        | Remove Validation Error While Typing / Choosing
        |--------------------------------------------------------------------------
        */

        $('#teacherRegistrationForm').on('input change', 'input, textarea, select', function () {

            setFieldState(this, true);

            // Immediately re-flag empty required fields rather than showing
            // a false "valid" state while the user is still typing.
            const $this = $(this);

            if ($this.prop('required')) {

                if ($this.attr('type') === 'checkbox') {

                    if (!$this.is(':checked')) setFieldState(this, false);

                } else if ($this.is('select') && $this.attr('multiple')) {

                    const val = $this.val();
                    if (!val || val.length === 0) setFieldState(this, false);

                } else if (!isFilled($this.val())) {

                    setFieldState(this, false);

                }
            }

        });

    });
</script>

</body>

</html>