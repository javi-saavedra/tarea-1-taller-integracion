<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query';
  import { makeSearchQuery } from '../../queries';
  import type Ingredient from '../../types/ingredient';
  import type Menu from '../../types/menu';
  import { goto } from '$app/navigation';

  let openMenu = false;
  let search = '';

  const menusQuery = useQuery(
    makeSearchQuery<Menu>('search/trays', search)
  );
  $: menusQuery.setOptions(
    makeSearchQuery<Menu>('search/trays', search)
  );
  $: menus = $menusQuery.data || [];

  const platesQuery = useQuery(
    makeSearchQuery<Ingredient>('search/courses', search)
  );
  $: platesQuery.setOptions(
    makeSearchQuery<Ingredient>('search/courses', search)
  );
  $: plates = $platesQuery.data || [];

  const ingredientsQuery = useQuery(
    makeSearchQuery<Ingredient>('search/ingredients', search)
  );
  $: ingredientsQuery.setOptions(
    makeSearchQuery<Ingredient>('search/ingredients', search)
  );
  $: ingredients = $ingredientsQuery.data || [];

  $: results = [
    {name: 'menus', data: menus},
    {name: 'plates', data: plates},
    {name: 'ingredients', data: ingredients},
  ];
</script>

<header class="bg-white shadow-sm lg:static lg:overflow-y-visible">
  <div class="w-full px-4 sm:px-6 lg:px-8">
    <div class="relative flex justify-between items-center lg:gap-8 xl:grid xl:grid-cols-12">
      <div class="flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
        <div class="flex flex-shrink-0 items-center">
          <a href="/">
            <img class="block h-20 w-auto" src="/assets/logo.png" alt="Your Company">
          </a>
        </div>
      </div>
      <div class="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
        <div class="flex relative items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
          <div class="w-full">
            <label for="search" class="sr-only">Search</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                </svg>
              </div>
              <input id="search" name="search" bind:value={search} class="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6" placeholder="Search" type="search">
            </div>
          </div>
          {#if search && results.length > 0}
            <div class="z-10 w-full absolute flex flex-col gap-3 shadow-lg border border-gray-100 top-16 bg-white rounded-lg p-3 h-44 overflow-y-scroll">
              {#each results as result (result.name)}
                {#each result.data as data}
                  <button
                    class="flex justify-between items-center rounded-lg px-4 py-2 hover:bg-gray-100"
                    on:click={() => {
                      search = '';
                      goto(`/${result.name}/${data.id}`);
                    }}
                  >
                    <span class="text-sm text-grat-600 font-medium">{data.name}</span>
                    <span class="font-serif text-yellow-600 text-base">{data.price.toLocaleString('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                    })}</span>
                  </button>
                {/each}
              {/each}
            </div>
          {/if}
        </div>
      </div>
      <div class="flex items-center md:absolute md:inset-y-0 md:right-0">
        <button
          type="button"
          class="-mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          aria-expanded="false"
          on:click={() => {openMenu = !openMenu}}
        >
          <span class="sr-only">Open menu</span>
          <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {#if openMenu}
        <div class="z-10 absolute shadow-lg border border-gray-200 right-0.5 top-16 bg-white rounded-lg flex flex-col p-3 text-sm">
          <a class="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg" href="/" on:click={() => {openMenu = !openMenu}}>
            Menus
          </a>
          <a class="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg" href="/plates" on:click={() => {openMenu = !openMenu}}>
            Platos
          </a>
          <a class="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg" href="/ingredients" on:click={() => {openMenu = !openMenu}}>
            Ingredientes
          </a>
        </div>
      {/if}

    </div>
  </div>
</header>