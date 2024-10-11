import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect } from "react";
import { fetchDataFromApi } from "../../utils/api";
import Spinner from "../../components/spinner/Spinner";
import MovieCard from "../../components/movieCard/MovieCard";
import { useParams } from "react-router-dom";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";

const GptSearchResult = () => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { query } = useParams();

  const searchMovies = async (movie) => {
    try {
      const data = await fetchDataFromApi(
        `/search/multi?query=${movie}#0&include_adult=false`
      );
      return data.results;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };

  const getPromptData = async () => {
    setLoading(true);

    // Check if the data for the current query is already cached in localStorage
    const cachedData = localStorage.getItem(query);
    if (cachedData) {
      setRecommendedMovies(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    if (query.length > 0) {
      try {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Based on the following query: "${query}", suggest up to 20 highly-rated movies that best match the theme, genre, and mood described. Provide only the movie titles, separated by commas, ensuring a diverse range of options spanning different decades and styles.`;

        const result = await model.generateContent(prompt);

        if (result && result.response.text()) {
          const movieNames = result.response
            .text()
            .split(",")
            .map((name) => name.trim());

          const movieData = [];
          for (const movieName of movieNames) {
            const movies = await searchMovies(movieName);
            movieData.push(...movies);
          }

          // Cache the result in localStorage
          localStorage.setItem(query, JSON.stringify(movieData));

          setRecommendedMovies(movieData);
        } else {
          console.error("No results from Gemini AI");
        }
      } catch (error) {
        console.error("Error with Gemini AI search:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getPromptData();
  }, [query]);

  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {recommendedMovies?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`Search ${
                  recommendedMovies.length > 1 ? "results" : "result"
                } of '${query}'`}
              </div>

              <div className="content">
                {recommendedMovies.map((item, index) => {
                  if (item.media_type === "person") return;
                  return (
                    <MovieCard key={index} data={item} fromSearch={true} />
                  );
                })}
              </div>
            </>
          ) : (
            <span className="resultNotFound">Sorry, Results Not Found</span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default GptSearchResult;
