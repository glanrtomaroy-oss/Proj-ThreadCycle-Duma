function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-column">
                        <h3>ThreadCycle Duma</h3>
                        <p>A digital platform for slow fashion and sustainable living in Dumaguete City.</p>
                    </div>
                    <div className="footer-column">
                        <h3>Quick Links</h3>
                        <div className="footer-links">
                            <a href="#home">Home</a>
                            <a href="#scrap-estimator">Scrap Estimator</a>
                            <a href="#tutorials">Tutorials</a>
                            <a href="#thrift-map">Thrift Map</a>
                            <a href="#about">About</a>
                        </div>
                    </div>
                    <div className="footer-column">
                        <h3>Contact</h3>
                        <p>Dumaguete City, Philippines</p>
                        <p>Email: info@threadcycleduma.com</p>
                    </div>
                    <div className="footer-column">
                        <h3>Connect</h3>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
                <div className="copyright">
                    <p>&copy; 2025 ThreadCycle Duma. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
