import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import NumberFlow from "@number-flow/react";
import { CheckCheck, Users, Target, Crown } from "lucide-react";
import { useRef, useState } from "react";

// ─── New 3-Tier Pricing Plans ─────────────────────────────
export const plans = [
  {
    id: 1,
    tierId: "COMMUNITY",
    name: "Community",
    tagline: "Pour démarrer",
    description: "Accès à la communauté WhatsApp et agenda des meetups",
    priceIndividual: 100,
    priceCompany: 100,
    popular: false,
    icon: <Users size={20} />,
    buttonText: "Rejoindre",
    accentColor: "#00B4A6",
    features: [
      "Groupe WhatsApp exclusif PATH",
      "Agenda & programme des meetups",
      "Newsletter premium mensuelle",
      "Annuaire des membres",
    ],
    note: "Meetup : 400 dh / participation",
    includes: [
      "Inclus :",
      "Groupe WhatsApp PATH",
      "Agenda meetups",
      "Newsletter mensuelle",
    ],
  },
  {
    id: 2,
    tierId: "PROFESSIONAL",
    name: "Professionnel",
    tagline: "Benchmark & Meetups",
    description: "Tous les meetups inclus + accès aux benchmarks RH premium",
    priceIndividual: 2500,
    priceCompany: 3500,
    popular: true,
    icon: <Target size={20} />,
    buttonText: "Sélectionner",
    accentColor: "#7B2D8E",
    features: [
      "Tout le Pack Community",
      "Tous les meetups inclus",
      "Discussions Benchmark RH",
      "Contenus & études exclusives",
      "Templates RH professionnels",
      "Webinaires experts",
    ],
    note: null,
    includes: [
      "Tout Community, plus :",
      "Tous meetups inclus",
      "Benchmark RH",
      "Contenus premium",
    ],
  },
  {
    id: 3,
    tierId: "SENIOR",
    name: "Senior / Recruteur",
    tagline: "Droits éditoriaux",
    description: "Tous les avantages Pro + droits de publication sur la plateforme",
    priceIndividual: 4000,
    priceCompany: 5000,
    popular: false,
    icon: <Crown size={20} />,
    buttonText: "Sélectionner",
    accentColor: "#d97706",
    features: [
      "Tout le Pack Professionnel",
      "Publication d'annonces",
      "Articles & contenu éditorial",
      "Accès BDD RH avancée",
      "Profil DRH mis en avant",
      "Badge Senior visible",
    ],
    note: null,
    includes: [
      "Tout Professionnel, plus :",
      "Publication d'annonces",
      "Accès BDD RH avancée",
      "Support dédié 24/7",
    ],
  },
];

interface PricingProps {
  onSelectPlan?: (plan: typeof plans[0]) => void;
}

