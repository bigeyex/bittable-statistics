import { configureStore } from '@reduxjs/toolkit'
import metaReducer from './metaSlice'
import descriptiveSlice from './descriptiveSlice'
import regressionSlice from './regressionSlice'
import hypothesisSlice from './hypothesisSlice'
import crosstabsSlice from './crosstabsSlice'
import correlationSlice from './correlationSlice'

export default configureStore({
  reducer: {
    meta: metaReducer,
    descriptive: descriptiveSlice,
    correlation: correlationSlice,
    regression: regressionSlice,
    hypothesis: hypothesisSlice,
    crosstabs: crosstabsSlice,
  },
})

export enum StatFieldType {
  Categorical,
  Numerical
}