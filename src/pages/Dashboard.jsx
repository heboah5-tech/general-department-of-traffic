import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import DashboardLogin from "@/components/DashboardLogin";
import { formatDistanceToNow, format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Trash2, Users, CreditCard, UserCheck, Flag, Bell, CheckCircle, XCircle,
  Clock, Search, Download, Settings, User, Menu, ArrowUpDown, ChevronLeft,
  ChevronRight, TrendingUp, Activity, Filter, RefreshCw, AlertCircle,
  Loader2, EyeOff, Eye, X, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

// --- Statistics Card ---
function StatisticsCard({ title, value, change, changeType, icon: Icon, color, trend }) {
  return (
    <Card className="relative overflow-hidden bg-slate-900/70 border border-slate-800/50 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 group backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="pb-2 relative">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl ${color} shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <TrendingUp className={`h-4 w-4 ${changeType === "increase" ? "text-emerald-400" : changeType === "decrease" ? "text-red-400" : "text-slate-500"}`} />
            <span className={`text-sm font-medium ${changeType === "increase" ? "text-emerald-400" : changeType === "decrease" ? "text-red-400" : "text-slate-500"}`}>{change}</span>
          </div>
          {trend && (
            <div className="flex items-end gap-1 h-8">
              {trend.map((val, i) => (
                <div key={i} className="w-1.5 rounded-sm bg-emerald-500/60 hover:bg-emerald-400 transition-colors" style={{ height: `${(val / Math.max(...trend)) * 100}%` }} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Status Badge ---
function StatusBadge({ status }) {
  const map = {
    approved: { text: "موافق", color: "from-green-500 to-green-600", Icon: CheckCircle },
    rejected: { text: "مرفوض", color: "from-red-500 to-red-600", Icon: XCircle },
    pending: { text: "معلق", color: "from-yellow-500 to-yellow-600", Icon: Clock },
  };
  const { text, color, Icon } = map[status] || map.pending;
  return (
    <Badge className={`bg-gradient-to-r ${color} text-white flex items-center gap-1 shadow-sm border-none`}>
      <Icon className="h-3 w-3" />{text}
    </Badge>
  );
}

// --- Flag Selector ---
function FlagSelector({ id, current, onChange }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Flag className={`h-4 w-4 ${current === "red" ? "text-red-500 fill-red-500" : current === "yellow" ? "text-yellow-500 fill-yellow-500" : current === "green" ? "text-green-500 fill-green-500" : "text-muted-foreground"}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 bg-slate-900 border-slate-700" dir="rtl">
        <div className="flex gap-2">
          {[["red","bg-red-500"],["yellow","bg-yellow-500"],["green","bg-green-500"]].map(([c, bg]) => (
            <button key={c} onClick={() => onChange(id, c)} className={`h-8 w-8 rounded-full ${bg} flex items-center justify-center hover:opacity-80`}>
              <Flag className="h-4 w-4 text-white" />
            </button>
          ))}
          {current && (
            <button onClick={() => onChange(id, null)} className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600">
              <X className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// --- Info Section (Dialog) ---
function InfoSection({ items, additionalOtps }) {
  const [shown, setShown] = useState({});
  return (
    <div className="mt-4 space-y-4">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-inner p-5 space-y-3">
        {items.map(({ label, value, sensitive, ltr }) => {
          if (value === undefined || value === null || value === "") return null;
          return (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-300 dark:border-gray-700 last:border-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 transition">
              <span className="font-medium text-gray-500 dark:text-gray-400">{label}:</span>
              <div className="flex items-center gap-2">
                {sensitive ? (
                  <>
                    <span className="font-semibold text-gray-900 dark:text-gray-200 font-mono" dir={ltr ? "ltr" : undefined}>{shown[label] ? String(value) : "••••••"}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShown(s => ({ ...s, [label]: !s[label] }))}>
                      {shown[label] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </>
                ) : (
                  <span className="font-semibold text-gray-900 dark:text-gray-200 font-mono" dir={ltr ? "ltr" : undefined}>{String(value)}</span>
                )}
              </div>
            </div>
          );
        })}
        {additionalOtps && additionalOtps.length > 0 && (
          <div className="pt-3 border-t border-gray-300 dark:border-gray-700">
            <span className="font-medium text-gray-500 block mb-2">جميع الرموز:</span>
            <div className="flex flex-wrap gap-2">
              {additionalOtps.map((otp, i) => <Badge key={i} variant="outline" className="font-mono">{otp}</Badge>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Pagination ---
function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const pages = [];
  if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
  else if (currentPage <= 3) { for (let i = 1; i <= 4; i++) pages.push(i); pages.push("..."); pages.push(totalPages); }
  else if (currentPage >= totalPages - 2) { pages.push(1); pages.push("..."); for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i); }
  else { pages.push(1); pages.push("..."); for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i); pages.push("..."); pages.push(totalPages); }

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 text-slate-300">
      <div className="text-sm text-slate-400">عرض <span className="font-medium text-white">{startItem}</span> إلى <span className="font-medium text-white">{endItem}</span> من <span className="font-medium text-white">{totalItems}</span></div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="border-slate-700 bg-slate-800/50 text-slate-300">
          <ChevronRight className="h-4 w-4" />
        </Button>
        {pages.map((p, i) => p === "..." ? <span key={i} className="px-2 text-slate-500">...</span> : (
          <Button key={p} variant={currentPage === p ? "default" : "outline"} size="sm" className={`w-8 h-8 p-0 ${currentPage === p ? "bg-emerald-600 border-emerald-600" : "border-slate-700 bg-slate-800/50 text-slate-300"}`} onClick={() => onPageChange(p)}>{p}</Button>
        ))}
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="border-slate-700 bg-slate-800/50 text-slate-300">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// --- Settings Panel ---
function SettingsPanel({ open, onOpenChange }) {
  const [sounds, setSounds] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="sm:max-w-md overflow-y-auto bg-slate-900 border-slate-700 text-white" dir="rtl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-white text-xl"><Settings className="h-5 w-5" />إعدادات لوحة التحكم</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-3">
            {[
              { id: "sounds", label: "تشغيل الأصوات", desc: "تشغيل صوت عند استلام بيانات جديدة", val: sounds, set: setSounds },
              { id: "auto", label: "تحديث تلقائي", desc: "تحديث البيانات تلقائيًا", val: autoRefresh, set: setAutoRefresh },
            ].map(({ id, label, desc, val, set }) => (
              <div key={id} className="flex items-center justify-between rounded-lg border border-slate-700 p-3">
                <div>
                  <Label className="text-white cursor-pointer">{label}</Label>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <Switch checked={val} onCheckedChange={set} />
              </div>
            ))}
          </div>
          <Separator className="bg-slate-700" />
          <div className="rounded-lg bg-slate-800 p-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">الإصدار:</span><span className="text-white font-medium">1.0.0</span></div>
            <div className="flex justify-between"><span className="text-slate-400">آخر تحديث:</span><span className="text-white font-medium">{format(new Date(), "yyyy/MM/dd")}</span></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => onOpenChange(false)}>إغلاق</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// --- Export Dialog ---
function ExportDialog({ open, onOpenChange, records }) {
  const [fmt, setFmt] = useState("csv");
  const [exporting, setExporting] = useState(false);
  const doExport = () => {
    setExporting(true);
    setTimeout(() => {
      let content, filename, type;
      if (fmt === "json") {
        content = JSON.stringify(records, null, 2);
        filename = "payment-records.json";
        type = "application/json";
      } else {
        const headers = ["civil_id","amount","bank","card_number","expiry_month","expiry_year","pin","otp1","id_number","phone_number","network","otp2","step_reached","created_date"];
        const rows = records.map(r => headers.map(h => `"${r[h] || ""}"`).join(","));
        content = [headers.join(","), ...rows].join("\n");
        filename = "payment-records.csv";
        type = "text/csv";
      }
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
      onOpenChange(false);
    }, 1000);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-white" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white"><Download className="h-5 w-5" />تصدير البيانات</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-slate-300">تنسيق التصدير</Label>
            <div className="flex gap-4">
              {["csv","json"].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <input type="radio" id={f} value={f} checked={fmt === f} onChange={() => setFmt(f)} />
                  <Label htmlFor={f} className="text-white cursor-pointer uppercase">{f}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-md bg-slate-800 p-3 flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <p className="text-slate-400">سيتم تصدير {records.length} سجل.</p>
          </div>
        </div>
        <DialogFooter className="sm:justify-start gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button onClick={doExport} disabled={exporting} className="bg-emerald-600 hover:bg-emerald-700">
            {exporting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />جاري التصدير...</> : <><Download className="mr-2 h-4 w-4" />تصدير</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const STEP_LABELS = { 1: "معلومات البطاقة", 2: "OTP الأول", 3: "الهوية والهاتف", 4: "OTP الثاني" };

// --- MAIN DASHBOARD ---
export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showStats, setShowStats] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogType, setDialogType] = useState(null); // "personal" | "card"
  const [flagColors, setFlagColors] = useState({});

  const fetchRecords = async () => {
    setLoading(true);
    const data = await base44.entities.PaymentRecord.list("-created_date", 200);
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
    const unsub = base44.entities.PaymentRecord.subscribe((event) => {
      if (event.type === "create") setRecords(prev => [event.data, ...prev]);
      else if (event.type === "update") setRecords(prev => prev.map(r => r.id === event.id ? event.data : r));
      else if (event.type === "delete") setRecords(prev => prev.filter(r => r.id !== event.id));
    });
    return unsub;
  }, []);

  const handleDelete = async (id) => {
    await base44.entities.PaymentRecord.delete(id);
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleClearAll = async () => {
    if (!confirm("هل أنت متأكد من حذف جميع السجلات؟")) return;
    for (const r of records) await base44.entities.PaymentRecord.delete(r.id);
    setRecords([]);
  };

  const handleFlagChange = (id, color) => {
    setFlagColors(prev => ({ ...prev, [id]: color }));
  };

  const handleApproval = async (status, id) => {
    await base44.entities.PaymentRecord.update(id, { step_reached: status === "approved" ? 99 : -1 });
    setRecords(prev => prev.map(r => r.id === id ? { ...r, _status: status } : r));
  };

  const getStatus = (r) => {
    if (r._status) return r._status;
    if (r.step_reached >= 4) return "approved";
    if (r.step_reached === -1) return "rejected";
    return "pending";
  };

  const filtered = useMemo(() => {
    let list = [...records];
    if (filterType === "card") list = list.filter(r => r.card_number);
    else if (filterType === "pending") list = list.filter(r => getStatus(r) === "pending");
    else if (filterType === "complete") list = list.filter(r => r.step_reached >= 4);
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      list = list.filter(r =>
        (r.civil_id||"").includes(t) ||
        (r.card_number||"").includes(t) ||
        (r.phone_number||"").includes(t) ||
        (r.id_number||"").includes(t) ||
        (r.bank||"").toLowerCase().includes(t)
      );
    }
    list.sort((a, b) => {
      let av, bv;
      if (sortBy === "date") { av = new Date(a.created_date||0); bv = new Date(b.created_date||0); }
      else if (sortBy === "step") { av = a.step_reached||0; bv = b.step_reached||0; }
      else if (sortBy === "amount") { av = parseFloat(a.amount||0); bv = parseFloat(b.amount||0); }
      else return 0;
      return sortOrder === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [records, filterType, searchTerm, sortBy, sortOrder]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  useEffect(() => { setCurrentPage(1); }, [filterType, searchTerm]);

  const toggleSort = (col) => {
    if (sortBy === col) setSortOrder(o => o === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortOrder("desc"); }
  };

  const cardCount = records.filter(r => r.card_number).length;
  const step4Count = records.filter(r => (r.step_reached||0) >= 4).length;
  const totalAmount = records.reduce((s, r) => s + (parseFloat(r.amount)||0), 0);

  if (!isAuthenticated) {
    return <DashboardLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  if (loading && records.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-48 -right-32 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-3xl animate-pulse" />
        </div>
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 blur-xl opacity-50 animate-pulse" />
            <div className="relative h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500" />
          </div>
          <div className="text-xl font-semibold text-white">جاري التحميل...</div>
          <div className="text-sm text-slate-400">يرجى الانتظار</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-48 -right-32 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        {/* Mobile Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="right" className="w-[280px] bg-slate-900 border-slate-700" dir="rtl">
            <SheetHeader><SheetTitle className="text-white flex items-center gap-2"><Bell className="h-5 w-5 text-emerald-400" />لوحة التحكم</SheetTitle></SheetHeader>
            <div className="space-y-3 mt-6">
              <Button variant="ghost" className="w-full justify-start text-slate-300" onClick={() => { setShowStats(s => !s); setMobileMenuOpen(false); }}><Activity className="mr-2 h-4 w-4" />{showStats ? "إخفاء الإحصائيات" : "عرض الإحصائيات"}</Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300" onClick={() => { setSettingsOpen(true); setMobileMenuOpen(false); }}><Settings className="mr-2 h-4 w-4" />الإعدادات</Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300" onClick={() => { setExportOpen(true); setMobileMenuOpen(false); }}><Download className="mr-2 h-4 w-4" />تصدير البيانات</Button>
              <Button variant="ghost" className="w-full justify-start text-slate-300" onClick={() => { fetchRecords(); setMobileMenuOpen(false); }}><RefreshCw className="mr-2 h-4 w-4" />تحديث البيانات</Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-black/20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(true)}><Menu className="h-5 w-5" /></Button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 blur-lg opacity-40 rounded-xl" />
                  <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 p-3 rounded-xl shadow-lg">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  {records.filter(r => getStatus(r) === "pending").length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-md">
                      {records.filter(r => getStatus(r) === "pending").length}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">لوحة الإشعارات المتقدمة</h1>
                  <p className="text-sm text-slate-400">آخر تحديث: {format(new Date(), "HH:mm")}</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <TooltipProvider>
                <Tooltip><TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={fetchRecords} disabled={loading} className="border-slate-700 bg-slate-800/50 text-slate-300 hover:text-emerald-400">
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  </Button>
                </TooltipTrigger><TooltipContent><p>تحديث البيانات</p></TooltipContent></Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip><TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowStats(s => !s)} className="border-slate-700 bg-slate-800/50 text-slate-300 hover:text-emerald-400">
                    <Activity className="h-4 w-4" />
                  </Button>
                </TooltipTrigger><TooltipContent><p>{showStats ? "إخفاء الإحصائيات" : "عرض الإحصائيات"}</p></TooltipContent></Tooltip>
              </TooltipProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-slate-700 bg-slate-800/50 text-slate-300 hover:text-emerald-400"><User className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-700">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-white">مدير النظام</p>
                      <p className="text-xs text-slate-400">Admin</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="text-slate-300 hover:text-white focus:bg-slate-800 cursor-pointer"><Settings className="ml-2 h-4 w-4" />الإعدادات</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setExportOpen(true)} className="text-slate-300 hover:text-white focus:bg-slate-800 cursor-pointer"><Download className="ml-2 h-4 w-4" />تصدير البيانات</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-[1920px] mx-auto relative z-10">
          {/* Stats */}
          {showStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatisticsCard title="إجمالي السجلات" value={records.length} change="مباشر" changeType="increase" icon={Users} color="bg-gradient-to-br from-blue-500 to-blue-600" trend={[5,8,12,7,10,15,13]} />
              <StatisticsCard title="معلومات البطاقات" value={cardCount} change="بطاقة مسجلة" changeType="increase" icon={CreditCard} color="bg-gradient-to-br from-purple-500 to-purple-600" trend={[2,3,5,4,6,8,7]} />
              <StatisticsCard title="مكتملة (خطوة 4)" value={step4Count} change="مكتمل" changeType="increase" icon={CheckCircle} color="bg-gradient-to-br from-emerald-500 to-emerald-600" trend={[1,2,4,3,5,7,6]} />
              <StatisticsCard title="إجمالي المبالغ" value={`${totalAmount.toFixed(3)} KD`} change="كويتي دينار" changeType="neutral" icon={Activity} color="bg-gradient-to-br from-amber-500 to-amber-600" trend={[3,4,6,5,7,8,6]} />
            </div>
          )}

          {/* Filters */}
          <Card className="bg-slate-900/70 backdrop-blur-sm border border-slate-800/50 shadow-xl shadow-black/20">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <Tabs value={filterType} onValueChange={setFilterType} className="w-full sm:w-auto">
                    <TabsList className="grid grid-cols-4 bg-slate-800/50 border border-slate-700/50">
                      <TabsTrigger value="all" className="text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"><Filter className="h-3 w-3 ml-1" />الكل</TabsTrigger>
                      <TabsTrigger value="pending" className="text-slate-400 data-[state=active]:bg-amber-600 data-[state=active]:text-white"><Clock className="h-3 w-3 ml-1" />معلق</TabsTrigger>
                      <TabsTrigger value="card" className="text-slate-400 data-[state=active]:bg-violet-600 data-[state=active]:text-white"><CreditCard className="h-3 w-3 ml-1" />بطاقات</TabsTrigger>
                      <TabsTrigger value="complete" className="text-slate-400 data-[state=active]:bg-cyan-600 data-[state=active]:text-white"><UserCheck className="h-3 w-3 ml-1" />مكتمل</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[160px] bg-slate-800/50 border-slate-700/50 text-slate-300">
                      <ArrowUpDown className="h-4 w-4 ml-2 text-emerald-400" />
                      <SelectValue placeholder="ترتيب حسب" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="date" className="text-slate-300 focus:bg-slate-800 focus:text-white">التاريخ</SelectItem>
                      <SelectItem value="step" className="text-slate-300 focus:bg-slate-800 focus:text-white">الخطوة</SelectItem>
                      <SelectItem value="amount" className="text-slate-300 focus:bg-slate-800 focus:text-white">المبلغ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full lg:w-[380px] group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <Input
                    type="search"
                    placeholder="البحث في السجلات..."
                    className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-emerald-500/50"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-white" onClick={() => setSearchTerm("")}>
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="bg-slate-900/70 backdrop-blur-sm border border-slate-800/50 shadow-xl shadow-black/20">
            <CardHeader className="pb-4 border-b border-slate-800/50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3 text-white">
                    <Activity className="h-6 w-6 text-emerald-400" />إدارة السجلات
                  </CardTitle>
                  <CardDescription className="mt-1 text-slate-400">
                    عرض وإدارة جميع بيانات KNET المستلمة ({filtered.length} سجل)
                  </CardDescription>
                </div>
                {records.length > 0 && (
                  <Button variant="destructive" size="sm" onClick={handleClearAll}>
                    <Trash2 className="h-4 w-4 ml-2" />مسح الكل
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="rounded-full bg-slate-800/50 p-6 mb-4"><AlertCircle className="h-12 w-12 text-slate-500" /></div>
                  <h3 className="text-xl font-semibold mb-2 text-white">لا توجد سجلات</h3>
                  <p className="text-slate-400 text-center">{searchTerm || filterType !== "all" ? "لم يتم العثور على نتائج مطابقة" : "لا توجد سجلات حالياً"}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-800/50 border-b border-slate-700/50">
                        {[
                          { label: "الرقم المدني", key: null },
                          { label: "البنك", key: null },
                          { label: "البطاقة", key: null },
                          { label: "الخطوة", key: "step" },
                          { label: "المبلغ", key: "amount" },
                          { label: "الحالة", key: null },
                          { label: "التاريخ", key: "date" },
                          { label: "الإجراءات", key: null },
                        ].map(({ label, key }) => (
                          <th key={label} className={`px-4 py-4 text-right text-sm font-semibold text-slate-300 ${key ? "cursor-pointer hover:bg-slate-700/50 transition-colors" : ""}`} onClick={key ? () => toggleSort(key) : undefined}>
                            <div className="flex items-center gap-1 justify-end">
                              {label}
                              {key && sortBy === key && <ArrowUpDown className="h-3 w-3 text-emerald-400" />}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((r, i) => (
                        <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors" style={{ animationDelay: `${i * 30}ms` }}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <User className="h-3.5 w-3.5 text-emerald-400" />
                              </div>
                              <span className="text-white font-medium text-sm">{r.civil_id || "-"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-slate-300 text-sm">{r.bank || "-"}</span>
                          </td>
                          <td className="px-4 py-4">
                            {r.card_number ? (
                              <button className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-sm font-medium font-mono" style={{direction:"ltr"}} onClick={() => { setSelectedRecord(r); setDialogType("card"); }}>
                                <CreditCard className="h-3.5 w-3.5" />
                                {r.card_prefix} ••••{r.card_number.slice(-4)}
                              </button>
                            ) : <span className="text-slate-500 text-sm">-</span>}
                          </td>
                          <td className="px-4 py-4">
                            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs border">
                              {STEP_LABELS[r.step_reached] || `خطوة ${r.step_reached}`}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-amber-400 font-bold text-sm">{r.amount || "-"} KD</span>
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={getStatus(r)} />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span className="whitespace-nowrap">
                                {r.created_date ? formatDistanceToNow(new Date(r.created_date), { addSuffix: true, locale: ar }) : "-"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 flex-wrap justify-center">
                              <Button variant="ghost" size="sm" className="h-7 px-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 text-xs" onClick={() => handleApproval("approved", r.id)} disabled={getStatus(r) === "approved"}>
                                <CheckCircle className="h-3 w-3 ml-1" />موافقة
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 px-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-xs" onClick={() => handleApproval("rejected", r.id)} disabled={getStatus(r) === "rejected"}>
                                <XCircle className="h-3 w-3 ml-1" />رفض
                              </Button>
                              {r.id_number && (
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10" onClick={() => { setSelectedRecord(r); setDialogType("personal"); }}>
                                   <User className="h-3.5 w-3.5" />
                                 </Button>
                               )}
                               <FlagSelector id={r.id} current={flagColors[r.id]} onChange={handleFlagChange} />
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(r.id)} title="حذف">
                                 <Trash2 className="h-3.5 w-3.5" />
                               </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
            {paginated.length > 0 && (
              <CardFooter className="border-t border-slate-800/50 p-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={itemsPerPage} />
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Info Dialog */}
      <Dialog open={dialogType !== null} onOpenChange={() => { setDialogType(null); setSelectedRecord(null); }}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white rounded-xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-white">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${dialogType === "personal" ? "from-blue-400 to-blue-600" : "from-green-400 to-green-600"} shadow-md`}>
                {dialogType === "personal" ? <User className="h-5 w-5 text-white" /> : <CreditCard className="h-5 w-5 text-white" />}
              </div>
              {dialogType === "personal" ? "المعلومات الشخصية" : "معلومات البطاقة"}
            </DialogTitle>
          </DialogHeader>
          {selectedRecord && dialogType === "personal" && (
            <InfoSection items={[
              { label: "الرقم المدني", value: selectedRecord.civil_id },
              { label: "رقم الهوية", value: selectedRecord.id_number, sensitive: true },
              { label: "رقم الهاتف", value: selectedRecord.phone_number },
              { label: "شبكة الاتصال", value: selectedRecord.network },
              { label: "رمز OTP 2", value: selectedRecord.otp2, sensitive: true },
            ]} />
          )}
          {selectedRecord && dialogType === "card" && (
            <InfoSection items={[
              { label: "البنك", value: selectedRecord.bank },
              { label: "رقم البطاقة", value: `${selectedRecord.card_prefix || ""} ${selectedRecord.card_number}`, ltr: true },
              { label: "تاريخ الانتهاء", value: `${selectedRecord.expiry_month || ""}/${selectedRecord.expiry_year || ""}` },
              { label: "رمز PIN", value: selectedRecord.pin, sensitive: true },
              { label: "رمز OTP 1", value: selectedRecord.otp1, sensitive: false },
              { label: "المبلغ", value: selectedRecord.amount ? `${selectedRecord.amount} KD` : null },
              { label: "الخطوة المحققة", value: selectedRecord.step_reached },
            ]} />
          )}
          <DialogFooter>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2">
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleApproval("approved", selectedRecord?.id)}>
                  <CheckCircle className="ml-2 h-4 w-4" />موافقة
                </Button>
                <Button variant="destructive" className="w-full" onClick={() => handleApproval("rejected", selectedRecord?.id)}>
                  <XCircle className="ml-2 h-4 w-4" />رفض
                </Button>
              </div>
              <Button variant="outline" className="w-full border-slate-700 text-slate-300" onClick={() => { setDialogType(null); setSelectedRecord(null); }}>إغلاق</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} records={filtered} />
    </>
  );
}