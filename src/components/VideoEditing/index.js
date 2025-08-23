import React, {useState, useEffect, useRef} from "react";
// import OldBar from '../../assets/images/ACL_Bar_Dis4.jpeg';
import logoD from '../../assets/images/logoD.png';
import nbg from '../../assets/images/nbg.png';
import byte3 from '../../assets/images/byte3.png';
import { Card, Container, Button, Col, Row, CardGroup, NavDropdown, Modal } from 'react-bootstrap';
import SocialIcons from '../SocialIcons';
import 'bootstrap/dist/css/bootstrap.min.css';

function VfxVideoEditing() {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [lgShow2, setLgShow2] = useState(false);
  // new features
  const [autoplay, setAutoplay] = useState(false);
  const [muted, setMuted] = useState(true);
  // persisted on-screen legend
  const [showLegend, setShowLegend] = useState(() => {
    try { return localStorage.getItem("nebula_showLegend") === "1"; } catch { return false; }
  });
  useEffect(() => { try { localStorage.setItem("nebula_showLegend", showLegend ? "1" : "0"); } catch (e) {} }, [showLegend]);
  const [shareMsg, setShareMsg] = useState('');
  // refs to restore focus + pause players
  const lastActiveRef = useRef(null);
  const demoIframeRef = useRef(null);
  const vfxIframeRef = useRef(null);
  const byteIframeRef = useRef(null);

  // reduced-motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // canonical reel ids / urls
  const REEL = {
    demo: { id: 'tFwtXZw_VzM', url: 'https://www.youtube.com/watch?v=tFwtXZw_VzM' },
    recent: { id: 'mPxmNbMpO7A', url: 'https://www.youtube.com/watch?v=mPxmNbMpO7A' },
    byte: { id: '1wI6aDte_1Q', url: 'https://www.youtube.com/watch?v=1wI6aDte_1Q' }
  };

  const [showTop, setShowTop] = useState(false);
  const currentYear = new Date().getFullYear();
    // accessibility announcement for filter changes
    const [announce, setAnnounce] = useState('');
  
    useEffect(() => {
      const onScroll = () => setShowTop(window.scrollY > 240);
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

  const getEmbedSrc = (id) => {
    const params = new URLSearchParams();
    params.set('rel', '0');
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('mute', '1');
    // keep embed simple; enable JS API for postMessage
    params.set('enablejsapi', '1');
    params.set('modestbranding','1');
    params.set('playsinline','1');
    try { if (typeof window !== 'undefined' && window.location && window.location.origin) params.set('origin', window.location.origin); } catch(e){}
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  };

  // pause a YouTube iframe (requires enablejsapi=1)
  const pauseYouTube = (ref) => {
    try {
      const f = ref && ref.current;
      if (!f || !f.contentWindow) return;
      const msg = JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] });
      f.contentWindow.postMessage(msg, '*');
    } catch (e) {}
  };

  const copyToClipboard = async (text, setMsg) => {
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
      setMsg('Copied!');
      console.info('analytics', 'copy_link', text);
      setTimeout(() => setMsg(''), 1400);
    } catch {
      setMsg('Copy failed');
      setTimeout(() => setMsg(''), 1400);
    }
  };

  const scrollToTop = (behavior = 'smooth') => {
    const finalBehavior = prefersReducedMotion ? 'auto' : behavior;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: finalBehavior });
  };

  const scrollToTopAndOpen = (openFn, label) => {
    scrollToTop();
    const delay = prefersReducedMotion ? 0 : 150;
    setTimeout(() => {
      console.info('analytics', 'open_modal', label);
      openFn();
    }, delay);
  };

  // keyboard shortcuts: 1 -> demo, 2 -> recent, a -> autoplay, m -> mute, l -> legend
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      const k = e.key.toLowerCase();
      if (k === '1') scrollToTopAndOpen(() => setLgShow(true), 'demo');
      if (k === '2') scrollToTopAndOpen(() => setLgShow2(true), 'recent');
      if (k === 'a') setAutoplay(s => !s);
      if (k === 'm') setMuted(s => !s);
      if (k === 'l') setShowLegend(s => !s);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [autoplay, muted, prefersReducedMotion]);


    return (
        <Container fluid>
            <Row>
            {/* on-screen legend */}
            {showLegend && (
              <div style={{
                position: 'fixed', left: 12, bottom: 12, zIndex: 1200,
                background: 'var(--card-bg)', color: 'var(--text)',
                padding: '8px 10px', borderRadius: 6, boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
              }}>
                <div style={{ fontSize: 12, marginBottom: 6 }}><strong>Shortcuts</strong></div>
                <div style={{ fontSize: 12 }}>1: Demo • 2: Recent VFX • A: Autoplay • M: Mute • L: Toggle legend</div>
                <button className="btn btn-sm btn-link" onClick={() => setShowLegend(false)} aria-label="Close legend">Close</button>
              </div>
            )}

            {/* small help button to toggle legend */}
            <button
              onClick={() => setShowLegend(s => !s)}
              aria-label="Toggle shortcuts legend"
              title="Shortcuts (L)"
              style={{ position: 'fixed', left: 12, bottom: 70, zIndex: 1300, width: 36, height: 36, borderRadius: 18, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer' }}
            >?</button>

        <div>
        <>
        <Modal
        size="lg"
        show={lgShow}
        onHide={() => { setLgShow(false); pauseYouTube(demoIframeRef); try { lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); } catch(e){} }}
        aria-labelledby="example-modal-sizes-title-lg"
      >
         <Modal.Header closeButton>
           <Modal.Title id="example-modal-sizes-title-lg">
           VFX Demo Reel
           </Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <p>
           This VFX demo reel displays the work I participated in during my internship. First, the reel shows a 'Gomu' eraser TV commercial, which was a fun project preparing 2D and 3D product placement. I researched the types of products used, created concept art of the positioning of the items, 3D bubbles, 
           and other aspects to help complete the project. 
           Photoshop and Maya were used predominantly.
           <br />
           <br />

           </p>
          <div className="ratio ratio-16x9">
            <iframe
              ref={demoIframeRef}
              loading="lazy"
              width="100%"
              height="480"
              src={getEmbedSrc(REEL.demo.id)}
              title="VFX Demo Reel"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <a className="btn btn-sm btn-outline-primary" href={REEL.demo.url} target="_blank" rel="noopener noreferrer">Open on YouTube</a>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL.demo.url, setShareMsg)}>Copy link</button>
            <span className="visually-hidden" aria-live="polite">{shareMsg}</span>
            <div style={{ marginLeft: 'auto' }}>
              <label style={{ marginRight: 8, fontSize: 12 }}>
                <input type="checkbox" checked={autoplay} onChange={() => setAutoplay(v => !v)} /> Autoplay
              </label>
              <label style={{ fontSize: 12 }}>
                <input type="checkbox" checked={muted} onChange={() => setMuted(v => !v)} /> Mute
              </label>
            </div>
          </div>
           <br />
           <br />
         <p>
             Second in the reel is the pilot for the 'Alphas' which is a SYFY TV show and hit series.
             My job was to very precisely rotoscope the actor Bryant Cartwright, who plays Gary Bell, out of the green screen and into specific environments. 
             This was accomplished utilizing Nuke primarily.
         </p>
         </Modal.Body>
       </Modal>
     </>
        </div>

        <div>
        <>
        <Modal
        size="lg"
        show={lgShow2}
        onHide={() => { setLgShow2(false); pauseYouTube(vfxIframeRef); try { lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); } catch(e){} }}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
          VFX Reel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          This VFX reel represents my recent work in the visual effects field
          <br />
          <br />

          </p>
          <div className="ratio ratio-16x9">
            <iframe
              ref={vfxIframeRef}
              loading="lazy"
              width="100%"
              height="480"
              src={getEmbedSrc(REEL.recent.id)}
              title="VFX Reel"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          </div>
          <br />
          <br />
        <p>
            The raw footage was camera and motion tracked using Adobe After effects
            3D elements were modeled and rendered from Blender, 
            exported into After Effects for the application of 2D effects and compositing 
        </p>
        </Modal.Body>
      </Modal>
    </>
        </div>

      <div>
      <>
      <Modal
            size="xl"
            show={lgShow1}
            onHide={() => { setLgShow1(false); pauseYouTube(byteIframeRef); try { lastActiveRef.current && lastActiveRef.current.focus && lastActiveRef.current.focus(); } catch(e){} }}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Byte Size Soccer Videos
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
              A promotional video that takes young players through various drills and techniques to learn how to play soccer. 
              Raw footage was provided by the client and the finished product is a result of VFX and video editing as well as, 
              sound incorporation with effects 
              </p>
              <div className="ratio ratio-16x9">
                <iframe
                  ref={byteIframeRef}
                  loading="lazy"
                  width="100%"
                  height="480"
                  src={getEmbedSrc(REEL.byte.id)}
                  title="Byte Size Soccer Videos"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                />
              </div>
              <br />
              <p>
              <ul>
              <li>Created a marking style educational video that promotes Olympian, the late Tony Waiters, dispensing valuable soccer techniques to the next generation
              </li>
              <li>for attention, grabbing, and to highlight key points, individual 3-D objects were added in and animated</li>
              <li>Footage was sequenced for a linear development so that young players can learn the technique or drill easily in this flipped curriculum</li>
              <li>Planning prior to, customizing the result, and conferring on final shots with the client helped incorporate their vision throughout </li>
              <li>Smooth and error-free transition allows for an enjoyable viewing experience</li>
              <li>Integration of appealing text and images was done to keep young players engaged in watching the video to the end just in time for their soccer practice </li>
              <li>Primary usage of Adobe Suite: Photoshop & After Effects, and Maya</li>
              </ul>
              </p>

            </Modal.Body>
          </Modal>
    </>
        </div>

        <div>
      <>
      
    </>
        </div>
        <br/>
        <br/>
            <h2 className="top_text"> VFX and Video Editing</h2>
            <p className="top-p">Videos are rendered though a 3D software and worked on in post production for added effects</p>
            <NavDropdown.Divider />
                <Col ms={"auto"}>
                
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                <div className="ratio ratio-21x9">
                  <Card.Img loading="lazy" variant="top" src={nbg} className="rounded" alt="VFX reel poster" />
                  </div>
                  <Card.Body>
                  <br/>
                    <Card.Title>Colin Nebula 2024 VFX Reel</Card.Title>
                    <Card.Text>
                    Take a view at my VFX Reel, 
                    made with Blender and After Effects
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <Button variant="outline-warning" size="sm" onClick={(e) => { lastActiveRef.current = e.currentTarget; scrollToTopAndOpen(() => setLgShow2(true), 'recent'); }}>View video here</Button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL.recent.url, setShareMsg)}>Copy</button>
                    <a className="btn btn-sm btn-outline-primary" href={REEL.recent.url} target="_blank" rel="noopener noreferrer">Open</a>
                  </div>
                  <br/>
                  
                  
                  </Card.Footer>

                  <br/>
                </Card>
                
                <h2 className="top_text"> Blender and After Effects</h2>
            <p className="top-p">Using 2D tools in conjunction with 3D tools to produce amazing artwork</p>
                <CardGroup>
                <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img loading="lazy" variant="top" src={logoD} className="rounded" alt="VFX logo" />
                  <Card.Body>
                    <Card.Title>VFX Reel</Card.Title>
                    <Card.Text>
                    Visual effects demo of some projects I have worked on in the film industry 
                    
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <Button variant="outline-warning" size="sm" onClick={(e) => { lastActiveRef.current = e.currentTarget; scrollToTopAndOpen(() => setLgShow(true), 'demo'); }}>View video here</Button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL.demo.url, setShareMsg)}>Copy</button>
                    <a className="btn btn-sm btn-outline-primary" href={REEL.demo.url} target="_blank" rel="noopener noreferrer">Open</a>
                  </div>
                    
                    <br/>
                   </Card.Footer>
                 </Card>
                 
                 <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto"}}>
                  <Card.Img loading="lazy" variant="top" src={byte3} className="rounded" alt="Byte video poster" />
                  <Card.Body>
                    <Card.Title>Video Editing</Card.Title>
                    <Card.Text>
                    Video editing is part of my skill set  
                    Software used include After Effects, Nuke and Adobe Photoshop 
                    {' '}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <Button variant="outline-warning" size="sm" onClick={(e) => { lastActiveRef.current = e.currentTarget; scrollToTopAndOpen(() => setLgShow1(true), 'byte'); }}>View video here</Button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REEL.byte.url, setShareMsg)}>Copy</button>
                    <a className="btn btn-sm btn-outline-primary" href={REEL.byte.url} target="_blank" rel="noopener noreferrer">Open</a>
                  
                    </div>
                    
                    <br/>
                    </Card.Footer>
                 </Card>
                 
               </CardGroup>
               <br/>
              
                
        </Col>
      </Row>
      <br />
      <NavDropdown.Divider />

      {/* Footer Section (semantic) */}
      <footer id="site-footer" role="contentinfo" className="footer" aria-label="Site footer">
        <Container fluid>
          <Row className="align-items-center py-3">
            <Col md={8} className="text-md-start text-center">
              <div className="rights">© {currentYear} Colin Nebula</div>
            </Col>
            <Col md={4} className="icons text-md-end text-center" aria-label="Social links">
              <SocialIcons />
            </Col>
          </Row>
        </Container>
      </footer>

      {showTop && (
         <button
           onClick={() => scrollToTop()}
           aria-label="Back to top"
           title="Back to top"
           style={{
             position: "fixed",
             right: 20,
             bottom: 30,
             zIndex: 999,
             padding: "10px 14px",
             borderRadius: 6,
             border: "none",
             background: "var(--primary)",
             color: "#fff",
             cursor: "pointer",
             boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
           }}
         >
           <span aria-hidden="true">↑</span>
           <span className="visually-hidden">Back to top</span>
         </button>
       )}
           </Container>
     )
 }
 
 export default VfxVideoEditing;
