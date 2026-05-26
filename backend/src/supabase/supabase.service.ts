import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private bucket = 'meal-photos';

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL e SUPABASE_SERVICE_KEY precisam estar no .env');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadMealPhoto(buffer: Buffer, originalName: string): Promise<string> {
    // Nome único pra evitar colisão
    const ext = originalName.split('.').pop();
    const fileName = `${randomUUID()}.${ext}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(fileName, buffer, {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        upsert: false,
      });

    if (error) {
      throw new Error(`Erro ao subir foto: ${error.message}`);
    }

    // Retorna URL pública (com CDN)
    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}