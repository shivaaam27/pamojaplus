import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export function InquireButton({
  sellerId,
  listingId,
  refCode,
  className,
  children = "Inquire on WhatsApp"
}: {
  sellerId: string;
  listingId?: string;
  refCode?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const qs = new URLSearchParams({ seller: sellerId });
  if (listingId) qs.set("listing", listingId);
  if (refCode) qs.set("ref", refCode);

  return (
    <a
      href={`/api/inquiry?${qs.toString()}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold",
        "bg-green text-white hover:bg-green-dark transition shadow-card",
        className
      )}
    >
      <MessageCircle className="w-4 h-4" />
      {children}
    </a>
  );
}
