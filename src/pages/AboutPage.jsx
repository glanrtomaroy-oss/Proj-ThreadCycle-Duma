import { useState } from 'react';

// About page: mission, goals, and team information
function AboutPage() {

  return (
    <>
      {/* Hero Section for About Page */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center bg-no-repeat" id="about">

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#7a8450]/70 to-[rgba(38,70,83,0.8)]"></div>

        <div className="relative w-full max-w-6xl mx-auto px-4 text-white py-20 text-center">
          <h1 className="text-4xl font-bold mb-5">About ThreadCycle Duma</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Learn about our mission to promote sustainable fashion in Dumaguete City
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-[#FEFEE3] py-12">
        <div className="w-full max-w-6xl mx-auto px-4 space-y-12">
          {/* About the Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#F5FAF6] border border-[#2C6E49]/10 rounded-2xl p-7 shadow-md">
              <h2 className="text-2xl font-bold text-[#2C6E49] mb-3">About ThreadCycle</h2>
              <p className="text-gray-700 leading-relaxed">ThreadCycle Duma is a community platform focused on sustainable fashion and circular practices. We help residents discover thrift shops, learn upcycling skills, and track impact through tools like the Scrap Estimator.</p>
            </div>
            <div className="bg-[#F5FAF6] border border-[#2C6E49]/10 rounded-2xl p-7 shadow-md">
              <h2 className="text-2xl font-bold text-[#2C6E49] mb-3">Our Goals</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-relaxed">
                <li>Reduce textile waste through education and practical tools</li>
                <li>Support local thrift shops and sustainable businesses</li>
                <li>Build a community around repair, reuse, and upcycling</li>
                <li>Promote conscious consumption and creative reuse</li>
              </ul>
            </div>
          </div>

          {/* About Us - Team Cards */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#2C6E49]">About Us</h2>
              <p className="text-gray-600">The team behind ThreadCycle Duma</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white border border-[#2C6E49]/10 rounded-2xl text-center p-6 shadow-sm hover:shadow-md transition-shadow">
                <img src="member1.png" alt="Glan R. Tomaroy" className="w-28 h-28 object-cover rounded-full mx-auto mb-4 ring-2 ring-[#2C6E49]/20" />
                <h3 className="text-gray-800 font-semibold">Glan R. Tomaroy</h3>
                <p className="text-[#2C6E49] font-medium">Co-Founder & Developer</p>
              </div>
              <div className="bg-white border border-[#2C6E49]/10 rounded-2xl text-center p-6 shadow-sm hover:shadow-md transition-shadow">
                <img src="member2.jpg" alt="Voughn John Zoe N. Villalon" className="w-28 h-28 object-cover rounded-full mx-auto mb-4 ring-2 ring-[#2C6E49]/20" />
                <h3 className="text-gray-800 font-semibold">Voughn John Zoe N. Villalon</h3>
                <p className="text-[#2C6E49] font-medium">Co-Founder & Sustainability Expert</p>
              </div>
              <div className="bg-white border border-[#2C6E49]/10 rounded-2xl text-center p-6 shadow-sm hover:shadow-md transition-shadow">
                <img src="member3.jpg" alt="Kate Valerie Katada" className="w-28 h-28 object-cover rounded-full mx-auto mb-4 ring-2 ring-[#2C6E49]/20" />
                <h3 className="text-gray-800 font-semibold">Kate Valerie Katada</h3>
                <p className="text-[#2C6E49] font-medium">Co-Founder & Secretary</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
