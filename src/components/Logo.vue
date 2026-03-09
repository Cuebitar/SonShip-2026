<template>
    <!-- <div class="font-heading font-black tracking-tight" :class="props.class">
        <span class="font-['Times_New_Roman',serif] text-primary italic">son</span><span class="text-tertiary drop-shadow-[0_4px_3px_rgba(0,0,0,0.5)]">ship.</span>
    </div> -->
    <div class="font-heading md:tracking-[-0.7rem] tracking-[-0.4rem] w-full" :class="props.class">
        <span class="font-['Times_New_Roman',serif] text-primary italic font-bold text-[1.125em]">son</span><span class="text-tertiary drop-shadow-[0_4px_3px_rgba(0,0,0,0.5)] font-black text-[1em]">ship<span class="font-['Times_New_Roman',serif]">.</span></span>
    </div>
</template>

<script setup>
const props = defineProps({
    class: {
        type: String,
        default: 'text-xl'
    }
})
</script>