import { configureStore } from '@reduxjs/toolkit'
import metaReducer from './metaSlice'
import descriptiveSlice from './descriptiveSlice'
import regressionSlice from './regressionSlice'
import hypothesisSlice from './hypothesisSlice'

export default configureStore({
  reducer: {
    meta: metaReducer,
    descriptive: descriptiveSlice,
    regression: regressionSlice,
    hypothesis: hypothesisSlice,
  },
})

export enum StatFieldType {
  Categorical,
  Numerical
}