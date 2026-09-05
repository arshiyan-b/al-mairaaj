import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet as WalletIcon,
  CreditCard,
  ChevronDown,
  Smartphone,
  Building2,
  Loader2,
  ArrowLeft,
  Upload,
  Landmark,
  Search,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

const PAYMENT_METHODS = [
  { id: "easypaisa", label: "EasyPaisa", icon: Smartphone },
  { id: "jazzcash", label: "JazzCash", icon: Smartphone },
  { id: "bank", label: "Bank Transfer", icon: Building2 },
  { id: "kuickpay", label: "KuickPay", icon: CreditCard },
];

const BANK_NAMES = [
  "Allied Bank Limited (ABL)",
  "Askari Bank Limited",
  "Bank Al Habib Limited",
  "Bank Alfalah Limited",
  "Bank Makramah Limited",
  "Dubai Islamic Bank Pakistan Limited",
  "Faysal Bank Limited",
  "Habib Bank Limited (HBL)",
  "Habib Metropolitan Bank Limited",
  "JS Bank Limited",
  "MCB Bank Limited",
  "MCB Islamic Bank Limited",
  "Meezan Bank Limited",
  "National Bank of Pakistan (NBP)",
  "Samba Bank Limited",
  "Silkbank Limited",
  "Sindh Bank Limited",
  "Soneri Bank Limited",
  "Standard Chartered Bank (Pakistan) Limited",
  "The Bank of Khyber (BOK)",
  "The Bank of Punjab (BOP)",
  "United Bank Limited (UBL)",
  "Zarai Taraqiati Bank Limited (ZTBL)",
  "Industrial and Commercial Bank of China (ICBC) Pakistan",
  "Citibank N.A. Pakistan",
  "Deutsche Bank AG Pakistan",
];

// Platform's receiving account details shown to the student on Step 2.
// Replace these with your real account details (or fetch from an API).
const RECEIVING_ACCOUNTS = {
  easypaisa: {
    type: "mobile",
    accountTitle: "Kanwar Nomani",
    mobileNumber: "0336 3384821",
  },
  jazzcash: {
    type: "mobile",
    accountTitle: "Kanwar Nomani",
    mobileNumber: "0336 3384821",
  },
  bank: {
    type: "bank",
    accountTitle: "Kanwar Nomani",
    accountNumber: "0336 3384821",
    accountIBAN: "PK06 TMFB 0000000037875528",
    bankName: "Easy Paisa",
    branchCode: "",
  },
  kuickpay: null, // coming soon
};

