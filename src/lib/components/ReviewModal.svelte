<script lang="ts">
  import { PencilSquare, Star, XMark } from '@steeze-ui/heroicons'
  import { useMutation, useQueryClient } from '@sveltestack/svelte-query';
  import { Icon } from '@steeze-ui/svelte-icon'
  import type Review from '../types/review';
  import dataProvider from '../dataProvider';
  import LoadingIcon from "./common/LoadingIcon.svelte";

  export let toggle = false;
  export let entityId;

  let email;
  let password;
  let comment = '';
  let rating = 0;

  const queryClient = useQueryClient();

  $: createReviewMutation = useMutation(
    async (data: Review) => {
      await dataProvider.create('reviews', { data: data }).catch((e) => {
        throw e;
      });
    },
    {
      onSuccess: () => {
        toggle = false;
        queryClient.invalidateQueries('reviews');
        let queryKey = ['reviews', entityId];
        let newData = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(queryKey, newData);
      }
    }
  );

  const handleSubmit = () => {
    const data = {
      entity_id: entityId,
      email,
      password,
      content: comment,
      rating,
    };
    $createReviewMutation.mutate(data);
  }
</script>


{#if toggle}
  <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          <button class="absolute top-3 right-3 rounded-lg p-2 hover:bg-gray-50" on:click={() => {toggle = false}}>
            <Icon src={XMark} class="h-5 w-5 text-gray-600 font-medium" />
          </button>
          <div>
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <Icon src={PencilSquare} class="h-6 w-6 text-yellow-600"/>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Agrega una reseña</h3>

              <div class="mt-2">
                <label class="text-left block text-sm font-medium text-gray-700" for="email">
                  Email
                </label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <input
                    bind:value={email}
                    type="email"
                    name="email"
                    id="email"
                    class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="ejemplo@uc.cl"
                  >
                </div>
              </div>

              <div class="mt-2">
                <label class="text-left block text-sm font-medium text-gray-700" for="password">
                  Contraseña
                </label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <input
                    bind:value={password}
                    type="password"
                    name="password"
                    id="password"
                    class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Contraseña"
                  >
                </div>
              </div>

              <div class="mt-2">
                <label class="text-left block text-sm font-medium text-gray-700" for="password">
                  Comentario
                </label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <textarea
                    class="px-3 py-2 shadow-sm block w-full focus:ring-gray-900 focus:border-gray-900 sm:text-sm border border-gray-300 rounded-md"
                    id="comment"
                    name="comment"
                    on:keyup|preventDefault={(e) => (comment = e.target.value)}
                    placeholder="Deja un comentario"
                    rows="3"
                  >{comment}</textarea>
                </div>
              </div>

              <div class="mt-2">
                <label class="text-left block text-sm font-medium text-gray-700" for="password">
                  Rating
                </label>
                <div class="mt-1 flex rounded-md">
                  {#each Array(5) as star, index}
                    <button class="h-8 w-8" on:click={() => {rating = index + 1}}>
                      <Icon src={Star} class="h-7 w-7 text-yellow-600" theme={rating > index ? 'solid' : 'default'}/>
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-6">
            <button
              type="button"
              disabled="{!comment || !email || !password}"
              on:click={handleSubmit}
              class="inline-flex w-full justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-700 disabled:opacity-50 disabled:hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
            >
              Enviar
              {#if $createReviewMutation.isLoading}
                <span class="h-5 w-5 text-white ml-2">
                  <LoadingIcon />
                </span>
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
