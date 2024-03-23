import { configureStore } from '@reduxjs/toolkit'
import metaReducer from './metaSlice'
import descriptiveSlice from './descriptiveSlice'
import regressionSlice from './regressionSlice'
import hypothesisSlice from './hypothesisSlice'
import crosstabsSlice from './crosstabsSlice'

export default configureStore({
  reducer: {
    meta: metaReducer,
    descriptive: descriptiveSlice,
    regression: regressionSlice,
    hypothesis: hypothesisSlice,
    crosstabs: crosstabsSlice,
  },
})

export enum StatFieldType {
  Categorical,
  Numerical
}