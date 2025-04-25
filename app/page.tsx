"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Shield, Zap, Settings, Search, Link } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const router = useRouter();

  const NavigateTo = () => {
    router.push('/ai-assistants');
  }

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 mb-4 text-blue-500" />,
      title: "Natural Conversations",
      description: "Experience fluid, human-like interactions with advanced language processing capabilities."
    },
    {
      icon: <Zap className="w-6 h-6 mb-4 text-yellow-500" />,
      title: "Lightning Fast",
      description: "Get instant responses with our optimized performance architecture."
    },
    {
      icon: <Shield className="w-6 h-6 mb-4 text-green-500" />,
      title: "Privacy Focused",
      description: "Your data stays yours with our secure, privacy-first approach to AI."
    },
    {
      icon: <Settings className="w-6 h-6 mb-4 text-purple-500" />,
      title: "Customizable",
      description: "Tailor your assistant to your specific needs and preferences."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="absolute inset-0 z-0 bg-blue-50 dark:bg-blue-900/20 opacity-70 rounded-full scale-150 blur-3xl transform -translate-x-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Your Personal<span className="text-blue-600 dark:text-blue-400"> AI Assistant</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              Intelligent, intuitive, and designed to make your life easier.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2" onClick={NavigateTo}>
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-8 py-6 text-lg rounded-lg" onClick={NavigateTo}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Preview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">Personal AI Assistant</div>
          </div>
          <div className="p-6 md:p-8 h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg">
              <Search className="text-gray-400" />
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                placeholder="Ask me anything..."
                disabled
              />
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index: any) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={`rounded-full w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 mb-4 transition-transform duration-300 ${hoveredFeature === index ? 'scale-110' : ''}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 dark:bg-blue-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to experience the future of personal assistance?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join thousands of satisfied users who have transformed their productivity with our AI assistant.
          </p>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-lg font-medium">
            Start Your Free Trial
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-4">Personal AI Assistant</div>
            <p className="mb-6">Intelligent assistance for your everyday needs</p>
            <div className="flex justify-center gap-6 mb-8">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-sm">© 2025 Personal AI Assistant. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}