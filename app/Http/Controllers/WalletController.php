<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\Http\Requests\UpdateTopupRequestStatus;

use App\Services\VoucherService;
use App\Services\TopupRequestService;
use App\Services\WalletService;

use App\Models\Wallet;

class WalletController extends Controller
{
    protected $voucherService;
    protected $topupRequestService;
    protected $walletService;

    public function __construct(
        VoucherService $voucherService,
        TopupRequestService $topupRequestService,
        WalletService $walletService,
    ) {
        $this->voucherService = $voucherService;
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
    public function topup_request_update_status(UpdateTopupRequestStatus $request, $id)
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
    public function vouchers()
    {
        $vouchers = $this->voucherService->getVouchers();
        return view('admin.wallet.vouchers.index', compact('vouchers'));
    }
    public function voucher_show($id)
    {
        $voucher = $this->voucherService->getVoucher($id);
        return view('admin.wallet.vouchers.show', compact('voucher'));
    }
    public function voucher_store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:vouchers,code',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'expires_at' => 'nullable|date',
        ]);

        $this->voucherService->create($validated);

        return redirect()
            ->route('admin.vouchers.index')
            ->with('success', 'Voucher created successfully.');
    }
}