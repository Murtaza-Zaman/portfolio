import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useGSAP } from "@gsap/react";
import { MessageSquare, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

import { PageIntro } from "../../components/common/PageIntro";
import { Seo } from "../../components/common/Seo";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { brand } from "../../constants/brand";
import { useCreateInquiry } from "../../hooks/usePublicContent";
import { contactSchema } from "../../schemas/contactSchema";
import { buildBreadcrumbSchema } from "../../utils/seoSchemas";
import { gsap } from "../../lib/gsap";

const inquiryTypes = [
  { value: "client", label: "A potential client (Project / SaaS / Cloud)" },
  { value: "recruiter", label: "A recruiter / Hiring team" },
  { value: "partner", label: "A technology partner / Collaborator" },
  { value: "general", label: "General inquiry" },
];

export function ContactPage() {
  const mutation = useCreateInquiry();
  const infoRef = useRef(null);
  const formRef = useRef(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiryType: "client",
      name: "",
      email: "",
      organization: "",
      subject: "",
      timeline: "",
      budgetRange: "",
      message: "",
      consent: false,
    },
  });

  const onSubmit = (values) => {
    mutation.mutate(
      {
        ...values,
        sourcePath: window.location.pathname,
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  // Entrance animations — info slides left, form slides right
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([infoRef.current, formRef.current], { opacity: 1, x: 0 });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.75 } });
    tl.fromTo(infoRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0 })
      .fromTo(formRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0 }, "-=0.55");
  }, []);

  return (
    <>
      <Seo
        canonicalPath="/contact"
        description="Start a professional conversation with Murtaza Zaman regarding software engineering, cloud architecture, or digital solution engineering."
        structuredData={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ])}
        title="Contact & Collaboration"
      />

      {/* Hero intro */}
      <section className="bg-transparent relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(6,182,212,0.15) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-28 lg:px-8">
          <PageIntro
            dark
            description="Share the challenge, architecture goals, or technical requirements you are exploring. Every impactful software collaboration begins with a direct, focused technical conversation."
            eyebrow="Initiate Contact"
            title="Initialize Collaboration."
          />
        </div>
      </section>

      {/* Main content area */}
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left panel: Info & Process */}
          <div ref={infoRef} style={{ opacity: 0 }} className="space-y-6">
            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-mono font-medium text-teal-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
              </span>
              <span>AVAILABLE FOR NEW PROJECTS & CONSULTING</span>
            </div>

            {/* What to expect card */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 shadow-sm">
              <h3 className="font-display text-base font-semibold text-white flex items-center gap-2">
                <span className="font-mono text-cyan-400 text-xs font-bold tracking-widest uppercase">// 01</span>
                <span>Collaboration Blueprint</span>
              </h3>
              <ul className="mt-4 space-y-3.5 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono font-bold text-cyan-400">1</span>
                  <div>
                    <span className="font-medium text-white">Direct Requirements Discovery</span>
                    <p className="mt-0.5 text-xs text-slate-400">Thorough review of your technical specs, system architecture, and deadlines.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono font-bold text-cyan-400">2</span>
                  <div>
                    <span className="font-medium text-white">Architecture & Technical Proposal</span>
                    <p className="mt-0.5 text-xs text-slate-400">System design breakdown, stack choices, milestone roadmap, and clear cost estimates.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono font-bold text-cyan-400">3</span>
                  <div>
                    <span className="font-medium text-white">Milestone-Driven Execution</span>
                    <p className="mt-0.5 text-xs text-slate-400">Clean code, automated tests, regular sprint updates, and smooth deployment.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Fast direct conversation / WhatsApp */}
            <div className="rounded-2xl border border-teal-500/20 bg-teal-950/20 backdrop-blur-sm p-6 shadow-sm">
              <div className="flex items-center gap-2 text-teal-400">
                <MessageSquare className="h-4 w-4" />
                <h3 className="font-display text-base font-semibold">
                  Need a faster response?
                </h3>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Reach out directly on WhatsApp for quick inquiries, immediate project scoping, or consultation.
              </p>
              <a
                className="mt-4 inline-flex items-center gap-2.5 rounded-xl bg-teal-500/15 border border-teal-400/30 px-4 py-2.5 text-xs sm:text-sm font-semibold text-teal-200 shadow-sm hover:bg-teal-500/25 hover:border-teal-400/50 transition"
                href={brand.contactInfo?.whatsappUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg aria-hidden="true" className="h-4 w-4 fill-current text-teal-400" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Message on WhatsApp ({brand.contactInfo?.whatsappNumber || "+92 336 9406373"})</span>
              </a>
            </div>

            {/* Service Level Agreement */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono uppercase">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>RESPONSE SLA</span>
                </div>
                <div className="mt-1 text-sm font-semibold text-white font-mono">
                  &lt; 24-48 Hours
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono uppercase">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                  <span>IP & CONFIDENTIALITY</span>
                </div>
                <div className="mt-1 text-sm font-semibold text-white font-mono">
                  100% Protected
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Form */}
          <form
            ref={formRef}
            className="space-y-5 rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-7 shadow-2xl sm:p-9"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            style={{ opacity: 0 }}
          >
            <div>
              <span className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                // Direct Transmission
              </span>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-white font-display">
                Send Project Inquiry
              </h2>
            </div>

            <Select
              error={errors.inquiryType?.message}
              label="I am contacting you as"
              options={inquiryTypes}
              {...register("inquiryType")}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                autoComplete="name"
                error={errors.name?.message}
                label="Your name"
                placeholder="Murtaza Zaman"
                required
                {...register("name")}
              />
              <Input
                autoComplete="email"
                error={errors.email?.message}
                label="Email address"
                placeholder="you@company.com"
                required
                type="email"
                {...register("email")}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                autoComplete="organization"
                error={errors.organization?.message}
                label="Organization / Company"
                placeholder="e.g. Acme Tech"
                {...register("organization")}
              />
              <Input
                error={errors.timeline?.message}
                label="Estimated timeline"
                placeholder="e.g. 1-3 months, Immediate"
                {...register("timeline")}
              />
            </div>

            <Input
              error={errors.subject?.message}
              label="Subject"
              placeholder="Brief summary of the opportunity"
              {...register("subject")}
            />

            <Textarea
              error={errors.message?.message}
              label="Message"
              placeholder="Describe your project, technology stack, business goals, or any specific questions..."
              required
              rows={5}
              {...register("message")}
            />

            <div className="space-y-1">
              <label className="flex items-start gap-3 text-sm text-slate-300">
                <input
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-[#071022] text-cyan-500 focus:ring-cyan-500/20"
                  type="checkbox"
                  {...register("consent")}
                />
                <span>
                  I agree to have my contact information used solely for responding to this inquiry.
                  <span className="ml-1 text-coral-400">*</span>
                </span>
              </label>
              {errors.consent?.message && (
                <p className="text-xs font-medium text-rose-400">
                  {errors.consent.message}
                </p>
              )}
            </div>

            {mutation.isError && (
              <div
                aria-live="assertive"
                className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300"
                role="alert"
              >
                {mutation.error?.message || "The message could not be sent. Please check your inputs and try again."}
              </div>
            )}

            {mutation.isSuccess && (
              <div
                aria-live="polite"
                className="flex items-start gap-3 rounded-xl border border-teal-500/30 bg-teal-500/10 p-4 text-sm font-medium text-teal-300"
                role="status"
              >
                <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                <span>Thank you for reaching out. Your message has been safely received, and I will be in touch shortly.</span>
              </div>
            )}

            <Button
              className="w-full sm:w-auto"
              disabled={mutation.isPending || isSubmitting}
              type="submit"
            >
              {mutation.isPending || isSubmitting ? "Sending message..." : "Send message"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
