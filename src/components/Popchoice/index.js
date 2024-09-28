import './index.css';
import React, { useState } from 'react';
import { openai, supabase } from '../../config';

export default function Popchoice() {
  const [favoriteMovie, setFavoriteMovie] = useState('');
  const [mood, setMood] = useState('');
  const [funOrSerious, setFunOrSerious] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [movieRecommendations, setMovieRecommendations] = useState([]);

  const resetForm = () => {
    setFavoriteMovie('');
    setMood('');
    setFunOrSerious('');
    setIsSubmitted(false);
    setMovieRecommendations([]);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('Favorite Movie:', favoriteMovie);
    console.log('Mood:', mood);
    console.log('Fun or Serious:', funOrSerious);

    const chatMessages = [
      {
        role: 'system',
        content:
          "You are a movie expert suggesting movies based on user preferences. Provide all movie recommendations as a JSON array of objects, where each object contains the following keys: 'movieName' (string) for the name of the movie, 'description' (string) for a short description of the movie, and 'coverImageUrl' (string) for the URL of the movie's cover image. Use camelCase for the keys and ensure that the cover image URLs are sourced from a reliable database like The Movie Database (TMDb) or IMDb. Do not include any introductory text or additional commentary.",
      },
      {
        role: 'assistant',
        content: 'What’s your favorite movie and why?',
      },
      {
        role: 'user',
        content: favoriteMovie,
      },
      {
        role: 'assistant',
        content: 'Are you in the mood for something new or a classic?',
      },
      {
        role: 'user',
        content: mood,
      },
      {
        role: 'assistant',
        content: 'Do you wanna have fun or do you want something serious?',
      },
      {
        role: 'user',
        content: funOrSerious,
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: chatMessages,
      temperature: 0.5,
      frequency_penalty: 0.5,
    });

    const suggestions = JSON.parse(response.choices[0].message.content);
    setMovieRecommendations(suggestions);

    setIsSubmitted(true);
  }

  return (
    <div className="container">
      <div>
        <img
          className="popcorn-img"
          src={require('../../assets/popcorn.png')}
          alt="Delicious Popcorn"
        />
        <h1 className="title">PopChoice</h1>
      </div>
      {isSubmitted ? (
        <div className='recommendations'>
          {movieRecommendations?.map((movie) => (
            <div key={movie?.movieName} className="movie-card">
              <img
                className="movie-image"
                src={movie?.coverImageUrl}
                alt={movie?.movieName}
              />
              <h2>{movie?.movieName}</h2>
              <p>{movie?.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <form className="movie-form">
          <div className="form-group">
            <label htmlFor="favorite-movie">
              What’s your favorite movie and why?
            </label>
            <textarea
              rows="4"
              id="favorite-movie"
              name="favorite-movie"
              value={favoriteMovie}
              onChange={(e) => setFavoriteMovie(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mood">
              Are you in the mood for something new or a classic?
            </label>
            <textarea
              rows="4"
              id="mood"
              name="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fun-or-serious">
              Do you wanna have fun or do you want something serious?
            </label>
            <textarea
              rows="4"
              id="fun-or-serious"
              name="fun-or-serious"
              value={funOrSerious}
              onChange={(e) => setFunOrSerious(e.target.value)}
              required
            />
          </div>
          <button className="submit-btn" onClick={handleSubmit}>
            Let’s Go
          </button>
        </form>
      )}
    </div>
  );
}
