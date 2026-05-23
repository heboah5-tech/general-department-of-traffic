import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, Volume2, Globe } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-background flex flex-col" dir="rtl">
      {/* Top bar with logos - mimicking the clean look from screenshot */}
      <div className="bg-muted/20 border-b border-border/50 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Right side (in RTL): Logos and Main Text */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-4">
              <img
                src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/ce2cb383c_www_moi_gov_kw_logo-moi_8a94a177.svg"
                alt="وزارة الداخلية"
                className="h-16 w-auto object-contain drop-shadow-md"
              />
              <div className="hidden sm:flex flex-col items-start">
                <span className="font-bold text-lg text-foreground tracking-wide">دولة الكويت</span>
                <span className="font-extrabold text-xl text-primary tracking-wide">وزارة الداخلية</span>
              </div>
            </Link>
          </div>

          {/* Left side (in RTL): Secondary logos or badges if needed */}
          <div className="hidden sm:flex items-center opacity-80 hover:opacity-100 transition-opacity">
            <img
              src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/80d1412c8_www_moi_gov_kw_state-of-kuwait_89206fff.svg"
              alt="Kuwait"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main Navigation bar - matching the dark blue from screenshot */}
      <nav className="bg-primary shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Desktop nav links */}
            <ul className="hidden sm:flex items-center">
              {[
                { name: "الرئيسية", path: "/" },
                { name: "الخدمات الإلكترونية", path: "/EServices" },
                { name: "إدارات توعوية", path: "#" },
                { name: "التحقق من الوثائق", path: "#" },
                { name: "رايك يهمنا", path: "#" },
                { name: "أرقام الطوارئ", path: "/EmergencyNumbers" },
                { name: "منصة المواعيد", path: "#" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="block px-5 py-4 text-[13px] text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300 font-bold border-e border-primary-foreground/10 relative group overflow-hidden"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* English Button & Mobile Toggle */}
            <div className="flex items-center gap-3 ms-auto sm:ms-0 py-2 sm:py-0">
              <button className="flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground text-xs px-4 py-2 rounded-sm hover:bg-primary-foreground hover:text-primary transition-all duration-300 font-bold group">
                <Globe className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                English
              </button>
              
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="sm:hidden">
                  <button className="p-2 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors rounded-sm border border-primary-foreground/20">
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background w-72 pt-12 border-l border-border shadow-2xl">
                  <div className="flex flex-col items-center mb-8 border-b border-border pb-6">
                    <img
                      src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/ce2cb383c_www_moi_gov_kw_logo-moi_8a94a177.svg"
                      alt="Logo"
                      className="h-16 w-auto mb-4"
                    />
                    <span className="font-bold text-lg text-primary">وزارة الداخلية</span>
                  </div>
                  <nav className="flex flex-col gap-2" dir="rtl">
                    {[
                      { name: "الرئيسية", path: "/" },
                      { name: "الخدمات الإلكترونية", path: "/EServices" },
                      { name: "إدارات توعوية", path: "#" },
                      { name: "التحقق من الوثائق", path: "#" },
                      { name: "رايك يهمنا", path: "#" },
                      { name: "أرقام الطوارئ", path: "/EmergencyNumbers" },
                      { name: "منصة المواعيد", path: "#" },
                    ].map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className="text-sm text-foreground hover:text-primary hover:bg-muted rounded-md px-4 py-3 transition-colors font-bold border border-transparent hover:border-border"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Accessibility / Utility Bar */}
      <div className="bg-secondary/30 border-b border-border/50 py-1.5 shadow-sm relative z-0">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <button className="flex items-center gap-2 bg-background border border-border px-3 py-1 rounded shadow-sm text-xs font-bold text-foreground hover:bg-muted hover:border-primary/40 transition-all group">
            <Volume2 className="h-3 w-3 text-primary group-hover:scale-110 transition-transform" />
            استمع
          </button>
        </div>
      </div>
    </header>
  );
}