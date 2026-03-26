import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { useRef } from "react";

export const plans = [
  {
    name: "Gratuit",
    description: "Accès de base à l'actualité RH pour les professionnels",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Plan actuel",
    buttonVariant: "outline" as const,
    features: [
      { text: "Articles d'actualité gratuits", icon: <Briefcase size={20} /> },
      { text: "Nominations récentes", icon: <Database size={20} /> },
      { text: "Ressources de base", icon: <Server size={20} /> },
    ],
    includes: [
      "Inclus gratuitement :",
      "Accès aux articles publics",
      "Newsletter mensuelle",
      "Réseau de base",
    ],
  },
  {
    name: "Mensuel",
    description: "Accès complet pendant un mois",
    price: 99,
    yearlyPrice: 99,
    buttonText: "Sélectionner",
    buttonVariant: "outline" as const,
    features: [
      { text: "Tous les articles premium", icon: <Briefcase size={20} /> },
      { text: "Templates RH professionnels", icon: <Database size={20} /> },
      { text: "Guides juridiques complets", icon: <Server size={20} /> },
    ],
    includes: [
      "Tout le plan Gratuit, plus :",
      "Interviews exclusives",
      "Outils RH Premium",
      "Support prioritaire",
    ],
  },
  {
    name: "Annuel",
    description: "Meilleur rapport qualité-prix pour un engagement long terme",
    price: 999,
    yearlyPrice: 999,
    popular: true,
    buttonText: "Sélectionner",
    buttonVariant: "default" as const,
    features: [
      { text: "Accès anticipé au contenu", icon: <Briefcase size={20} /> },
      { text: "Webinaires exclusifs", icon: <Database size={20} /> },
      { text: "Certificat de formation", icon: <Server size={20} /> },
    ],
    includes: [
      "Tout le plan Mensuel, plus :",
      "Économisez 189 MAD",
      "Accès aux événements VIP",
      "Support dédié 24/7",
    ],
  },
];

interface PricingProps {
  onSelectPlan?: (plan: any) => void;
}

export default function PricingSection({ onSelectPlan }: PricingProps) {
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <div
      className="px-4 pt-20 min-h-screen max-w-7xl mx-auto relative"
      ref={pricingRef}
    >
      <article className="flex sm:flex-row flex-col sm:pb-0 pb-4 sm:items-center items-start justify-between">
        <div className="text-left mb-6">
          <h2 className="text-4xl font-medium leading-[130%] text-gray-900 mb-4">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-start"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0,
              }}
            >
              Forfaits & Adhésion
            </VerticalCutReveal>
          </h2>

          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-gray-600 w-[80%]"
          >
            Rejoignez des milliers de professionnels RH au Maroc. Choisissez le forfait qui correspond le mieux à vos besoins.
          </TimelineContent>
        </div>
      </article>

      <TimelineContent
        as="div"
        animationNum={2}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="grid md:grid-cols-3 gap-4 mx-auto bg-gradient-to-b from-neutral-100 to-neutral-200 sm:p-3 rounded-lg"
      >
        {plans.map((plan, index) => (
          <TimelineContent
            as="div"
            key={plan.name}
            animationNum={index + 3}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative flex-col flex justify-between h-full ${
                plan.popular
                  ? "scale-110 ring-2 ring-neutral-900 bg-gradient-to-t from-black to-neutral-900 text-white"
                  : "border-none shadow-none bg-transparent pt-4 text-gray-900"
              }`}
            >
              <CardContent className="pt-0 flex-1">
                <div className="space-y-2 pb-3">
                  {plan.popular && (
                    <div className="pt-4">
                      <span className="bg-neutral-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Populaire
                      </span>
                    </div>
                  )}

                  <div className="flex items-baseline">
                    <span className="text-4xl font-semibold">
                      <NumberFlow
                        format={{
                          style: "currency",
                          currency: "MAD",
                          maximumFractionDigits: 0
                        }}
                        value={plan.popular ? 999 : plan.price}
                        className="text-4xl font-semibold"
                      />
                    </span>
                    <span
                      className={
                        plan.popular
                          ? "text-neutral-200 ml-1"
                          : "text-gray-600 ml-1"
                      }
                    >
                      /{plan.popular ? "an" : "mois"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <h3 className="text-3xl font-semibold mb-2">{plan.name}</h3>
                </div>
                <p
                  className={
                    plan.popular
                      ? "text-sm text-neutral-200 mb-4"
                      : "text-sm text-gray-600 mb-4"
                  }
                >
                  {plan.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <h4 className="font-medium text-base mb-3">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2 font-semibold">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span
                          className={
                            plan.popular
                              ? "text-white h-6 w-6 bg-neutral-600 border border-neutral-500 rounded-full grid place-content-center mt-0.5 mr-3 flex-shrink-0"
                              : "text-black h-6 w-6 bg-white border border-black rounded-full grid place-content-center mt-0.5 mr-3 flex-shrink-0"
                          }
                        >
                          <CheckCheck className="h-4 w-4" />
                        </span>
                        <span
                          className={
                            plan.popular
                              ? "text-sm text-neutral-100"
                              : "text-sm text-gray-600"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <button
                  onClick={() => onSelectPlan && onSelectPlan(plan)}
                  disabled={plan.price === 0}
                  className={`w-full mb-6 p-4 text-xl rounded-xl transition-all ${
                    plan.popular
                      ? "bg-gradient-to-t from-neutral-100 to-neutral-300 font-semibold shadow-lg shadow-neutral-500 border border-neutral-400 text-black hover:scale-[1.02]"
                      : plan.price === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                      : "bg-gradient-to-t from-neutral-900 to-neutral-600 shadow-lg shadow-neutral-900 border border-neutral-700 text-white hover:scale-[1.02]"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </CardFooter>
            </Card>
          </TimelineContent>
        ))}
      </TimelineContent>
    </div>
  );
}
