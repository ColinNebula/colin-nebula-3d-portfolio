import React, { useState, useEffect, useRef } from "react";
import oldBar from "../../assets/images/oldBar.png";
import oldBarAo from "../../assets/images/oldBarAo.png";
import shield1 from "../../assets/images/shield1.png";
import tacticalK from "../../assets/images/tacticalK.png";
import sword from "../../assets/images/sword.png";
import swordd from "../../assets/images/swordd.png";

import swordInfo from "../../assets/images/swordInfo.png";
import cover1 from "../../assets/images/cover1.png";
import maskSide from "../../assets/images/maskSide.png";
import maskO from "../../assets/images/maskO.png";
import wireM from "../../assets/images/wireM.png";
import shield from "../../assets/images/shield.png";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  NavDropdown,
  Modal,
} from "react-bootstrap";
import CardGroup from "react-bootstrap/CardGroup";
import SocialIcons from "../SocialIcons";

function Portfolio() {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [lgShow2, setLgShow2] = useState(false);
  const [lgShow3, setLgShow3] = useState(false);
  const [showTop, setShowTop] = useState(false);
  // enhancements (persisted)
  const [autoplay, setAutoplay] = useState(() => {
    try { return localStorage.getItem("nebula_autoplay") === "1"; } catch { return false; }
  });
  const [muted, setMuted] = useState(() => {
    try {
      const v = localStorage.getItem("nebula_muted");
      return v == null ? true : v === "1";
    } catch { return true; }
  });
  const [showLegend, setShowLegend] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const ytPrefetched = useRef(false);
  // persist autoplay/muted
  useEffect(() => {
    try {
      localStorage.setItem("nebula_autoplay", autoplay ? "1" : "0");
      localStorage.setItem("nebula_muted", muted ? "1" : "0");
    } catch (e) {}
  }, [autoplay, muted]);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // preconnect helper (call on hover to speed up iframe loading)
  const preconnectYouTube = () => {
    try {
      if (ytPrefetched.current || typeof document === "undefined") return;
      const add = (rel, href) => {
        if (!document.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
          const l = document.createElement("link");
          l.rel = rel;
          l.href = href;
          l.crossOrigin = "anonymous";
          document.head.appendChild(l);
        }
      };
      add("preconnect", "https://www.youtube.com");
      add("preconnect", "https://www.google.com");
      ytPrefetched.current = true;
    } catch (e) {}
  };

  // share helpers (Twitter / LinkedIn)
  const openShareWindow = (platform, url) => {
    try {
      let shareUrl = "";
      if (platform === "twitter") {
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Check out this reel from Colin Nebula")}`;
      } else if (platform === "linkedin") {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      } else return;
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=460");
      console.info("analytics", "share", platform, url);
    } catch (e) {}
  };

  // basic focus-trap for open modals
  useEffect(() => {
    const trap = (e) => {
      if (!(lgShow || lgShow1 || lgShow2 || lgShow3)) return;
      if (e.key !== "Tab") return;
      const modal = document.querySelector(".modal.show .modal-content");
      if (!modal) return;
      const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'))
        .filter((el) => el.offsetWidth || el.offsetHeight || el.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [lgShow, lgShow1, lgShow2, lgShow3]);

  // canonical ids / urls used below
  const REELS = {
    mask: {
      id: "ZsZYqn04yNQ",
      url: "https://www.youtube.com/watch?v=ZsZYqn04yNQ",
    },
    sword: {
      id: "hLH3htg2GS0",
      url: "https://www.youtube.com/watch?v=hLH3htg2GS0",
    },
  };

  const getEmbedSrc = (videoId) => {
    const params = new URLSearchParams();
    params.set("rel", "0");
    if (autoplay) params.set("autoplay", "1");
    if (muted) params.set("mute", "1");
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setShareMsg("Copied!");
      console.info("analytics", "copy_link", text);
      setTimeout(() => setShareMsg(""), 1400);
    } catch {
      setShareMsg("Copy failed");
      setTimeout(() => setShareMsg(""), 1400);
    }
  };

  const scrollToTopAndOpen = (openFn, label) => {
    const behavior = prefersReducedMotion ? "auto" : "smooth";
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior });
    const delay = prefersReducedMotion ? 0 : 150;
    setTimeout(() => {
      console.info("analytics", "open_modal", label);
      openFn();
    }, delay);
  };

  // keyboard shortcuts (1..4, A, M, L)
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable)
        return;
      const k = e.key.toLowerCase();
      if (k === "1") scrollToTopAndOpen(() => setLgShow(true), "mask");
      if (k === "2") scrollToTopAndOpen(() => setLgShow1(true), "oldBar");
      if (k === "3") scrollToTopAndOpen(() => setLgShow2(true), "riotShield");
      if (k === "4") scrollToTopAndOpen(() => setLgShow3(true), "sword");
      if (k === "a") setAutoplay((s) => !s);
      if (k === "m") setMuted((s) => !s);
      if (k === "l") setShowLegend((s) => !s);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [autoplay, muted, prefersReducedMotion]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 240);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // current year for footer
  const currentYear = new Date().getFullYear();

  // helper to scroll to top, respecting reduced-motion preference
  const scrollToTop = (behavior = "smooth") => {
    const finalBehavior = prefersReducedMotion ? "auto" : behavior;
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: finalBehavior });
  };

  return (
    <Container fluid>
      {/* skip link for keyboard users */}
      <a href="#main-content" className="visually-hidden focusable" style={{ position: "absolute", left: 8, top: 8, zIndex: 2000 }}>Skip to content</a>
      <div id="main-content" />
      <Row>
        {/* on-screen legend */}
        {showLegend && (
          <div
            style={{
              position: "fixed",
              left: 12,
              bottom: 12,
              zIndex: 1200,
              background: "var(--card-bg)",
              color: "var(--text)",
              padding: "8px 10px",
              borderRadius: 6,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ fontSize: 12, marginBottom: 6 }}>
              <strong>Shortcuts</strong>
            </div>
            <div style={{ fontSize: 12 }}>
              1: Mask • 2: Old Bar • 3: Shield • 4: Sword • A: Autoplay • M:
              Mute • L: Toggle legend
            </div>
            <button
              className="btn btn-sm btn-link"
              onClick={() => setShowLegend(false)}
              aria-label="Close legend"
            >
              Close
            </button>
          </div>
        )}

        <div>
          <>
            <Modal
              fullscreen={true}
              show={lgShow}
              onHide={() => setLgShow(false)}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                  Mask of Malice
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Mask of malice is an original concept for a project currently
                  in progress. Blender was used to model, uv, and texture the
                  objects. Painting was done in photoshop
                  <br />
                  <br />
                  <div className="ratio ratio-21x9">
                    <iframe
                      loading="lazy"
                      width="100%"
                      height="560"
                      src={getEmbedSrc(REELS.mask.id)}
                      title="Mask of Malice video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </p>
                <br />
                <Card.Img src={maskO} className="rounded" alt="Card image" />
                <a href="https://react-bootstrap.github.io/components/modal/"></a>
                <br />
                <br />
                <br />
                <Modal.Title id="example-modal-sizes-title-lg">
                  Mask of Malice
                </Modal.Title>
                <p>
                  Some of the 2D maps used were generated using Adobe Photoshop,
                  Blender was used to model, uv, and texture the objects.
                  Sculpting was done in ZBrush, and normal maps were extracted
                  using Xnormal
                </p>
                <br />
                <Card.Img src={wireM} className="rounded" alt="Card image" />
                <a href="https://react-bootstrap.github.io/components/modal/"></a>
                {" "}
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <a onMouseEnter={preconnectYouTube} className="btn btn-sm btn-outline-primary" href={REELS.mask.url} target="_blank" rel="noopener noreferrer">Open on YouTube</a>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => copyToClipboard(REELS.mask.url)}>Copy link</button>
                  <button aria-label="Share mask on Twitter" className="btn btn-sm btn-outline-info" onClick={() => openShareWindow("twitter", REELS.mask.url)}>Tweet</button>
                  <button aria-label="Share mask on LinkedIn" className="btn btn-sm btn-outline-info" onClick={() => openShareWindow("linkedin", REELS.mask.url)}>LinkedIn</button>
                  <span className="visually-hidden" aria-live="polite">{shareMsg}</span>
                  <div style={{ marginLeft: "auto" }}>
                    <label style={{ marginRight: 8, fontSize: 12 }}>
                      <input type="checkbox" checked={autoplay} onChange={() => setAutoplay((s) => !s)} /> Autoplay
                    </label>
                    <label style={{ fontSize: 12 }}>
                      <input type="checkbox" checked={muted} onChange={() => setMuted((s) => !s)} /> Mute
                    </label>
                  </div>
                </div>
                <br />
              </Modal.Body>
            </Modal>
          </>
        </div>
        <div>
          <>
            <Modal
              fullscreen={true}
              show={lgShow1}
              onHide={() => setLgShow1(false)}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                  Old 20th Century Bar
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Model of a old 20 Century bar at night time. Maya was used to
                  model, uv, and texture the objects. Painting was done in
                  photoshop
                </p>
                <Card.Img src={oldBar} className="rounded" alt="Card image" />
                <a href="https://react-bootstrap.github.io/components/modal/"></a>
                <br />
                <br />
                <p>Low poly count on all objects</p>
                <br />
                <br />
                <Card.Img src={oldBarAo} className="rounded" alt="Card image" />
                <a href="https://react-bootstrap.github.io/components/modal/"></a>
                {" "}
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  {" "}
                  <a
                    className="btn btn-sm btn-outline-primary"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                  {" "}
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => copyToClipboard(window.location.href)}
                  >
                    Copy link
                  </button>
                  {" "}
                </div>

                <br />
                <br />
              </Modal.Body>
            </Modal>
          </>
        </div>

        <div>
          <>
            <Modal
              fullscreen={true}
              show={lgShow2}
              onHide={() => setLgShow2(false)}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                  3D Riot Shield
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Model of a crowd control shield. Blender was used to model,
                  uv, and texture the objects. Painting was done in Adobe
                  photoshop.
                </p>
                <Card.Img src={shield1} className="rounded" alt="Card image" />
                <a href="https://react-bootstrap.github.io/components/modal/"></a>
                {" "}
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  {" "}
                  <a
                    className="btn btn-sm btn-outline-primary"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                  {" "}
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => copyToClipboard(window.location.href)}
                  >
                    Copy link
                  </button>
                  {" "}
                </div>
              </Modal.Body>
            </Modal>
          </>
        </div>

        <div>
          <>
            <Modal
              fullscreen={true}
              show={lgShow3}
              onHide={() => setLgShow3(false)}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                  Sword
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Sword Model. Blender was used to model, uv, and texture the
                  objects. The sculpting details were done in ZBrush. The normal
                  map was baked in XNormal, and Photoshop was used for painting.
                  <br />
                  <br />
                  <div className="ratio ratio-16x9">
                    <iframe
                      loading="lazy"
                      width="100%"
                      height="560"
                      src={getEmbedSrc(REELS.sword.id)}
                      title="Sword video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </p>
                <br />
                <Card.Img src={swordd} className="rounded" alt="Card image" />
                <a href="https://react-bootstrap.github.io/components/modal/"></a>
                {" "}
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  {" "}
                  <a
                    className="btn btn-sm btn-outline-primary"
                    href={REELS.sword.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open on YouTube
                  </a>
                  {" "}
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => copyToClipboard(REELS.sword.url)}
                  >
                    Copy link
                  </button>
                  {" "}
                  <span className="visually-hidden" aria-live="polite">
                    {shareMsg}
                  </span>
                  {" "}
                  <div style={{ marginLeft: "auto" }}>
                    {" "}
                    <label style={{ marginRight: 8, fontSize: 12 }}>
                      {" "}
                      <input
                        type="checkbox"
                        checked={autoplay}
                        onChange={() => setAutoplay((s) => !s)}
                      />{" "}
                      Autoplay {" "}
                    </label>
                    {" "}
                    <label style={{ fontSize: 12 }}>
                      {" "}
                      <input
                        type="checkbox"
                        checked={muted}
                        onChange={() => setMuted((s) => !s)}
                      />{" "}
                      Mute {" "}
                    </label>
                    {" "}
                  </div>
                  {" "}
                </div>
                <NavDropdown.Divider />
                <br />
                <p>Blender cycles render.</p>
                <NavDropdown.Divider />
                <br />
                <Card.Img
                  src={swordInfo}
                  className="rounded"
                  alt="Card image"
                />
                <a href="https://react-bootstrap.github.io/components/modal/"></a>
              </Modal.Body>
            </Modal>
          </>
        </div>
        <br />
        <br />
        <h2 class="top_text"> Welcome to My Portfolio</h2>
        <p class="top-p">
          {" "}
          Here is a collection of objects modeled using various industry 3D
          softwares
        </p>
        <NavDropdown.Divider />
        <Col>
          <CardGroup>
            <Card
              className="bg-dark text-white shadow-lg"
              style={{ color: "#000", width: "auto" }}
            >
              <Card.Img
                variant="top"
                src={cover1}
                className="rounded"
                alt="Card image"
              />
              <Card.Body>
                <Card.Title className="ti-tle">Mask of Malice</Card.Title>
                <Card.Text>
                  This mask was modeled in Blender. ZBrush was used to add more
                  details{" "}
                </Card.Text>
              </Card.Body>
              {" "}
              <Card.Footer>
                {" "}
                {" "}
                {" "}
              </Card.Footer>
              {" "}
              <Card.Footer>
                {" "}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {" "}
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() =>
                      scrollToTopAndOpen(() => setLgShow(true), "mask")
                    }
                  >
                    View here
                  </Button>
                  {" "}
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => copyToClipboard(REELS.mask.url)}
                  >
                    Copy
                  </button>
                  {" "}
                  <a
                    className="btn btn-sm btn-outline-primary"
                    href={REELS.mask.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                  {" "}
                </div>
                {" "}
              </Card.Footer>
              <br />
            </Card>

            <Card
              className="bg-dark text-white shadow-lg"
              style={{ color: "#000", width: "auto" }}
            >
              <Card.Img src={oldBarAo} className="rounded" alt="Card image" />
              <Card.Body>
                <Card.Title className="ti-tle">Old Bar</Card.Title>
                <Card.Text>
                  Utilizing my 3D knowledge to build complicated scenes{" "}
                </Card.Text>
              </Card.Body>
              {" "}
              <Card.Footer>
                {" "}
               {" "}
                {" "}
              </Card.Footer>
              {" "}
              <Card.Footer>
                {" "}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {" "}
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() =>
                      scrollToTopAndOpen(() => setLgShow1(true), "oldBar")
                    }
                  >
                    View here
                  </Button>
                  {" "}
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => copyToClipboard(window.location.href)}
                  >
                    Copy
                  </button>
                  {" "}
                  <a
                    className="btn btn-sm btn-outline-primary"
                    href={window.location.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                  {" "}
                </div>
                {" "}
              </Card.Footer>
              <br />
            </Card>

            <Card
              className="bg-dark text-white shadow-lg"
              style={{ color: "#000", width: "auto" }}
            >
              <Card.Img src={shield} className="rounded" alt="Card image" />
              <Card.Body>
                <Card.Title className="ti-tle">Riot Shield</Card.Title>
                <Card.Text>A shield modeled in Blender</Card.Text>
              </Card.Body>
              {" "}
              <Card.Footer>
                {" "}
                {" "}
                {" "}
              </Card.Footer>
              {" "}
              <Card.Footer>
                {" "}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {" "}
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() =>
                      scrollToTopAndOpen(() => setLgShow2(true), "riotShield")
                    }
                  >
                    View here
                  </Button>
                  {" "}
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => copyToClipboard(window.location.href)}
                  >
                    Copy
                  </button>
                  {" "}
                  <a
                    className="btn btn-sm btn-outline-primary"
                    href={window.location.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                </div>
              </Card.Footer>
              <br />
            </Card>
          </CardGroup>
          <br />
          <NavDropdown.Divider />
          <br />
          <h2 class="middle_text"> Industry software used on all projects</h2>
          <p class="mid-p">
            Software used include Maya, Blender, Nuke, Fusion, Adobe After
            Effects, Adobe Photoshop, and Zbrush
          </p>

          <CardGroup>
            <Card
              className="bg-dark text-white shadow-lg"
              style={{ color: "#000", width: "auto" }}
            >
              <Card.Img src={sword} className="rounded" alt="Card image" />
              <Card.Body>
                <Card.Title className="ti-tle">Sword</Card.Title>
                <Card.Text>
                  This sword is a 3D model. It was designed, modeled, textured
                  using Blender{" "}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                {" "}
              </Card.Footer>
              <Card.Footer>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() =>
                      scrollToTopAndOpen(() => setLgShow3(true), "sword")
                    }
                  >
                    View here
                  </Button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => copyToClipboard(REELS.sword.url)}
                  >
                    Copy
                  </button>
                  <a
                    className="btn btn-sm btn-outline-primary"
                    href={REELS.sword.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                </div>
              </Card.Footer>
              <br />
            </Card>

            <Card
              className="bg-dark text-white shadow-lg"
              style={{ color: "#000", width: "auto" }}
            >
              <Card.Img src={maskSide} className="rounded" alt="Card image" />
              <Card.Body>
                <Card.Title className="ti-tle">3D Model</Card.Title>
                <Card.Text>
                  3D face mask modeled, UV, and textured in Blender. Added
                  details and sculpting using ZBrush{" "}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button variant="outline-warning" size="sm">
                  View here
                </Button>{" "}
              </Card.Footer>
              <br />
            </Card>

            <Card
              className="bg-dark text-white shadow-lg"
              style={{ color: "#000", width: "auto" }}
            >
              <Card.Img src={tacticalK} className="rounded" alt="Card image" />
              <Card.Body>
                <Card.Title className="ti-tle">Tactical Knife </Card.Title>
                <Card.Text>
                  Tactical knife 3D model. Modeled, UV, and textured using Maya
                  3D software
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button variant="outline-warning" size="sm">
                  View here
                </Button>{" "}
              </Card.Footer>
              <br />
            </Card>
          </CardGroup>
        </Col>
      </Row>
      <br />

      <NavDropdown.Divider />

      {/* Footer Section (semantic & accessible) */}
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
  );
}

export default Portfolio;
