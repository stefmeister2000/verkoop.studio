import image0 from '../assets/freeflow-hero-3d.webp'
import small0 from '../assets/freeflow-hero-3d-640.webp'
import image1 from '../assets/studio-team.webp'
import small1 from '../assets/studio-team-640.webp'
import imageHero from '../assets/hero-portrait.webp'
import smallHero from '../assets/hero-portrait-640.webp'
import image2 from '../assets/stef.webp'
import small2 from '../assets/stef-640.webp'
import imageStefDesk from '../assets/stef-desk.webp'
import smallStefDesk from '../assets/stef-desk-640.webp'
import image3 from '../assets/cases/pinacello.webp'
import small3 from '../assets/cases/pinacello-640.webp'
import image4 from '../assets/cases/nooms.webp'
import small4 from '../assets/cases/nooms-640.webp'
import image5 from '../assets/cases/olearys.webp'
import small5 from '../assets/cases/olearys-640.webp'
import image6 from '../assets/cases/ekart.webp'
import small6 from '../assets/cases/ekart-640.webp'
export const optimizedImages: Record<string, {width:number; height:number; srcSet?:string}> = {
  [image0]: {width:1254, height:1254, srcSet:`${small0} 640w, ${image0} 1254w`},
  [image1]: {width:848, height:1066, srcSet:`${small1} 640w, ${image1} 848w`},
  [imageHero]: {width:1066, height:1600, srcSet:`${smallHero} 640w, ${imageHero} 1066w`},
  [image2]: {width:1440, height:1920, srcSet:`${small2} 640w, ${image2} 1440w`},
  [imageStefDesk]: {width:1066, height:1600, srcSet:`${smallStefDesk} 640w, ${imageStefDesk} 1066w`},
  [image3]: {width:1440, height:777, srcSet:`${small3} 640w, ${image3} 1440w`},
  [image4]: {width:1440, height:781, srcSet:`${small4} 640w, ${image4} 1440w`},
  [image5]: {width:1440, height:776, srcSet:`${small5} 640w, ${image5} 1440w`},
  [image6]: {width:1440, height:1080, srcSet:`${small6} 640w, ${image6} 1440w`},

  '/partners/jobr.webp': {width:1280, height:800, srcSet:'/partners/jobr-640.webp 640w, /partners/jobr.webp 1280w'},
  '/partners/werkr.webp': {width:1280, height:800, srcSet:'/partners/werkr-640.webp 640w, /partners/werkr.webp 1280w'},
  '/partners/tinrate.webp': {width:1280, height:800, srcSet:'/partners/tinrate-640.webp 640w, /partners/tinrate.webp 1280w'},
  '/partners/eonlog-website.webp': {width:1280, height:800, srcSet:'/partners/eonlog-website-640.webp 640w, /partners/eonlog-website.webp 1280w'},
  '/partners/tinrate-website.webp': {width:1280, height:800, srcSet:'/partners/tinrate-website-640.webp 640w, /partners/tinrate-website.webp 1280w'},
  '/partners/jobr-website.webp': {width:1280, height:800, srcSet:'/partners/jobr-website-640.webp 640w, /partners/jobr-website.webp 1280w'},
  '/partners/tinrate-logo.svg': {width:76, height:17},
  '/partners/werkr-logo.svg': {width:125, height:27},
  '/partners/lyte-logo.png': {width:1984, height:688},
}
