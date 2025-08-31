import React, { useState, useRef, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';

const VideoPlayer = ({ 
  videoUrl, 
  poster, 
  title, 
  autoplay = false, 
  muted = true,
  onPlay,
  onPause,
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const [videoType, setVideoType] = useState(null);
  const [embedUrl, setEmbedUrl] = useState('');
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    console.log('VideoPlayer: useEffect triggered with videoUrl:', videoUrl);
    if (videoUrl) {
      setHasError(false);
      const type = detectVideoType(videoUrl);
      setVideoType(type);
      console.log('VideoPlayer: Detected video type:', type);
      
      if (type.platform !== 'native') {
        const embed = generateEmbedUrl(videoUrl, type);
        setEmbedUrl(embed);
        console.log('VideoPlayer: Generated embed URL:', embed);
      }
    } else {
      setHasError(true);
      console.log('VideoPlayer: No videoUrl provided, setting error state');
    }
  }, [videoUrl]);

  const detectVideoType = (url) => {
    // YouTube detection
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return { platform: 'youtube', id: youtubeMatch[1] };
    }

    // Vimeo detection
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return { platform: 'vimeo', id: vimeoMatch[1] };
    }

    // TikTok detection
    const tiktokRegex = /(?:tiktok\.com\/@[^/]+\/video\/|vm\.tiktok\.com\/|tiktok\.com\/t\/)([a-zA-Z0-9]+)/;
    const tiktokMatch = url.match(tiktokRegex);
    if (tiktokMatch) {
      return { platform: 'tiktok', id: tiktokMatch[1] };
    }

    // Instagram detection (posts and reels)
    const instagramRegex = /(?:instagram\.com\/(?:p|reel)\/|instagr\.am\/p\/)([a-zA-Z0-9-_]+)/;
    const instagramMatch = url.match(instagramRegex);
    if (instagramMatch) {
      return { platform: 'instagram', id: instagramMatch[1] };
    }

    // Twitter/X detection
    const twitterRegex = /(?:twitter\.com|x\.com)\/[^/]+\/status\/([0-9]+)/;
    const twitterMatch = url.match(twitterRegex);
    if (twitterMatch) {
      return { platform: 'twitter', id: twitterMatch[1] };
    }

    // Twitch detection
    const twitchRegex = /(?:twitch\.tv\/videos\/)([0-9]+)/;
    const twitchMatch = url.match(twitchRegex);
    if (twitchMatch) {
      return { platform: 'twitch', id: twitchMatch[1] };
    }

    // DailyMotion detection
    const dailymotionRegex = /(?:dailymotion\.com\/video\/)([a-zA-Z0-9]+)/;
    const dailymotionMatch = url.match(dailymotionRegex);
    if (dailymotionMatch) {
      return { platform: 'dailymotion', id: dailymotionMatch[1] };
    }

    // Wistia detection
    const wistiaRegex = /(?:wistia\.com\/medias\/|wi\.st\/)([a-zA-Z0-9]+)/;
    const wistiaMatch = url.match(wistiaRegex);
    if (wistiaMatch) {
      return { platform: 'wistia', id: wistiaMatch[1] };
    }

    // JW Player detection
    const jwRegex = /(?:jwplatform\.com\/players\/)([a-zA-Z0-9-]+)/;
    const jwMatch = url.match(jwRegex);
    if (jwMatch) {
      return { platform: 'jwplayer', id: jwMatch[1] };
    }

    // Native video (mp4, webm, etc.)
    return { platform: 'native', url };
  };

  const generateEmbedUrl = (originalUrl, type) => {
    const baseParams = new URLSearchParams();
    
    switch (type.platform) {
      case 'youtube':
        baseParams.set('rel', '0');
        baseParams.set('modestbranding', '1');
        baseParams.set('showinfo', '0');
        if (autoplay) baseParams.set('autoplay', '1');
        if (muted) baseParams.set('mute', '1');
        return `https://www.youtube.com/embed/${type.id}?${baseParams.toString()}`;
        
      case 'vimeo':
        baseParams.set('title', '0');
        baseParams.set('byline', '0');
        baseParams.set('portrait', '0');
        if (autoplay) baseParams.set('autoplay', '1');
        if (muted) baseParams.set('muted', '1');
        return `https://player.vimeo.com/video/${type.id}?${baseParams.toString()}`;
        
      case 'tiktok':
        // TikTok embed is limited, but we can use their oEmbed or direct embed
        return `https://www.tiktok.com/embed/v2/${type.id}`;
        
      case 'instagram':
        // Instagram embeds require special handling
        return `https://www.instagram.com/p/${type.id}/embed/`;
        
      case 'twitter':
        // Twitter video embeds
        return `https://platform.twitter.com/embed/Tweet.html?id=${type.id}`;
        
      case 'twitch':
        baseParams.set('parent', window.location.hostname);
        if (autoplay) baseParams.set('autoplay', 'true');
        if (muted) baseParams.set('muted', 'true');
        return `https://player.twitch.tv/?video=${type.id}&${baseParams.toString()}`;
        
      case 'dailymotion':
        baseParams.set('ui-highlight', '29abe8');
        baseParams.set('ui-logo', '0');
        if (autoplay) baseParams.set('autoplay', '1');
        if (muted) baseParams.set('mute', '1');
        return `https://www.dailymotion.com/embed/video/${type.id}?${baseParams.toString()}`;
        
      case 'wistia':
        baseParams.set('seo', 'false');
        baseParams.set('videoFoam', 'true');
        if (autoplay) baseParams.set('autoPlay', 'true');
        return `https://fast.wistia.net/embed/iframe/${type.id}?${baseParams.toString()}`;
        
      case 'jwplayer':
        return `https://cdn.jwplayer.com/players/${type.id}`;
        
      default:
        return originalUrl;
    }
  };

  const handlePlay = () => {
    setIsLoading(true);
    setShowPoster(false);
    setIsPlaying(true);
    
    if (onPlay) onPlay();
    
    // For iframe-based players, hide loading after a delay
    if (videoType.platform !== 'native') {
      setTimeout(() => setIsLoading(false), 1500);
    }
  };

  const handleNativePlay = () => {
    setIsPlaying(true);
    setIsLoading(false);
    if (onPlay) onPlay();
  };

  const handleNativePause = () => {
    setIsPlaying(false);
    if (onPause) onPause();
  };

  const handleNativeLoadStart = () => {
    setIsLoading(true);
  };

  const handleNativeCanPlay = () => {
    setIsLoading(false);
  };

  const renderVideoContent = () => {
    if (hasError) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-4">
          <i className="bi bi-exclamation-triangle text-warning mb-3" style={{ fontSize: '3rem' }}></i>
          <h6 className="text-white mb-2">Video Not Available</h6>
          <small className="text-white-50">Please check the video URL or try a different video.</small>
        </div>
      );
    }

    if (videoType?.platform === 'native') {
      return (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          controls
          autoPlay={autoplay}
          muted={muted}
          className="w-100 h-100 object-fit-cover"
          onPlay={handleNativePlay}
          onPause={handleNativePause}
          onLoadStart={handleNativeLoadStart}
          onCanPlay={handleNativeCanPlay}
          onError={() => setHasError(true)}
          style={{ backgroundColor: '#000' }}
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    if (isPlaying && embedUrl) {
      return (
        <>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title || "Video Player"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-100 h-100"
            style={{ backgroundColor: '#000' }}
            onLoad={() => setIsLoading(false)}
            onError={() => setHasError(true)}
          />
          {isLoading && (
            <div className="position-absolute top-50 start-50 translate-middle">
              <Spinner animation="border" variant="light" role="status">
                <span className="visually-hidden">Loading video...</span>
              </Spinner>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        {poster && (
          <img
            src={poster}
            alt={title || "Video thumbnail"}
            className="w-100 h-100 object-fit-cover"
            style={{ 
              filter: showPoster ? 'brightness(0.7)' : 'none',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1
            }}
            onError={() => {
              console.error('VideoPlayer: Poster image failed to load:', poster);
              setHasError(true);
            }}
            onLoad={() => console.log('VideoPlayer: Poster image loaded successfully')}
          />
        )}
        {!isPlaying && (
          <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 3 }}>
            <Button
              variant="light"
              size="lg"
              className="rounded-circle shadow-lg"
              onClick={handlePlay}
              style={{
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label={`Play ${title || 'video'}`}
            >
              <i className="bi bi-play-fill fs-1" style={{ marginLeft: '4px' }}></i>
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={`position-relative video-player ${className}`}>
      {console.log('VideoPlayer render: isPlaying=', isPlaying, 'hasError=', hasError, 'videoType=', videoType)}
      <div className="ratio ratio-16x9">
        {renderVideoContent()}
      </div>
      
      {/* Video info overlay */}
      {!isPlaying && title && (
        <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark">
          <h6 className="text-white mb-0 fw-semibold">{title}</h6>
          <small className="text-white-50">
            {videoType?.platform ? `${videoType.platform.charAt(0).toUpperCase() + videoType.platform.slice(1)} Video` : 'Video'}
          </small>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;