import React from 'react'

import { Carousel } from "react-bootstrap"
export default function BootstrapCarousel() {
  return (
    <div>
    <Carousel>
    <Carousel.Item>
      <img
        className="d-block w-100 h-100"
        src="https://2.bp.blogspot.com/-YWfHS-ASpHQ/UTbTgTT-ttI/AAAAAAAAAaU/680ysBOQ35Q/s640/ACL_Bar_Dis3.jpeg"
        alt="Colin Nebula's Old Bar"
      />
      <Carousel.Caption>
        <h3>Old Bar</h3>
        <p>Modeled in Maya and sculpted in Zbrush. xNormal was used to bake
        the normal maps.</p>
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
        <p>Bluetooth Headset - Modeled in Maya and sculpted in Zbrush. Xnormal was used to bake
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
        <p>Modeled in Maya, Sculpted in Zbrush. Used Xnormal for normal mapping.</p>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
        src="https://1.bp.blogspot.com/-Ge9N6vdTKHA/UTUI34cwZ8I/AAAAAAAAAZ0/YVS8B_oQmLc/s640/ACL_Bar_Ao.jpeg"
        alt="Colin Nebula's Old Bar Occlusion Layer"
      />

      <Carousel.Caption>
      <h3>Century Bar Occlusion Layer</h3>
      <p>Modeled in Maya and sculpted in Zbrush. Xnormal was used to bake
      the normal maps.</p>
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
      <p>Modeled in Maya and sculpted in Zbrush. Xnormal was used to bake
      the normal maps.</p>
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
      <p>Modeled in Maya and sculpted in Zbrush. Xnormal was used to bake
      the normal maps.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
      src="https://1.bp.blogspot.com/-9CTDLb1uzDk/UQAWP4ew7JI/AAAAAAAAAWU/toksX0zgSUc/s640/GRSDis_02.jpeg"
      alt="Colin Nebula's 9mm Handgun"
    />

      <Carousel.Caption>
        <h3>9mm Handgun</h3>
        <p>Modeled in Maya and sculpted in Zbrush. Xnormal was used to bake
        the normal maps.</p>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
        src="https://4.bp.blogspot.com/-QF9x91b003E/UOCGiXSIN0I/AAAAAAAAAVg/Hvj1aj2q2Uo/s640/M16A2_02Closeup.jpg"
        alt="Colin Nebula's M16A2 Rifle"
      />
      
  
      <Carousel.Caption>
        <h3>M16 A2 Rifle</h3>
        <p>Modeled in Maya and sculpted in Zbrush. Xnormal was used to bake
        the normal maps.</p>
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
    </div>
  )
}

