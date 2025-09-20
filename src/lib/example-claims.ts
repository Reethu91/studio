
import type { Claim } from "@/app/dashboard/page";

export const exampleClaims: Claim[] = [
  {
    id: "CLM-0001",
    crop: "Corn",
    damageType: "Hail Damage",
    status: "Reported",
    dateFiled: "07/15/2024",
    imageUrl: "https://picsum.photos/seed/hail/400/225",
    analysis: {
      damageType: "Hail Damage",
      damageExtent: "Moderate",
      additionalNotes: "Visible bruising and shredding of leaves. Some stalks are broken. Damage appears to be widespread across the northern section of the field.",
    },
    reportSummary: "Preliminary claim report for hail damage to corn crop. Analysis indicates moderate damage with significant leaf shredding and some stalk breakage. Estimated affected area is 15 acres. Awaiting adjuster for full loss assessment.",
  },
  {
    id: "CLM-0002",
    crop: "Soybeans",
    damageType: "Drought Stress",
    status: "Analyzed",
    dateFiled: "07/18/2024",
    imageUrl: "https://picsum.photos/seed/drought/400/225",
    analysis: {
        damageType: "Drought Stress",
        damageExtent: "Severe",
        additionalNotes: "Plants are stunted, leaves are yellow and wilted. Significant pod abortion observed. Soil is visibly dry and cracked.",
    },
    reportSummary: undefined,
  },
  {
    id: "CLM-0003",
    crop: "Wheat",
    damageType: "Fungus - Powdery Mildew",
    status: "Reported",
    dateFiled: "07/20/2024",
    imageUrl: "https://picsum.photos/seed/fungus/400/225",
    analysis: {
        damageType: "Fungus - Powdery Mildew",
        damageExtent: "Minor",
        additionalNotes: "White, powdery spots are present on the upper surfaces of lower leaves. The infection appears to be in its early stages and is not yet widespread.",
    },
    reportSummary: "Claim report for fungal infection (Powdery Mildew) in wheat. AI analysis confirms minor damage, primarily on lower leaves. Recommend immediate fungicide application to prevent further spread. No significant yield loss expected if treated promptly.",
  },
    {
    id: "CLM-0004",
    crop: "Barley",
    damageType: "Insect Infestation - Aphids",
    status: "Pending",
    dateFiled: "07/21/2024",
    imageUrl: "https://picsum.photos/seed/insects/400/225",
    analysis: undefined,
    reportSummary: undefined,
  },
   {
    id: "CLM-0005",
    crop: "Canola",
    damageType: "Frost Damage",
    status: "Archived",
    dateFiled: "05/30/2024",
    imageUrl: "https://picsum.photos/seed/frost/400/225",
    analysis: {
        damageType: "Frost Damage",
        damageExtent: "Severe",
        additionalNotes: "Flowers and pods are desiccated and discolored. Significant yield loss is evident. This claim has been processed and closed.",
    },
    reportSummary: "Final report for frost damage on Canola crop. The damage was assessed as severe, leading to an 80% yield loss on the affected 50 acres. Compensation has been issued and the claim is now closed.",
  },
];
