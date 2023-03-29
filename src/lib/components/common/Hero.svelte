<script lang="ts">
  import { page } from '$app/stores';

  $: path = $page.route.id;
  const pathToLabel = (path: string): string => {
    if (path.includes('plates')) return 'Platos';
    else if (path.includes('ingredients')) return 'Ingredientes';
    else return 'Menus';
  }
</script>

<div class="relative isolate overflow-hidden">
  <img src="/assets/food.jpg" alt="" class="absolute inset-0 -z-10 h-full w-full object-cover opacity-50">
  <div class="w-full h-80 bg-black opacity-30"></div>
  <div class="absolute top-0 w-full h-80 flex items-center justify-center">
    <h1 class="text-4xl sm:text-6xl text-white font-serif text-center">
      {pathToLabel(path || '')}
    </h1>
  </div>
</div>