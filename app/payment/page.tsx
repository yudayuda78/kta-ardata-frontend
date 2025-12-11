import PaymentClient from "@/components/PaymentClient";

export default function PaymentPage({
  searchParams,
}: {
  searchParams: { iuran_id?: string };
}) {
  return <PaymentClient paramId={searchParams.iuran_id} />;
}
