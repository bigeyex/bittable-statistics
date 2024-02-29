import { configureStore } from '@reduxjs/toolkit'
import metaReducer from './metaSlice'
import descriptiveSlice from './descriptiveSlice'
import regressionSlice from './regressionSlice'

export default configureStore({
  reducer: {
    meta: metaReducer,
    descriptive: descriptiveSlice,
    regression: regressionSlice,
  },
})

export enum StatFieldType {
  Categorical,
  Numerical
}