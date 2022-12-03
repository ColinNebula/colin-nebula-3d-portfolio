import React from 'react';
import ProfilePic from '../../assets/images/profile.jpg';

function About() {
    return (
        <section>
            <div className="center" id="about">
				<h1 className="page-header">About</h1>
			</div>
            <div className="center">
				<img
					src={ProfilePic}
					alt="about-me"
					className="photo"
				/>
			</div>
            <div className="about-me">
                <p>
                    Hi my name is Colin, a full-stack web developer based out of Toronto, Canada. 
                    My journey into tech started at the end of 2020 when I lost my corporate sales job due to the pandemic. 
                    I took the opportunity to reinvent myself and pursue a new and challenging career in web development.
                </p>
                <p>
                    I'm leveraging my telecommunications sales background to build a more intuitive user experience on the web. 
                    I recently earned a certificate in full-stack web development from the University of Toronto, 
                    with newly developed skills in JavaScript, CSS, React.js, and responsive web design. 
                    Known as an innovative problem solver passionate about developing apps, with a focus on the MERN technology stack. 
                    I’m excited to apply my skills as part of a fast-paced, quality-driven team to build better experiences on the web.
                </p>
                <p>
                    When I'm not coding I enjoy cooking, spending time with my family and keeping fit. I've been on a fitness journey since the start of the pandemic and I'm in the best shape of my life. I weight train daily and go for 10km runs several times a week.
                </p>
            </div>
        </section>
    );
}

export default About;
