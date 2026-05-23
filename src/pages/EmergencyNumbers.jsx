import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

const emergencyNumbers = [
  { dept: "الشرطة، الإسعاف و قوة الإطفاء", numbers: ["112"], whatsapp: null, isEmergency: true },
  { dept: "الدفاع المدني", numbers: ["1804000"], whatsapp: null },
  { dept: "إدارة الجرائم الإلكترونية", numbers: ["97283939"], whatsapp: "https://wa.me/+96597283939" },
  { dept: "الإدارة العامة لحماية الأحداث", numbers: ["25589535", "97283636"], whatsapp: null },
  { dept: "الإدارة العامة لمكافحة المخدرات", numbers: ["1884141"], whatsapp: null },
  { dept: "الإدارة العامة لخفر السواحل", numbers: ["1880888"], whatsapp: null },
  { dept: "الإدارة العامة للمرور", numbers: ["99324092"], whatsapp: "https://wa.me/+96599324092" },
  { dept: "الإدارة العامة للرقابة والتفتيش", numbers: ["25200334"], whatsapp: null },
  { dept: "الإدارة العامة لشؤون الإقامة", numbers: ["25582960", "25582961", "97288200", "97288211"], whatsapp: "https://wa.me/+96597288200" },
  { dept: "إدارة حماية الآداب العامة ومكافحة الإتجار بالأشخاص", numbers: ["25589648", "25589655", "25589696"], whatsapp: null },
];

export default function EmergencyNumbers() {
  return (
    <div dir="rtl" className="bg-background min-h-screen">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero */}
      <section className="bg-primary py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")' }} />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary-foreground/20 rounded-full p-2">
                <Phone className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-primary-foreground text-xl font-bold leading-tight">أرقام الطوارئ</h1>
                <p className="text-primary-foreground/70 text-xs">وزارة الداخلية - دولة الكويت</p>
              </div>
            </div>
            <div className="mt-3 bg-destructive/20 border border-destructive/30 rounded-sm px-4 py-2 inline-block">
              <p className="text-primary-foreground text-xs">في حالات الطوارئ القصوى اتصل بـ <span className="font-bold text-lg">112</span></p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency number highlight */}
      <section className="py-6 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedElement>
            <Card className="bg-destructive/10 border-destructive/20 rounded-sm shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-destructive" />
                  <div>
                    <div className="text-sm font-bold text-foreground">الشرطة، الإسعاف و قوة الإطفاء</div>
                    <div className="text-xs text-muted-foreground">للطوارئ فقط</div>
                  </div>
                </div>
                <a href="tel:112" className="text-3xl font-bold text-destructive hover:text-destructive/80 transition-colors">112</a>
              </CardContent>
            </Card>
          </AnimatedElement>
        </div>
      </section>

      {/* All Numbers */}
      <section className="py-6 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedElement>
            <div className="text-end mb-4">
              <h2 className="text-sm font-bold text-foreground">أرقام الإدارات</h2>
              <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/488c86d53_www_moi_gov_kw_ico-horizontal-bar_84f2249f.svg" alt="" className="h-2 w-16 object-contain ms-auto mt-1" />
            </div>
          </AnimatedElement>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyNumbers.filter(e => !e.isEmergency).map((item, i) => (
              <AnimatedElement key={i} delay={i * 70}>
                <Card className="bg-card border-border rounded-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1.5 items-start">
                        {item.numbers.map((num, ni) => (
                          <div key={ni} className="flex items-center gap-2">
                            <a href={`tel:${num}`} className="text-primary font-bold text-sm hover:underline ltr:block" dir="ltr">{num}</a>
                            {item.whatsapp && ni === 0 && (
                              <a href={item.whatsapp} target="_blank" rel="noopener noreferrer">
                                <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/20add913f_www_moi_gov_kw_ico-whatsapp_9510a1c8.svg" alt="WhatsApp" className="h-4 w-4 object-contain" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="text-end">
                        <p className="text-xs font-semibold text-foreground leading-snug">{item.dept}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-6 bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedElement>
            <div className="text-center">
              <h3 className="text-primary-foreground text-sm font-bold mb-2">تحميل تطبيق وزارة الداخلية</h3>
              <p className="text-primary-foreground/70 text-xs mb-4">للوصول السريع لجميع الخدمات والأرقام</p>
              <div className="flex justify-center gap-4">
                <a href="https://play.google.com/store/apps/details?id=com.MoIKuwait" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/30 rounded-sm px-4 py-2 hover:bg-primary-foreground/20 transition-colors">
                  <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/abcd9785d_www_moi_gov_kw_ico-android_bd4c1b1d.svg" alt="Android" className="h-5 w-5 object-contain" />
                  <span className="text-primary-foreground text-xs">Google Play</span>
                </a>
                <a href="https://itunes.apple.com/kw/app/moi-kuwait/id871764188?mt=8" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/30 rounded-sm px-4 py-2 hover:bg-primary-foreground/20 transition-colors">
                  <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/c71e7da0f_www_moi_gov_kw_ico-apple_dc28b8cd.svg" alt="Apple" className="h-5 w-5 object-contain" />
                  <span className="text-primary-foreground text-xs">App Store</span>
                </a>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>
    </div>
  );
}