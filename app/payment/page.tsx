import PaymentClient from "@/components/PaymentClient";

export default function PaymentPage({
  searchParams,
}: {
  searchParams: { iuran_id?: string };
}) {
  return <PaymentClient iuranId={searchParams.iuran_id} />;
}
