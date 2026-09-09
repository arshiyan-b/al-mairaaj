<div class="mb-3">
    <label class="form-label">Subject</label>
    <select name="subject_id" class="form-control" required>
        <option value="">Select Subject</option>
        @foreach ($subjects as $subject)
            <option value="{{ $subject->id }}"
                {{ old('subject_id', $simulator->subject_id ?? '') == $subject->id ? 'selected' : '' }}>
                {{ $subject->name }}
            </option>
        @endforeach
    </select>
</div>

<div class="mb-3">
    <label class="form-label">Title</label>
    <input type="text" name="title" class="form-control"
        value="{{ old('title', $simulator->title ?? '') }}" required>
</div>

<div class="mb-3">
    <label class="form-label">Description</label>
    <textarea name="description" class="form-control" rows="2">{{ old('description', $simulator->description ?? '') }}</textarea>
</div>

<div class="mb-3">
    <label class="form-label">Page Path</label>
    <input type="text" name="page_path" class="form-control"
        value="{{ old('page_path', $simulator->page_path ?? '') }}"
        placeholder="e.g. /simulators/periodic-table or a full URL">
    <div class="form-text">
        Where this simulator's own page lives - a path on this site, or a full URL if it's
        hosted elsewhere. Opening a simulator navigates here directly (no iframe).
    </div>
</div>

<div class="row mb-3">
    <div class="col-md-6">
        <label class="form-label">Sort Order</label>
        <input type="number" min="0" name="sort_order" class="form-control"
            value="{{ old('sort_order', $simulator->sort_order ?? 0) }}">
    </div>

    <div class="col-md-6">
        <label class="form-label">Status</label>
        <select name="status" class="form-control" required>
            @foreach (['draft' => 'Draft', 'published' => 'Published'] as $value => $label)
                <option value="{{ $value }}"
                    {{ old('status', $simulator->status ?? 'draft') === $value ? 'selected' : '' }}>
                    {{ $label }}
                </option>
            @endforeach
        </select>
    </div>
</div>

<div class="mb-3">
    <label class="form-label">Thumbnail <span class="text-muted small">(optional)</span></label>

    @if (! empty($simulator) && $simulator->thumbnail)
        <div class="mb-2">
            <img src="{{ asset('storage/' . $simulator->thumbnail) }}" alt="Current thumbnail"
                class="rounded" style="height: 60px; width: 60px; object-fit: cover;">
        </div>
    @endif

    <input type="file" name="thumbnail" class="form-control" accept="image/*">
</div>