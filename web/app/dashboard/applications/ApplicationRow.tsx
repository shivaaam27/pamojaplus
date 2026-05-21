"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, Mail, Phone, MapPin, Tag, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/Card";
import { ActionRow } from "./ActionRow";

const STATUS_TONE: Record<string, "green" | "yellow" | "ink"> = {
  new: "yellow",
  reviewing: "yellow",
  approved: "green",
  rejected: "ink"
};

export interface ApplicationFields {
  id: string;
  business_name: string;
  owner_name: string;
  whatsapp: string;
  email: string | null;
  category: string;
  location: string;
  description: string;
  socials: string | null;
  status: "new" | "reviewing" | "approved" | "rejected";
  created_at: string;
}

export function ApplicationRow({ a }: { a: ApplicationFields }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr className="hover:bg-bg/60 cursor-pointer" onClick={() => setOpen((v) => !v)}>
        <td className="p-3 w-8">{open ? <ChevronDown className="w-4 h-4 text-ink-2" /> : <ChevronRight className="w-4 h-4 text-ink-2" />}</td>
        <td className="p-3 font-semibold">{a.business_name}</td>
        <td className="p-3">{a.owner_name}<div className="text-xs text-ink-2">{a.whatsapp}</div></td>
        <td className="p-3">{a.category}</td>
        <td className="p-3">{a.location}</td>
        <td className="p-3 text-ink-2">{new Date(a.created_at).toLocaleDateString("en-GB")}</td>
        <td className="p-3"><Badge tone={STATUS_TONE[a.status] ?? "ink"}>{a.status}</Badge></td>
        <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}><ActionRow id={a.id} status={a.status} /></td>
      </tr>
      {open && (
        <tr className="bg-bg/40">
          <td></td>
          <td colSpan={7} className="p-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm max-w-3xl">
              <Field icon={Phone} label="WhatsApp" value={a.whatsapp} href={`https://wa.me/${a.whatsapp.replace(/[^\d]/g, "")}`} />
              <Field icon={Mail}  label="Email"    value={a.email ?? "—"} href={a.email ? `mailto:${a.email}` : undefined} />
              <Field icon={Tag}   label="Category" value={a.category} />
              <Field icon={MapPin} label="Location" value={a.location} />
              {a.socials && <Field icon={Link2} label="Socials" value={a.socials} className="sm:col-span-2" />}
              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 text-ink-2 text-xs uppercase tracking-widest font-bold mb-1">Description</div>
                <p className="whitespace-pre-wrap text-ink">{a.description}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Field({ icon: Icon, label, value, href, className = "" }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string; className?: string }) {
  const inner = (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-ink-2 mt-0.5 shrink-0" />
      <div>
        <div className="text-xs uppercase tracking-widest font-bold text-ink-2">{label}</div>
        <div className="font-semibold break-words">{value}</div>
      </div>
    </div>
  );
  return (
    <div className={className}>
      {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-green-dark">{inner}</a> : inner}
    </div>
  );
}
