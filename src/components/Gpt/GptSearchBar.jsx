import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import { addGPTMovieResult, setLoading } from "../../store/gptSlice";
import openai from "../../utils/OpenAI";

const GPTSearchBar = () => {
  const dispatch = useDispatch();
  const searchText = useRef("");
  const [fetchCount, setFetchCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [GPTMovies, setGPTMovies] = useState(null);

  const searchMovies = async (movie) => {
    try {
      const data = await fetchDataFromApi(`/search/multi?query=${movie}`);
      const json = await data.json();
      return json.results;
    } catch (error) {
      console.log(error);
    }
  };

  const search = async (searchInput) => {
    if (fetchCount >= 2) {
      setShowModal(true);
      return;
    }

    try {
      setFetchCount((prev) => prev + 1);
      dispatch(setLoading(true));

      const gptResults = await openai.chat.completions.create({
        messages: [{ role: "user", content: searchInput }],
        model: "gpt-3.5-turbo",
      });

      if (!gptResults.choices || gptResults.choices.length === 0) {
        console.log("No choices returned from GPT");
        dispatch(setLoading(false));
        return;
      }

      const moviesArray = gptResults.choices[0].message.content.split(",");
      setGPTMovies(moviesArray);

      const promiseArray = moviesArray.map((movie) => searchMovies(movie));
      const results = await Promise.all(promiseArray);

      dispatch(
        addGPTMovieResult({ movieNames: moviesArray, movieResults: results })
      );
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  };

  const handleSearch = () => {
    const inputValue = searchText.current.value.trim();
    if (inputValue) {
      const searchQuery =
        "Act as a Movie Recommendation system and suggest some movies for the query: " +
        inputValue +
        ". Only give me names of 5 movies, comma separated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";

      search(searchQuery);
    }
  };

  return (
    <>
      <div className="search-bar-container">
        <input
          ref={searchText}
          className="search-input"
          type="text"
          placeholder="Search for a movie or tv show..."
        />

        <button
          onClick={handleSearch}
          disabled={showModal}
          className="search-button"
        >
          {showModal ? "Limited" : "Search"}
        </button>
      </div>
      {showModal && (
        <div className="modal-container">
          <div className="modal-content">
            <p>You have reached the maximum number of searches.</p>
            <button
              onClick={() => setShowModal(false)}
              className="close-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GPTSearchBar;
