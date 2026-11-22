export interface SiteSettings {
  whatsapp_number?: string
  contact_phone?: string
  contact_email?: string
  address?: string
  hours?: string
  instagram_url?: string
  facebook_url?: string
  hero_overlay_opacity?: string
  hero_video_url?: string
  hero_poster_url?: string
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
  hero_overlay_opacity: '20',
  hero_video_url: 'images/site/hero.mp4',
  hero_poster_url: 'images/site/hero-poster.webp',
  collage_workshop_url: 'images/site/collage-workshop.webp',
  collage_workshop_alt: 'Workshop in Kigali',
  collage_materials_url: 'images/site/collage-materials.webp',
  collage_materials_alt: 'Sustainably sourced Rwandan timber',
  collage_finish_url: 'images/site/collage-finish.webp',
  collage_finish_alt: 'Hand finishing and joinery detail',
  banner_image_url: 'images/site/banner.webp',
  banner_image_alt: 'Handcrafted solid wood furniture banner',
  about_banner_url: '',
  about_banner_alt: '',
  craftsman_portrait_url: '',
  craftsman_portrait_alt: '',
  craftsman_process_url: '',
  craftsman_process_alt: '',
  about_process_1_url: '',
  about_process_1_alt: '',
  about_process_2_url: '',
  about_process_2_alt: '',
  about_process_3_url: '',
  about_process_3_alt: '',
  about_process_4_url: '',
  about_process_4_alt: '',
  craftsman_tools_url: '',
  craftsman_tools_alt: '',
}
