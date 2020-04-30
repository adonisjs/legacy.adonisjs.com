<template>
	<span>{{ formatedTime }}</span>
</template>

<script>
	import Vue from 'vue'
  import { format, parseISO } from 'date-fns'

	export default {
		props: {
			time: {
				type: String,
				required: true,
      },

			format: {
				type: String,
				required: false,
				default: 'dd.MM.yyyy',
			},
		},
		computed: {
			formatedTime() {
				const parsedDate = parseISO(this.time)
				return format(parsedDate, this.format)
			},
		},
	}
</script>
