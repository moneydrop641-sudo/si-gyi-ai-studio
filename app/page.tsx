"use client";

import { useState, useRef } from "react";

const steps = [
  "Video ထည့်ရန်",
  "ဘာသာပြန်ရန်",
  "အသံရွေးရန်",
  "Video ပြင်ရန်",
  "Render",
  "Download",
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [sourceText, setSourceText] = useState("");
  const [translation, setTranslation] = useState("");
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState("");

  const [voice, setVoice] = useState("Nilar");
  const [subtitle, setSubtitle] = useState(true);
  const [blur, setBlur] = useState(false);
  const [flip, setFlip] = useState(false);
  const [crop, setCrop] = useState("Original");

  const fileInput = useRef<HTMLInputElement>(null);

  async function translateWithGemini() {
    if (!apiKey.trim()) {
      setTranslateError("Gemini API Key ထည့်ပေးပါ။");
      return;
    }

    if (!sourceText.trim()) {
      setTranslateError("ဘာသာပြန်မယ့် မူရင်းစာသား ထည့်ပါ။");
      return;
    }

    setTranslating(true);
    setTranslateError("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          text: sourceText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "ဘာသာပြန်မအောင်မြင်ပါ။"
        );
      }

      setTranslation(data.translatedText);
    } catch (error) {
      setTranslateError(
        error instanceof Error
          ? error.message
          : "Network error ဖြစ်နေပါတယ်။"
      );
    } finally {
      setTranslating(false);
    }
  }

  function nextStep() {
    if (step === 0 && !videoUrl.trim() && !videoFile) {
      alert("Video ဖိုင် သို့မဟုတ် Video Link ထည့်ပါ။");
      return;
    }

    if (step === 1 && !translation.trim()) {
      alert("မြန်မာဘာသာပြန်စာသား ထည့်ပါ။");
      return;
    }

    setStep((current) => Math.min(current + 1, 5));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  return (
    <main className="min-h-screen bg-[#08090b] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e8ff47]">
              AI VIDEO WORKSPACE
            </p>

            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
              Si Gyi{" "}
              <span className="text-[#e8ff47]">AI Studio</span>
            </h1>
          </div>

          <a
            href="https://t.me/SMITH_HH"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-[#303239] px-3 py-2 text-sm"
          >
            Admin ↗
          </a>
        </header>

        {/* Gemini API Key */}
        <section className="mb-6 rounded-2xl border border-[#303239] bg-[#111317] p-4 sm:p-5">
          <label className="mb-3 block text-sm font-semibold">
            🔑 Gemini API Key
          </label>

          <div className="flex gap-2">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Paste your Gemini API key"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-xl border border-[#303239] bg-[#090a0c] px-3 py-3 text-sm outline-none focus:border-[#e8ff47]"
            />

            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="rounded-xl border border-[#303239] px-3 text-sm"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>

          <p className="mt-2 text-xs text-[#92949c]">
            API Key ကို ဒီ Browser Session အတွင်းသာ အသုံးပြုပါ။
            အခြားသူများနှင့် မမျှဝေပါနှင့်။
          </p>
        </section>

        {/* Workflow */}
        <section className="rounded-2xl border border-[#303239] bg-[#111317] p-4 sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#e8ff47]">
                STEP {step + 1} / 6
              </p>

              <h2 className="mt-2 text-xl font-bold">
                {steps[step]}
              </h2>
            </div>

            <span className="rounded-lg bg-[#e8ff47] px-3 py-2 text-xs font-black text-black">
              {Math.round(((step + 1) / 6) * 100)}%
            </span>
          </div>

          <div className="mb-6 flex gap-1.5">
            {steps.map((item, index) => (
              <div
                key={item}
                className={`h-1.5 flex-1 rounded-full ${
                  index <= step
                    ? "bg-[#e8ff47]"
                    : "bg-[#303239]"
                }`}
              />
            ))}
          </div>

          {/* STEP 1 */}
          {step === 0 && (
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Video Link
              </label>

              <input
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="YouTube / TikTok / RedNote link"
                className="mb-4 w-full rounded-xl border border-[#303239] bg-[#090a0c] px-4 py-3 outline-none focus:border-[#e8ff47]"
              />

              <div className="rounded-xl border border-dashed border-[#454851] p-5 text-center">
                <p className="mb-3 text-sm text-[#92949c]">
                  သို့မဟုတ် ဖုန်းထဲမှ Video ဖိုင်ရွေးပါ
                </p>

                <input
                  ref={fileInput}
                  type="file"
                  accept="video/*"
                  onChange={(event) => {
                    setVideoFile(
                      event.target.files?.[0] || null
                    );
                  }}
                  className="w-full text-sm"
                />

                {videoFile && (
                  <p className="mt-3 break-all text-sm text-[#e8ff47]">
                    ✓ {videoFile.name}
                  </p>
                )}
              </div>

              <p className="mt-3 text-xs text-[#92949c]">
                မှတ်ချက် — Video Link ကို အလိုအလျောက် Download
                လုပ်တဲ့စနစ် မချိတ်ဆက်ရသေးပါ။
              </p>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div>
              <label className="mb-2 block text-sm font-semibold">
                မူရင်းစာသား
              </label>

              <textarea
                value={sourceText}
                onChange={(event) => setSourceText(event.target.value)}
                placeholder="ဘာသာပြန်လိုတဲ့ မူရင်းစာသား ထည့်ပါ..."
                rows={5}
                className="mb-4 w-full rounded-xl border border-[#303239] bg-[#090a0c] p-4 outline-none focus:border-[#e8ff47]"
              />

              <button
                type="button"
                onClick={translateWithGemini}
                disabled={translating}
                className="w-full rounded-xl bg-[#e8ff47] px-4 py-3 font-bold text-black disabled:opacity-50"
              >
                {translating
                  ? "ဘာသာပြန်နေသည်..."
                  : "🌐 Translate with Gemini"}
              </button>

              {translateError && (
                <p className="mt-3 break-words text-sm text-red-400">
                  {translateError}
                </p>
              )}

              <label className="mb-2 mt-5 block text-sm font-semibold">
                မြန်မာဘာသာပြန်ရလဒ်
              </label>

              <textarea
                value={translation}
                onChange={(event) => setTranslation(event.target.value)}
                placeholder="ဘာသာပြန်ရလဒ် ဒီမှာပေါ်လာမယ်..."
                rows={6}
                className="w-full rounded-xl border border-[#303239] bg-[#090a0c] p-4 outline-none focus:border-[#e8ff47]"
              />
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div>
              <p className="mb-3 text-sm text-[#92949c]">
                မြန်မာအသံ ရွေးချယ်ပါ
              </p>

              <div className="grid grid-cols-2 gap-3">
                {["Nilar", "Thiha"].map((name) => (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setVoice(name)}
                    className={`rounded-xl border p-5 text-left ${
                      voice === name
                        ? "border-[#e8ff47] bg-[#e8ff47]/10"
                        : "border-[#303239] bg-[#090a0c]"
                    }`}
                  >
                    <span className="block text-lg font-bold">
                      {name}
                    </span>

                    <span className="mt-1 block text-xs text-[#92949c]">
                      Myanmar Voice
                    </span>

                    {voice === name && (
                      <span className="mt-3 block text-xs text-[#e8ff47]">
                        ✓ Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-xs text-[#92949c]">
                Nilar / Thiha TTS အသံဖိုင်ထုတ်လုပ်ရန်
                Text-to-Speech စနစ်ကို ထပ်ချိတ်ဆက်ရပါမည်။
              </p>
            </div>
          )}

          {/* STEP 4 */}
          {step === 3 && (
            <div className="space-y-4">
              <Toggle
                label="MMSub Subtitle"
                description="မြန်မာစာတန်းထိုးရန်"
                checked={subtitle}
                onChange={setSubtitle}
              />

              <Toggle
                label="Blur Effect"
                description="Video Blur ပြုလုပ်ရန်"
                checked={blur}
                onChange={setBlur}
              />

              <Toggle
                label="Flip Video"
                description="Video ကို ဘယ်ညာလှန်ရန်"
                checked={flip}
                onChange={setFlip}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Crop Ratio
                </label>

                <select
                  value={crop}
                  onChange={(event) => setCrop(event.target.value)}
                  className="w-full rounded-xl border border-[#303239] bg-[#090a0c] px-3 py-3"
                >
                  <option value="Original">Original</option>
                  <option value="9:16">9:16 — TikTok / Reels</option>
                  <option value="16:9">16:9 — YouTube</option>
                  <option value="1:1">1:1 — Square</option>
                </select>
              </div>

              <p className="text-xs text-[#92949c]">
                ဒီရွေးချယ်မှုတွေက လက်ရှိမှာ Setting UI ဖြစ်ပါတယ်။
                Video ပေါ်မှာ သက်ရောက်စေရန် Rendering စနစ် လိုအပ်ပါတယ်။
              </p>
            </div>
          )}

          {/* STEP 5 */}
          {step === 4 && (
            <div className="py-6 text-center">
              <div className="mb-4 text-4xl">⚙️</div>

              <h3 className="text-lg font-bold">
                Render Configuration
              </h3>

              <div className="mx-auto mt-5 max-w-sm space-y-2 rounded-xl border border-[#303239] bg-[#090a0c] p-4 text-left text-sm">
                <p>Video: {videoFile?.name || videoUrl || "မထည့်ရသေး"}</p>
                <p>Voice: {voice}</p>
                <p>MMSub: {subtitle ? "On" : "Off"}</p>
                <p>Blur: {blur ? "On" : "Off"}</p>
                <p>Flip: {flip ? "On" : "Off"}</p>
                <p>Crop: {crop}</p>
              </div>

              <p className="mt-4 text-xs text-[#92949c]">
                FFmpeg Rendering မချိတ်ဆက်ရသေးပါ။
                ယခုအဆင့်တွင် Video ကို အမှန်တကယ် Render မလုပ်သေးပါ။
              </p>
            </div>
          )}

          {/* STEP 6 */}
          {step === 5 && (
            <div className="py-8 text-center">
              <div className="mb-4 text-5xl">📥</div>

              <h3 className="text-xl font-bold">
                Download Video
              </h3>

              <p className="mt-3 text-sm text-[#92949c]">
                Download လုပ်နိုင်မယ့် Output Video ကို
                ရရှိရန် Render စနစ် ချိတ်ဆက်ဖို့ လိုအပ်ပါတယ်။
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-7 flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={previousStep}
                className="rounded-xl border border-[#303239] px-5 py-3 text-sm font-semibold"
              >
                ← Back
              </button>
            )}

            {step < 5 && (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 rounded-xl bg-[#e8ff47] px-5 py-3 font-bold text-black"
              >
                Continue →
              </button>
            )}
          </div>
        </section>

        <footer className="pb-5 pt-5 text-center text-xs text-[#777982]">
          Si Gyi AI Studio · Admin{" "}
          <a
            href="https://t.me/SMITH_HH"
            target="_blank"
            rel="noreferrer"
            className="text-[#e8ff47]"
          >
            @SMITH_HH
          </a>
        </footer>
      </div>
    </main>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#303239] bg-[#090a0c] p-4 text-left"
    >
      <span>
        <span className="block font-semibold">{label}</span>
        <span className="mt-1 block text-xs text-[#92949c]">
          {description}
        </span>
      </span>

      <span
        className={`h-6 w-11 shrink-0 rounded-full p-1 ${
          checked ? "bg-[#e8ff47]" : "bg-[#454851]"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}