export default function Footer() {
  return (
    <footer className="bg-primary border-t border-primary/20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <a href="https://www.youtube.com/user/SecurityMediaQ8" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/821f2a943_www_moi_gov_kw_ico-youtube_e3080d60.svg" alt="YouTube" className="h-7 w-7 object-contain" />
          </a>
          <a href="https://www.instagram.com/moi_kuw/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/d85d614b8_www_moi_gov_kw_ico-instagram_e6dbe356.svg" alt="Instagram" className="h-7 w-7 object-contain" />
          </a>
          <a href="https://twitter.com/moi_kuw?lang=en" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/e556b0d13_www_moi_gov_kw_ico-twitter_8e0883cd.svg" alt="Twitter" className="h-7 w-7 object-contain" />
          </a>
          <a href="https://www.facebook.com/MOIKuwait/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/e6ae8ded8_www_moi_gov_kw_ico-facebook_682e1a62.svg" alt="Facebook" className="h-7 w-7 object-contain" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.MoIKuwait" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/abcd9785d_www_moi_gov_kw_ico-android_bd4c1b1d.svg" alt="Android" className="h-7 w-7 object-contain" />
          </a>
          <a href="https://itunes.apple.com/kw/app/moi-kuwait/id871764188?mt=8" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src="https://media.base44.com/images/public/6a11cacbd565fb23b026ee36/c71e7da0f_www_moi_gov_kw_ico-apple_dc28b8cd.svg" alt="Apple" className="h-7 w-7 object-contain" />
          </a>
        </div>
        {/* Copyright */}
        <div className="text-center">
          <p className="text-primary-foreground/80 text-xs">
            © جميع الحقوق محفوظة لوزارة الداخلية-دولة الكويت - 2026
          </p>
        </div>
      </div>
    </footer>
  );
}