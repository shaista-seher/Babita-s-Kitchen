import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Award, Heart, Users, Sparkles } from "lucide-react";

export default function Story() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-[#f8f6f2]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 tracking-wide">
              OUR <span className="text-[#800000]">STORY</span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary/80 font-medium leading-relaxed font-serif italic">
              What began in 2020 as one woman's dream in her kitchen has blossomed into a powerful testament to female entrepreneurship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Story Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-lg border border-border/30"
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-xl leading-relaxed text-secondary/80 mb-8 font-serif">
                Babita's unwavering spirit and culinary genius prove that when women support women, incredible things happen.
              </p>

              <div className="my-10 p-8 bg-amber-50 rounded-3xl border border-amber-100">
                <p className="text-lg leading-relaxed text-secondary/90 italic font-serif">
                  "Every spice, every recipe, every dish carries the essence of feminine strength and nurturing love. We're not just selling food—we're sharing the legacy of generations of women who have preserved culture through cuisine, breaking barriers and building empires from their kitchens."
                </p>
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6 tracking-wide">
                OUR MISSION
              </h2>
              <p className="text-lg leading-relaxed text-secondary/80 mb-8 font-serif">
                Our mission transcends business. We're creating opportunities for women, celebrating female leadership, and proving that the kitchen isn't just where meals are made—it's where revolutions begin.
              </p>

              <div className="my-10 p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                <p className="text-lg leading-relaxed text-secondary/90 font-medium font-serif">
                  When you choose Babita's Kitchen, you're investing in a woman's dream and supporting female-led enterprise.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 tracking-wide">
              WHAT WE STAND FOR
            </h2>
            <p className="text-lg text-secondary/70 max-w-2xl mx-auto font-serif italic">
              Our values guide everything we do, from sourcing ingredients to serving our community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Nurturing Love",
                description: "Every dish is made with love and care, just like home-cooked meals"
              },
              {
                icon: Award,
                title: "Quality First",
                description: "We use only the finest organic ingredients in all our products"
              },
              {
                icon: Users,
                title: "Women Empowerment",
                description: "Supporting female entrepreneurs and creating opportunities for women"
              },
              {
                icon: Sparkles,
                title: "Tradition & Innovation",
                description: "Preserving traditional recipes while embracing modern culinary arts"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-[#f8f6f2] rounded-3xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-[#800000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-[#800000]" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2 tracking-wide">
                  {value.title.toUpperCase()}
                </h3>
                <p className="text-sm text-secondary/70 font-serif">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#800000]/10 to-[#8B5E3C]/10" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6 tracking-wide">
              JOIN OUR JOURNEY
            </h2>
            <p className="text-lg text-secondary/80 mb-8 max-w-2xl mx-auto font-serif">
              Be part of something bigger. Every meal you order supports female entrepreneurship and keeps traditions alive.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

