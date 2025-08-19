import React, {useState} from 'react'

import { Carousel } from "react-bootstrap"
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
import { Modal, Button, Card, NavDropdown } from 'react-bootstrap';
export default function BootstrapCarousel() {
  const [lgShow, setLgShow] = useState(false);
  const [lgShow1, setLgShow1] = useState(false);
  const [lgShow2, setLgShow2] = useState(false);
  const [lgShow3, setLgShow3] = useState(false);
  return (

    

    <div>

    <>
      <Modal
        size="lg"
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
         
        Mask of malice is an original concept for a project currently in progress.
        Blender was used to model, uv, and texture the objects. 
        Painting was done in photoshop
        <br/>
        <br/>
        <div className="ratio ratio-21x9">
        <iframe 
        width="560" 
        height="315" 
        src="https://www.youtube.com/embed/ZsZYqn04yNQ?si=cWqpjx-rp3cAtGTD" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
        </iframe>
        </div>
        </p>
        <br/>
        <Card.Img src={maskO} className="rounded" alt="Card image" />
        <a href="https://react-bootstrap.github.io/components/modal/"></a>
        <br/>
        <br/>
        <br/>
        <Modal.Title id="example-modal-sizes-title-lg">
            Mask of Malice
          </Modal.Title>
          <p>
          Some of the 2D maps used were generated using Adobe Photoshop, 
          Blender was used to model, uv, and texture the objects.
          Sculpting was done in Zbrush, and normal maps were extracted using Xnormal 
        
        
          </p>
          <br/>
          <Card.Img src={wireM} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
          <br/>
        </Modal.Body>
      </Modal>
    </>

    <>
      <Modal
        size="lg"
        show={lgShow1}
        onHide={() => setLgShow1(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="ti-tle" id="example-modal-sizes-title-lg">
          VFX Reel 2024
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
        <br />
        <p>
          Thank you for viewing my most recent VFX reel. All objects were created in Blender.
          After Effects was used for camera and motion tracking of the raw footage.
        </p>
        <div className="ratio ratio-16x9">
          <iframe 
        width="560" 
        height="315" src="https://www.youtube.com/embed/mPxmNbMpO7A?si=Akv33m0cXFxl7nhV" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
          </iframe>
        </div>

        <br />
        <br />
        <Modal.Title className="ti-tle" id="example-modal-sizes-title-lg">
          Past VFX Projects
          </Modal.Title>
          <br />
          <p>
          This VFX reel displays the work I participated in during my internship. First, the reel shows a 'Gomu' eraser TV commercial, which was a fun project preparing 2D and 3D product placement. I researched the types of products used, created concept art of the positioning of the items, 3D bubbles, 
          and other aspects to help complete the project. 
          Photoshop and Maya were used predominantly.
          <br />
          <br />
          Second in the reel is the pilot for the 'Alphas' which is a SYFY TV show and hit series.
          My job was to very precisely rotoscope the actor Bryant Cartwright, who plays Gary Bell, out of the green screen and into specific environments. 
          This was accomplished utilizing Nuke primarily.

          </p>
          <div className="ratio ratio-16x9">
          <iframe 
          width="640" 
          height="360" 
          src="https://www.youtube.com/embed/tFwtXZw_VzM" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
          </iframe>
          </div>
        
        </Modal.Body>
      </Modal>
      
    </>

    <>
      <Modal
        size="xxl-down"
        show={lgShow2}
        onHide={() => setLgShow2(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
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
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/N2WhwHaicR4?si=oH6JWh_VnC-jWj0H" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
          </iframe>
          </div>
        
        </Modal.Body>
      </Modal>
    </>

    <>
      <Modal
        size="lg"
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
          Sword Model. 
          Blender was used to model, uv, and texture the objects. 
          The sculpting details were done in ZBrush.
          The normal map was baked in XNormal, and Photoshop was used for painting.
          
          <br/>
          <br/>
          <div className="ratio ratio-16x9">
          <iframe width="560" 
          height="315" 
          src="https://www.youtube.com/embed/hLH3htg2GS0?si=y5onQfNbBUpvm-Os" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
          </iframe>
          </div>

          </p>
          <br/>
          <Card.Img src={swordd} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>

          <NavDropdown.Divider />
          <br/>

          <p>Blender cycles render.</p>

          <NavDropdown.Divider />
          <br/>
          <Card.Img src={swordInfo} className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
        </Modal.Body>
      </Modal>
    </>

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
      <Button variant="outline-warning" onClick={() => setLgShow(true)}>View Now</Button>{' '}
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
      <Button variant="outline-warning" onClick={() => setLgShow1(true)}>View Now</Button>{' '}
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
      <Button variant="outline-warning" onClick={() => setLgShow2(true)}>View Now</Button>{' '}
    </Carousel.Caption>
  </Carousel.Item>

    <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
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
      <Button variant="outline-warning" onClick={() => setLgShow3(true)}>View Now</Button>{' '}
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
  
    </div>
  )
}

