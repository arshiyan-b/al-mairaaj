@php
    $formId = isset($question) ? 'editQuestionForm' . $question->id : 'addQuestionForm';
    $type = old('question_type', $question->question_type ?? 'mcq');
    $correct = old('correct_option', $question->correct_option ?? 'a');
@endphp

<div class="row mb-3">
    <div class="col-md-6">
        <label class="form-label">Pause At (mm:ss)</label>
        @php
            $existingSeconds = old('trigger_at_seconds', $question->trigger_at_seconds ?? 0);
        @endphp
        <input type="text" class="form-control trigger-time-input" data-form="{{ $formId }}"
            value="{{ sprintf('%02d:%02d', intdiv($existingSeconds, 60), $existingSeconds % 60) }}"
            placeholder="mm:ss" required>
        <input type="hidden" name="trigger_at_seconds" class="trigger-seconds-hidden" data-form="{{ $formId }}"
            value="{{ $existingSeconds }}">
    </div>

    <div class="col-md-6">
        <label class="form-label">Question Type</label>
        <select name="question_type" class="form-control question-type-select" data-form="{{ $formId }}" required>
            <option value="mcq" {{ $type === 'mcq' ? 'selected' : '' }}>Multiple Choice</option>
            <option value="true_false" {{ $type === 'true_false' ? 'selected' : '' }}>True / False</option>
        </select>
    </div>
</div>

<div class="mb-3">
    <label class="form-label">Question</label>
    <textarea name="question_text" class="form-control" rows="2" required>{{ old('question_text', $question->question_text ?? '') }}</textarea>
</div>

{{-- MCQ options --}}
<div class="mcq-options" id="{{ $formId }}-mcq-options">
    <div class="row mb-2">
        <div class="col-md-6">
            <label class="form-label">Option A</label>
            <div class="input-group">
                <span class="input-group-text">
                    <input type="radio" name="correct_option" value="a" {{ $correct === 'a' ? 'checked' : '' }}>
                </span>
                <input type="text" name="option_a" class="form-control mcq-option-input"
                    value="{{ old('option_a', ($question->question_type ?? 'mcq') === 'mcq' ? ($question->option_a ?? '') : '') }}">
            </div>
        </div>
        <div class="col-md-6">
            <label class="form-label">Option B</label>
            <div class="input-group">
                <span class="input-group-text">
                    <input type="radio" name="correct_option" value="b" {{ $correct === 'b' ? 'checked' : '' }}>
                </span>
                <input type="text" name="option_b" class="form-control mcq-option-input"
                    value="{{ old('option_b', ($question->question_type ?? 'mcq') === 'mcq' ? ($question->option_b ?? '') : '') }}">
            </div>
        </div>
    </div>

    <div class="row mb-2">
        <div class="col-md-6">
            <label class="form-label">Option C</label>
            <div class="input-group">
                <span class="input-group-text">
                    <input type="radio" name="correct_option" value="c" {{ $correct === 'c' ? 'checked' : '' }}>
                </span>
                <input type="text" name="option_c" class="form-control mcq-option-input"
                    value="{{ old('option_c', $question->option_c ?? '') }}">
            </div>
        </div>
        <div class="col-md-6">
            <label class="form-label">Option D <span class="text-muted small">(optional)</span></label>
            <div class="input-group">
                <span class="input-group-text">
                    <input type="radio" name="correct_option" value="d" {{ $correct === 'd' ? 'checked' : '' }}>
                </span>
                <input type="text" name="option_d" class="form-control mcq-option-input"
                    value="{{ old('option_d', $question->option_d ?? '') }}">
            </div>
        </div>
    </div>

    <div class="form-text mb-3">Tick the radio button next to the correct answer.</div>
</div>

{{-- True/False options --}}
<div class="true-false-options" id="{{ $formId }}-true-false-options" style="display: none;">
    <input type="hidden" name="option_a" value="True" class="tf-hidden-option" data-form="{{ $formId }}" disabled>
    <input type="hidden" name="option_b" value="False" class="tf-hidden-option" data-form="{{ $formId }}" disabled>

    <div class="row mb-3">
        <div class="col-md-6">
            <div class="form-check">
                <input class="form-check-input" type="radio" name="correct_option" value="a"
                    {{ $correct === 'a' ? 'checked' : '' }}>
                <label class="form-check-label">True is correct</label>
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-check">
                <input class="form-check-input" type="radio" name="correct_option" value="b"
                    {{ $correct === 'b' ? 'checked' : '' }}>
                <label class="form-check-label">False is correct</label>
            </div>
        </div>
    </div>
</div>

<div class="mb-3">
    <label class="form-label">Explanation <span class="text-muted small">(optional, shown after answering)</span></label>
    <textarea name="explanation" class="form-control" rows="2">{{ old('explanation', $question->explanation ?? '') }}</textarea>
</div>

<script>
    (function () {
        const formId = "{{ $formId }}";
        const typeSelect = document.querySelector('select.question-type-select[data-form="' + formId + '"]');
        const mcqOptions = document.getElementById(formId + '-mcq-options');
        const tfOptions = document.getElementById(formId + '-true-false-options');
        const timeInput = document.querySelector('.trigger-time-input[data-form="' + formId + '"]');
        const secondsHidden = document.querySelector('.trigger-seconds-hidden[data-form="' + formId + '"]');

        function toggleType() {
            const isTrueFalse = typeSelect.value === 'true_false';
            mcqOptions.style.display = isTrueFalse ? 'none' : 'block';
            tfOptions.style.display = isTrueFalse ? 'block' : 'none';

            mcqOptions.querySelectorAll('input').forEach((el) => { el.disabled = isTrueFalse; });
            tfOptions.querySelectorAll('input').forEach((el) => { el.disabled = !isTrueFalse; });
        }

        typeSelect.addEventListener('change', toggleType);
        toggleType();

        timeInput.addEventListener('input', function () {
            const parts = timeInput.value.split(':').map((p) => parseInt(p, 10) || 0);
            const minutes = parts[0] || 0;
            const seconds = parts[1] || 0;
            secondsHidden.value = (minutes * 60) + seconds;
        });
    })();
</script>