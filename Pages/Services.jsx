import React, { useRef, useEffect , useState} from 'react';
import SC1 from '../Images/SE-1.webp';
import SC2 from '../Images/SE-2.webp';
import SC3 from '../Images/SE-3.webp';
import Nav from '../Components/Nav';
import Sidebar from '../Components/Sidebar';

const Services = () => {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const featuresRef = useRef(null);
  const processRef = useRef(null);
  const pricingRef = useRef(null);

  const [sideopen, setsideopen] = useState(false)

  useEffect(() => {
    // Hero Animation
    if (heroRef.current) {
      heroRef.current.style.opacity = '0';
      heroRef.current.style.transform = 'translateY(30px)';
      setTimeout(() => {
        heroRef.current.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        heroRef.current.style.opacity = '1';
        heroRef.current.style.transform = 'translateY(0)';
      }, 100);
    }

    // Services Cards Animation
    if (servicesRef.current) {
      const cards = servicesRef.current.querySelectorAll('.service-card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        setTimeout(() => {
          card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 300 + index * 150);
      });
    }

    // Features Animation
    if (featuresRef.current) {
      const features = featuresRef.current.querySelectorAll('.feature-item');
      features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-30px)';
        setTimeout(() => {
          feature.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          feature.style.opacity = '1';
          feature.style.transform = 'translateX(0)';
        }, 600 + index * 100);
      });
    }

    // Process Steps Animation
    if (processRef.current) {
      const steps = processRef.current.querySelectorAll('.process-step');
      steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'scale(0.9)';
        setTimeout(() => {
          step.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          step.style.opacity = '1';
          step.style.transform = 'scale(1)';
        }, 800 + index * 150);
      });
    }

    // Pricing Cards Animation
    if (pricingRef.current) {
      const pricing = pricingRef.current.querySelectorAll('.pricing-card');
      pricing.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
          card.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 1000 + index * 150);
      });
    }
  }, []);

  return (
    <>
    <Nav setsideopen={setsideopen}/>
    <Sidebar sideopen={sideopen}/>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-93">
          <img src={SC1} alt="404" className='h-full w-full object-cover'/>
        </div>
        
        <div ref={heroRef} className="relative z-10 max-w-7xl mt-18 mx-auto px-8 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Our Services</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            We provide reliable, high-quality solutions tailored to meet your needs and help you grow with confidence.
          </p>
        </div>
      </div>

      {/* Main Services */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">What We Offer</h2>
        <div ref={servicesRef} className="grid md:grid-cols-3 gap-8">
          <div className="service-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Structured Learning</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
             Well-organized study materials designed to help you understand concepts clearly and learn at your own pace.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Concept Clarity
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Study Foucs
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pratice & Revision
              </li>
            </ul>
          </div>

          <div className="service-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 group">
            <div className="w-20 h-20 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Study Tools</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Interactive tools and features that help you manage time, track progress, and stay consistent with your studies.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Time Management
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Progress Tracking
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Focus & Productivity
              </li>
            </ul>
          </div>

          <div className="service-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 group">
            <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Exam-Focused Support</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Targeted guidance and resources to help you prepare effectively for exams and perform with confidence.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Syllabus Coverage
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Practice Tests
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Revision & Strategy
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Why Choose Us</h2>
              <div ref={featuresRef} className="space-y-6">
                <div className="feature-item flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Learning System</h3>
                    <p className="text-gray-600">The system provides adaptive learning content, quizzes, progress reports, study reminders, interactive tools, and guidance for exam success.</p>
                  </div>
                </div>

                <div className="feature-item flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assured</h3>
                    <p className="text-gray-600">Our content is carefully designed and verified by experts to ensure high-quality, reliable, and effective learning.</p>
                  </div>
                </div>

                <div className="feature-item flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
                    <p className="text-gray-600">Our team is available around the clock to assist you with questions, guidance, and technical support anytime.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden opacity-89 shadow-xl">
              <img src={SC2} alt="404" className='h-full w-full object-cover' />
            </div>
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Our Process</h2>
        <div ref={processRef} className="grid md:grid-cols-4 gap-8">
          <div className="process-step text-center">
            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Discovery</h3>
            <p className="text-gray-600">Get Introduced to the services of Study Pulse</p>
          </div>

          <div className="process-step text-center">
            <div className="w-20 h-20 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Create Account</h3>
            <p className="text-gray-600">Create an account on our platform to explore more</p>
          </div>

          <div className="process-step text-center">
            <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Your Path</h3>
            <p className="text-gray-600">Select the service which suits your needs</p>
          </div>

          <div className="process-step text-center">
            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
              4
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Get Started</h3>
            <p className="text-gray-600">Start your journey with Study Pulse and Get reminders daily</p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Pricing Plans</h2>
          <div ref={pricingRef} className="grid md:grid-cols-3 gap-8">
            <div className="pricing-card bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Normal copilot chat
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No Reminders 
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic Study Material
                </li>
              </ul>
              <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Get Started
              </button>
            </div>

            <div className="pricing-card bg-linear-to-br from-emerald-500 to-teal-500 p-8 rounded-2xl shadow-xl transform scale-105 relative">
              <div className="absolute top-0 right-0 bg-white text-emerald-600 px-4 py-1 rounded-bl-lg rounded-tr-2xl text-sm font-bold">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Advanced</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$100</span>
                <span className="text-emerald-100">/6 months</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  GPT-5 chat
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 Study Reminders
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All types of Study Material
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
                Get Started
              </button>
            </div>

            <div className="pricing-card bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Package</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$75</span>
                <span className="text-gray-600">/per annum</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copilot-5 chat
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 Study Reminders
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Pakistan Board Study Material
                </li>
              </ul>
              <button className="w-full py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors duration-200">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className=" py-20" style={{
        backgroundImage: `url(${SC3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        
      }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Explore with Study Pulse</h2>
          <p className="text-xl text-blue-100 mb-8">
            Explore with Study Pulse, Create Account and Get Started Today with Study Pulse!
          </p>
          <button className="px-8 py-4 bg-[linear-linear(90deg,#6e1db5,#E94C89)] text-white font-semibold rounded-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl hover:cursor-pointer">
            Explore Now!
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Services;