const Topup = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stepper
  const [step, setStep] = useState(1);

  // Step 1 state
  const [amount, setAmount] = useState(PRESET_AMOUNTS[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id);

  // Step 2 state (per-method form fields)
  const [mobileNumber, setMobileNumber] = useState("");
  const [senderAccountName, setSenderAccountName] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankScreenshot, setBankScreenshot] = useState(null);
  const [bankScreenshotPreview, setBankScreenshotPreview] = useState(null);

  const [copiedField, setCopiedField] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Real DOM nodes for the file inputs — a File can only travel in a native form
  // submission via the actual <input type="file"> element the user picked it with,
  // not one JS reconstructs, so submit moves these nodes into a throwaway form.
  const screenshotInputRef = useRef(null);
  const bankScreenshotInputRef = useRef(null);

  const [bankSearch, setBankSearch] = useState("");
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);

  const filteredBanks = BANK_NAMES.filter((name) =>
    name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  useEffect(() => {
    let cancelled = false;

    fetch("/api/student/wallet-data", { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load wallet (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setWallet(data.wallet || { balance: 0, currency: "PKR" });
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWallet({ balance: 0, currency: "PKR" });
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currency = wallet?.currency || "PKR";
  const balance = Number(wallet?.balance ?? 0);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;
  const isValidAmount = Number.isFinite(effectiveAmount) && effectiveAmount > 0;

  const handlePreset = (value) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setCustomAmount(value);
  };

  const resetStep2Fields = () => {
    setMobileNumber("");
    setSenderAccountName("");
    setScreenshot(null);
    setScreenshotPreview(null);
    setBankAccountNumber("");
    setBankAccountName("");
    setBankName("");
    setBankScreenshot(null);
    setBankScreenshotPreview(null);
    setSubmitError(null);
  };

  const handleContinue = () => {
    if (!isValidAmount) return;
    resetStep2Fields();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSubmitError(null);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleBankScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBankScreenshot(file);
    const reader = new FileReader();
    reader.onload = () => setBankScreenshotPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCopy = async (field, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      // clipboard not available, ignore silently
    }
  };

  const isStep2Valid = () => {
    if (method === "easypaisa" || method === "jazzcash") {
      return mobileNumber.trim() && senderAccountName.trim() && screenshot;
    }
    if (method === "bank") {
      return (
        bankAccountNumber.trim() &&
        bankAccountName.trim() &&
        bankName.trim() &&
        bankScreenshot
      );
    }
    // kuickpay: not implemented yet
    return false;
  };

  // Appends a hidden field to a form being built for submission.
  const appendHiddenField = (form, name, value) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value ?? "";
    form.appendChild(input);
  };

  const handleSubmit = () => {
    if (!isStep2Valid() || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || "";
    const fileInput =
      method === "bank" ? bankScreenshotInputRef.current : screenshotInputRef.current;

    if (!fileInput || !fileInput.files?.[0]) {
      setSubmitError("Please attach a payment screenshot.");
      setSubmitting(false);
      return;
    }

    const form = document.createElement("form");
    form.action = "/api/student/topup-request";
    form.method = "POST";
    form.enctype = "multipart/form-data";
    form.style.display = "none";

    appendHiddenField(form, "_token", csrfToken);
    appendHiddenField(form, "payment_method", method === "bank" ? "bank" : method);
    appendHiddenField(form, "amount", effectiveAmount);

    if (method === "easypaisa" || method === "jazzcash") {
      appendHiddenField(form, "mobile_number", mobileNumber);
      appendHiddenField(form, "account_name", senderAccountName);
    } else if (method === "bank") {
      appendHiddenField(form, "bank_account_number", bankAccountNumber);
      appendHiddenField(form, "bank_account_name", bankAccountName);
      appendHiddenField(form, "bank_name", bankName);
    }

    // Move the actual file input (carrying its real FileList) into the form
    // so the browser submits the real screenshot file, not a JS-recreated one.
    fileInput.name = "screenshot";
    form.appendChild(fileInput);

    document.body.appendChild(form);
    form.submit(); // full browser navigation — follows the controller's redirect natively
  };

  if (loading) return <TopupSkeleton />;

  const receiving = RECEIVING_ACCOUNTS[method];
  const selectedMethodLabel = PAYMENT_METHODS.find((m) => m.id === method)?.label;

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen relative z-0">
      <motion.div
        className="text-left mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-700 to-indigo-700 text-transparent bg-clip-text">
          Top-up Wallet
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Add funds to your wallet to unlock courses and live classes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Current balance */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full min-h-[220px] p-6 rounded-xl shadow-md hover:shadow-xl border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col relative">
            <div className="flex items-center gap-2 absolute top-4 left-6">
              <WalletIcon className="h-5 w-5" />
              <span className="font-medium text-white/80">Current Balance</span>
            </div>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-0 gap-1">
              <div className="text-4xl md:text-5xl font-bold tracking-tight text-center">
                {currency} {balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Top-up form */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="h-full p-6 rounded-xl shadow-md hover:shadow-xl border-0 bg-white dark:bg-gray-800 flex flex-col">
            <CardHeader className="p-0 mb-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Add Funds
                </CardTitle>

                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  <StepDot active={step === 1} done={step > 1} label="1" />
                  <div className="w-6 h-px bg-gray-300 dark:bg-gray-600" />
                  <StepDot active={step === 2} done={false} label="2" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 flex flex-col gap-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Amount selection */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Choose an amount
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PRESET_AMOUNTS.map((value) => {
                          const isActive = !customAmount && amount === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handlePreset(value)}
                              className={`py-3 rounded-lg border text-sm font-semibold transition-colors ${
                                isActive
                                  ? "bg-indigo-600 border-indigo-600 text-white"
                                  : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-400"
                              }`}
                            >
                              {currency} {value}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-3">
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          Or enter a custom amount
                        </label>
                        <div className="mt-1 flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-3 py-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                            {currency}
                          </span>
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={customAmount}
                            onChange={handleCustomChange}
                            className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment method */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Payment method
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => {
                          const isActive = method === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setMethod(id)}
                              className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-colors ${
                                isActive
                                  ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                                  : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-400"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-auto pt-2">
                      <button
                        type="button"
                        onClick={handleContinue}
                        disabled={!isValidAmount}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 text-sm shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-6"
                  >
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 w-fit"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>

                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-indigo-50/60 dark:bg-indigo-900/10 p-3 text-sm text-gray-700 dark:text-gray-300">
                      Sending <span className="font-semibold">{currency} {effectiveAmount}</span> via{" "}
                      <span className="font-semibold">{selectedMethodLabel}</span>
                    </div>

                    {method === "kuickpay" && (
                      <div className="flex flex-col items-center justify-center text-center gap-2 py-10 text-gray-500 dark:text-gray-400">
                        <CreditCard className="h-8 w-8 opacity-50" />
                        <p className="text-sm font-medium">KuickPay is coming soon</p>
                        <p className="text-xs">Please choose another payment method for now.</p>
                      </div>
                    )}

                    {(method === "easypaisa" || method === "jazzcash") && receiving && (
                      <>
                        <ReceivingDetails title="Transfer to this account">
                          <DetailRow label="Account Title" value={receiving.accountTitle} />
                          <DetailRow
                            label="Mobile Number"
                            value={receiving.mobileNumber}
                            copyable
                            copied={copiedField === "mobileNumber"}
                            onCopy={() => handleCopy("mobileNumber", receiving.mobileNumber)}
                          />
                        </ReceivingDetails>

                        <div className="flex flex-col gap-4">
                          <FormField
                            label="Your Mobile Number"
                            value={mobileNumber}
                            onChange={setMobileNumber}
                            placeholder="03XX-XXXXXXX"
                          />
                          <FormField
                            label="Account Name"
                            value={senderAccountName}
                            onChange={setSenderAccountName}
                            placeholder="Name on the sending account"
                          />

                          <ScreenshotUpload
                            label="Payment Screenshot"
                            preview={screenshotPreview}
                            onChange={handleScreenshotChange}
                            inputRef={screenshotInputRef}
                          />
                        </div>
                      </>
                    )}

                    {method === "bank" && receiving && (
                      <>
                        <ReceivingDetails title="Transfer to this account">
                          <DetailRow label="Bank Name" value={receiving.bankName} />
                          <DetailRow label="Account Title" value={receiving.accountTitle} />
                          <DetailRow
                            label="Account Number"
                            value={receiving.accountNumber}
                            copyable
                            copied={copiedField === "accountNumber"}
                            onCopy={() => handleCopy("accountNumber", receiving.accountNumber)}
                          />
                          <DetailRow
                            label="IBAN"
                            value={receiving.accountIBAN}
                            copyable
                            copied={copiedField === "accountIBAN"}
                            onCopy={() => handleCopy("accountIBAN", receiving.accountIBAN)}
                          />
                          {receiving.branchCode && (
                            <DetailRow label="Branch Code" value={receiving.branchCode} />
                          )}
                        </ReceivingDetails>

                        <div className="flex flex-col gap-4">
                          <FormField
                            label="Your Account Number"
                            value={bankAccountNumber}
                            onChange={setBankAccountNumber}
                            placeholder="Account number you sent from"
                          />
                          <FormField
                            label="Your Account Name"
                            value={bankAccountName}
                            onChange={setBankAccountName}
                            placeholder="Name on the sending account"
                          />

                          <div className="relative">
                            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                              Your Bank Name
                            </label>

                            {/* Selected Bank */}
                            <button
                              type="button"
                              onClick={() => setBankDropdownOpen((prev) => !prev)}
                              className="w-full flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-indigo-400"
                            >
                              <span className={bankName ? "" : "text-gray-400"}>
                                {bankName || "Select your bank"}
                              </span>

                              <ChevronDown
                                size={16}
                                className={`transition-transform ${
                                  bankDropdownOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {/* Dropdown */}
                            {bankDropdownOpen && (
                              <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                                
                                {/* Search */}
                                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                  <div className="relative">
                                    <Search
                                      size={16}
                                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                      type="text"
                                      value={bankSearch}
                                      onChange={(e) => setBankSearch(e.target.value)}
                                      placeholder="Search bank..."
                                      autoFocus
                                      className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-indigo-400"
                                    />
                                  </div>
                                </div>

                                {/* Bank List */}
                                <div className="max-h-60 overflow-y-auto">
                                  {filteredBanks.length > 0 ? (
                                    filteredBanks.map((name) => (
                                      <button
                                        key={name}
                                        type="button"
                                        onClick={() => {
                                          setBankName(name);
                                          setBankDropdownOpen(false);
                                          setBankSearch("");
                                        }}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 ${
                                          bankName === name
                                            ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400"
                                            : "text-gray-900 dark:text-gray-100"
                                        }`}
                                      >
                                        {name}
                                      </button>
                                    ))
                                  ) : (
                                    <div className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
                                      No banks found
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <ScreenshotUpload
                            label="Payment Screenshot"
                            preview={bankScreenshotPreview}
                            onChange={handleBankScreenshotChange}
                            inputRef={bankScreenshotInputRef}
                          />
                        </div>
                      </>
                    )}

                    {submitError && <p className="text-sm text-red-500">{submitError}</p>}

                    {method !== "kuickpay" && (
                      <div className="mt-auto pt-2">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={!isStep2Valid() || submitting}
                          className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 text-sm shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>Submit Top-up Request</>
                          )}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

function StepDot({ active, done, label }) {
  return (
    <div
      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
        active
          ? "bg-indigo-600 border-indigo-600 text-white"
          : done
          ? "bg-indigo-100 border-indigo-300 text-indigo-700"
          : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400"
      }`}
    >
      {label}
    </div>
  );
}

function ReceivingDetails({ title, children }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/30">
      <div className="flex items-center gap-2 mb-3">
        <Landmark className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</p>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value, copyable, copied, onCopy }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-800 dark:text-gray-100">{value}</span>
        {copyable && (
          <button
            type="button"
            onClick={onCopy}
            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-indigo-400"
      />
    </div>
  );
}

function ScreenshotUpload({ label, preview, onChange, inputRef }) {
  return (
    <div>
      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">{label}</label>
      <label className="flex items-center justify-center gap-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-indigo-400 transition-colors">
        <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
        {preview ? (
          <img src={preview} alt="Screenshot preview" className="h-24 rounded-md object-cover" />
        ) : (
          <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Upload className="h-4 w-4" />
            Upload screenshot
          </span>
        )}
      </label>
    </div>
  );
}

function TopupSkeleton() {
  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Skeleton className="h-56 rounded-xl" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default Topup;