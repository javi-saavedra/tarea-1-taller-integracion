<script lang="ts">
  import { page } from '$app/stores';
  import { useQuery } from '@sveltestack/svelte-query';
  import { makePlateQuery, makeReviewsQuery } from '../../../lib/queries';
  import type Plate from '../../../lib/types/plate';
  import LoadingIcon from "../../../lib/components/common/LoadingIcon.svelte";
  import _ from 'lodash';
  import useRefreshQuery from '../../../lib/stores/useFetchQuery';
  import ReviewSection from "../../../lib/components/common/ReviewSection.svelte";
  import ReviewModal from "../../../lib/components/ReviewModal.svelte";

  let toggle = false;
  $: plateId = $page.params.slug;
  const plateQuery = useQuery(
    makePlateQuery<Plate>(plateId, {})
  );
  $: plateQuery.setOptions(
    makePlateQuery<Plate>(plateId, {})
  );
  $: plate = $plateQuery.data || {};

  const reviewsQuery = useRefreshQuery(makeReviewsQuery, plateId);
  $: reviewsQuery.refresh(plateId);
  $: reviews = $reviewsQuery.data || [];
</script>

{#if $plateQuery.isLoading || !plate || _.isEmpty(plate) }
  <div class="flex w-full pt-20 justify-center">
    <span class="animate-spin w-16 h-16 block text-red-400">
      <LoadingIcon />
    </span>
  </div>
{:else}
  <div class="flex flex-col gap-5 w-full my-10 px-20">
    <div class="flex gap-3">
      <h1 class="text-3xl font-serif">
        {plate.name}
      </h1>
      <div class="relative z-10 rounded-full bg-orange-100 py-1.5 px-3 font-medium text-yellow-600">{plate.category}</div>
    </div>
    <p class="text-gray-500">
      {plate.description}
    </p>
    <p class="bg-yellow-600 text-white px-4 py-2 w-fit rounded-full tracking-wider text-xl font-medium font-serif">
      {plate.price.toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
      })}
    </p>

    <h1 class="mt-20 font-serif text-2xl text-gray-600">Ingredientes del plato</h1>
    <div class="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
      {#each plate.ingredients as ingredient (ingredient.id)}
        <a class="h-full" href={`/ingredients/${ingredient.id}`}>
          <article class="flex flex-col items-start bg-gray-100 rounded-lg h-full">
            <div class="relative w-full">
              <img src={ingredient.img_url} alt="" class="aspect-[16/9] w-full rounded-t-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]">
              <div class="absolute inset-0"></div>
            </div>
            <div class="w-full px-5 py-3 flex justify-between items-center mt-3">
              <h3 class="text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                {ingredient.name}
              </h3>
              <div class="relative z-10 rounded-full bg-orange-100 py-1.5 px-3 font-medium text-yellow-600">{ingredient.quantity}</div>
            </div>
          </article>
        </a>
      {/each}
    </div>

    <div class="mt-20 flex justify-between" class:mb-20={reviews.length === 0}>
      <h1 class="font-serif text-2xl text-gray-600">Reseñas del menú</h1>
      <button
        class="bg-white border border-gray-300 rounded-lg p-3 font-medium hover:bg-gray-100"
        on:click={() => {toggle = true}}
      >Agregar reseña</button>
    </div>

    <div class="mb-40">
      <ReviewSection {reviews}/>
    </div>
  </div>
  <ReviewModal bind:toggle entityId={plateId}/>
{/if}