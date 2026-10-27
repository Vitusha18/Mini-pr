import React from 'react';
import { BrainCircuit, CloudSun, ShieldCheck, Cpu, Droplets, Thermometer, Wind, Gauge } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export const FeaturesSection = () => {
  const features = [
    {
      icon: BrainCircuit,
      title: 'AI-Based Pest Prediction',
      badge: 'Core Engine',
      description: 'Use environmental indicators and crop information to estimate pest outbreak risk before visible damage occurs.',
      points: [
        'Multi-factor environmental correlation',
        'Crop growth stage consideration',
        'Risk level stratification (Low to Critical)'
      ]
    },
    {
      icon: CloudSun,
      title: 'Live Weather Monitoring',
      badge: 'Open-Meteo Integration',
      description: 'Monitor environmental conditions associated with pest life-cycles using real-time farm coordinates.',
      points: [
        'Zero cost Open-Meteo integration',
        'Hyper-local latitude & longitude lookup',
        'Soil moisture & canopy temperature metrics'
      ]
    },
    {
      icon: ShieldCheck,
      title: 'Smart Preventive Recommendations',
      badge: 'Actionable Guidance',
      description: 'Provide useful preventive guidance based on prediction results, emphasizing integrated pest management.',
      points: [
        'Early cultural & biological control alerts',
        'Pheromone trap & barrier timings',
        'Responsible, scientifically supported practices'
      ]
    },
  ];

  const indicators = [
    { label: 'Ambient Temperature', icon: Thermometer, unit: '°C' },
    { label: 'Relative Humidity', icon: Droplets, unit: '%' },
    { label: 'Rainfall & Wetness', icon: CloudSun, unit: 'mm' },
    { label: 'Wind Velocity', icon: Wind, unit: 'km/h' },
    { label: 'Atmospheric Pressure', icon: Gauge, unit: 'hPa' },
    { label: 'Soil Temperature & Moisture', icon: Cpu, unit: '°C / %' },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white border-y border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="success" size="md" className="mb-3">
            Core Capabilities
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
            Built for Early Prevention, Not Delayed Reaction
          </h2>
          <p className="mt-4 text-base text-brand-secondary leading-relaxed">
            By analyzing climatic indicators that foster insect breeding, PestGuard AI provides actionable intelligence before pest infestations inflict irreversible crop loss.
          </p>
        </div>

        {/* 3 Main Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} hoverEffect padding="lg" className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-lightgreen flex items-center justify-center text-brand-green">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <Badge variant="neutral" size="sm">
                      {feat.badge}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-brand-dark mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-brand-secondary leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {feat.points.map((pt) => (
                    <div key={pt} className="flex items-start gap-2 text-xs text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-green mt-1.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Environmental Indicators Strip */}
        <div className="mt-16 bg-brand-bg rounded-2xl p-6 sm:p-8 border border-brand-border">
          <div className="text-center mb-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-dark">
              Key Environmental Predictors Utilized
            </h4>
            <p className="text-xs text-brand-secondary mt-1">
              Direct telemetry from Open-Meteo processed into pest-habitat viability indicators
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {indicators.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.label}
                  className="bg-white rounded-xl p-4 border border-slate-200/70 text-center flex flex-col items-center justify-center shadow-soft"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-brand-green mb-2.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-brand-dark leading-tight">
                    {item.label}
                  </span>
                  <span className="text-xs text-brand-secondary mt-1">
                    ({item.unit})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
