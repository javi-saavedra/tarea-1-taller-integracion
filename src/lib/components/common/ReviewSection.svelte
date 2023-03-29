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
  $: avg = reviews?.length > 0 ? _.sumBy(reviews, 'rating') / reviews.length : 0
  $: countStars = _.groupBy(reviews, 'rating');

  const percentage = (star: number) => {
    return reviews?.length > 0 ? ((countStars[star]?.length || 0) / reviews.length) * 100 : 0
  }

  const calculatePercentages = (ratingObj: {[Key: number]: Review[]}) => {
    let percentages = [];
    for (let i = 1; i < 6; i++) {
      percentages = _.keys(ratingObj).includes(i.toString()) ? [...percentages, percentage(i)] : [...percentages, 0];
    }
    return percentages;
  }
  $: allPercentages = calculatePercentages(countStars);
</script>


<div class="flow-root">
  <div class="gap-7 w-full text-center items-center rounded-lg hidden md:flex">
    <p class="text-9xl font-serif -mt-10">{_.round(avg, 1)}</p>

    <dl class="space-y-3 w-72">
      {#each Array(5) as star, index (index)}
        <div class="flex items-center text-sm">
          <dt class="flex flex-1 items-center">
            <p class="w-3 font-medium text-gray-900">{5 - index}</p>
            <div aria-hidden="true" class="ml-1 flex flex-1 items-center">
              <Icon src="{Star}" theme="solid" class="text-yellow-400 h-5 w-5 flex-shrink-0"/>
              <div class="relative ml-3 flex-1">
                <div class="h-3 rounded-full border border-gray-200 bg-gray-100"></div>

                <div style="width: {allPercentages[4 - index]}%" class="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"></div>
              </div>
            </div>
          </dt>
          <dd class="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">{_.round(allPercentages[4 - index], 0)}%</dd>
        </div>
      {/each}
    </dl>
  </div>
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