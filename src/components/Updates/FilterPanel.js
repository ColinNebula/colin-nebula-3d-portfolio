import React, { useState } from 'react';
import { Row, Col, Form, Button, Collapse } from 'react-bootstrap';
import './FilterPanel.css';

const FilterPanel = ({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  categories,
  showBookmarked,
  setShowBookmarked,
  bookmarkedCount,
  setCurrentPage
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilter('all');
    setSearchQuery('');
    setShowBookmarked(false);
    setCurrentPage(1);
  };

  return (
    <div className="filters-section mb-4">
      <div className="d-flex justify-content-between align-items-center filter-header">
        <h3 className="h6 mb-0">Filter Updates</h3>
        <Button 
          variant="link"
          onClick={() => setShowFilters(!showFilters)} 
          aria-expanded={showFilters}
          className="toggle-filters-btn"
          aria-label={showFilters ? "Hide filters" : "Show filters"}
        >
          {showFilters ? (
            <>Hide Filters <i className="bi bi-chevron-up ms-1"></i></>
          ) : (
            <>Filters & Options <i className="bi bi-chevron-down ms-1"></i></>
          )}
        </Button>
      </div>
      
      <Collapse in={showFilters}>
        <div className="filter-panel">
          <Row className="g-3">
            <Col md={3} sm={6}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select 
                  value={filter} 
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter updates by category"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(categories).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} sm={6}>
              <Form.Group>
                <Form.Label>Sort By</Form.Label>
                <Form.Select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort updates"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Viewed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} sm={8}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <div className="search-input-wrapper">
                  <Form.Control
                    type="text"
                    placeholder="Search by keyword..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    aria-label="Search updates"
                  />
                  {searchQuery && (
                    <Button 
                      variant="link" 
                      className="search-clear-btn"
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      aria-label="Clear search"
                    >
                      <i className="bi bi-x-circle-fill"></i>
                    </Button>
                  )}
                </div>
              </Form.Group>
            </Col>
            <Col md={2} sm={4} className="d-flex flex-column">
              <Form.Label>Display Options</Form.Label>
              <div className="d-flex gap-2">
                <div className="btn-group view-toggle-group">
                  <Button 
                    variant={viewMode === 'cards' ? 'primary' : 'outline-primary'} 
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    aria-label="Card view"
                    title="Card view"
                    className="view-toggle-btn"
                  >
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'primary' : 'outline-primary'} 
                    size="sm"
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                    title="List view"
                    className="view-toggle-btn"
                  >
                    <i className="bi bi-list-ul"></i>
                  </Button>
                </div>
                
                <Button 
                  variant={showBookmarked ? 'primary' : 'outline-primary'}
                  size="sm"
                  className="bookmark-filter-btn"
                  onClick={() => {
                    setShowBookmarked(!showBookmarked);
                    setCurrentPage(1);
                  }}
                  title={showBookmarked ? 'Show all updates' : 'Show only bookmarks'}
                  aria-label={showBookmarked ? 'Show all updates' : 'Show only bookmarks'}
                  disabled={bookmarkedCount === 0}
                >
                  <i className="bi bi-bookmark-fill me-1"></i>
                  {bookmarkedCount > 0 && <span className="bookmark-count">{bookmarkedCount}</span>}
                </Button>
              </div>
            </Col>
          </Row>

          {/* Active filters display */}
          {(filter !== 'all' || searchQuery || showBookmarked) && (
            <div className="active-filters mt-3">
              <div className="d-flex align-items-center flex-wrap">
                <span className="me-2 active-filter-label">Active filters:</span>
                
                {filter !== 'all' && (
                  <div className="active-filter-pill">
                    <span className="filter-label">
                      {categories[filter]?.label || filter}
                    </span>
                    <Button 
                      variant="link" 
                      className="filter-remove-btn"
                      onClick={() => setFilter('all')}
                      aria-label={`Remove ${categories[filter]?.label} filter`}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  </div>
                )}
                
                {searchQuery && (
                  <div className="active-filter-pill">
                    <span className="filter-label">
                      "{searchQuery}"
                    </span>
                    <Button 
                      variant="link" 
                      className="filter-remove-btn"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search query"
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  </div>
                )}
                
                {showBookmarked && (
                  <div className="active-filter-pill">
                    <span className="filter-label">
                      <i className="bi bi-bookmark-fill me-1"></i> Bookmarked
                    </span>
                    <Button 
                      variant="link" 
                      className="filter-remove-btn"
                      onClick={() => setShowBookmarked(false)}
                      aria-label="Show all updates"
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  </div>
                )}
                
                <Button 
                  variant="link" 
                  className="ms-auto clear-all-btn"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default FilterPanel;
