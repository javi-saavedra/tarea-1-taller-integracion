<script lang="ts">
  import { page } from '$app/stores';
  import { useQuery } from '@sveltestack/svelte-query';
  import { makeIngredientQuery, makeReviewsQuery } from '../../../lib/queries';
  import type Ingredient from '../../../lib/types/ingredient';
  import LoadingIcon from "../../../lib/components/common/LoadingIcon.svelte";
  import _ from 'lodash';
  import useRefreshQuery from '../../../lib/stores/useFetchQuery';
  import ReviewSection from "../../../lib/components/common/ReviewSection.svelte";
  import ReviewModal from "../../../lib/components/ReviewModal.svelte";

  let toggle = false;
  $: ingredientId = $page.params.slug;

  const ingredientQuery = useQuery(
    makeIngredientQuery<Ingredient>(ingredientId, {})
  );
  $: ingredientQuery.setOptions(
    makeIngredientQuery<Ingredient>(ingredientId, {})
  );
  $: ingredient = $ingredientQuery.data || {};

  const reviewsQuery = useRefreshQuery(makeReviewsQuery, ingredientId);
  $: reviewsQuery.refresh(ingredientId);
  $: reviews = $reviewsQuery.data || [];
</script>

{#if $ingredientQuery.isLoading || !ingredient || _.isEmpty(ingredient) }
  <div class="flex w-full pt-20 justify-center">
    <span class="animate-spin w-16 h-16 block text-red-400">
      <LoadingIcon />
    </span>
  </div>
{:else}
  <div class="flex flex-col gap-5 w-full my-10 px-20">
    <h1 class="text-3xl font-serif">
      {ingredient.name}
    </h1>
    <div class="w-96 h-auto">
      <img src={ingredient.img_url} alt="" class="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]">
    </div>
    <p class="text-gray-500">
      {ingredient.description}
    </p>
    <p class="bg-yellow-600 text-white px-4 py-2 w-fit rounded-full tracking-wider text-xl font-medium font-serif">
      {ingredient.price.toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
      })}
    </p>

    <div class="mt-20 flex justify-between" class:mb-20={reviews.length === 0}>
      <h1 class="font-serif text-2xl text-gray-600">Reseñas del ingrediente</h1>
      <button
        class="bg-white border border-gray-300 rounded-lg p-3 font-medium hover:bg-gray-100"
        on:click={() => {toggle = true}}
      >Agregar reseña</button>
    </div>

    <div class="mb-40">
      <ReviewSection {reviews}/>
    </div>
  </div>
  <ReviewModal bind:toggle entityId={ingredientId}/>
{/if}