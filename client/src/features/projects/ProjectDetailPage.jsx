import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import { useProject } from "../../hooks/usePublicContent";

export function ProjectDetailPage() {
  const { slug } = useParams();
  const query = useProject(slug);
  const liveUrl = query.data?.data?.liveUrl || query.data?.data?.repositoryUrl;

  useEffect(() => {
    if (liveUrl && (liveUrl.startsWith("http://") || liveUrl.startsWith("https://"))) {
      window.location.replace(liveUrl);
    }
  }, [liveUrl]);

  if (query.isLoading) {
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (liveUrl && (liveUrl.startsWith("http://") || liveUrl.startsWith("https://"))) {
    return null;
  }

  return <Navigate replace to="/projects" />;
}