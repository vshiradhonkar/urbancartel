import React, { useState } from 'react';
import "../App.css";

function Panel() {
  const categories = ['Design', 'Project', 'Execution'];
  const [selectedCategory, setSelectedCategory] = useState('Design');

  const content = {
    Design: {
      paragraph: "Our team works with our clients to refine an idea and concept into an executable design. We create a final design that encompasses the brand narrative to bring stories to life and provide end-to-end design solutions from concept, design, and architectural drawings to 3D renderings.",
      image: 'https://assets-global.website-files.com/64d3dd9edfb41666c35b15b7/64d3dd9edfb41666c35b15e1_Project-p-1080.jpg',
    },
    Project: {
      paragraph: "Once we have a design, our production team takes the lead in bringing it to life. We manage all stages of the project, from build specifications and technical drawings to site surveys, vendor management, and 2D & 3D production. We have an extensive network of partners to meet each unique design and project need.",
      image: 'https://assets-global.website-files.com/64d3dd9edfb41666c35b15b7/64d3dd9edfb41666c35b15d0_Project.webp',
    },
    Execution: {
      paragraph: "We’re with you every step of the way, from the project initiation to launch day. Our production and design teams are onsite to direct and guide the process down to the last point of completion, ensuring success across the built space and experience.",
      image: 'https://assets-global.website-files.com/64d3dd9edfb41666c35b15b7/64d3dd9edfb41666c35b15cd_Execution-p-1080.jpg',
    },
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (<>
    <div className='panel'>
      <div className='left-panel'>
        <div className='headings-column'> 
          {categories.map((category) => (
            <h1
              key={category}
              className={selectedCategory === category ? 'selected' : ''}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </h1>
          ))}
        </div>
        {selectedCategory && (
          <div className='paragraph'>
            <p>{content[selectedCategory].paragraph}</p>
          </div>
        )}
      </div>
      <div className='right-panel'>
        {selectedCategory && <img src={content[selectedCategory].image} alt='' />}
      </div>
    </div>
    <p><div className='smalldot'></div> WHO WE WORK WITH</p>
    </>

  );
}

export default Panel;