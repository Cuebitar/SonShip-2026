<template>
    <div class="font-heading font-black tracking-tight" :class="props.class">
        <span class="font-['Times_New_Roman',serif] text-primary italic">son</span><span class="text-tertiary drop-shadow-[0_4px_3px_rgba(0,0,0,0.5)]">ship.</span>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    class: {
        type: String,
        default: 'xl'
    }
})

const sizeClass = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'text-sm'
        case 'md':
            return 'text-md'
        case 'lg':
            return 'text-lg'
        case 'xl':
            return 'text-xl'
        case '2xl':
            return 'text-2xl'
        case '3xl':
            return 'text-3xl'
        case '4xl':
            return 'text-4xl'
        case '5xl':
            return 'text-5xl'
        case '6xl':
            return 'text-6xl'
        case '7xl':
            return 'text-7xl'
        case '8xl':
            return 'text-8xl'
        case '9xl':
            return 'text-9xl'
        default:
            return `text-[${props.size}]`
    }
})
</script>