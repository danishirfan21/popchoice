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

  async function createEmbedding(input) {
    try {
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input,
      });
      return embeddingResponse.data[0].embedding;
    } catch (error) {
      console.error('Error creating embedding:', error);
    }
  }

  async function findNearestMatch(embedding) {
    try {
      const { data, error } = await supabase.rpc('match_movies', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 4,
      });

      if (data.length === 0) {
        return [];
      }

      if (error) {
        console.error('Error finding nearest match:', error);
        return;
      }

      const match = data.map((obj) => obj.content).join('\n');
      return match;
    } catch (error) {
      console.error('Error finding nearest match:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    const userInput = `Favorite Movie:  ${favoriteMovie}\nMood: ${mood}\nFun or Serious: ${funOrSerious}`;

    const chatMessages = [
      {
        role: 'system',
        content:
          "You are a movie expert suggesting movies based on user preferences. Provide all movie recommendations strictly as a JSON array of objects, without any text outside the array. Each object must contain the following keys: 'movieName' (string), 'description' (string), and 'coverImageUrl' (string). Use camelCase for the keys and ensure that the cover image URLs are sourced from a reliable database like The Movie Database (TMDb) or IMDb.",
      },
      {
        role: 'user',
        content: userInput,
      },
    ];

    const embedding = await createEmbedding(userInput);
    const match = await findNearestMatch(embedding);
    if (!match) {
      console.error('No matching movies found.');
      return;
    }

    if (!match || match.length === 0) {
      setMovieRecommendations([]);
      setIsSubmitted(true);
      return;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        ...chatMessages,
        {
          role: 'user',
          content: `Here are some movies related to: ${match}`,
        },
      ],
      temperature: 0.5,
      frequency_penalty: 0.5,
    });

    let suggestions;
    try {
      suggestions = JSON.parse(response.choices[0].message.content);
    } catch (err) {
      console.error('Failed to parse response as JSON:', err);
      suggestions = [];
    }

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
        <div className="recommendations">
          {movieRecommendations?.length > 0 ? (
            movieRecommendations?.map((movie) => (
              <div key={movie?.movieName} className="movie-card">
                <img
                  className="movie-image"
                  src={movie?.coverImageUrl}
                  alt={movie?.movieName}
                />
                <h2>{movie?.movieName}</h2>
                <p>{movie?.description}</p>
              </div>
            ))
          ) : (
            <p>No movie recommendations found.</p>
          )}
          <button className="reset-button" onClick={resetForm}>
            Try Again
          </button>
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
          <button className="submit-button" onClick={handleSubmit}>
            Let’s Go
          </button>
        </form>
      )}
    </div>
  );
}
