@extends('teacher.layout.app')
@section('title')
    Course Videos
@endsection
@section('content')

    <div class="container">
        @include('teacher.layouts.alerts')
        <div class="card mb-2">
            <div class="card-header">
                <button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#addVideo">Add Video</button>
            </div>
            <div class="card-body">
                <div class="table-responsive-wrapper" style="overflow-x: auto;">
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <th>Course ID</th>
                                <td>{{ $course->course_id }}</td>
                            </tr>
                            <tr>
                                <th>Title</th>
                                <td>{{ $course->course_title }}</td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td>{{ $course->course_description }}</td>
                            </tr>
                            <tr>
                                <th>Subject</th>
                                <td>{{ $course->subject->subject_name ?? 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th>Paper</th>
                                <td>Paper - {{ $course->course_paper }}</td>
                            </tr>
                            <tr>
                                <th>Qualification</th>
                                <td>{{ strtoupper($course->course_qualification) }}</td>
                            </tr>
                            <tr>
                                <th>Teacher Name</th>
                                <td>{{ $course->teacher->teacher_name ?? 'N/A' }}</td>
                            </tr>
                            <tr>
                                <th>Number of Videos</th>
                                <td>
                                    @if($course->videos->count() !== 0)
                                        {{ $course->videos->count() }}
                                    @else
                                        <span class="text-muted">No videos found.</span>
                                    @endif
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                @if($videos->count() !== 0)
                    <hr>
                    <h2>List of Videos</h2>
                    <br>
                    <ul class="list-unstyled">
                        @foreach($videos as $video)
                            <li>
                                <div class="col-md-8 p-2 mb-2 border rounded bg-light cursor-pointer" role="button"
                                    data-bs-toggle="modal" data-bs-target="#videoModal"
                                    data-video="https://player.vimeo.com/video/{{ $video->video_link }}"
                                    data-minutes="{{ $video->minutes }}" data-seconds="{{ $video->seconds }}"
                                    data-video-id="{{ $video->video_id }}" data-mcq-id="{{ $video->mcq_id }}">
                                    <strong>{{ $video->video_order }}. </strong>{{ $video->video_title }}
                                </div>

                                <div>
                                    @if (is_null($video->mcq_id))
                                        <button class="btn btn-primary" data-bs-toggle="modal"
                                            data-bs-target="#McqModal{{ $video->video_id }}">Add MCQ</button>
                                    @endif
                                </div>
                            </li>

                            <!-- Add MCQ Modal -->
                            <div class="modal fade" id="McqModal{{ $video->video_id }}" tabindex="-1" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <form action="{{ route('mcq.store') }}" method="POST">
                                            @csrf
                                            <div class="modal-header">
                                                <h5 class="modal-title">Add MCQ</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                            </div>

                                            <input type="hidden" name="video_id" value="{{ $video->video_id }}">
                                            <input type="hidden" name="board" value="{{ $board }}">

                                            <div class="modal-body">
                                                <div class="mb-3">
                                                    <label class="form-label">Question</label>
                                                    <input type="text" class="form-control" name="question" required>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-6 mb-3">
                                                        <label class="form-label">Option A</label>
                                                        <input type="text" class="form-control" name="option_a" required>
                                                    </div>
                                                    <div class="col-md-6 mb-3">
                                                        <label class="form-label">Option B</label>
                                                        <input type="text" class="form-control" name="option_b" required>
                                                    </div>
                                                    <div class="col-md-6 mb-3">
                                                        <label class="form-label">Option C</label>
                                                        <input type="text" class="form-control" name="option_c">
                                                    </div>
                                                    <div class="col-md-6 mb-3">
                                                        <label class="form-label">Option D</label>
                                                        <input type="text" class="form-control" name="option_d">
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-6 mb-3">
                                                        <label class="form-label">Correct Answer</label>
                                                        <select class="form-select" name="correct_option" required>
                                                            <option value="" disabled selected>Select correct option</option>
                                                            <option value="a">Option A</option>
                                                            <option value="b">Option B</option>
                                                            <option value="c">Option C</option>
                                                            <option value="d">Option D</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-6 mb-3">
                                                        <label class="form-label">Appear Time</label>
                                                        <div class="d-flex gap-2">
                                                            <input type="number" class="form-control" name="minutes" min="0"
                                                                placeholder="minutes" required>
                                                            <input type="number" class="form-control" name="seconds" min="0"
                                                                max="59" placeholder="seconds" required>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="modal-footer">
                                                <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" class="btn btn-primary">Save</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>


                            <!-- Video Modal -->
                            <div class="modal fade" id="videoModal" tabindex="-1" aria-labelledby="videoModalLabel"
                                aria-hidden="true">
                                <div class="modal-dialog modal-lg modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="videoModalLabel">Video</h5>
                                        </div>
                                        <div class="modal-body">
                                            <div class="ratio ratio-16x9">
                                                <iframe id="videoFrame" src="" allowfullscreen></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- MCQ Modal -->
                            @if($video->mcq)
                                <div class="modal fade" id="mcqModal{{ $video->video_id }}" tabindex="-1" aria-hidden="true"
                                    data-bs-backdrop="static" data-bs-keyboard="false">
                                    <div class="modal-dialog modal-lg modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">{{ $video->mcq->question }}</h5>
                                            </div>
                                            <div class="modal-body">
                                                <form id="mcqForm{{ $video->video_id }}"
                                                    data-correct="{{ $video->mcq->correct_option }}">
                                                    <div class="form-check">
                                                        <input type="radio" class="form-check-input" name="answer" value="a">
                                                        <label class="form-check-label">{{ $video->mcq->option_a }}</label>
                                                    </div>
                                                    <div class="form-check">
                                                        <input type="radio" class="form-check-input" name="answer" value="b">
                                                        <label class="form-check-label">{{ $video->mcq->option_b }}</label>
                                                    </div>
                                                    @if($video->mcq->option_c)
                                                        <div class="form-check">
                                                            <input type="radio" class="form-check-input" name="answer" value="c">
                                                            <label class="form-check-label">{{ $video->mcq->option_c }}</label>
                                                        </div>
                                                    @endif
                                                    @if($video->mcq->option_d)
                                                        <div class="form-check">
                                                            <input type="radio" class="form-check-input" name="answer" value="d">
                                                            <label class="form-check-label">{{ $video->mcq->option_d }}</label>
                                                        </div>
                                                    @endif

                                                    <div id="resultMsg{{ $video->video_id }}" class="mt-3 fw-bold"></div>

                                                    <div class="mt-3">
                                                        <button type="button" class="btn btn-primary"
                                                            onclick="checkAnswer({{ $video->video_id }})">
                                                            Submit
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @endif


                        @endforeach
                    </ul>
                @endif
            </div>
        </div>
    </div>


    <div class="modal fade" id="addVideo" tabindex="-1" aria-labelledby="addVideoLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addVideoLabel">Create a new {{ $board }} {{ $course->course_qualification }}
                        Video</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form method="POST"
                        action="{{ route('teacher.video_store', ['board' => $board, 'grade' => $course->course_qualification, 'id' => $course->course_id]) }}"
                        enctype="multipart/form-data">
                        @csrf
                        <div class="mb-3 row">
                            <div class="col-md-11">
                                <label for="videoTitle" class="form-label">Title</label>
                                <textarea name="videoTitle" class="form-control" id="videoTitle"
                                    placeholder="Enter Course Title" rows="1" style="resize: vertical;"></textarea>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-11">
                                <label for="videoDescription" class="form-label">Description</label>
                                <textarea name="videoDescription" class="form-control" id="videoDescription"
                                    placeholder="Enter Course Description" rows="3" style="resize: vertical;"></textarea>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-6">
                                <label for="videoLanguage" class="form-label">Language</label>
                                <select name="videoLanguage" class="form-control custom-input scroll-select"
                                    id="videoLanguage" required>
                                    <option disabled selected>-- Select Language --</option>
                                    <option value="English">English</option>
                                    <option value="Urdu">Urdu</option>
                                    <option value="Blingual">Bilingual</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="videoOrder" class="form-label">Order</label>
                                <input type="number" name="videoOrder" id="videoOrder" class="form-control"
                                    value="{{ $highestOrder + 1 }}" readonly>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-6">
                                <label for="videoDuration" class="form-label">Duration</label>
                                <input type="number" name="videoDuration" id="videoDuration" class="form-control" min="1"
                                    placeholder="Enter duration in minutes">
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-11">
                                <label for="videoFile" class="form-label">Upload Video</label>
                                <input type="file" name="videoFile" id="videoFile" class="form-control"
                                    requiredaccept="video/mp4,video/x-m4v,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/webm">
                            </div>
                        </div>
                        <input type="hidden" name="videoSubject" id="videoSubject"
                            value="{{ $course->subject->subject_key }}">

                        <button type="submit" class="btn btn-dark">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://player.vimeo.com/api/player.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            var videoModal = document.getElementById('videoModal');
            var videoFrame = document.getElementById('videoFrame');

            videoModal.addEventListener('show.bs.modal', function (event) {
                var link = event.relatedTarget;
                var videoUrl = link.getAttribute('data-video');
                videoFrame.src = videoUrl;
            });

            videoModal.addEventListener('hidden.bs.modal', function () {
                videoFrame.src = ''; // stop video on close
            });
        });
    </script>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            var videoModal = document.getElementById('videoModal');
            var videoFrame = document.getElementById('videoFrame');
            var player;
            var targetTime = null;
            var videoId = null;

            // When video modal is opened
            videoModal.addEventListener('show.bs.modal', function (event) {
                var link = event.relatedTarget;
                var videoUrl = link.getAttribute('data-video');
                var minutes = parseInt(link.getAttribute('data-minutes'));
                var seconds = parseInt(link.getAttribute('data-seconds'));
                videoId = link.getAttribute('data-video-id');

                videoFrame.src = videoUrl;
                targetTime = (minutes * 60) + seconds;

                // Load Vimeo player
                player = new Vimeo.Player(videoFrame);

                // Track time
                player.on('timeupdate', function (data) {
                    if (data.seconds >= targetTime) {
                        player.pause();

                        // Show the specific MCQ modal if exists
                        var mcqModal = document.getElementById(`mcqModal${videoId}`);
                        if (mcqModal) {
                            new bootstrap.Modal(mcqModal).show();
                        }

                        player.off('timeupdate'); // Stop further tracking
                    }
                });
            });

            // Clear video when modal closes
            videoModal.addEventListener('hidden.bs.modal', function () {
                if (player) {
                    player.unload();
                }
                videoFrame.src = '';
            });
        });
    </script>

    <script>
        function checkAnswer(videoId) {
            const form = document.getElementById(`mcqForm${videoId}`);
            const correctOption = form.getAttribute('data-correct');
            const selected = form.querySelector('input[name="answer"]:checked');
            const resultMsg = document.getElementById(`resultMsg${videoId}`);
            const modalEl = document.getElementById(`mcqModal${videoId}`);
            const modal = bootstrap.Modal.getInstance(modalEl);

            if (!selected) {
                resultMsg.innerHTML = "<span class='text-danger'>Please select an answer!</span>";
                return;
            }

            if (selected.value === correctOption) {
                resultMsg.innerHTML = "<span class='text-success'>Correct Answer ✅</span>";
                setTimeout(() => {
                    modal.hide(); // close the modal
                }, 1000); // close after 1 sec so user can see message
            } else {
                resultMsg.innerHTML = "<span class='text-danger'>Wrong Answer ❌ Try again!</span>";
            }
        }

    </script>

@endsection