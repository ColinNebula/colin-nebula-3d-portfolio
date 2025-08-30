import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef } from 'react'
import { Carousel, Modal, Button, Card, NavDropdown } from "react-bootstrap"
import shield1 from '../../assets/images/shield1.png';
import sword from '../../assets/images/sword.png';
import swordd from '../../assets/images/swordd.png';
import swordInfo from '../../assets/images/swordInfo.png';

import m16Close from '../../assets/images/m16Close.png';
import rundown from '../../assets/images/rundown.png';
import nbg from '../../assets/images/nbg.png';
import maskO from '../../assets/images/maskO.png';

import wireM from '../../assets/images/wireM.png';
import contents from '../../assets/images/contents.png';
export default function BootstrapCarousel() {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [lgShow2, setLgShow2] = useState(false);
  const [lgShow3, setLgShow3] = useState(false);
  // last active opener to restore focus when modal closes
  const lastActiveRef = useRef(null);
  const [modalAnnounce, setModalAnnounce] = useState('');
  // iframe refs for modals so we can pause them
  const maskIframeRef = useRef(null);
  const vfxIframeRef = useRef(null);
  const freeIframeRef = useRef(null);
  const swordIframeRef = useRef(null);
  const [shareMsg, setShareMsg] = useState('');
  const ytPrefetched = useRef(false);

  // canonical ids used for embeds
  const REELS = {
    mask: 'ZsZYqn04yNQ',
    vfx: 'mPxmNbMpO7A',
    freeRider: 'N2WhwHaicR4',
    sword: 'hLH3htg2GS0'
  };

  const getEmbedSrc = (id, { autoplay = false, muted = true } = {}) => {
    const p = new URLSearchParams();
    p.set('rel', '0');
    p.set('modestbranding', '1');
    p.set('playsinline', '1');
    p.set('enablejsapi', '1'); // required to pause via postMessage
    try { if (typeof window !== 'undefined' && window.location && window.location.origin) p.set('origin', window.location.origin); } catch(e){}
    if (autoplay) p.set('autoplay', '1');
    if (muted) p.set('mute', '1');
    return `https://www.youtube.com/embed/${id}?${p.toString()}`;
  };

  const preconnectYouTube = () => {
    try {
      if (ytPrefetched.current || typeof document === 'undefined') return;
      const add = (rel, href) => {
        if (!document.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
          const l = document.createElement('link'); l.rel = rel; l.href = href; l.crossOrigin = 'anonymous'; document.head.appendChild(l);
        }
      };
      add('preconnect', 'https://www.youtube.com');
      add('preconnect', 'https://www.google.com');
      ytPrefetched.current = true;
    } catch (e) {}
  };

  const pauseYouTube = (ref) => {
    try {
      const f = ref && ref.current;
      if (!f || !f.contentWindow) return;
      const msg = JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] });
      f.contentWindow.postMessage(msg, '*');
    } catch (e) {}
  };

  const noteOpen = (label) => { try { console.info('analytics','open_link', label); } catch(e){} };

  const copyToClipboard = async (text, successMessage = 'Copied!') => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else { 
        const ta = document.createElement('textarea'); 
        ta.value = text; 
        document.body.appendChild(ta); 
        ta.select(); 
        document.execCommand('copy'); 
        document.body.removeChild(ta); 
      }
      setShareMsg(successMessage);
      setTimeout(() => setShareMsg(''), 1400);
    } catch { 
      setShareMsg('Copy failed'); 
      setTimeout(() => setShareMsg(''), 1400); 
    }
  };

  // Function to get canonical URLs for each video
  const getVideoUrl = (reelKey) => {
    const baseUrl = 'https://www.youtube.com/watch?v=';
    return baseUrl + REELS[reelKey];
  };

  // keyboard shortcuts: 1..4 open respective modals (ignore typing in inputs)
  useEffect(() => {
    const handler = (e) => {
      if (!e.key) return;
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      const k = e.key.toLowerCase();
      if (k === '1') { noteOpen(REELS.mask); setModalAnnounce('Opening Mask of Malice'); setLgShow(true); setTimeout(() => setModalAnnounce(''), 1200); }
      if (k === '2') { noteOpen(REELS.vfx); setModalAnnounce('Opening VFX Reel'); setLgShow1(true); setTimeout(() => setModalAnnounce(''), 1200); }
      if (k === '3') { noteOpen(REELS.freeRider); setModalAnnounce('Opening Free Rider'); setLgShow2(true); setTimeout(() => setModalAnnounce(''), 1200); }
      if (k === '4') { noteOpen(REELS.sword); setModalAnnounce('Opening Sword'); setLgShow3(true); setTimeout(() => setModalAnnounce(''), 1200); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div>
      {/* Share notification */}
      {shareMsg && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#28a745',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '5px',
            zIndex: 9999
          }}
          role="alert"
          aria-live="polite"
        >
          {shareMsg}
        </div>
      )}

      {/* Modal for Mask of Malice */}
      <Modal
        fullscreen={true}
        show={lgShow}
        onHide={() => { 
          setLgShow(false); 
          pauseYouTube(maskIframeRef); 
          try { 
            lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); 
          } catch(e){} 
        }}
        aria-labelledby="mask-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="mask-modal-title">
            Mask of Malice
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Mask of malice is an original concept for a project currently in progress.
            Blender was used to model, uv, and texture the objects. 
            Painting was done in photoshop
          </p>
          <br/>
          <div className="ratio ratio-21x9">
            <iframe
              ref={maskIframeRef}
              loading="lazy"
              width="100%"
              height="560"
              src={getEmbedSrc(REELS.mask)}
              title="Mask of Malice video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          </div>
          
          {/* Action buttons */}
          <div className="mt-3 d-flex flex-wrap gap-2">
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={() => copyToClipboard(getVideoUrl('mask'), 'Mask video link copied!')}
            >
              Copy Link
            </button>
            <a 
              className="btn btn-sm btn-outline-primary" 
              href={getVideoUrl('mask')} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => noteOpen(getVideoUrl('mask'))}
            >
              Watch on YouTube
            </a>
          </div>

          <br/>
          <Card.Img loading="lazy" src={maskO} className="rounded" alt="Mask of Malice concept art" />
          
          <br/><br/><br/>
          <Modal.Title>
            Mask of Malice - Technical Details
          </Modal.Title>
          <p>
            Some of the 2D maps used were generated using Adobe Photoshop, 
            Blender was used to model, uv, and texture the objects.
            Sculpting was done in Zbrush, and normal maps were extracted using Xnormal 
          </p>
          <br/>
          <Card.Img loading="lazy" src={wireM} className="rounded" alt="Wireframe model" />
        </Modal.Body>
      </Modal>

      {/* Modal for VFX Reel */}
      <Modal
        fullscreen={true}
        show={lgShow1}
        onHide={() => { 
          setLgShow1(false); 
          pauseYouTube(vfxIframeRef); 
          try { 
            lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); 
          } catch(e){} 
        }}
        aria-labelledby="vfx-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title className="ti-tle" id="vfx-modal-title">
            VFX Reel 2024
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Thank you for viewing my most recent VFX reel. All objects were created in Blender.
            After Effects was used for camera and motion tracking of the raw footage.
          </p>
          
          <div className="ratio ratio-16x9">
            <iframe
              ref={vfxIframeRef}
              loading="lazy"
              width="100%"
              height="560"
              src={getEmbedSrc(REELS.vfx)}
              title="VFX Reel video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          </div>

          {/* Action buttons */}
          <div className="mt-3 d-flex flex-wrap gap-2">
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={() => copyToClipboard(getVideoUrl('vfx'), 'VFX reel link copied!')}
            >
              Copy Link
            </button>
            <a 
              className="btn btn-sm btn-outline-primary" 
              href={getVideoUrl('vfx')} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => noteOpen(getVideoUrl('vfx'))}
            >
              Watch on YouTube
            </a>
          </div>

          <br/><br/>
          <Modal.Title className="ti-tle">
            Past VFX Projects
          </Modal.Title>
          <br/>
          <p>
            This VFX reel displays the work I participated in during my internship. First, the reel shows a 'Gomu' eraser TV commercial, which was a fun project preparing 2D and 3D product placement. I researched the types of products used, created concept art of the positioning of the items, 3D bubbles, 
            and other aspects to help complete the project. 
            Photoshop and Maya were used predominantly.
            <br/><br/>
            Second in the reel is the pilot for the 'Alphas' which is a SYFY TV show and hit series.
            My job was to very precisely rotoscope the actor Bryant Cartwright, who plays Gary Bell, out of the green screen and into specific environments. 
            This was accomplished utilizing Nuke primarily.
          </p>
          
          <div className="ratio ratio-16x9">
            <iframe 
              width="640" 
              height="360" 
              src="https://www.youtube.com/embed/tFwtXZw_VzM" 
              title="Past VFX Projects" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen>
            </iframe>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal for Free Rider */}
      <Modal
        fullscreen={true}
        show={lgShow2}
        onHide={() => { 
          setLgShow2(false); 
          pauseYouTube(freeIframeRef); 
          try { 
            lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); 
          } catch(e){} 
        }}
        aria-labelledby="freerider-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="freerider-modal-title">
            Free Rider Animation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            A short low budget animated film made completely in blender. Very low polygon count for the whole project. 
            Objects were placed in the scene using Blenders particle engine
          </p>

          <div className="ratio ratio-16x9">
            <iframe
              ref={freeIframeRef}
              loading="lazy"
              width="100%"
              height="560"
              src={getEmbedSrc(REELS.freeRider)}
              title="Free Rider video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          </div>

          {/* Action buttons */}
          <div className="mt-3 d-flex flex-wrap gap-2">
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={() => copyToClipboard(getVideoUrl('freeRider'), 'Free Rider link copied!')}
            >
              Copy Link
            </button>
            <a 
              className="btn btn-sm btn-outline-primary" 
              href={getVideoUrl('freeRider')} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => noteOpen(getVideoUrl('freeRider'))}
            >
              Watch on YouTube
            </a>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal for Sword */}
      <Modal
        fullscreen={true}
        show={lgShow3}
        onHide={() => { 
          setLgShow3(false); 
          pauseYouTube(swordIframeRef); 
          try { 
            lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); 
          } catch(e){} 
        }}
        aria-labelledby="sword-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="sword-modal-title">
            Sword
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Sword Model. 
            Blender was used to model, uv, and texture the objects. 
            The sculpting details were done in ZBrush.
            The normal map was baked in XNormal, and Photoshop was used for painting.
          </p>
          <br/>
          
          <div className="ratio ratio-16x9">
            <iframe
              ref={swordIframeRef}
              loading="lazy"
              width="100%"
              height="560"
              src={getEmbedSrc(REELS.sword)}
              title="Sword video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          </div>

          {/* Action buttons */}
          <div className="mt-3 d-flex flex-wrap gap-2">
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={() => copyToClipboard(getVideoUrl('sword'), 'Sword video link copied!')}
            >
              Copy Link
            </button>
            <a 
              className="btn btn-sm btn-outline-primary" 
              href={getVideoUrl('sword')} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => noteOpen(getVideoUrl('sword'))}
            >
              Watch on YouTube
            </a>
          </div>

          <br/>
          <Card.Img loading="lazy" src={swordd} className="rounded" alt="Sword model render" />
          
          <NavDropdown.Divider />
          <br/>
          <p>Blender cycles render.</p>
          
          <NavDropdown.Divider />
          <br/>
          <Card.Img loading="lazy" src={swordInfo} className="rounded" alt="Sword technical information" />
        </Modal.Body>
      </Modal>

      {/* Carousel */}
      <Carousel>
        <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
        src={maskO}
        alt="broken car"
      />

      <Carousel.Caption className="text-light">
      <h3>Mask of Malice </h3>
      <p> View Mask of Malice in the Portfolio tab</p>
      <Button variant="outline-warning" onClick={(e) => { lastActiveRef.current = e.currentTarget; preconnectYouTube(); noteOpen(REELS.mask); setModalAnnounce('Opening Mask of Malice'); setLgShow(true); setTimeout(() => setModalAnnounce(''), 1200); }}>View Now</Button>{' '}
    </Carousel.Caption>
    
  </Carousel.Item>

    <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
        src={nbg}
        alt="broken car"
      />

      <Carousel.Caption className="text-light">
      <h3>Colin Nebula 3D </h3>
      <p> View my VFX Reel in the VFX tab</p>
      <Button variant="outline-warning" onClick={(e) => { lastActiveRef.current = e.currentTarget; preconnectYouTube(); noteOpen(REELS.vfx); setModalAnnounce('Opening VFX Reel'); setLgShow1(true); setTimeout(() => setModalAnnounce(''), 1200); }}>View Now</Button>{' '}
    </Carousel.Caption>
  </Carousel.Item>
    
    <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
        src={rundown}
        alt="broken car"
      />

      <Carousel.Caption className="text-light">
      <h3>Free Rider</h3>
      <p>A short film made in blender</p>
      <Button variant="outline-warning" onClick={(e) => { lastActiveRef.current = e.currentTarget; preconnectYouTube(); noteOpen(REELS.freeRider); setModalAnnounce('Opening Free Rider'); setLgShow2(true); setTimeout(() => setModalAnnounce(''), 1200); }}>View Now</Button>{' '}
    </Carousel.Caption>
  </Carousel.Item>

    <Carousel.Item>
      <img
        className="d-block w-100 h-100"
        src="https://1.bp.blogspot.com/-Ge9N6vdTKHA/UTUI34cwZ8I/AAAAAAAAAZ0/YVS8B_oQmLc/s640/ACL_Bar_Ao.jpeg"
        alt="Colin Nebula's Old Bar Occlusion Layer"
      />

      <Carousel.Caption className="text-dark">
      <h3>Century Bar Occlusion Layer</h3>
      <p>Modeled in Maya and sculpted in Zbrush. Xnormal was used to bake
      the normal maps</p>
    </Carousel.Caption>
  </Carousel.Item>

  <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
        src={sword}
        alt="Colin Nebula's Sword"
      />

      <Carousel.Caption className="text-light">
      <h3>Sword model</h3>
      <p>Modeled in Maya and sculpted in Zbrush. Xnormal was used to bake
      the normal maps</p>
      <Button variant="outline-warning" onClick={(e) => { lastActiveRef.current = e.currentTarget; preconnectYouTube(); noteOpen(REELS.sword); setModalAnnounce('Opening Sword'); setLgShow3(true); setTimeout(() => setModalAnnounce(''), 1200); }}>View Now</Button>{' '}
    </Carousel.Caption>
  </Carousel.Item>
  
    <Carousel.Item>
      <img
        className="d-block w-100 h-100"
        src="https://2.bp.blogspot.com/-YWfHS-ASpHQ/UTbTgTT-ttI/AAAAAAAAAaU/680ysBOQ35Q/s640/ACL_Bar_Dis3.jpeg"
        alt="Colin Nebula's Old Bar"
      />
      <Carousel.Caption>
        <h3>Old Bar</h3>
        <p>Modeled in Maya and sculpted in Zbrush. xNormal was used to bake
        the normal maps</p>
      </Carousel.Caption>
    </Carousel.Item>

    <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
        src={contents}
        alt="weapon models"
      />
      
  
      <Carousel.Caption>
        <h3>weapons of Malice</h3>
        <p>All Models were modeled, uv, and textured in Blender  </p>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
        src="https://2.bp.blogspot.com/-o_078EnQxn0/UR5bctdDucI/AAAAAAAAAXE/ClU3ljmELho/s640/HeadsetDis_4.jpg"
        alt="Colin Nebula's Headset"
      />

      <Carousel.Caption>
        <h3>Bluetooth Headset</h3>
        <p>Bluetooth Headset - Modeled in Maya and sculpted in ZBrush. XNormal was used to bake
        the normal maps</p>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
        src="https://3.bp.blogspot.com/-C9ZZLDxtBCs/UJq4PnSl81I/AAAAAAAAATM/Z10Bt9e1rpw/s640/SniperRifleTestxx6.jpg"
        alt="Colin Nebula's Sniper Rifle"
      />
  
      <Carousel.Caption>
        <h3>Sniper Rifle</h3>
        <p>Modeled in Maya, Sculpted in ZBrush. Used XNormal for normal mapping</p>
      </Carousel.Caption>
    </Carousel.Item>
    
  <Carousel.Item>
    <img
      className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
      src="https://3.bp.blogspot.com/-jEVRCwbpRM0/UIlUdrrsowI/AAAAAAAAARg/h1_STvmzwAU/s640/Knife_high_02.jpg"
      alt="Colin Nebula's Tactical Knife"
    />

      <Carousel.Caption>
      <h3>Tactical Knife</h3>
      <p>Modeled in Maya and sculpted in ZBrush. XNormal was used to bake
      the normal maps</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
      src="https://3.bp.blogspot.com/-LyOEJZcNHn8/UIL4ZTMMQ7I/AAAAAAAAAQw/4bzs7k_XDFM/s640/Shutgun_03.jpg"
      alt="Colin Nebula's Shotgun"
    />

      <Carousel.Caption>
      <h3>Shotgun</h3>
      <p>Modeled in Maya and sculpted in ZNrush. XNormal was used to bake
      the normal maps</p>
    </Carousel.Caption>
  </Carousel.Item>
  
    <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
        src={m16Close}
        alt="Colin Nebula's M16A2 Rifle"
      />
      
  
      <Carousel.Caption>
        <h3>M16 A2 Rifle</h3>
        <p>Modeled in Maya and sculpted in ZBrush. XNormal was used to bake
        the normal maps</p>
      </Carousel.Caption>
    </Carousel.Item>

    <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
        src={shield1}
        alt="Colin Nebula's Mask"
      />
      
  
      <Carousel.Caption>
        <h3>Riot Shield</h3>
        <p>Modeled in Blender and sculpted in ZBrush. </p>
      </Carousel.Caption>
    </Carousel.Item>

    
  </Carousel>
  {/* announce modal opens to screen readers */}
      <span className="visually-hidden" aria-live="assertive">{modalAnnounce}</span>
    </div>
  )
}



