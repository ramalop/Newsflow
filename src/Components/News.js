import React, { useEffect, useState } from "react";

import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import { useContext } from "react";
import SearchContext from "../context/SearchContext";

const News = (props) => {
  const { searchTerm } = useContext(SearchContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    let url;
    if (searchTerm) {
      url = `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    }
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);

    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsFlow`;
    setPage(1); // reset to first page on category change
    setHasMore(true); // reset hasMore when category changes
    updateNews();
    // eslint-disable-next-line
  }, [searchTerm]);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    let url;
    if (searchTerm) {
      url = `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
    }

    let data = await fetch(url);
    let parsedData = await data.json();

    if (!parsedData.articles || parsedData.articles.length === 0) {
      // stop fetching more
      setHasMore(false);
      return;
    }

    setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
    setPage(nextPage);
  };
  return (
    <>
      <h1
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        Newsflow - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
