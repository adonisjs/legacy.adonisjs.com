<template>
	<span class="typed-text" ref="word" />
</template>

<script>
	import TypeIt from 'typeit';

	export default {
		props: {
			words: {
				type: Array,
				required: true,
			},

			delay: {
				type: Number,
				default: 4000,
			},
		},

		mounted() {
			new TypeIt(this.$refs.word, {
				strings: this.words,
				nextStringDelay: [this.delay, 750],
				loopDelay: this.delay,
				breakLines: false,
				loop: true,
			}).go();
		},
	};
</script>

<style>
.typed-text {
	color: var(--brand);
}
.ti-cursor {
	margin: 0 !important;
}
</style>
