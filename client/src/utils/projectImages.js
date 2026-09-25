import seoPlatformImg from "../assets/seo_platform_preview.jpg";
import analyticsSaasImg from "../assets/analytics_saas_preview.jpg";
import aiContentImg from "../assets/ai_content_preview.jpg";
import ecommerceImg from "../assets/ecommerce_preview.jpg";
import fastfeastImg from "../assets/fastfeast_preview.jpg";
import furnishcoImg from "../assets/furnishco_preview.jpg";
import rhythmixImg from "../assets/rhythmix_preview.jpg";
import wandermapImg from "../assets/wandermap_preview.jpg";

/**
 * Resolves the optimal preview thumbnail for a project
 */
export function resolveProjectThumbnail(item) {
  if (!item) return seoPlatformImg;

  if (item.coverImage && !item.coverImage.includes("kmavcqmrms4o0j9z9sgd")) {
    return item.coverImage;
  }
  if (item.imageUrl && !item.imageUrl.includes("kmavcqmrms4o0j9z9sgd")) {
    return item.imageUrl;
  }
  if (item.image) {
    return item.image;
  }

  const slug = (item.slug || "").toLowerCase();
  const title = (item.title || "").toLowerCase();

  if (slug.includes("seo") || title.includes("seo") || title.includes("developer")) {
    return seoPlatformImg;
  }
  if (slug.includes("analytics") || title.includes("analytics") || title.includes("telemetry") || title.includes("saas")) {
    return analyticsSaasImg;
  }
  if (slug.includes("ai") || title.includes("ai") || title.includes("content") || title.includes("gemini")) {
    return aiContentImg;
  }
  if (slug.includes("commerce") || title.includes("commerce") || title.includes("storefront") || title.includes("ecommere") || title.includes("shop")) {
    return ecommerceImg;
  }
  if (slug.includes("fastfeast") || title.includes("fastfeast") || title.includes("food")) {
    return fastfeastImg;
  }
  if (slug.includes("furnish") || title.includes("furnish") || title.includes("furniture")) {
    return furnishcoImg;
  }
  if (slug.includes("rhythmix") || title.includes("rhythmix") || title.includes("music") || title.includes("audio")) {
    return rhythmixImg;
  }
  if (slug.includes("wander") || title.includes("wander") || title.includes("map") || title.includes("travel")) {
    return wandermapImg;
  }

  return seoPlatformImg;
}

export {
  seoPlatformImg,
  analyticsSaasImg,
  aiContentImg,
  ecommerceImg,
  fastfeastImg,
  furnishcoImg,
  rhythmixImg,
  wandermapImg,
};
