import React, { useState, useRef, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';

const VideoPlayer = ({ 
  url, 
  onError, 
  className = '', 
  title = 'Professional Video Player',
  poster = '',
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);

  // Detect video type based on URL
  const detectVideoType = (videoUrl) => {
    if (!videoUrl) return null;
    
    const urlPatterns = {
      youtube: /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
      vimeo: /(?:vimeo\.com\/)([0-9]+)/,
      tiktok: /(?:tiktok\.com\/)(@[a-zA-Z0-9_.]+\/video\/[0-9]+|embed\/[0-9]+)/,
      instagram: /(?:instagram\.com\/p\/|instagram\.com\/reel\/)([a-zA-Z0-9_-]+)/,
      twitter: /(?:twitter\.com\/[a-zA-Z0-9_]+\/status\/|x\.com\/[a-zA-Z0-9_]+\/status\/)([0-9]+)/,
      dailymotion: /(?:dailymotion\.com\/video\/)([a-zA-Z0-9]+)/
    };

    for (const [platform, pattern] of Object.entries(urlPatterns)) {
      const match = videoUrl.match(pattern);
      if (match) {
        return { platform, id: match[1] };
      }
    }
    
    return null;
  };

  // Generate embed URL based on platform
  const generateEmbedUrl = (videoType, videoUrl) => {
    if (!videoType) return null;

    const { platform, id } = videoType;
    
    switch (platform) {
      case 'youtube':
        return `https://www.youtube.com/embed/${id}?enablejsapi=1&origin=${window.location.origin}&autoplay=0&controls=1&rel=0&showinfo=0&modestbranding=1`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${id}?api=1&player_id=vimeo_player&autoplay=0&title=0&byline=0&portrait=0`;
      case 'tiktok':
        return `https://www.tiktok.com/embed/v2/${id}`;
      case 'instagram':
        return `https://www.instagram.com/p/${id}/embed/`;
      case 'twitter':
        return `https://platform.twitter.com/embed/Tweet.html?id=${id}`;
      case 'dailymotion':
        return `https://www.dailymotion.com/embed/video/${id}`;
      default:
        return videoUrl;
    }
  };

  const videoType = detectVideoType(url);
  const embedUrl = generateEmbedUrl(videoType, url);

  // Enhanced play functionality with iframe control
  const handlePlay = () => {
    try {
      setIsPlaying(true);
      
      if (iframeRef.current && videoType) {
        const iframe = iframeRef.current;
        
        // Send play command via postMessage API
        if (videoType.platform === 'youtube') {
          iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else if (videoType.platform === 'vimeo') {
          iframe.contentWindow.postMessage('{"method":"play"}', '*');
        }
      }
      
      setIsVisible(true);
    } catch (error) {
      console.error('Error playing video:', error);
    }
  };

  // Enhanced pause functionality with iframe control
  const handlePause = () => {
    try {
      setIsPlaying(false);
      
      if (iframeRef.current && videoType) {
        const iframe = iframeRef.current;
        
        // Send pause command via postMessage API
        if (videoType.platform === 'youtube') {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } else if (videoType.platform === 'vimeo') {
          iframe.contentWindow.postMessage('{"method":"pause"}', '*');
        }
      }
    } catch (error) {
      console.error('Error pausing video:', error);
    }
  };

  // Enhanced stop functionality with iframe control
  const handleStop = () => {
    try {
      setIsPlaying(false);
      setIsVisible(false);
      
      if (iframeRef.current && videoType) {
        const iframe = iframeRef.current;
        
        // Send stop command via postMessage API
        if (videoType.platform === 'youtube') {
          iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        } else if (videoType.platform === 'vimeo') {
          iframe.contentWindow.postMessage('{"method":"pause"}', '*');
          iframe.contentWindow.postMessage('{"method":"setCurrentTime","value":0}', '*');
        }
      }
    } catch (error) {
      console.error('Error stopping video:', error);
    }
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if (iframeRef.current.webkitRequestFullscreen) {
        iframeRef.current.webkitRequestFullscreen();
      } else if (iframeRef.current.msRequestFullscreen) {
        iframeRef.current.msRequestFullscreen();
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isPlaying) {
            handlePause();
          } else {
            handlePlay();
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleStop();
          break;
        case 'KeyF':
          e.preventDefault();
          handleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render video content
  const renderVideoContent = () => {
    if (error) {
      return (
        <div className="professional-video-error d-flex flex-column align-items-center justify-content-center h-100 text-center p-4">
          <div className="mb-3">
            <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '3rem' }}></i>
          </div>
          <h5 className="text-white mb-2">Video Unavailable</h5>
          <p className="text-white-50 mb-0">
            {error.message || 'Unable to load video content'}
          </p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="professional-video-loading d-flex flex-column align-items-center justify-content-center h-100">
          <Spinner animation="border" variant="light" className="mb-3" />
          <p className="text-white-50 mb-0">Loading professional video...</p>
        </div>
      );
    }

    if (!url) {
      return (
        <div className="professional-video-placeholder d-flex flex-column align-items-center justify-content-center h-100 text-center p-4">
          <div className="mb-3">
            <i className="bi bi-camera-video text-white-50" style={{ fontSize: '4rem' }}></i>
          </div>
          <h5 className="text-white mb-2">Professional Video Player</h5>
          <p className="text-white-50 mb-3">
            Select a video from the playlist or enter a custom URL to begin
          </p>
          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <span className="badge bg-primary bg-opacity-75 px-3 py-2">
              <i className="bi bi-youtube me-1"></i>YouTube
            </span>
            <span className="badge bg-info bg-opacity-75 px-3 py-2">
              <i className="bi bi-vimeo me-1"></i>Vimeo
            </span>
          </div>
        </div>
      );
    }

    if (embedUrl) {
      return (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={title}
          className="professional-video-iframe"
          style={{
            borderRadius: '12px',
            minHeight: '300px'
          }}
        />
      );
    }

    return (
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        controls
        poster={poster}
        className="professional-video-element"
        style={{
          borderRadius: '12px',
          objectFit: 'cover'
        }}
      >
        <source src={url} type="video/mp4" />
        <source src={url} type="video/webm" />
        <source src={url} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <div className={`professional-video-player position-relative ${className}`} {...props}>
      {/* Professional background gradient */}
      <div className="professional-video-background"></div>
      
      {/* Video container */}
      <div className="professional-video-container position-relative">
        <div className="ratio ratio-16x9">
          {renderVideoContent()}
        </div>
        
        {/* Enhanced Play Button Overlay */}
        {!isVisible && !error && url && (
          <div className="d-flex align-items-center justify-content-center position-absolute top-0 start-0 w-100 h-100">
            <Button
              variant="light"
              size="lg"
              onClick={handlePlay}
              className="professional-play-button rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '80px',
                height: '80px',
                fontSize: '2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '3px solid rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <i className="bi bi-play-fill"></i>
            </Button>
          </div>
        )}
        
        {/* Professional Control Overlay */}
        <div 
          className="professional-video-controls position-absolute bottom-0 start-0 end-0 p-3"
          style={{
            background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
            backdropFilter: 'blur(10px)',
            borderRadius: '0 0 12px 12px'
          }}
        >
          <div className="d-flex align-items-end justify-content-between">
            <div>
              <h6 className="text-white mb-1 fw-bold" style={{ letterSpacing: '0.3px' }}>{title}</h6>
              <div className="d-flex align-items-center gap-3">
                <small className="text-white-50 d-flex align-items-center gap-1">
                  <i className="bi bi-camera-video-fill"></i>
                  {videoType?.platform ? `${videoType.platform.charAt(0).toUpperCase() + videoType.platform.slice(1)} Video` : 'Professional Video'}
                </small>
                <small className="text-white-50 d-flex align-items-center gap-1">
                  <i className="bi bi-badge-hd-fill"></i>
                  HD Quality
                </small>
              </div>
            </div>
          </div>
          
          {/* Enhanced Control Buttons */}
          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="d-flex gap-2">
              {/* Play/Pause Toggle Button */}
              <Button
                variant={isPlaying ? "warning" : "success"}
                size="sm"
                onClick={isPlaying ? handlePause : handlePlay}
                className="professional-control-btn d-flex align-items-center gap-2"
                disabled={!url}
              >
                <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                <span className="d-none d-sm-inline">{isPlaying ? 'Pause' : 'Play'}</span>
              </Button>
              
              {/* Stop Button */}
              <Button
                variant="danger"
                size="sm"
                onClick={handleStop}
                className="professional-control-btn d-flex align-items-center gap-2"
                disabled={!url}
              >
                <i className="bi bi-stop-fill"></i>
                <span className="d-none d-sm-inline">Stop</span>
              </Button>
              
              {/* Fullscreen Button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleFullscreen}
                className="professional-control-btn d-flex align-items-center gap-2"
                disabled={!url}
              >
                <i className="bi bi-arrows-fullscreen"></i>
                <span className="d-none d-lg-inline">Fullscreen</span>
              </Button>
            </div>
            
            {/* Status Indicator */}
            <div className="d-flex align-items-center gap-1">
              <div 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isPlaying ? '#28a745' : '#ffc107',
                  boxShadow: `0 0 10px ${isPlaying ? '#28a745' : '#ffc107'}`
                }}
              ></div>
              <small className="text-white-50">
                {isPlaying ? 'Playing' : 'Ready'}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;