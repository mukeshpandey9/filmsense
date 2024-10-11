import React, { useState, useEffect } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { useSelector } from "react-redux";
import Img from "../../../components/lazyImg/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

const HeroBanner = () => {
  const navigate = useNavigate();
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");
  const [useAI, setUseAI] = useState(false);
  const { url } = useSelector((state) => state.home);
  const { data, loading } = useFetch("/movie/upcoming");

  useEffect(() => {
    if (data && data.results) {
      const bg =
        url.backdrop +
        data.results[Math.floor(Math.random() * data.results.length)]
          ?.backdrop_path;
      setBackground(bg);
    }
  }, [data, url.backdrop]);

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      if (useAI) {
        navigate(`/gpt-search/${query}`);
      } else {
        navigate(`/search/${query}`);
      }
    }
  };

  const handleSearch = () => {
    if (query.length > 0) {
      if (useAI) {
        navigate(`/gpt-search/${query}`);
      } else {
        navigate(`/search/${query}`);
      }
    }
  };

  return (
    <>
      <div className="heroBanner">
        {!loading && (
          <div className="backdrop-img">
            <Img src={background} />
          </div>
        )}

        <div className="opacity-layer"></div>
        <ContentWrapper>
          <div className="heroBannerContent">
            <span className="title">Welcome</span>
            <span className="subTitle">
              Millions of movies, TV shows, and people to discover. Explore now.
            </span>
            <div className="searchInput">
              <input
                type="text"
                placeholder={
                  useAI
                    ? "Suggest me some south Indian comedy movies..."
                    : "Search for a movie or tv show..."
                }
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={searchQueryHandler}
              />
              <button className="ai-button" onClick={handleSearch}>
                Search
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={useAI}
                    onChange={() => setUseAI(!useAI)}
                  />
                  <span className="slider round"></span>
                </label>
                <span>AI</span>
              </button>
            </div>
          </div>
        </ContentWrapper>
      </div>
    </>
  );
};

export default HeroBanner;
