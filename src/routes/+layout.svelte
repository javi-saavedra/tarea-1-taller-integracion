<script>
  import "../app.css";
  import Navbar from "$lib/components/common/Navbar.svelte";
  import Hero from "$lib/components/common/Hero.svelte";
  import {QueryClient, QueryClientProvider} from "@sveltestack/svelte-query";

  const queryClient = new QueryClient({});
</script>

<QueryClientProvider client={queryClient}>
  <main class="flex-1 overflow-y-auto">
    <div class="relative overflow-hidden bg-white">
      <Navbar />
      <Hero />
      <slot/>
    </div>
  </main>
</QueryClientProvider>
