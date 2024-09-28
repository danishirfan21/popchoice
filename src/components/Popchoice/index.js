import './index.css';
import React, { useState } from 'react';

export default function Popchoice() {
  const [favoriteMovie, setFavoriteMovie] = useState('');
  const [mood, setMood] = useState('');
  const [funOrSerious, setFunOrSerious] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Favorite Movie:', favoriteMovie);
    console.log('Mood:', mood);
    console.log('Fun or Serious:', funOrSerious);
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
          />
        </div>
        <button className="submit-btn" onClick={handleSubmit}>
          Let’s Go
        </button>
      </form>
    </div>
  );
}
