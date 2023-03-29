<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query';
  import { makeResourceQuery } from '../../lib/queries';
  import type Ingredient from '../../lib/types/ingredient';
  import LoadingIcon from "../../lib/components/common/LoadingIcon.svelte";
  import _ from 'lodash';
  import Filters from "../../lib/components/common/Filters.svelte";
  import Pagination from "../../lib/components/common/Pagination.svelte";

  let sort = 'name';
  let order = 'asc';
  let params = {};
  let curPage = 1;
  $: params = {
    sort: sort,
    order: order,
    size: 18,
    page: curPage,
  }

  const ingredientsQuery = useQuery(
    makeResourceQuery<Ingredient>('ingredients', params)
  );
  $: ingredientsQuery.setOptions(
    makeResourceQuery<Ingredient>('ingredients', params)
  );
  $: ingredients = $ingredientsQuery.data?.items || [];
</script>

{#if $ingredientsQuery.isLoading || !ingredients || _.isEmpty(ingredients) }
  <div class="flex w-full pt-20 justify-center">
    <span class="animate-spin w-16 h-16 block text-red-400">
      <LoadingIcon />
    </span>
  </div>
{:else}
  <div class="flex flex-col gap-5 w-full my-10 px-20">
    <div class="w-full flex justify-end px-10 my-10">
      <Filters bind:sort={sort} bind:order={order} />
    </div>
    <div class="mt-5 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
      {#each ingredients as ingredient (ingredient.id)}
        <a class="h-full" href={`/ingredients/${ingredient.id}`}>
          <article class="flex flex-col items-start bg-gray-100 rounded-lg h-full">
            <div class="relative w-full">
              <img src={ingredient.img_url} alt="" class="aspect-[16/9] w-full rounded-t-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]">
              <div class="absolute inset-0"></div>
            </div>
            <div class="flex flex-col gap-3 max-w-xl px-5 pt-3 pb-5">
              <h3 class="mt-3 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                {ingredient.name}
              </h3>
              <p class="-ml-1 bg-yellow-600 text-white px-4 py-1 w-fit rounded-full tracking-wider text-md font-medium font-serif">
                {ingredient.price.toLocaleString('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                })}
              </p>
            </div>
          </article>
        </a>
      {/each}
    </div>
    <div class="my-10">
      <Pagination
        pages={$ingredientsQuery.data?.pages || 0}
        page={$ingredientsQuery.data?.page || 0}
        size={$ingredientsQuery.data?.size || 0}
        total={$ingredientsQuery.data?.total || 0}
        bind:curPage
      />
    </div>
  </div>
{/if}