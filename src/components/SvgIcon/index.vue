<template>
  <div class="svg-icon">
    <svg v-if="iconClass && isSvgIcon" :class="svgClass" aria-hidden="true">
      <use :xlink:href="iconName" />
    </svg>
    <component v-else-if="iconClass && !isElIcon" :is="'el-icon-' + iconClass" class="svg_icon" />
  </div>
</template>

<script>
import { svgIcons, elIcons } from '@/icons'
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    isSvgIcon() {
      return svgIcons.indexOf(this.iconClass) !== -1
    },
    isElIcon() {
      return elIcons.indexOf(this.iconClass.replace('-', '').toLocaleLowerCase()) == -1
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg_icon ' + this.className
      } else {
        return 'svg_icon'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
}
.svg_icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
