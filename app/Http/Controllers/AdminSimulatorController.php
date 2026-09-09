<?php

namespace App\Http\Controllers;

use App\Models\Simulator;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminSimulatorController extends Controller
{
    public function index()
    {
        $simulators = Simulator::with('subject')->orderBy('sort_order')->get();
        $subjects = Subject::orderBy('name')->get();

        return view('admin.simulators.index', compact('simulators', 'subjects'));
    }

    public function store(Request $request)
    {
        $validated = $this->validateSimulator($request);
        $validated['slug'] = $this->uniqueSlug($validated['title']);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('simulator_thumbnails', 'public');
        }

        Simulator::create($validated);

        return redirect()
            ->route('admin.simulators.index')
            ->with('success', 'Simulator created successfully.');
    }

    public function update(Request $request, Simulator $simulator)
    {
        $validated = $this->validateSimulator($request);

        if ($validated['title'] !== $simulator->title) {
            $validated['slug'] = $this->uniqueSlug($validated['title'], $simulator->id);
        }

        if ($request->hasFile('thumbnail')) {
            if ($simulator->thumbnail) {
                Storage::disk('public')->delete($simulator->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('simulator_thumbnails', 'public');
        }

        $simulator->update($validated);

        return redirect()
            ->route('admin.simulators.index')
            ->with('success', 'Simulator updated successfully.');
    }

    public function destroy(Simulator $simulator)
    {
        if ($simulator->thumbnail) {
            Storage::disk('public')->delete($simulator->thumbnail);
        }

        $simulator->delete();

        return redirect()
            ->route('admin.simulators.index')
            ->with('success', 'Simulator deleted successfully.');
    }

    private function validateSimulator(Request $request): array
    {
        return $request->validate([
            'subject_id' => 'required|integer|exists:subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'page_path' => 'nullable|string|max:500',
            'thumbnail' => 'nullable|image|max:2048',
            'status' => 'required|in:draft,published',
            'sort_order' => 'nullable|integer|min:0',
        ]);
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;

        while (
            Simulator::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base . '-' . (++$i);
        }

        return $slug;
    }
}