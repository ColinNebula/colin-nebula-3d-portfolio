import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Form } from 'react-bootstrap';
import VideoPlayer from './VideoPlayer';

const VideoPlaylist = ({ 
  videos = [], 
  autoAdvance = false, 
  shuffle = false,
  repeat = false,
  onVideoChange,
  onAutoAdvanceChange,
  onShuffleChange,
  onRepeatChange,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistOrder, setPlaylistOrder] = useState([]);
  const [hasPlayedAll, setHasPlayedAll] = useState(false);

  useEffect(() => {
    if (videos.length > 0) {
      const order = shuffle 
        ? [...Array(videos.length).keys()].sort(() => Math.random() - 0.5)
        : [...Array(videos.length).keys()];
      setPlaylistOrder(order);
      setCurrentIndex(0);
    }
  }, [videos, shuffle]);

  const currentVideo = videos[playlistOrder[currentIndex]] || videos[0];

  const handleVideoEnd = () => {
    if (autoAdvance) {
      if (currentIndex < videos.length - 1) {
        goToNext();
      } else if (repeat) {
        // Restart playlist from beginning when repeat is on
        setCurrentIndex(0);
        setHasPlayedAll(true);
        if (onVideoChange) onVideoChange(videos[playlistOrder[0]]);
      } else {
        setIsPlaying(false);
        setHasPlayedAll(true);
      }
    } else {
      setIsPlaying(false);
    }
  };

  const goToNext = () => {
    let nextIndex;
    if (currentIndex < videos.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (repeat) {
      // Loop back to beginning when repeat is on
      nextIndex = 0;
      setHasPlayedAll(true);
    } else {
      return; // No next video available
    }
    
    setCurrentIndex(nextIndex);
    setIsPlaying(false); // Reset playing state for user control
    if (onVideoChange) onVideoChange(videos[playlistOrder[nextIndex]]);
  };

  const goToPrevious = () => {
    let prevIndex;
    if (currentIndex > 0) {
      prevIndex = currentIndex - 1;
    } else if (repeat) {
      // Loop to end when repeat is on
      prevIndex = videos.length - 1;
    } else {
      return; // No previous video available
    }
    
    setCurrentIndex(prevIndex);
    setIsPlaying(false); // Reset playing state for user control
    if (onVideoChange) onVideoChange(videos[playlistOrder[prevIndex]]);
  };

  const shufflePlaylist = () => {
    if (onShuffleChange) {
      onShuffleChange(!shuffle);
    }
  };

  const toggleRepeat = () => {
    if (onRepeatChange) {
      onRepeatChange(!repeat);
    }
  };

  const selectVideo = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    if (onVideoChange) onVideoChange(videos[playlistOrder[index]]);
  };

  const getPlatformIcon = (url) => {
    if (url.includes('youtube')) return 'bi-youtube';
    if (url.includes('vimeo')) return 'bi-vimeo';
    if (url.includes('tiktok')) return 'bi-tiktok';
    if (url.includes('instagram')) return 'bi-instagram';
    if (url.includes('twitter') || url.includes('x.com')) return 'bi-twitter-x';
    if (url.includes('twitch')) return 'bi-twitch';
    if (url.includes('dailymotion')) return 'bi-camera-video';
    return 'bi-play-circle';
  };

  if (!videos.length) {
    return (
      <div className="text-center p-4">
        <i className="bi bi-collection-play fs-1 text-muted mb-3 d-block"></i>
        <h5 className="text-muted">No videos in playlist</h5>
      </div>
    );
  }

  return (
    <div className={`video-playlist ${className}`}>
      {/* Main Video Player */}
      <div className="mb-4">
        <VideoPlayer
          videoUrl={currentVideo?.url}
          poster={currentVideo?.poster}
          title={currentVideo?.title}
          autoplay={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleVideoEnd}
        />
        
        {/* Video Info and Controls */}
        <Card className="bg-dark text-white border-0 mt-3">
          <Card.Body className="py-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="mb-1 fw-bold">{currentVideo?.title || 'Untitled Video'}</h6>
                <small className="text-white-50">
                  Video {currentIndex + 1} of {videos.length}
                  {currentVideo?.duration && ` • ${currentVideo.duration}`}
                  {shuffle && <span className="ms-2"><i className="bi bi-shuffle text-warning"></i> Shuffled</span>}
                  {repeat && <span className="ms-2"><i className="bi bi-repeat text-success"></i> Repeat</span>}
                  {hasPlayedAll && !repeat && <span className="ms-2"><i className="bi bi-check-circle text-info"></i> Completed</span>}
                </small>
              </div>
            </div>
            
            {/* Enhanced Media Controls */}
            <div className="d-flex justify-content-center align-items-center mb-3 gap-2">
              <Button 
                variant={shuffle ? "warning" : "outline-light"} 
                size="sm" 
                onClick={shufflePlaylist}
                title={shuffle ? "Disable shuffle" : "Enable shuffle"}
                className="px-3"
              >
                <i className="bi bi-shuffle me-1"></i>
                {shuffle ? 'On' : 'Off'}
              </Button>
              
              <Button 
                variant="outline-light" 
                size="sm" 
                onClick={goToPrevious}
                disabled={!repeat && currentIndex === 0}
                title="Previous video"
                className="px-3"
              >
                <i className="bi bi-skip-backward-fill"></i>
              </Button>
              
              <Button 
                variant={isPlaying ? "success" : "outline-light"} 
                size="sm" 
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "Pause" : "Play"}
                className="px-4"
              >
                <i className={`bi bi-${isPlaying ? 'pause' : 'play'}-fill`}></i>
              </Button>
              
              <Button 
                variant="outline-light" 
                size="sm" 
                onClick={goToNext}
                disabled={!repeat && currentIndex === videos.length - 1}
                title="Next video"
                className="px-3"
              >
                <i className="bi bi-skip-forward-fill"></i>
              </Button>
              
              <Button 
                variant={repeat ? "success" : "outline-light"} 
                size="sm" 
                onClick={toggleRepeat}
                title={repeat ? "Disable repeat" : "Enable repeat"}
                className="px-3"
              >
                <i className="bi bi-repeat me-1"></i>
                {repeat ? 'On' : 'Off'}
              </Button>
            </div>
            
            {/* Playlist Options */}
            <div className="d-flex flex-wrap gap-3 align-items-center justify-content-center">
              <Form.Check
                type="switch"
                id="auto-advance"
                label={<span><i className="bi bi-fast-forward me-1"></i>Auto-advance</span>}
                checked={autoAdvance}
                onChange={(e) => onAutoAdvanceChange && onAutoAdvanceChange(e.target.checked)}
                className="text-white-50"
              />
              <Form.Check
                type="switch"
                id="shuffle-switch"
                label={<span><i className="bi bi-shuffle me-1"></i>Shuffle</span>}
                checked={shuffle}
                onChange={(e) => onShuffleChange && onShuffleChange(e.target.checked)}
                className="text-white-50"
              />
              <Form.Check
                type="switch"
                id="repeat-switch"
                label={<span><i className="bi bi-repeat me-1"></i>Repeat</span>}
                checked={repeat}
                onChange={(e) => onRepeatChange && onRepeatChange(e.target.checked)}
                className="text-white-50"
              />
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Playlist */}
      <Card className="bg-dark border-0">
        <Card.Header className="bg-dark border-bottom border-secondary">
          <h6 className="mb-0 text-white">
            <i className="bi bi-collection-play me-2"></i>
            Playlist ({videos.length} videos)
          </h6>
        </Card.Header>
        <Card.Body className="p-0">
          <ListGroup variant="flush">
            {videos.map((video, index) => {
              const orderIndex = playlistOrder.indexOf(index);
              const isActive = orderIndex === currentIndex;
              
              return (
                <ListGroup.Item
                  key={index}
                  className={`bg-dark text-white border-secondary cursor-pointer ${isActive ? 'bg-primary bg-opacity-25' : ''}`}
                  onClick={() => selectVideo(orderIndex)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {isActive ? (
                        <i className="bi bi-play-fill text-warning"></i>
                      ) : (
                        <span className="text-white-50 small">{orderIndex + 1}</span>
                      )}
                    </div>
                    
                    {video.thumbnail && (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="me-3 rounded"
                        style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                      />
                    )}
                    
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{video.title || 'Untitled Video'}</div>
                      <small className="text-white-50">
                        {video.description && `${video.description.substring(0, 60)}...`}
                        {video.duration && ` • ${video.duration}`}
                      </small>
                    </div>
                    
                    <div className="ms-2">
                      <i className={`${getPlatformIcon(video.url)} text-white-50`}></i>
                    </div>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VideoPlaylist;