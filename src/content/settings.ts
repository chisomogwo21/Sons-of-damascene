export interface HeroImageItem {
  url: string
  alt: string
  /** CSS object-position focal point so the furniture piece is never cut off */
  position?: string
}

/**
 * Photos shown in the home page hero panels.
 * Adding a photo is one new line here.
 */
export const heroImages: HeroImageItem[] = [
  { url: 'images/products/bed/1.webp', alt: 'Handcrafted Solid Wood Bed', position: '52% 68%' },
  { url: 'images/products/dining-table-and-benches/1.webp', alt: 'Dining Table and Benches Set', position: '52% 62%' },
  { url: 'images/products/fabric-wrapped-low-bed/1.webp', alt: 'Fabric-Wrapped Low Bed', position: '48% 72%' },
  { url: 'images/products/slatted-bench/1.webp', alt: 'Slatted Bench', position: '50% 78%' },
  { url: 'images/products/tic-tac-toe-set/1.webp', alt: 'Tic-Tac-Toe Game Set', position: '50% 50%' },
  { url: 'images/products/serving-tray/1.webp', alt: 'Handled Serving Tray', position: '46% 50%' },
]

export interface SiteSettings {
  whatsapp_number?: string
  contact_phone?: string
  contact_email?: string
  address?: string
  hours?: string
  instagram_url?: string
  facebook_url?: string
  hero_overlay_opacity?: string
  collage_workshop_url?: string
  collage_workshop_alt?: string
  collage_materials_url?: string
  collage_materials_alt?: string
  collage_finish_url?: string
  collage_finish_alt?: string
  banner_image_url?: string
  banner_image_alt?: string
  about_banner_url?: string
  about_banner_alt?: string
  craftsman_portrait_url?: string
  craftsman_portrait_alt?: string
  craftsman_process_url?: string
  craftsman_process_alt?: string
  about_process_1_url?: string
  about_process_1_alt?: string
  about_process_2_url?: string
  about_process_2_alt?: string
  about_process_3_url?: string
  about_process_3_alt?: string
  about_process_4_url?: string
  about_process_4_alt?: string
  craftsman_tools_url?: string
  craftsman_tools_alt?: string
  [key: string]: string | undefined
}

export const settings: SiteSettings = {
  whatsapp_number: '+250783710430',
  contact_phone: '+250 783 710 430',
  contact_email: 'hello@sonsofdamascene.com',
  address: 'KG 12 Ave, Kigali, Rwanda',
  hours: 'Mon–Sat 8am–6pm',
  instagram_url: '',
  facebook_url: '',
  hero_overlay_opacity: '35',
  collage_workshop_url: 'images/site/collage-workshop.webp',
  collage_workshop_alt: 'Workshop in Kigali',
  collage_materials_url: 'images/site/collage-materials.webp',
  collage_materials_alt: 'Sustainably sourced Rwandan timber',
  collage_finish_url: 'images/site/collage-finish.webp',
  collage_finish_alt: 'Hand finishing and joinery detail',
  banner_image_url: 'images/site/banner.webp',
  banner_image_alt: 'Handcrafted solid wood furniture banner',
  about_banner_url: 'images/site/about-banner.webp',
  about_banner_alt: 'Sons of Damascene wordmark on a plaster wall',
  craftsman_portrait_url: '',
  craftsman_portrait_alt: '',
  craftsman_process_url: 'images/site/craftsman-workshop.webp',
  craftsman_process_alt: 'Sons of Damascene woodworking workshop bench and tool shelves',
  about_process_1_url: 'images/products/serving-tray/image.png',
  about_process_1_alt: 'A handled wooden serving tray from our workshop',
  about_process_2_url: 'images/site/about-process-2.webp',
  about_process_2_alt: 'Carving chisels on a workbench',
  about_process_3_url: 'images/site/about-process-3.webp',
  about_process_3_alt: 'A finished wooden clothes rack',
  about_process_4_url: 'images/site/about-process-4.webp',
  about_process_4_alt: "A finished bed set up in a customer's bedroom",
  craftsman_tools_url: 'images/site/craftsman-tools.webp',
  craftsman_tools_alt: 'Woodworking hand and power tools on the workshop bench',
}
