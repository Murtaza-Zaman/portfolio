import { useParams } from "react-router-dom";

import { DetailPage } from "../../components/common/DetailPage";
import { useService } from "../../hooks/usePublicContent";

export function ServiceDetailPage() {
  const { slug } = useParams();
  return <DetailPage backLabel="Back to services" backPath="/services" fields={[{ label: "The problem", key: "problem" }, { label: "The approach", key: "approach" }, { label: "The value", key: "value" }]} query={useService(slug)} titleKey="name" />;
}