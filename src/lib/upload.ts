import { createClient } from "@/lib/supabase/client";

export async function uploadImage(file: File, bucket: string = 'images', folder: string = 'uploads'): Promise<string> {
    const supabase = createClient();
    
    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }

    // Get Public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
}
