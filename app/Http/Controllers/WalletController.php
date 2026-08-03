<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateTopupRequestStatus;

use App\Services\TopupRequestService;
use App\Services\WalletService;

use App\Models\Batch;
use App\Models\Board;
use App\Models\CurriculumSubject;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\LiveClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\TopupRequest;
use App\Models\Wallet;
use App\Models\WalletTransaction;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class WalletController extends Controller
{
    protected $topupRequestService;
    protected $walletService;

    public function __construct(
        TopupRequestService $topupRequestService,
        WalletService $walletService,
    ) {
        $this->topupRequestService = $topupRequestService;
        $this->walletService = $walletService;
    }
    public function index()
    {
        $wallets = Wallet::all();
        return view("admin.wallet.index", compact('wallets'));
    }
    public function topup_requests()
    {
        $topup_requests = $this->topupRequestService->getTopupRequests();
        return view("admin.wallet.topup_requests.index", compact('topup_requests'));
    }
    public function topup_request_details($id)
    {
        $topup_request = $this->topupRequestService->getTopupRequest($id);
        return view("admin.wallet.topup_requests.details", compact('topup_request'));
    }
    public function topup_request_screenshot($id)
    {
        $topup_request = $this->topupRequestService->getTopupRequest($id);
        if ($topup_request && $topup_request->screenshot) {
            return response()->file(storage_path('app/private/' . $topup_request->screenshot));
        } else {
            abort(404, 'Screenshot not found.');
        }
    }
    public function update_topup_request_status(UpdateTopupRequestStatus $request, $id)
    {
        $topupRequest = $this->topupRequestService->getTopupRequest($id);

        $this->topupRequestService->updateStatus(
            $topupRequest,
            $request->validated()['status']
        );

        return redirect()
            ->route('admin.top-up.request.details', $id)
            ->with('success', 'Top-up request status updated successfully.');
    }
}