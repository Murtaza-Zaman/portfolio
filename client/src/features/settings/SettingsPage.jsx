import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { PageIntro } from "../../components/common/PageIntro";
import { Seo } from "../../components/common/Seo";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { siteSettingsSchema } from "../../schemas/adminSchemas";
import { adminApi } from "../../services/adminApi";
import { getAccessToken } from "../../store/authStore";

const DEFAULT_SETTINGS = {
  siteName: "Murtaza Zaman",
  siteTitle: "Future Technology Builder & Software Engineer",
  siteDescription:
    "Professional portfolio and digital solution engineering platform at the intersection of software development, cloud systems architecture, and digital growth.",
  contactEmail: "contact@murtazazaman.com",
  calendlyUrl: "https://calendly.com/murtazazaman",
  maintenanceMode: false,
};

export function SettingsPage() {
  const [savedStatus, setSavedStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const queryClient = useQueryClient();
  const token = getAccessToken();

  const settingsQuery = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => adminApi.getSettings(token),
    retry: false,
  });

  const {
    formState: { errors, isDirty, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: DEFAULT_SETTINGS,
  });

  useEffect(() => {
    if (settingsQuery.data?.data) {
      const data = settingsQuery.data.data;
      reset({
        siteName: data.siteName || DEFAULT_SETTINGS.siteName,
        siteTitle: data.siteTitle || DEFAULT_SETTINGS.siteTitle,
        siteDescription: data.siteDescription || DEFAULT_SETTINGS.siteDescription,
        contactEmail: data.contactEmail || DEFAULT_SETTINGS.contactEmail,
        calendlyUrl: data.calendlyUrl || DEFAULT_SETTINGS.calendlyUrl,
        maintenanceMode: Boolean(data.maintenanceMode),
      });
    }
  }, [settingsQuery.data, reset]);

  const updateMutation = useMutation({
    mutationFn: (data) => adminApi.updateSettings(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      setSavedStatus(true);
      setErrorMessage(null);
      setTimeout(() => setSavedStatus(false), 3500);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to update platform settings.");
    },
  });

  const onSubmit = async (formData) => {
    try {
      await updateMutation.mutateAsync(formData);
    } catch {
      // Handled by onError
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-5 py-10 sm:px-6 lg:px-8">
      <Seo title="Platform Settings" />
      <PageIntro
        dark={true}
        description="Manage global website settings, identity defaults, and operational configurations."
        eyebrow="System Configuration"
        title="Platform Settings"
      />

      <form className="space-y-8" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Website Identity</CardTitle>
            <CardDescription>
              Basic identity information presented across search engines and social shares.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                error={errors.siteName?.message}
                label="Site Name / Author"
                required
                {...register("siteName")}
              />
              <Input
                error={errors.contactEmail?.message}
                label="Primary Contact Email"
                required
                type="email"
                {...register("contactEmail")}
              />
            </div>

            <Input
              error={errors.siteTitle?.message}
              label="Default Page Title"
              required
              {...register("siteTitle")}
            />

            <Textarea
              error={errors.siteDescription?.message}
              label="Default Meta Description"
              required
              rows={3}
              {...register("siteDescription")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations & Direct Scheduling</CardTitle>
            <CardDescription>
              External service links for direct visitor scheduling and inquiries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input
              error={errors.calendlyUrl?.message}
              helperText="Optional Calendly or Cal.com URL for booking introductory calls"
              label="Calendly / Booking URL"
              placeholder="https://calendly.com/your-name"
              {...register("calendlyUrl")}
            />
          </CardContent>
        </Card>

        {savedStatus && (
          <div
            aria-live="polite"
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300"
            role="status"
          >
            Settings saved successfully.
          </div>
        )}

        {errorMessage && (
          <div
            aria-live="polite"
            className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-300"
            role="status"
          >
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors" to="/admin">
            &larr; Back to Admin Dashboard
          </Link>
          <Button disabled={isSubmitting || updateMutation.isPending || !isDirty} type="submit">
            {isSubmitting || updateMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
