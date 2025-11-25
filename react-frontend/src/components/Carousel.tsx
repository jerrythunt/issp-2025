import React, { useState } from "react";
import "./Carousel.css";

const slides = [
  {
    image: "/assets/images/elderly-man 2.jpg",
    title: "Creating Life’s Playlist",
    description: `Creating a truly effective custom music playlist for someone with dementia hinges on deep personalization rooted in their life history and musical preferences. The goal is to choose music that is highly familiar and emotionally significant, typically focusing on popular songs, hymns, or genres from the person's late adolescence and early adulthood (roughly ages 15 to 30), as this period often yields the strongest memory recall.

BrainTest Music provides an easy means of creating your life’s playlist and allowing you to access it anywhere you go.`,
  },
  {
    image: "assets/images/senior-enjoying-music-headphones 2.jpg",
    title: "Listening to Favorites",
    description: `Listening to favorite music is one of the most accessible and profound therapeutic interventions for individuals with dementia. When a person hears a song that holds deep personal meaning, it often bypasses the damaged cognitive centers and directly accesses the emotional and memory processing areas of the brain that remain relatively preserved.

This process can lead to a transformation, where a previously withdrawn or agitated person may become visibly calm, engaged, and alert. The familiar melodies and rhythms can help to reduce anxiety and depressive symptoms, prompt singing or movement, and facilitate a recollection of cherished memories, providing valuable moments of authentic self-expression and connection with caregivers in the present.`,
  },
  {
    image: "/assets/images/elderly-woman 2.jpg",
    title: "Tracking Mood",
    description: `Tracking the mood of someone with dementia requires a patient and observant approach, as verbal reports of feelings may be unreliable or impossible due to cognitive decline. Instead of relying solely on questions, caregivers should focus on documenting non-verbal cues and behavioral patterns throughout the day.

BrainTest Music keeps a simple mood journal that correlates behaviors with the time of day, music being played, environment, recent events (e.g., "agitated after lunch during loud TV show" or "calm while listening to music at 3 PM"). This detailed tracking helps to identify potential triggers for distress and effective interventions or routines that promote comfort and a positive emotional state.`,
  },
];


export default function Carousel() {
  const [active, setActive] = useState(0);

  return (
    <div className="hero--gothic">
      <div className="carousel-images-row">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`hero--gothic__slide${active === idx ? " active" : ""}`}
            onClick={() => setActive(idx)}
          >
            <img
              src={slide.image}
              alt={slide.title}
              style={slide.image.includes("senior-enjoying-music-headphones 2.jpg") ? { transform: "scaleX(-1)" } : {}}
            />
          </div>
        ))}
      </div>
      <div className="carousel-text-block">
        <div className="carousel-title">{slides[active].title}</div>
        <div className="carousel-description">
          {slides[active].description.split('\n').map((line, idx) =>
            line.trim() === "" ? <br key={idx} /> : <span key={idx}>{line}<br /></span>
          )}
        </div>
      </div>
    </div>
  );
}

