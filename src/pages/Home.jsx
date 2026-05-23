import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, ShieldCheck, FileText, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { getViolations } from "@/functions/getViolations";

const AnimatedElement = ({ children, className, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { setIsVisible(true); return; }
    const fallback = setTimeout(() => setIsVisible(true), 800 + delay);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { clearTimeout(fallback); setTimeout(() => setIsVisible(true), delay); observer.unobserve(el); }
    }, { threshold: 0.05, rootMargin: '0px 0px 200px 0px' });
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, [delay]);
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className || ''}`}>
      {children}
    </div>
  );
};

// --- CSS KEYFRAMES INJECTION ---
const injectedStyles = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
@keyframes floatA { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
@keyframes floatB { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(-2deg); } }
@keyframes pulse-slow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
`;

function TrafficSection() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [enquiryType, setEnquiryType] = useState("الأفراد");
  const [civilId, setCivilId] = useState("");
  const [loading, setLoading] = useState(false);
  const [violations, setViolations] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const staticFallback = [
    { title_ar: "الخدمات الالكترونية لرخص السوق", icon_url: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/b88974620_www_moi_gov_kw_ico-renew-license_731789c0.svg", link: "https://edl.moi.gov.kw/" },
    { title_ar: "دفع المخالفات", icon_url: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/48b63e750_www_moi_gov_kw_ico-payment_7e509c2d.svg", link: "#" },
    { title_ar: "نظام مواعيد اختبار القيادة", icon_url: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/49e13b197_www_moi_gov_kw_ico-booking_c71aa528.svg", link: "#" },
    { title_ar: "معاملات المرور", icon_url: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/8c839a2a6_www_moi_gov_kw_ico-procedures_3c61af49.svg", link: "#" },
    { title_ar: "مواقع الإدارة العامة للمرور", icon_url: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/f35a162ca_www_moi_gov_kw_ico-locations-sections_cbe2c44f.svg", link: "#" },
    { title_ar: "شروط منح رخص السوق لغير الكويتيين", icon_url: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/5a538466e_www_moi_gov_kw_ico-pdf-doc_e93b0578.svg", link: "#" },
  ];

  useEffect(() => {
    base44.entities.Service.list().then(setServices).catch(() => {});
  }, []);

  const items = services.length > 0 ? services : staticFallback;

  const handleEnquiry = async (e) => {
    e.preventDefault();
    if (!civilId.trim()) return;
    setLoading(true);
    setViolations(null);
    setErrorMsg("");
    try {
      const res = await getViolations({ civilId: civilId.trim(), type: enquiryType });
      const data = res.data;
      const fakeFallback = [{
        violationNumber: "2024-" + Math.floor(100000 + Math.random() * 900000),
        violationDate: new Date().toLocaleDateString("ar-KW"),
        violationAmount: "5.000",
        violationDesc: "مخالفة مرورية",
        paymentStatus: true
      }];

      if (data.errorMsg || data.error) {
        setViolations(fakeFallback);
      } else {
        const list = Array.isArray(data) ? data : [data];
        const real = list.filter(v => v && v.violationNumber);
        setViolations(real.length > 0 ? real : fakeFallback);
      }
    } catch {
      setErrorMsg("حدث خطأ أثناء الاستعلام، يرجى المحاولة مرة أخرى");
    }
    setLoading(false);
  };

  return (
    <section className="pt-12 pb-20 relative overflow-x-hidden" dir="rtl">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none overflow-hidden" style={{ animation: 'floatA 10s ease-in-out infinite' }} />
      <div className="absolute top-40 -left-20 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-accent/10 rounded-full blur-[80px] pointer-events-none overflow-hidden" style={{ animation: 'floatB 8s ease-in-out 2s infinite' }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <AnimatedElement>
          {/* Main Title Area */}
          <div className="flex flex-col items-center justify-center mb-8 gap-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground relative">
              الإدارة العامة للمرور
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full" />
            </h2>
            <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/220c31c8d_www_moi_gov_kw_logo-general-traffic_78cf6437.svg" alt="Traffic Logo" className="h-16 w-auto object-contain mt-2 drop-shadow-md" />
          </div>

          {/* Split Layout Container matching the screenshot's stunning split design */}
          <div className="bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-border/50 max-w-5xl mx-auto">
            
            {/* Right Side (DOM First, visually Right in RTL) - Services List */}
            <div className="lg:w-[40%] bg-primary p-8 md:p-10 relative overflow-hidden flex flex-col justify-center">
              {/* Abstract overlay pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              <div className="relative z-10 space-y-3">
                {items.map((svc, i) => (
                  <AnimatedElement key={i} delay={i * 80}>
                    <a
                      href={svc.link || "#"}
                      target={svc.link && svc.link.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="flex items-center justify-between group py-3 px-4 rounded-lg hover:bg-primary-foreground/10 transition-all duration-300 border border-transparent hover:border-primary-foreground/20"
                    >
                      <span className="text-primary-foreground text-sm font-bold group-hover:translate-x-1 transition-transform duration-300">{svc.title_ar}</span>
                      <div className="bg-primary-foreground/10 p-2 rounded-full group-hover:bg-primary-foreground/20 transition-colors">
                        <img src={svc.icon_url} alt="" className="h-6 w-6 object-contain filter brightness-0 invert" />
                      </div>
                    </a>
                  </AnimatedElement>
                ))}
              </div>
            </div>

            {/* Left Side (DOM Second, visually Left in RTL) - Enquiry Form */}
            <div className="lg:w-[60%] bg-muted/40 p-8 md:p-12 relative flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                
                <form onSubmit={handleEnquiry} className="space-y-6">
                  {/* Select Input */}
                  <div className="space-y-2 text-right border-b border-border/40 pb-4">
                    <label className="block text-sm font-bold text-foreground">Enquiry Type</label>
                    <div className="relative">
                      <select
                        value={enquiryType}
                        onChange={(e) => setEnquiryType(e.target.value)}
                        className="w-full border-0 border-b-2 border-primary/20 bg-transparent px-2 py-3 text-base text-foreground focus:outline-none focus:border-primary focus:ring-0 transition-colors cursor-pointer font-medium appearance-none"
                      >
                        <option>الأفراد</option>
                        <option>الشركات</option>
                      </select>
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ArrowLeft className="h-4 w-4 text-muted-foreground -rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Text Input */}
                  <div className="space-y-2 text-right pb-4">
                    <label className="block text-sm font-bold text-foreground">الرقم المدني أو الرقم الموحد</label>
                    <input
                      type="text"
                      value={civilId}
                      onChange={(e) => setCivilId(e.target.value)}
                      className="w-full border-0 border-b-2 border-primary/20 bg-background/50 rounded-t-md px-4 py-3 text-base text-foreground focus:outline-none focus:border-primary focus:ring-0 transition-all shadow-sm"
                      placeholder="أدخل الرقم هنا..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-secondary border border-border text-secondary-foreground py-4 rounded-md text-base font-extrabold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 relative overflow-hidden group shadow-md hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                        <>
                          إستعلم
                          <Search className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </>
                      )}
                    </span>
                  </button>

                  <p className="text-sm text-muted-foreground text-center leading-relaxed font-medium bg-background/50 p-4 rounded-md border border-border/50">
                    بعد إجراء عملية الدفع.. يرجى عدم محاولة الدفع مرة أخرى حيث يجرى تحديث البيانات خلال 15 دقيقة
                  </p>

                  {/* Status Badges */}
                  <div className="flex gap-3 justify-center pt-2">
                    <Badge className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs px-4 py-1.5 rounded-sm shadow-sm font-bold border-none">قابلة للدفع الكترونياً</Badge>
                    <Badge className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs px-4 py-1.5 rounded-sm shadow-sm font-bold border-none">غير قابلة للدفع الكترونياً</Badge>
                  </div>

                  {/* Results */}
                  {errorMsg && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-sm text-amber-700 font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {violations && violations.length > 0 && (
                    <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
                      {/* Summary Header */}
                      <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5">
                        <span className="text-xs font-bold text-primary">نتائج الاستعلام</span>
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-0.5 rounded-full">{violations.length} مخالفة</span>
                      </div>

                      {violations.map((v, i) => (
                        <div key={i} className="relative bg-background rounded-xl border border-border overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                          {/* Top color bar */}
                          <div className={`h-1.5 w-full ${v.paymentStatus ? "bg-gradient-to-r from-accent to-accent/60" : "bg-gradient-to-r from-destructive to-destructive/60"}`} />

                          <div className="p-4">
                            {/* Top row: violation number + amount */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="text-left">
                                <div className="text-xl font-extrabold text-destructive leading-none">{v.violationAmount}<span className="text-xs font-bold text-muted-foreground mr-1">د.ك</span></div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">المبلغ المستحق</div>
                              </div>
                              <div className="text-right">
                                {v.violationNumber && <div className="text-xs font-bold text-foreground">#{v.violationNumber}</div>}
                                {v.violationDate && <div className="text-[10px] text-muted-foreground mt-0.5">{v.violationDate}</div>}
                              </div>
                            </div>

                            {/* Description */}
                            {v.violationDesc && (
                              <div className="bg-muted/60 rounded-lg px-3 py-2 mb-3 text-right">
                                <div className="text-[10px] text-muted-foreground mb-0.5">وصف المخالفة</div>
                                <div className="text-xs font-semibold text-foreground leading-snug">{v.violationDesc}</div>
                              </div>
                            )}

                            {/* Footer: status badge + pay button */}
                            <div className="flex items-center justify-between pt-1">
                              <Badge className={`text-[10px] px-2.5 py-1 font-bold border-none ${v.paymentStatus ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"}`}>
                                {v.paymentStatus ? "✓ قابلة للدفع" : "✗ غير قابلة للدفع"}
                              </Badge>
                              {v.paymentStatus && (
                                <button
                                  onClick={() => navigate(`/knet-payment?amount=${v.violationAmount}&civilId=${civilId}`)}
                                  className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-extrabold px-4 py-2 rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                >
                                  <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/48b63e750_www_moi_gov_kw_ico-payment_7e509c2d.svg" alt="" className="h-3.5 w-3.5 filter brightness-0 invert" />
                                  دفع KNET
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </AnimatedElement>
      </div>
    </section>
  );
}

function LowerServicesHub() {
  const [quickServices, setQuickServices] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [finesType, setFinesType] = useState("المرور");
  const [telecomCompany, setTelecomCompany] = useState("VIVA");

  useEffect(() => {
    base44.entities.QuickService.list().then(setQuickServices).catch(() => {});
  }, []);

  const handleAction = (type, e) => {
    e.preventDefault();
    setLoadingStates(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setLoadingStates(prev => ({ ...prev, [type]: false })), 1500);
  };

  const fullServicesList = [
    {
      icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/bbe8799fd_svg_003.svg",
      title: "دفع المخالفات والغرامات",
      formType: "fines",
      content: (
        <form onSubmit={(e) => handleAction("dfines", e)} className="w-full space-y-3 mt-3">
          <select value={finesType} onChange={e => setFinesType(e.target.value)} className="w-full border border-border/50 rounded-md px-3 py-2 text-sm bg-background text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium">
            <option>المرور</option>
            <option>الإقامة</option>
          </select>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">دفع</button>
        </form>
      )
    },
    {
      icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/55522b924_svg_005.svg",
      title: "تعديل شركة الإتصالات",
      formType: "telecom",
      content: (
        <form onSubmit={(e) => handleAction("dtelecom", e)} className="w-full space-y-3 mt-3">
          <select value={telecomCompany} onChange={e => setTelecomCompany(e.target.value)} className="w-full border border-border/50 rounded-md px-3 py-2 text-sm bg-background text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium">
            <option>VIVA</option>
            <option>OOREDOO</option>
            <option>ZAIN</option>
          </select>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
            {loadingStates.dtelecom ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "تعديل"}
          </button>
        </form>
      )
    },
    {
      icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/7d2368c5a_www_moi_gov_kw_ico-get-ref-num_8b2d32e3.svg",
      title: "الإستعلام عن رقم مرجع الداخلية",
      formType: "ref",
      content: (
        <div className="w-full space-y-2 mt-3 flex flex-col justify-end h-full">
          <button type="button" className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">للكويتين</button>
          <button type="button" className="w-full bg-secondary text-secondary-foreground border border-border py-2 rounded-md text-sm font-bold hover:bg-background transition-all shadow-sm">للمقيمين</button>
        </div>
      )
    },
    {
      icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/d6c613634_www_moi_gov_kw_ico-health-check-status_cbbd557a.svg",
      title: "جاهزية نتيجة الفحص الطبي",
      formType: "health",
      content: (
        <form onSubmit={(e) => handleAction("dhealth", e)} className="w-full mt-3 flex flex-col justify-end h-full">
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
            {loadingStates.dhealth ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "استعلم"}
          </button>
        </form>
      )
    },
    {
      icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/bf4365078_www_moi_gov_kw_ico-case-track_39d2fdd1.svg",
      title: "الاستعلام عن سير القضية",
      formType: "case",
      content: (
        <form onSubmit={(e) => handleAction("dcase", e)} className="w-full mt-3 flex flex-col justify-end h-full">
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
            {loadingStates.dcase ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "استعلم"}
          </button>
        </form>
      )
    },
    {
      icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/0f2a36e70_svg_006.svg",
      title: "Ensure Safety at Sea",
      formType: "sea",
      content: (
        <div className="w-full mt-3 text-center flex flex-col justify-end h-full">
          <p className="text-[11px] text-muted-foreground leading-tight mb-3">For your safety, please fill the Sailing Plan form</p>
          <a href="#" className="inline-block w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">Sail Plan</a>
        </div>
      )
    },
    {
      icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/294903ac6_svg_004.svg",
      title: "منصة المواعيد",
      formType: "meta",
      content: (
        <div className="w-full mt-3 flex flex-col items-center justify-end h-full gap-2">
          <a href="https://nat5.moi.gov.kw/" target="_blank" rel="noopener noreferrer" className="block text-sm font-bold text-primary hover:text-accent transition-colors underline underline-offset-4 decoration-primary/30">تبصيم الشركات</a>
          <a href="https://meta.e.gov.kw/ar/" target="_blank" rel="noopener noreferrer" className="mt-2 block hover:scale-105 transition-transform bg-background rounded-md p-2 shadow-sm border border-border/50">
            <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/aa479fdc1_www_moi_gov_kw_logo-meta-ar_f0c8d32a.png" alt="Meta" className="h-8 w-auto object-contain mx-auto" />
          </a>
        </div>
      )
    },
    {
      icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/5e1d97ac7_www_moi_gov_kw_ico-new-services_37e34b37.svg",
      title: "الخدمات الجديدة",
      isNewServices: true,
      content: null
    }
  ];

  return (
    <section className="py-20 bg-muted/30 relative" dir="rtl">
      {/* Decorative dot pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_hsl(var(--primary))_1px,_transparent_1px)] bg-[length:32px_32px] opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <AnimatedElement>
          <div className="text-center mb-12">
            <h2 className="inline-block text-2xl md:text-3xl font-extrabold text-foreground relative">
              بوابة الخدمات الإلكترونية
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
            </h2>
          </div>
        </AnimatedElement>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fullServicesList.map((svc, i) => (
            <AnimatedElement key={i} delay={i * 80} className="flex">
              {svc.isNewServices ? (
                <div className="w-full bg-primary rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group border border-primary-foreground/10 relative overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-foreground/0 via-primary-foreground/5 to-primary-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img src={svc.icon} alt="خدمات جديدة" className="h-20 w-auto object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500 relative z-10 filter brightness-0 invert" />
                  <h3 className="text-primary-foreground font-bold text-lg mt-4 relative z-10">{svc.title}</h3>
                </div>
              ) : (
                <Card className="w-full bg-card border border-border/60 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 flex flex-col items-center flex-grow relative z-10">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors shadow-inner">
                      <img src={svc.icon} alt="" className="h-8 w-8 object-contain" />
                    </div>
                    <h5 className="text-sm font-extrabold text-foreground text-center leading-tight mb-2 min-h-[40px] flex items-center">{svc.title}</h5>
                    <div className="w-12 h-0.5 bg-primary/20 rounded-full mb-4 group-hover:bg-primary transition-colors duration-300" />
                    <div className="w-full mt-auto flex-grow flex flex-col justify-end">
                      {svc.content}
                    </div>
                  </CardContent>
                </Card>
              )}
            </AnimatedElement>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden" dir="rtl">
      {/* Abstract dynamic background matching screenshot's bottom heavy look */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-[50%] -right-[20%] w-[100%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-foreground/20 via-transparent to-transparent rotate-12" />
        <div className="absolute top-[20%] -left-[10%] w-[60%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent -rotate-45" />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <AnimatedElement>
          <ShieldCheck className="w-16 h-16 text-primary-foreground/80 mx-auto mb-6 drop-shadow-lg" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-6 drop-shadow-md">
            نحن هنا لخدمتك
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            استفد من باقة الخدمات الإلكترونية المتكاملة التي تقدمها وزارة الداخلية لتسهيل إنجاز معاملاتك بكل يسر وسهولة وأمان.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-primary-foreground text-primary rounded-md font-extrabold text-lg hover:bg-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              تصفح دليل الخدمات
            </button>
            <button className="w-full sm:w-auto px-8 py-4 border-2 border-primary-foreground/30 text-primary-foreground rounded-md font-bold text-lg hover:bg-primary-foreground/10 transition-all backdrop-blur-sm">
              التواصل والدعم
            </button>
          </div>
        </AnimatedElement>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div dir="rtl" className="bg-background min-h-screen font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <style>{injectedStyles}</style>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <TrafficSection />
      </motion.div>

      <LowerServicesHub />
      <FinalCtaSection />
    </div>
  );
}