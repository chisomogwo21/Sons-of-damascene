export interface EnquiryPayload {
  name: string
  contact: string
  message: string
}

export async function sendEnquiry(enquiry: EnquiryPayload): Promise<void> {
  const url = import.meta.env.VITE_SUPABASE_URL as string
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string
  if (!url || !key) {
    throw new Error('Missing database configuration')
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 3000)

  try {
    const res = await fetch(`${url}/rest/v1/enquiries`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: enquiry.name,
        contact: enquiry.contact,
        message: enquiry.message,
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      throw new Error(`Failed to save enquiry: ${res.status} ${res.statusText}`)
    }
  } finally {
    clearTimeout(timer)
  }
}
