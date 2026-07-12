import { apiGet } from './apiClient';
import { getEndpointUrl } from './backendConfig';

export interface ResolvedUtilityContact {
    utility_id: string;
    utility_name: string;
    region_name?: string | null;
    dma_id?: string | null;
    dma_name?: string | null;
    contact_phone?: string | null;
    contact_email?: string | null;
    contact_address?: string | null;
}

export async function resolveUtilityForCoordinates(
    latitude: number,
    longitude: number
): Promise<ResolvedUtilityContact | null> {
    try {
        return await apiGet<ResolvedUtilityContact>(getEndpointUrl('/api/utilities/public/resolve'), {
            requiresAuth: false,
            params: {
                latitude,
                longitude,
            },
        });
    } catch (error) {
        console.warn('[UtilityService] Failed to resolve utility for location:', error);
        return null;
    }
}
