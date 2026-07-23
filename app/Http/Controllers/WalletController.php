<?php

namespace App\Http\Controllers;

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
    public function index()
    {
        $wallets = Wallet::all();
        return view("admin.wallet.index", compact('wallets'));
    }

    public function top_up_requests()
    {
        $topup_requests = WalletTransaction::all();
        return view("admin.wallet.top-up.requests", compact('topup_requests'));
    }
}