import React from "react";
import "./Pagination.css";

const Pagination = ({
  currentPage,
  perPage,
  setPage,
  loading = false,
  records,
  error = false,
}) => {
  const numPages = records>perPage ? Math.ceil(records / perPage) : 1;

  const isFirstPage = currentPage === 1,
    isLastPage = currentPage === numPages,
    isOnlyPage = numPages === 1;

  const range = (from, to, step = 1) => {
    let i = from;
    const range = [];

    while (i <= to) {
      range.push(i);
      i += step;
    }

    return range;
  };

  const handlePageClick = (event) => {
    const newPage = event.target.dataset.page;
    switch (newPage) {
      case "first":
        setPage(1);
        break;

      case "last":
        setPage(numPages);
        break;
      default:
        setPage(newPage);
    }
  };

  const errorText = "Couldn't load pages due to some error",
    loadingText = "Loading...";

  const placeholderText = error ? (
    <span className="Pagination-error">{errorText}</span>
  ) : (
    <span className="Pagination-loading">{loadingText}</span>
  );

  const actionPage = (text, data, disabled) => {
    return (
      !isOnlyPage && (
        <button
          className="Pagination-item"
          data-page={data}
          onClick={handlePageClick}
          disabled={disabled}
        >
          {text}
        </button>
      )
    );
  };

  return (
    <div className="Pagination-container">
      {loading || error ? (
        <div className="Pagination-placeholder">{placeholderText}</div>
      ) : (
        <div className="Pagination">
          {actionPage("<< First", "first", isFirstPage)}
          {actionPage("< Prev", "prev", isFirstPage)}

          {range(1, numPages).map((page) => (
            <button
              key={`page-${page}`}
              className="Pagination-item"
              data-page={page}
              onClick={handlePageClick}
              disabled={currentPage === page}
            >
              {page}
            </button>
          ))}

          {actionPage("Next >", "next", isLastPage)}
          {actionPage("Last >>", "last", isLastPage)}
        </div>
      )}
    </div>
  );
};

export default Pagination;
