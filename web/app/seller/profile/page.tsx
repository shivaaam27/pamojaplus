import { SellerShell } from "@/components/layout/SellerShell";
import { Card } from "@/components/ui/Card";
import { getMySeller } from "../_lib/getSeller";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function SellerProfilePage() {
  const seller = await getMySeller();
  if (!seller) return <SellerShell><div className="text-sm text-ink-2">No seller profile.</div></SellerShell>;

  return (
    <SellerShell businessName={seller.business_name}>
      <div className="max-w-xl">
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-green">Seller portal</div>
          <h1 className="font-display font-extrabold text-2xl mt-1">Profile</h1>
          <p className="text-sm text-ink-2 mt-1">Keep your contact details up to date — shoppers reach you through your WhatsApp.</p>
        </div>
        <Card>
          <div className="mb-4">
            <div className="text-xs uppercase tracking-widest font-bold text-ink-2">Business name</div>
            <div className="font-display font-extrabold text-xl mt-1">{seller.business_name}</div>
            <div className="text-xs text-ink-2 mt-1">Contact Pamoja+ ops to change your business name.</div>
          </div>
          <ProfileForm init={{
            owner_name: seller.owner_name,
            whatsapp:   seller.whatsapp,
            phone:      seller.phone,
            location:   seller.location,
            category:   seller.category
          }} />
        </Card>
      </div>
    </SellerShell>
  );
}
