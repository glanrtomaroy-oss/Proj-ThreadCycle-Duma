import { useState } from 'react';

function AboutPage() {

  return (
    <>
      {/* Hero Section for About Page */}
      <section className="bg-gradient-to-r from-[#7a8450] to-[rgba(38,70,83,0.8)] bg-cover bg-center text-white py-20 text-center bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')]" id="about">
        <div className="w-full max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-5">About ThreadCycle Duma</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Learn about our mission to promote sustainable fashion in Dumaguete City
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-10 pb-20">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 mb-16">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mt-6 first:mt-0">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">ThreadCycle Duma was born out of a passion for sustainable fashion and a desire to address the growing issue of textile waste in our community. Founded in 2023, our platform connects local fashion creators, tailoring shops, and sewing enthusiasts who share a common goal: to reduce fashion waste and promote eco-friendly practices.</p>

              <p className="text-gray-600 leading-relaxed">Dumaguete City, known as the "City of Gentle People," has a rich culture of creativity and community. We wanted to harness this spirit to create a movement towards more sustainable fashion choices that benefit both our community and our environment.</p>

              <h2 className="text-2xl font-bold text-gray-800 mt-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">Our mission is to provide a centralized platform that encourages the reuse, repurposing, and responsible management of fabrics within the Dumaguete community. We aim to:</p>
              <ul className="ml-5 mb-5 space-y-2">
                <li className="text-gray-600 leading-relaxed">Reduce textile waste through education and practical tools</li>
                <li className="text-gray-600 leading-relaxed">Support local thrift shops and sustainable businesses</li>
                <li className="text-gray-600 leading-relaxed">Create a community around slow fashion practices</li>
                <li className="text-gray-600 leading-relaxed">Educate people on repairing and upcycling clothing</li>
                <li className="text-gray-600 leading-relaxed">Track and celebrate our collective impact on reducing fashion waste</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-800 mt-6">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">We envision a Dumaguete City where sustainable fashion is the norm, not the exception. A community where clothing is valued, repaired, and repurposed, and where the environmental impact of our fashion choices is minimized through conscious consumption and creative reuse.</p>
            </div>

            <div className="flex justify-center">
              <div className="relative w-full max-w-sm h-[600px] flex items-center justify-center">
                <i className="fas fa-leaf absolute text-green-600 text-xl hidden"></i>
                <img src="aboutpic.jpg" alt="Sustainable Fashion Community" className="w-full h-full rounded-xl object-cover shadow-lg" />
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="my-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Team</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">The passionate individuals behind ThreadCycle Duma</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg text-center p-5 transition-transform hover:-translate-y-1">
                <div className="w-30 h-30 rounded-full overflow-hidden mx-auto mb-4">
                  <img src="member1.png" alt="Glan R. Tomaroy" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-gray-800 mb-1">Glan R. Tomaroy</h3>
                <p className="text-[#4c5f0d] font-medium mb-2">Co-Founder & Developer</p>
                <p className="text-gray-600 text-sm">IT professional with a passion for sustainable solutions and community development.</p>
              </div>

              <div className="bg-white rounded-lg overflow-hidden shadow-lg text-center p-5 transition-transform hover:-translate-y-1">
                <div className="w-30 h-30 rounded-full overflow-hidden mx-auto mb-4">
                  <img src="member2.jpg" alt="Voughn John Zoe N. Villalon" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-gray-800 mb-1">Voughn John Zoe N. Villalon</h3>
                <p className="text-[#4c5f0d] font-medium mb-2">Co-Founder & Sustainability Expert</p>
                <p className="text-gray-600 text-sm">Fashion enthusiast with expertise in sustainable practices and community engagement.</p>
              </div>

              <div className="bg-white rounded-lg overflow-hidden shadow-lg text-center p-5 transition-transform hover:-translate-y-1">
                <div className="w-30 h-30 rounded-full overflow-hidden mx-auto mb-4">
                  <img src="member3.jpg" alt="Kate Valerie Katada" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-gray-800 mb-1">Kate Valerie Katada</h3>
                <p className="text-[#4c5f0d] font-medium mb-2">Co-Founder & Sustainability Expert</p>
                <p className="text-gray-600 text-sm">Fashion enthusiast with expertise in sustainable practices and community engagement.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default AboutPage;
