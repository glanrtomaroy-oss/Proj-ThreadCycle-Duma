import { useState } from 'react';

function AboutPage() {

  return (
    <>
      {/* Hero Section for About Page */}
      <section className="hero about-hero" id="about">
        <div className="container">
          <h1>About ThreadCycle Duma</h1>
          <p>
            Learn about our mission to promote sustainable fashion in Dumaguete City
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>ThreadCycle Duma was born out of a passion for sustainable fashion and a desire to address the growing issue of textile waste in our community. Founded in 2023, our platform connects local fashion creators, tailoring shops, and sewing enthusiasts who share a common goal: to reduce fashion waste and promote eco-friendly practices.</p>
              
              <p>Dumaguete City, known as the "City of Gentle People," has a rich culture of creativity and community. We wanted to harness this spirit to create a movement towards more sustainable fashion choices that benefit both our community and our environment.</p>
              
              <h2>Our Mission</h2>
              <p>Our mission is to provide a centralized platform that encourages the reuse, repurposing, and responsible management of fabrics within the Dumaguete community. We aim to:</p>
              <ul>
                <li>Reduce textile waste through education and practical tools</li>
                <li>Support local thrift shops and sustainable businesses</li>
                <li>Create a community around slow fashion practices</li>
                <li>Educate people on repairing and upcycling clothing</li>
                <li>Track and celebrate our collective impact on reducing fashion waste</li>
              </ul>
              
              <h2>Our Vision</h2>
              <p>We envision a Dumaguete City where sustainable fashion is the norm, not the exception. A community where clothing is valued, repaired, and repurposed, and where the environmental impact of our fashion choices is minimized through conscious consumption and creative reuse.</p>
            </div>
            
            <div className="about-image">
              <div className="image-placeholder">
                <i className="fas fa-leaf"></i>
                    <img src="./src/assets/aboutpic.jpg" alt="Sustainable Fashion Community" />
              </div>
            </div>
          </div>
          
          {/* Team Section */}
          <div className="team-section">
            <div className="section-title">
              <h2>Our Team</h2>
              <p>The passionate individuals behind ThreadCycle Duma</p>
            </div>
            
            <div className="team-grid">
  <div className="team-member">
    <div className="member-image">
      <img src="member1.png" alt="Glan R. Tomaroy" />
    </div>
    <h3>Glan R. Tomaroy</h3>
    <p className="member-role">Co-Founder & Developer</p>
    <p>IT professional with a passion for sustainable solutions and community development.</p>
  </div>

  <div className="team-member">
    <div className="member-image">
      <img src="member2.jpg" alt="Voughn John Zoe N. Villalon" />
    </div>
    <h3>Voughn John Zoe N. Villalon</h3>
    <p className="member-role">Co-Founder & Sustainability Expert</p>
    <p>Fashion enthusiast with expertise in sustainable practices and community engagement.</p>
  </div>

  <div className="team-member">
    <div className="member-image">
      <img src="member3.jpg" alt="Kate Valerie Katada" />
    </div>
    <h3>Kate Valerie Katada</h3>
    <p className="member-role">Co-Founder & Sustainability Expert</p>
    <p>Fashion enthusiast with expertise in sustainable practices and community engagement.</p>
  </div>
</div>
          </div>
          
        </div>
      </section>
    </>
  );
}

export default AboutPage;
