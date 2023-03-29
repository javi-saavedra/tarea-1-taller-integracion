<script lang="ts">
  import type Review from '../../types/review';
  import { Icon } from '@steeze-ui/svelte-icon'
  import { Star } from '@steeze-ui/heroicons'
  import { AvatarGenerator } from 'random-avatar-generator';
  import Filters from "./Filters.svelte";
  import _ from 'lodash';

  export let reviews: Review[];
  const generator = new AvatarGenerator();

  let sort = 'date';
  let order = 'asc';
  const options = [
    {value: 'date', label: 'Fecha'},
    {value: 'rating', label: 'Rating'}
  ]

  $: sortedReviews = _.sortBy(reviews, [sort]);
  $: orderedReviews = order === 'asc' ? sortedReviews : _.reverse([...sortedReviews]);
</script>


<div class="flow-root">
  <div class="w-full flex justify-start my-10">
    <Filters bind:sort={sort} bind:order={order} {options} />
  </div>
  <div class="-my-12 divide-y divide-gray-200">
    {#each orderedReviews as review}
    <div class="py-12">
      <div class="flex items-center">
        <img src={generator.generateRandomAvatar()} alt="avatar" class="h-12 w-12 rounded-full">
        <div class="ml-4">
          <h4 class="text-sm font-bold text-gray-900">{review.username}</h4>
          <div class="mt-1 flex items-center">
            {#each Array(review.rating) as star}
              <Icon src="{Star}" theme="solid" class="text-yellow-400 h-5 w-5 flex-shrink-0"/>
            {/each}
          </div>
        </div>
      </div>

      <div class="mt-4 space-y-6 text-base italic text-gray-600">
        <p>{review.content}</p>
      </div>
      <p class="text-xs text-gray-500 mt-4">{new Date(review.date).toLocaleDateString()}</p>
    </div>
    {/each}
  </div>
</div>