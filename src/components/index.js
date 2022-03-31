import SvgIcon from './SvgIcon'
import DataList from './DataList'
import FormDialog from './FormDialog'
import Upload from './Upload/index.vue'

export default {
  install: Vue => {
    Vue.component(SvgIcon.name, SvgIcon)
    Vue.component(DataList.name, DataList)
    Vue.component(FormDialog.name, FormDialog)
    Vue.component(Upload.name, Upload)
  }
}
