import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Search } from "lucide-react";

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

const eServiceCategories = [
  {
    title: "الخدمات الإلكترونية لرخص السوق",
    icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/636ee81b1_www_moi_gov_kw_ico-renew_1991d40d.svg",
    link: "https://edl.moi.gov.kw/Login.aspx",
    desc: "تجديد وإصدار رخص القيادة إلكترونياً"
  },
  {
    title: "الخدمات الإلكترونية للأفراد",
    icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/eb94887f7_www_moi_gov_kw_ico-renew-individual_d80e552d.svg",
    link: "https://eres.moi.gov.kw/individual/ar/auth/login",
    desc: "خدمات الإقامة والتأشيرات للأفراد"
  },
  {
    title: "جاهزية نتيجة الفحص الطبي",
    icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/d6c613634_www_moi_gov_kw_ico-health-check-status_cbbd557a.svg",
    link: "#",
    desc: "الاستعلام عن نتائج الفحص الطبي"
  },
  {
    title: "دفع رسوم سمة دخول عمل بالقطاع الأهلي",
    icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/95cbf8a48_svg_007.svg",
    link: "#",
    desc: "دفع رسوم تأشيرات العمل إلكترونياً"
  },
  {
    title: "الخدمات الإلكترونية للشركات",
    icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/a922e27f5_www_moi_gov_kw_ico-renew-companies_419b8032.svg",
    link: "https://eres.moi.gov.kw/companies?culture=ar",
    desc: "إدارة خدمات الإقامة للشركات والمؤسسات"
  },
  {
    title: "الخدمات الإلكترونية للحكومة",
    icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/1b8dd49cf_www_moi_gov_kw_ico-renew-government_a119740b.svg",
    link: "https://eres.moi.gov.kw/government?culture=ar",
    desc: "الخدمات المخصصة للجهات الحكومية"
  }
];

export default function EServices() {
  const [search, setSearch] = useState("");
  const filtered = eServiceCategories.filter(s => s.title.includes(search));

  return (
    <div dir="rtl" className="bg-background min-h-screen">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero */}
      <section className="bg-primary py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")' }} />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <div className="flex items-center gap-3 mb-4">
              <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/ce2cb383c_www_moi_gov_kw_logo-moi_8a94a177.svg" alt="MOI" className="h-12 w-auto object-contain" />
              <div>
                <h1 className="text-primary-foreground text-lg font-bold leading-tight bg-gradient-to-l from-primary-foreground via-primary-foreground/80 to-primary-foreground bg-clip-text">
                  الخدمات الإلكترونية
                </h1>
                <p className="text-primary-foreground/70 text-xs">وزارة الداخلية - دولة الكويت</p>
              </div>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن الخدمة..."
                className="w-full bg-primary-foreground text-foreground rounded-sm ps-10 pe-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent text-start"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedElement>
            <h2 className="text-base font-bold text-foreground mb-1 text-end">الخدمات المتاحة</h2>
            <div className="flex justify-end mb-4">
              <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/488c86d53_www_moi_gov_kw_ico-horizontal-bar_84f2249f.svg" alt="" className="h-2 w-16 object-contain" />
            </div>
          </AnimatedElement>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((svc, i) => (
              <AnimatedElement key={i} delay={i * 80}>
                <a
                  href={svc.link}
                  target={svc.link.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="bg-card border-border rounded-sm shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full group cursor-pointer">
                    <CardContent className="p-5 text-center flex flex-col items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-lg group-hover:bg-primary/20 transition-all duration-300" />
                        <img src={svc.icon} alt="" className="h-16 w-16 object-contain mx-auto relative z-10" />
                      </div>
                      <div className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{svc.title}</div>
                      <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/488c86d53_www_moi_gov_kw_ico-horizontal-bar_84f2249f.svg" alt="" className="h-2 w-12 object-contain mx-auto" />
                      <p className="text-xs text-muted-foreground">{svc.desc}</p>
                      {svc.link.startsWith("http") && (
                        <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </CardContent>
                  </Card>
                </a>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Traffic Services */}
      <section className="py-8 bg-muted border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedElement>
            <div className="flex items-center justify-between mb-4">
              <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/220c31c8d_www_moi_gov_kw_logo-general-traffic_78cf6437.svg" alt="" className="h-10 w-auto object-contain" />
              <div className="text-end">
                <h2 className="text-sm font-bold text-foreground">خدمات المرور الإلكترونية</h2>
                <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/488c86d53_www_moi_gov_kw_ico-horizontal-bar_84f2249f.svg" alt="" className="h-2 w-16 object-contain ms-auto mt-1" />
              </div>
            </div>
          </AnimatedElement>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "الخدمات الالكترونية لرخص السوق", icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/b88974620_www_moi_gov_kw_ico-renew-license_731789c0.svg", link: "https://edl.moi.gov.kw/" },
              { title: "دفع المخالفات", icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/48b63e750_www_moi_gov_kw_ico-payment_7e509c2d.svg", link: "#" },
              { title: "نظام مواعيد اختبار القيادة", icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/49e13b197_www_moi_gov_kw_ico-booking_c71aa528.svg", link: "#" },
              { title: "معاملات المرور", icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/8c839a2a6_www_moi_gov_kw_ico-procedures_3c61af49.svg", link: "#" },
              { title: "مواقع الإدارة العامة للمرور", icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/f35a162ca_www_moi_gov_kw_ico-locations-sections_cbe2c44f.svg", link: "#" },
              { title: "شروط منح رخص السوق لغير الكويتيين", icon: "https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/5a538466e_www_moi_gov_kw_ico-pdf-doc_e93b0578.svg", link: "#" },
            ].map((svc, i) => (
              <AnimatedElement key={i} delay={i * 80}>
                <a href={svc.link} target={svc.link.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer" className="flex items-center gap-3 bg-card border border-border rounded-sm p-3 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group">
                  <img src={svc.icon} alt="" className="h-10 w-10 object-contain flex-shrink-0" />
                  <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors text-end flex-1">{svc.title}</span>
                </a>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}