import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const BUCKET = 'product-images'
const MAX_BYTES = (parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB || '5')) * 1024 * 1024
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif']

async function isValidImageMagic(buffer: Buffer): Promise<boolean> {
  const magic = buffer.slice(0, 12)
  const hexStr = magic.toString('hex')
  // JPEG: ff d8 ff, PNG: 89 50 4e 47, WebP: 52 49 46 46, GIF: 47 49 46
  return /^ffd8ff|^89504e47|^52494646|^474946/.test(hexStr)
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File exceeds 5 MB limit' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (!ALLOWED_EXTS.includes(ext)) {
    return NextResponse.json({ error: 'Only image files (jpg, png, webp, gif) allowed' }, { status: 400 })
  }

  if (!ALLOWED_MIMES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid image type. Allowed: JPEG, PNG, WebP, GIF' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const isValidImage = await isValidImageMagic(buffer)
  if (!isValidImage) {
    return NextResponse.json({ error: 'File content does not match image type' }, { status: 400 })
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filename)

  return NextResponse.json({ url: publicUrl })
}
