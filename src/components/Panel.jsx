import React, { useState } from 'react';
import "../App.css";
import GoGreen from './GoGreen';

function Panel() {
  const categories = ['Design', 'Project', 'Execution'];
  const [selectedCategory, setSelectedCategory] = useState('Design');

  const content = {
    Design: {
      paragraph: "Our design process at Urban Cartel begins with a profound understanding of our mission to blend style with sustainability. Through collaborative brainstorming sessions and extensive market research, we refine initial concepts into innovative and eco-conscious designs. Every detail is meticulously crafted to reflect our commitment to premium quality and environmental responsibility.",
      image: 'https://assets-global.website-files.com/64d3dd9edfb41666c35b15b7/64d3dd9edfb41666c35b15e1_Project-p-1080.jpg',
    },
    Project: {
      paragraph: "Once our design is finalized, Urban Cartel's production team takes the lead in bringing it to life. We manage all stages of the project, from sourcing sustainable materials and technical specifications to logistics and vendor management. Our extensive network of partners enables us to meet the unique needs of our eco-conscious designs, ensuring timely delivery and quality craftsmanship.",
      image: 'https://assets-global.website-files.com/64d3dd9edfb41666c35b15b7/64d3dd9edfb41666c35b15d0_Project.webp',
    },
    Execution: {
      paragraph: "At Urban Cartel, we're dedicated to guiding our projects from inception to completion with seamless execution. Our production and design teams work hand-in-hand, overseeing every detail of the process to ensure a successful outcome. From the initial launch to the last point of completion, we're committed to delivering premium shoes crafted from recycled materials under our Go Green initiative.",
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
    <p><div className='smalldot'></div> GO GREEN WITH US</p>
      <GoGreen/>
    </>

  );
}

export default Panel;