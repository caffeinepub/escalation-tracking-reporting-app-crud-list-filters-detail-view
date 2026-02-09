import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Escalation, UserProfile } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Escalation Queries
export function useListEscalations() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<Escalation & { id: bigint }>>({
    queryKey: ['escalations'],
    queryFn: async () => {
      if (!actor) return [];
      const escalations = await actor.listEscalations();
      // Backend doesn't return IDs with escalations, we'll need to track them separately
      // For now, we'll use index as a workaround
      return escalations.map((esc, idx) => ({ ...esc, id: BigInt(idx) }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEscalation(escalationId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Escalation>({
    queryKey: ['escalation', escalationId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getEscalation(escalationId);
    },
    enabled: !!actor && !isFetching && escalationId !== undefined,
  });
}

export function useCreateEscalation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (escalation: Escalation) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEscalation(escalation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalations'] });
    },
  });
}

export function useUpdateEscalation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ escalationId, escalation }: { escalationId: bigint; escalation: Escalation }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEscalation(escalationId, escalation);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['escalations'] });
      queryClient.invalidateQueries({ queryKey: ['escalation', variables.escalationId.toString()] });
    },
  });
}

export function useDeleteEscalation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (escalationId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEscalation(escalationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalations'] });
    },
  });
}