export default function PricingSection({ onSelectPlan }: PricingProps) {
  const pricingRef = useRef<HTMLDivElement>(null);
  const [accountType, setAccountType] = useState<"INDIVIDUAL" | "COMPANY">("INDIVIDUAL");

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 0.35, duration: 0.5 },
    }),
    hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  };

  return (
    <div className="px-4 pt-16 pb-20 max-w-7xl mx-auto relative" ref={pricingRef}>

      {/* Header */}
      <article className="flex sm:flex-row flex-col sm:pb-0 pb-4 sm:items-end items-start justify-between mb-10 gap-6">
        <div className="text-left">
          <h2 className="text-4xl font-bold leading-[130%] text-gray-900 mb-3">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-start"
              transition={{ type: "spring", stiffness: 250, damping: 40, delay: 0 }}
            >
              Forfaits & Adhésion
            </VerticalCutReveal>
          </h2>
          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-gray-600 max-w-lg"
          >
            Rejoignez des milliers de professionnels RH au Maroc. Choisissez le forfait qui correspond à vos besoins.
          </TimelineContent>
        </div>

        {/* Account Type Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 flex-shrink-0">
          {(["INDIVIDUAL", "COMPANY"] as const).map(type => (
            <button
              key={type}
              onClick={() => setAccountType(type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                accountType === type
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {type === "INDIVIDUAL" ? "👤 Individuel" : "🏢 Entreprise"}
            </button>
          ))}
        </div>
      </article>

      {/* Plans Grid */}
      <TimelineContent
        as="div"
        animationNum={2}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="grid md:grid-cols-3 gap-5 mx-auto"
      >
        {plans.map((plan, index) => {
          const price = accountType === "INDIVIDUAL" ? plan.priceIndividual : plan.priceCompany;
          return (
            <TimelineContent
              as="div"
              key={plan.name}
              animationNum={index + 3}
              timelineRef={pricingRef}
              customVariants={revealVariants}
            >
              <Card
                className={`relative flex-col flex justify-between h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "ring-2 ring-[#7B2D8E] shadow-xl shadow-purple-100"
                    : "border border-gray-200 shadow-sm hover:shadow-md"
                }`}
                style={{
                  background: plan.popular
                    ? "linear-gradient(160deg, #1a0a2e 0%, #291244 50%, #3c1a63 100%)"
                    : "#ffffff",
                }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7B2D8E] via-[#00B4A6] to-[#7B2D8E]" />
                )}

                <CardContent className="pt-6 pb-2 flex-1">
                  {/* Icon + badge row */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: plan.popular ? "rgba(255,255,255,0.12)" : `${plan.accentColor}15`,
                        color: plan.popular ? "#4de0d4" : plan.accentColor,
                      }}
                    >
                      {plan.icon}
                    </div>
                    {plan.popular && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(0,180,166,0.2)", color: "#4de0d4" }}>
                        ★ Populaire
                      </span>
                    )}
                    {plan.tierId === "SENIOR" && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(217,119,6,0.1)", color: "#d97706" }}>
                        ✏️ Éditorial
                      </span>
                    )}
                  </div>

                  {/* Name & tagline */}
                  <h3 className={`text-xl font-bold mb-0.5 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mb-4 ${plan.popular ? "text-purple-200" : "text-gray-400"}`}>
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <NumberFlow
                      format={{ style: "currency", currency: "MAD", maximumFractionDigits: 0 }}
                      value={price}
                      className={`text-3xl font-black ${plan.popular ? "text-white" : "text-gray-900"}`}
                    />
                    <span className={`text-sm ${plan.popular ? "text-purple-200" : "text-gray-400"}`}>/mois</span>
                  </div>
                  {plan.priceIndividual !== plan.priceCompany && (
                    <p className={`text-xs mb-4 ${plan.popular ? "text-purple-300" : "text-gray-400"}`}>
                      {accountType === "INDIVIDUAL" ? "Tarif individuel" : "Tarif entreprise"}
                    </p>
                  )}

                  {/* Description */}
                  <p className={`text-sm mb-5 leading-relaxed ${plan.popular ? "text-purple-100" : "text-gray-500"}`}>
                    {plan.description}
                  </p>

                  {/* Features */}
                  <div className={`border-t pt-4 space-y-2 ${plan.popular ? "border-white/10" : "border-gray-100"}`}>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${plan.popular ? "text-purple-300" : "text-gray-400"}`}>
                      {plan.includes[0]}
                    </p>
                    <ul className="space-y-2">
                      {plan.includes.slice(1).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span
                            className={`h-5 w-5 rounded-full grid place-content-center flex-shrink-0 ${
                              plan.popular
                                ? "bg-white/10 text-teal-400"
                                : "border border-gray-200 text-gray-600 bg-white"
                            }`}
                          >
                            <CheckCheck className="h-3 w-3" />
                          </span>
                          <span className={`text-sm ${plan.popular ? "text-purple-100" : "text-gray-600"}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {plan.note && (
                      <p className="text-xs text-amber-600 font-medium mt-3 bg-amber-50 px-3 py-2 rounded-lg">
                        ⚠️ {plan.note}
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-2 pb-6">
                  <button
                    onClick={() => onSelectPlan && onSelectPlan(plan)}
                    className={`w-full py-3 text-sm font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      plan.popular
                        ? "bg-gradient-to-r from-white to-gray-100 text-gray-900 shadow-lg"
                        : plan.tierId === "SENIOR"
                        ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-md shadow-amber-200"
                        : "bg-gray-900 text-white hover:bg-gray-800 shadow-md"
                    }`}
                  >
                    {plan.buttonText} →
                  </button>
                </CardFooter>
              </Card>
            </TimelineContent>
          );
        })}
      </TimelineContent>

      {/* Referral CTA */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          🔗 <strong>Programme de parrainage :</strong> Invitez un membre et gagnez{" "}
          <span className="text-[#00B4A6] font-bold">250 MAD de crédits</span>. L'invité bénéficie de{" "}
          <span className="text-[#7B2D8E] font-bold">10% de réduction</span>.{" "}
          <a href="/register" className="underline text-[#7B2D8E] font-semibold">S'inscrire →</a>
        </p>
      </div>
    </div>
  );
}
