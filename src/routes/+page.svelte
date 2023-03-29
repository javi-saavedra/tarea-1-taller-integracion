<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query';
  import { makeResourceQuery } from "../lib/queries";
  import type Menu from '../lib/types/menu';
  import Filters from "../lib/components/common/Filters.svelte";
  import Pagination from "../lib/components/common/Pagination.svelte";

  let sort = 'name';
  let order = 'asc';
  let params = {};
  let curPage = 1;
  $: params = {
    sort: sort,
    order: order,
    size: 20,
    page: curPage,
  }
  const menusQuery = useQuery(
    makeResourceQuery<Menu>('trays', params)
  );
  $: menusQuery.setOptions(
    makeResourceQuery<Menu>('trays', params)
  );
  $: menus = $menusQuery.data?.items || [];
</script>

<div class="mx-auto md:max-w-5xl lg:max-w-7xl py-20">
  <div class="w-full flex justify-end px-10 my-10">
    <Filters bind:sort={sort} bind:order={order} />
  </div>
  <div class="grid px-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
    {#each menus as menu (menu.id)}
      <a class="bg-gray-50 rounded p-5 text-left hover:bg-gray-100 border border-gray-300 relative" href={`/menus/${menu.id}`}>
        <h1 class="text-sm text-gray-700 font-sans tracking-wider uppercase font-medium">{menu.name}</h1>
        <p class="text-yellow-600 text-lg font-medium font-serif">
          {menu.price.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
          })}
        </p>
      </a>
    {/each}
  </div>
  <div class="my-10">
    <Pagination
      pages={$menusQuery.data?.pages || 0}
      page={$menusQuery.data?.page || 0}
      size={$menusQuery.data?.size || 0}
      total={$menusQuery.data?.total || 0}
      bind:curPage
    />
  </div>
</div>
