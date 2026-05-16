import React, { useState, useEffect } from "react";
import { MessageSquare, X, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ReviewBubble = () => {
  const { getTranslated } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // --- თარგმანების ობიექტები ---
  const tTitle = {
    ge: "როგორ მოგეწონათ ჩვენი მენიუ?",
    en: "How did you like our menu?",
    de: "Wie hat Ihnen unsere Speisekarte gefallen?",
    ru: "Как вам наше меню?"
  };

  const tSub = {
    ge: "თქვენი აზრი ჩვენთვის მნიშვნელოვანია",
    en: "Your opinion matters to us",
    de: "Ihre Meinung ist uns wichtig",
    ru: "Ваше мнение важно для нас"
  };

  const tPlaceholder = {
    ge: "დაწერეთ თქვენი შთაბეჭდილება...",
    en: "Write your impression...",
    de: "Schreiben Sie Ihren Eindruck...",
    ru: "Напишите свое впечатление..."
  };

  const tSuccessTitle = {
    ge: "მადლობა შეფასებისთვის!",
    en: "Thanks for the review!",
    de: "Vielen Dank für die Bewertung!",
    ru: "Спасибо за отзыв!"
  };

  const tSuccessSub = {
    ge: "თქვენი აზრი წარმატებით გაიგზავნა.",
    en: "Your feedback has been successfully sent.",
    de: "Ihr Feedback wurde erfolgreich gesendet.",
    ru: "Ваш отзыв был успешно отправлен."
  };

  const tBtnSend = {
    ge: "გაგზავნა",
    en: "Send",
    de: "Senden",
    ru: "Отправить"
  };

  // სწრაფი თეგები სხვადასხვა ენაზე
  const quickTags = [
    { ge: "გემრიელია 😋", en: "Delicious 😋", de: "Lecker 😋", ru: "Вкусно 😋" },
    { ge: "სწრაფია ⚡", en: "Fast ⚡", de: "Schnell ⚡", ru: "Быстро ⚡" },
    { ge: "კარგი სერვისია 👍", en: "Great service 👍", de: "Toller Service 👍", ru: "Отличный сервис 👍" }
  ];

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("https://backend-uiw0.onrender.com/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        setSuccess(true);
        setText("");
      }
    } catch (err) {
      console.error("Review error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans antialiased">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <MessageSquare className="h-6 w-6 transition-transform group-hover:rotate-12" />
        </button>
      )}

      {/* Review Box */}
      {isOpen && (
        <div className="w-[calc(100vw-32px)] max-w-[360px] overflow-hidden rounded-2xl border border-border/50 bg-background/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div>
              <h3 className="font-semibold text-foreground text-base tracking-tight">
                {getTranslated(tTitle)}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {getTranslated(tSub)}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95 duration-300">
              <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500 mb-3">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="text-sm font-medium text-foreground">{getTranslated(tSuccessTitle)}</p>
              <p className="text-xs text-muted-foreground mt-1">{getTranslated(tSuccessSub)}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4">
              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={getTranslated(tPlaceholder)}
                  maxLength={400}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-secondary/30 p-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50"
                  disabled={loading}
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] font-medium text-muted-foreground/60">
                  {text.length}/400
                </span>
              </div>

              {/* Dynamic Quick Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {quickTags.map((tagObj, index) => {
                  const translatedTag = getTranslated(tagObj);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setText((prev) => (prev ? `${prev} ${translatedTag}` : translatedTag))}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {translatedTag}
                    </button>
                  );
                })}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <>
                    <span>{getTranslated(tBtnSend)}</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewBubble;
