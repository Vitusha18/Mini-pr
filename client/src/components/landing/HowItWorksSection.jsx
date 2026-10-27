import React from 'react';
import { UserPlus, MapPin, Sprout, CloudSun, BrainCircuit, BellRing, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Register Account',
      description: 'Sign up securely as a farmer with your name and email credentials.',
      icon: UserPlus,
    },
    {
      step: '02',
      title: 'Add Farm',
      description: 'Pinpoint your farm on the map to bind precise latitude and longitude coordinates.',
      icon: MapPin,
    },
    {
      step: '03',
      title: 'Select Crop',
      description: 'Register your planted crop, growth phase, sowing date, and optional supporting photo.',
      icon: Sprout,
    },
    {
      step: '04',
      title: 'Monitor Environment',
      description: 'System automatically queries Open-Meteo for real-time temperature, humidity, and rain.',
      icon: CloudSun,
    },
    {
      step: '05',
      title: 'Predict Pest Risk',
      description: 'AI model evaluates environmental thresholds to calculate species outbreak risk level.',
      icon: BrainCircuit,
    },
    {
      step: '06',
      title: 'Receive Warning',
      description: 'Get actionable warnings and preventive steps before pests damage your harvest.',
      icon: BellRing,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="success" size="md" className="mb-3">
            Workflow Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
            How PestGuard AI Works
          </h2>
          <p className="mt-4 text-base text-brand-secondary leading-relaxed">
            A continuous closed-loop pipeline from farm registration to early predictive notification.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} hoverEffect padding="md" className="relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-lightgreen flex items-center justify-center text-brand-green">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-sm font-black text-slate-300 font-mono">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-brand-dark mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Banner callout */}
        <div id="prediction" className="mt-14 bg-white rounded-2xl p-8 border border-brand-border shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-brand-dark">
              Scientific Prediction Basis
            </h3>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-2xl">
              Pest lifecycles and reproductive bursts are directly accelerated by specific temperature windows, sustained leaf wetness, and humidity spikes. Our platform turns these correlations into early warnings.
            </p>
          </div>
          <a href="#home" className="flex-shrink-0">
            <Badge variant="primary" size="lg">
              Environmental Indicators First
            </Badge>
          </a>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
