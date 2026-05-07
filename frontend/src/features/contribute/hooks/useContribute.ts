import { useMutation } from "@tanstack/react-query";
import { contributeApi } from "../api/contribute.api";

export function useContribute() {
  return useMutation({
    mutationFn: contributeApi.submitContribution,
  });
}
