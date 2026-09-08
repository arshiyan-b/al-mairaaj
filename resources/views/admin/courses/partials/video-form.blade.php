@php
    $formId = isset($video) ? 'editVideoForm' . $video->id : 'addVideoForm';
@endphp

<div class="mb-3">
    <label class="form-label">Title</label>
    <input type="text" name="title" class="form-control"
        value="{{ old('title', $video->title ?? '') }}" required>
</div>

<div class="mb-3">
    <label class="form-label">Description</label>
    <textarea name="description" class="form-control" rows="2">{{ old('description', $video->description ?? '') }}</textarea>
</div>

<div class="row mb-3">
    <div class="col-md-6">
        <label class="form-label">Video Provider</label>
        <select name="video_provider" class="form-control video-provider-select" data-form="{{ $formId }}" required>
            @foreach (['vimeo' => 'Vimeo', 'youtube' => 'YouTube', 'upload' => 'Upload File'] as $value => $label)
                <option value="{{ $value }}"
                    {{ old('video_provider', $video->video_provider ?? 'vimeo') === $value ? 'selected' : '' }}>
                    {{ $label }}
                </option>
            @endforeach
        </select>
    </div>

    <div class="col-md-6">
        <label class="form-label">Duration (seconds) <span class="text-muted small">(optional)</span></label>
        <input type="number" min="0" name="duration_seconds" class="form-control"
            value="{{ old('duration_seconds', $video->duration_seconds ?? '') }}">
    </div>
</div>

<div class="mb-3 video-id-field" id="{{ $formId }}-video-id-field">
    <label class="form-label">Video ID / URL</label>
    <input type="text" name="video_id" class="form-control"
        value="{{ old('video_id', (isset($video) && $video->video_provider !== 'upload') ? $video->video_id : '') }}"
        placeholder="e.g. 1016625668 for Vimeo, or the YouTube video ID">
</div>

<div class="mb-3 video-file-field" id="{{ $formId }}-video-file-field" style="display: none;">
    <label class="form-label">Video File</label>
    <input type="file" name="video_file" class="form-control" accept="video/mp4,video/quicktime">
    @if (isset($video) && $video->video_provider === 'upload')
        <div class="form-text">A file is already uploaded. Choosing a new one replaces it.</div>
    @endif
</div>

<div class="row mb-3">
    <div class="col-md-6">
        <label class="form-label">Sort Order</label>
        <input type="number" min="0" name="sort_order" class="form-control"
            value="{{ old('sort_order', $video->sort_order ?? 0) }}">
    </div>

    <div class="col-md-6">
        <label class="form-label">Status</label>
        <select name="status" class="form-control" required>
            @foreach (['draft' => 'Draft', 'published' => 'Published'] as $value => $label)
                <option value="{{ $value }}"
                    {{ old('status', $video->status ?? 'draft') === $value ? 'selected' : '' }}>
                    {{ $label }}
                </option>
            @endforeach
        </select>
    </div>
</div>

<script>
    (function () {
        const select = document.querySelector('select.video-provider-select[data-form="{{ $formId }}"]');
        const idField = document.getElementById('{{ $formId }}-video-id-field');
        const fileField = document.getElementById('{{ $formId }}-video-file-field');

        function toggle() {
            if (select.value === 'upload') {
                idField.style.display = 'none';
                fileField.style.display = 'block';
            } else {
                idField.style.display = 'block';
                fileField.style.display = 'none';
            }
        }

        select.addEventListener('change', toggle);
        toggle();
    })();
</script>