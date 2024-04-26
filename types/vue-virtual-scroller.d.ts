/** @link https://github.com/Akryum/vue-virtual-scroller/issues/199#issuecomment-1762889915 */

declare module 'vue-virtual-scroller' {
  import type {
    ComponentOptionsMixin,
    ComponentPropsOptions,
    ComputedOptions,
    DefineComponent,
    MethodOptions,
  } from 'vue'

  type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never

  type RecycleScrollerProps = {
    items: unknown[]
    direction?: 'vertical' | 'horizontal'
    itemSize?: number | null
    gridItems?: number
    itemSecondarySize?: number
    minItemSize?: number
    sizeField?: string
    typeField?: string
    keyField?: string
    pageMode?: boolean
    prerender?: number
    buffer?: number
    emitUpdate?: boolean
    updateInterval?: number
    listClass?: string
    itemClass?: string
    listTag?: string
    itemTag?: string
  }

  type RecycleScrollerEmits =
    | 'resize'
    | 'visible'
    | 'hidden'
    | 'update'
    | 'scroll-start'
    | 'scroll-end'

  type RecycleScrollerEmitFunctions = {
    resize: () => void
    visible: () => void
    hidden: () => void
    update: (
      tartIndex: number,
      endIndex: number,
      visibleStartIndex: number,
      visibleEndIndex: number,
    ) => void
    'scroll-start': () => void
    'scroll-end': () => void
  }

  type RecycleScrollerSlotProps = {
    item: ArrayElement<RecycleScrollerProps['items']>
    index: number
    active: boolean
  }

  type RecycleScrollerSlots = {
    default: (slotProps: unknown) => VNode[]
    before: () => VNode[]
    empty: () => VNode[]
    after: () => VNode[]
  }

  interface RecycleScrollerPublicMethods extends MethodOptions {
    getScroll(): { start: number; end: number }
    scrollToItem(index: number): void
    scrollToPosition(position: number)
  }

  export const RecycleScroller: DefineComponent<
    ComponentPropsOptions<RecycleScrollerProps>,
    object,
    object,
    ComputedOptions,
    RecycleScrollerPublicMethods,
    ComponentOptionsMixin,
    ComponentOptionsMixin,
    RecycleScrollerEmitFunctions,
    RecycleScrollerEmits,
    RecycleScrollerProps
  >

  export const DynamicScroller: RecycleScroller

  type DynamicScrollerItemProps = {
    item: unknown
    active: boolean
    sizeDependencies?: unknown[]
    watchData?: boolean
    tag?: string
    emitResize?: boolean
    onResize: () => void
  }

  type DynamicScrollerItemEmits = 'resize'

  export const DynamicScrollerItem: DefineComponent<
    ComponentPropsOptions<DynamicScrollerItemProps>,
    object,
    object,
    ComputedOptions,
    MethodOptions,
    ComponentOptionsMixin,
    ComponentOptionsMixin,
    DynamicScrollerItemEmits[],
    DynamicScrollerItemEmits,
    DynamicScrollerItemProps
  >
}
