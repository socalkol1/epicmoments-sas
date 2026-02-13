'use server';

import { createClient } from '@/lib/supabase/server';
import { createTagSchema } from '@/lib/validations/tags';
import { revalidatePath } from 'next/cache';
import type { Tag } from '@/types/supabase';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

async function getTenantId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('id', user.id)
    .single();

  if (!profile?.tenant_id) throw new Error('No tenant context');
  return profile.tenant_id;
}

async function requireAdmin(): Promise<{ tenantId: string; userId: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('id', user.id)
    .single();

  if (!profile?.tenant_id) throw new Error('No tenant context');

  const adminRoles = ['platform_admin', 'tenant_owner', 'tenant_admin'];
  if (!adminRoles.includes(profile.role)) {
    throw new Error('Insufficient permissions');
  }

  return { tenantId: profile.tenant_id, userId: user.id };
}

export async function searchTags(query: string): Promise<ActionResult<Tag[]>> {
  try {
    const tenantId = await getTenantId();
    const supabase = await createClient();

    let queryBuilder = supabase
      .from('tags')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name');

    if (query.trim()) {
      queryBuilder = queryBuilder.ilike('name', `%${query.trim()}%`);
    }

    const { data, error } = await queryBuilder.limit(20);

    if (error) throw error;
    return { success: true, data: data ?? [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search tags',
    };
  }
}

export async function getAllTags(): Promise<ActionResult<Tag[]>> {
  try {
    const tenantId = await getTenantId();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name');

    if (error) throw error;
    return { success: true, data: data ?? [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tags',
    };
  }
}

export async function createTag(input: {
  name: string;
  color?: string;
  description?: string | null;
}): Promise<ActionResult<Tag>> {
  try {
    const { tenantId } = await requireAdmin();
    const parsed = createTagSchema.parse(input);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('tags')
      .insert({
        tenant_id: tenantId,
        name: parsed.name,
        color: parsed.color,
        description: parsed.description ?? null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'A tag with this name already exists' };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create tag',
    };
  }
}

export async function addTagToAlbum(
  albumId: string,
  tagId: string
): Promise<ActionResult> {
  try {
    const { tenantId } = await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase.from('album_tags').insert({
      album_id: albumId,
      tag_id: tagId,
      tenant_id: tenantId,
    });

    if (error) {
      if (error.code === '23505') {
        return { success: true, data: undefined };
      }
      throw error;
    }

    revalidatePath('/admin/albums');
    revalidatePath('/portal');
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to add tag to album',
    };
  }
}

export async function removeTagFromAlbum(
  albumId: string,
  tagId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from('album_tags')
      .delete()
      .eq('album_id', albumId)
      .eq('tag_id', tagId);

    if (error) throw error;

    revalidatePath('/admin/albums');
    revalidatePath('/portal');
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to remove tag from album',
    };
  }
}

export async function addTagToProfile(
  profileId: string,
  tagId: string
): Promise<ActionResult> {
  try {
    const { tenantId } = await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase.from('profile_tags').insert({
      profile_id: profileId,
      tag_id: tagId,
      tenant_id: tenantId,
    });

    if (error) {
      if (error.code === '23505') {
        return { success: true, data: undefined };
      }
      throw error;
    }

    revalidatePath('/admin/clients');
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to add tag to client',
    };
  }
}

export async function removeTagFromProfile(
  profileId: string,
  tagId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from('profile_tags')
      .delete()
      .eq('profile_id', profileId)
      .eq('tag_id', tagId);

    if (error) throw error;

    revalidatePath('/admin/clients');
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to remove tag from client',
    };
  }
}
