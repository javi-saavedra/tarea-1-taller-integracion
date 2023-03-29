import type { UseQueryOptions } from '@sveltestack/svelte-query/dist/types';
import dataProvider from './dataProvider';
import type { ListResponse } from './dataProvider';
import type Menu from './types/menu';
import type Plate from './types/plate';
import type Ingredient from './types/ingredient';

type AnyResource = Record<string, any>;

export const makeResourceQuery = <ResType extends AnyResource = AnyResource>(
  resource: string,
  params: any = {
    pagination: { page: 1, perPage: 60 }
  },
  queryParams?: UseQueryOptions<ListResponse<ResType>>
): UseQueryOptions<ListResponse<ResType>> => ({
  queryKey: [resource, params],
  queryFn: () =>
    dataProvider.getList<ResType>(resource, {
      ...params,
      filter: { ...(params.filter || {}) } as typeof params.filter
    }),
  ...queryParams
});

export const makeSearchQuery = <ResType extends AnyResource = AnyResource>(
  resource: string,
  name: string
): UseQueryOptions<ListResponse<ResType>> => ({
  queryKey: [resource, name],
  queryFn: () =>
    dataProvider.getList<ResType>(resource, {name: name}),
});

export const makeReviewsQuery = <ResType extends AnyResource = AnyResource>(
  id: string
): UseQueryOptions<ListResponse<ResType>> => ({
  queryKey: ['reviews', id],
  queryFn: () =>
    dataProvider.getList<ResType>(`reviews/${id}`, {}),
});

export const makeMenuQuery = (
  id: string | null | undefined,
  queryParams?: UseQueryOptions<Menu>
): UseQueryOptions<Menu> => ({
  queryKey: ['trays', id],
  queryFn: () =>
    dataProvider
      .getOne('trays', id as string)
      .then((data) => {
        return data as unknown as Menu
      }),
  enabled: !!id,
  ...queryParams
});

export const makePlateQuery = (
  id: string | null | undefined,
  queryParams?: UseQueryOptions<Plate>
): UseQueryOptions<Plate> => ({
  queryKey: ['courses', id],
  queryFn: () =>
    dataProvider
      .getOne('courses', id as string)
      .then((data) => {
        return data as unknown as Plate
      }),
  enabled: !!id,
  ...queryParams
});

export const makeIngredientQuery = (
  id: string | null | undefined,
  queryParams?: UseQueryOptions<Ingredient>
): UseQueryOptions<Ingredient> => ({
  queryKey: ['ingredients', id],
  queryFn: () => {
    return dataProvider
      .getOne('ingredients', id as string)
      .then((data) => {
        return data as unknown as Ingredient
      })},
  enabled: !!id,
  ...queryParams
});